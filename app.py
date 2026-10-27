"""
PlantGuard AI - Main Flask Application
Provides secure endpoints for leaf disease recognition, pest damage assessment,
image validation, sample demonstration, and real AI multimodal vision analysis via Gemini.
"""

import os
import io
import json
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load local environment secrets
load_dotenv()

from services.image_validator import validate_image_file
from services.disease_engine import DiseaseClassifier
from services.pest_engine import PestDamageAnalyzer
from services.gemini_vision_service import GeminiVisionService
from services.gemini_chat_service import GeminiChatService

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024  # 6 MB max payload
app.config["SECRET_KEY"] = os.urandom(24).hex()

# Base directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAMPLE_DIR = os.path.join(BASE_DIR, "static", "samples")

# Initialize AI & Botanical Diagnostic Engines
disease_classifier = DiseaseClassifier()
pest_analyzer = PestDamageAnalyzer()
gemini_service = GeminiVisionService()
gemini_chat_service = GeminiChatService()


@app.route("/")
def index():
    """Serves the main PlantGuard AI dashboard interface."""
    return render_template("index.html")


@app.route("/chat")
def chat_page():
    """Serves the standalone PlantGuard AI Agricultural Chat interface."""
    return render_template("chat.html")


@app.route("/api/health", methods=["GET"])
def health_check():
    """API health and engine status check."""
    return jsonify({
        "status": "healthy",
        "service": "PlantGuard AI",
        "real_ai_configured": gemini_service.is_available(),
        "vision_model": getattr(gemini_service, "model_name", "gemini-3.8-flash"),
        "chat_ai_configured": gemini_chat_service.is_available(),
        "chat_model": gemini_chat_service.model_name,
        "active_engine": "Google Gemini Vision AI" if gemini_service.is_available() else disease_classifier.model_type,
        "pest_engine": pest_analyzer.method_name,
        "sample_dir_exists": os.path.exists(SAMPLE_DIR)
    })


@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    """
    Secure endpoint for Agricultural AI Chat queries.
    Accepts user message, optional conversation history, optional report context,
    and target language ('en', 'or', 'hi').
    Strictly keeps API keys on the server and provides safe agricultural guidance.
    """
    if not request.is_json:
        return jsonify({"success": False, "error": "Request body must be valid JSON."}), 400

    data = request.get_json(silent=True)
    if data is None or not isinstance(data, dict):
        return jsonify({"success": False, "error": "Invalid JSON payload provided."}), 400

    message = data.get("message")
    if not message or not isinstance(message, str) or not message.strip():
        return jsonify({"success": False, "error": "Message is required and cannot be empty."}), 400

    message = message.strip()
    if len(message) > 1000:
        return jsonify({"success": False, "error": "Message exceeds the maximum limit of 1000 characters."}), 400

    # Validate language
    language = data.get("language", "en")
    if language not in ("en", "or", "hi"):
        language = "en"

    # Validate and sanitize conversation history
    raw_history = data.get("history", [])
    history = []
    if isinstance(raw_history, list):
        for item in raw_history[:10]:  # Limit to 10 recent messages
            if isinstance(item, dict):
                role = str(item.get("role", "user")).strip().lower()
                text = str(item.get("text") or item.get("content") or "").strip()
                if role in ("user", "model", "assistant") and text and len(text) <= 1500:
                    history.append({"role": role, "text": text})

    # Optional leaf report context for follow-up questions
    raw_context = data.get("report_context")
    report_context = None
    if isinstance(raw_context, dict):
        report_context = {
            "crop": str(raw_context.get("crop", ""))[:100],
            "condition": str(raw_context.get("condition", ""))[:150],
            "confidence": raw_context.get("confidence", "N/A"),
            "severity": str(raw_context.get("severity", ""))[:50],
            "pathogen": str(raw_context.get("pathogen", ""))[:150],
            "symptoms": [str(s)[:150] for s in raw_context.get("symptoms", []) if isinstance(s, (str, int, float))][:10],
            "pest_damage": raw_context.get("pest_damage") if isinstance(raw_context.get("pest_damage"), dict) else {},
            "organic_treatment": [str(t)[:250] for t in raw_context.get("organic_treatment", []) if isinstance(t, str)][:10],
            "chemical_treatment": [str(t)[:250] for t in raw_context.get("chemical_treatment", []) if isinstance(t, str)][:10],
            "prevention": [str(p)[:250] for p in raw_context.get("prevention", []) if isinstance(p, str)][:10]
        }

    # Verify Gemini API key configuration
    if not gemini_chat_service.is_available():
        if language == "or":
            missing_msg = "ସର୍ଭରରେ Google Gemini API Key କନଫିଗର୍ ହୋଇନାହିଁ। ବାସ୍ତବ AI ଆସିଷ୍ଟାଣ୍ଟ ସହିତ କଥା ହେବା ପାଇଁ .env ଫାଇଲ୍ ରେ GEMINI_API_KEY ଯୋଡ଼ନ୍ତୁ।"
            disclaimer_msg = "PlantGuard AI କୃଷି ଓ ସାଧାରଣ ଶିକ୍ଷଣୀୟ ମାର୍ଗଦର୍ଶନ ପାଇଁ ଉଦ୍ଦିଷ୍ଟ।"
        elif language == "hi":
            missing_msg = "सर्वर पर Google Gemini API Key कॉन्फ़िगर नहीं है। लाइव AI चैट सक्षम करने के लिए .env फ़ाइल में GEMINI_API_KEY जोड़ें।"
            disclaimer_msg = "PlantGuard AI कृषि एवं सामान्य शैक्षिक मार्गदर्शन हेतु समर्पित है।"
        else:
            missing_msg = "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your server environment or .env file to enable live AI chat."
            disclaimer_msg = "PlantGuard AI advice is intended for educational and decision support guidance."

        return jsonify({
            "success": False,
            "error": missing_msg,
            "api_key_missing": True,
            "disclaimer": disclaimer_msg
        }), 503

    # Execute Gemini Chat query with comprehensive exception safety
    try:
        reply, err = gemini_chat_service.chat(
            message=message,
            history=history,
            report_context=report_context,
            language=language
        )
    except Exception as exc:
        app.logger.exception("Unexpected error in chat_endpoint: %s", exc)
        return jsonify({
            "success": False,
            "error": "An unexpected error occurred while processing your chat request. Please try again.",
            "api_key_missing": False,
            "can_retry": True
        }), 500

    if err:
        if isinstance(err, dict):
            status_code = err.get("status_code", 502)
            error_message = err.get("message") or err.get("raw_error") or "Chat request failed."
            can_retry = err.get("can_retry", True)
        else:
            error_message = str(err)
            can_retry = True
            if "503" in error_message or "high demand" in error_message.lower():
                status_code = 503
            elif "429" in error_message or "rate limit" in error_message.lower():
                status_code = 429
            elif "504" in error_message or "timeout" in error_message.lower():
                status_code = 504
            else:
                status_code = 502

        response = jsonify({
            "success": False,
            "error": error_message,
            "api_key_missing": False,
            "can_retry": can_retry
        })
        if status_code in (503, 429):
            response.headers["Retry-After"] = "5"
        return response, status_code

    return jsonify({
        "success": True,
        "reply": reply,
        "language": language,
        "model": gemini_chat_service.model_name,
        "has_report_context": bool(report_context),
        "disclaimer": "PlantGuard AI advice is intended for educational agricultural guidance. Always follow pesticide product labels and consult local agricultural extension officers."
    })


@app.route("/api/samples", methods=["GET"])
def list_samples():
    """Returns metadata for built-in sample demo images."""
    samples = [
        {
            "id": "sample_healthy_tomato.jpg",
            "title": "Healthy Tomato Leaf",
            "category": "Healthy Crop",
            "description": "Vibrant green foliage with no microbial lesions or chewing damage.",
            "url": "/static/samples/sample_healthy_tomato.jpg"
        },
        {
            "id": "sample_early_blight.jpg",
            "title": "Tomato Early Blight",
            "category": "Fungal Disease",
            "description": "Characteristic concentric 'target-board' necrotic lesions with yellow halo.",
            "url": "/static/samples/sample_early_blight.jpg"
        },
        {
            "id": "sample_late_blight.jpg",
            "title": "Potato / Tomato Late Blight",
            "category": "Oomycete Blight",
            "description": "Dark water-soaked necrotic patches with light margin spread.",
            "url": "/static/samples/sample_late_blight.jpg"
        },
        {
            "id": "sample_pest_damage.jpg",
            "title": "Caterpillar Chewed Leaf",
            "category": "Insect Damage",
            "description": "Ragged irregular holes and edge defoliation from chewing insects.",
            "url": "/static/samples/sample_pest_damage.jpg"
        }
    ]
    return jsonify({"success": True, "samples": samples})


@app.route("/api/analyze", methods=["POST"])
def analyze_image():
    """
    Analyzes an uploaded leaf image or a pre-selected sample image.
    Prioritizes real Gemini Vision AI if configured; otherwise gracefully
    executes validated botanical heuristic fallback.
    """
    image_bytes = None
    metadata = None
    mime_type = "image/jpeg"
    language = request.form.get("language", "en")

    # Optional user context answers for dynamic follow-up reasoning
    user_context = None
    raw_context = request.form.get("user_context")
    if raw_context:
        try:
            user_context = json.loads(raw_context)
        except Exception:
            user_context = {
                "plant_name": request.form.get("plant_name", ""),
                "watering": request.form.get("watering", ""),
                "insects_seen": request.form.get("insects_seen", ""),
                "sunlight": request.form.get("sunlight", "")
            }

    # Check if a sample image was requested
    sample_id = request.form.get("sample_id")
    if sample_id:
        safe_name = secure_filename(sample_id)
        sample_path = os.path.join(SAMPLE_DIR, safe_name)
        if not os.path.exists(sample_path):
            return jsonify({"success": False, "error": f"Sample image '{safe_name}' not found."}), 404
        
        with open(sample_path, "rb") as f:
            image_bytes = f.read()

        metadata = {
            "format": "JPEG",
            "width": 500,
            "height": 500,
            "size_kb": round(len(image_bytes) / 1024, 2),
            "is_sample": True,
            "sample_name": safe_name
        }

    else:
        # Standard file upload
        if "image" not in request.files:
            return jsonify({"success": False, "error": "No image file provided in request."}), 400

        file_storage = request.files["image"]
        is_valid, error_msg, meta = validate_image_file(file_storage)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        file_storage.seek(0)
        image_bytes = file_storage.read()
        metadata = meta
        metadata["is_sample"] = False
        mime_type = "image/png" if meta.get("format") == "PNG" else "image/jpeg"

    api_error = None
    try:
        # 1. Attempt Real Gemini Vision AI Analysis if API key is configured
        if gemini_service.is_available():
            real_ai_data, api_error = gemini_service.analyze_plant_leaf(
                image_bytes=image_bytes,
                mime_type=mime_type,
                language=language,
                user_answers=user_context
            )

            if real_ai_data and real_ai_data.get("is_plant_leaf", True):
                if language == "or":
                    default_condition = "ପତ୍ର ସ୍ୱାସ୍ଥ୍ୟ ମୂଲ୍ୟାଙ୍କନ"
                    default_crop = "ଫସଲ ପତ୍ର"
                    default_pathogen = "ଜୈବିକ ବା ପରିବେଶଗତ କାରଣ"
                    default_severity = "ମଧ୍ୟମ"
                    default_causes = "AI ଦ୍ୱାରା ପତ୍ର ଲକ୍ଷଣର ବୈଜ୍ଞାନିକ ବିଶ୍ଳେଷଣ କରାଯାଇଛି।"
                    default_pest_type = "କୌଣସି ପୋକ ଖାଇଥିବା କ୍ଷତି ଦେଖାଯାଇ ନାହିଁ"
                    default_culprits = ["କୌଣସି ପୋକ ନାହାଁନ୍ତି"]
                    default_pest_sev = "କିଛି ନାହିଁ"
                    default_ipm = ["ପ୍ରତି ସପ୍ତାହରେ ପତ୍ର ତଳ ପାଖ ନିରୀକ୍ଷଣ କରନ୍ତୁ ଏବଂ କୀଟ ଦେଖିଲେ ହାତରେ ସଂଗ୍ରହ କରି ନଷ୍ଟ କରନ୍ତୁ।"]
                    pest_method = "ଗୁଗୁଲ୍ ଜେମିନାଇ (Gemini) କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା ଅପ୍ଟିକାଲ୍ ପରୀକ୍ଷଣ"
                    pest_honesty = "ପତ୍ରର କଟା ଚିହ୍ନ ଓ କଣାକୁ ସିଧାସଳଖ AI ଭିଜନ୍ ମାଧ୍ୟମରେ ଯାଞ୍ଚ କରାଯାଇଛି।"
                    disclaimer_text = (
                        "ସୂଚନା: ଏହି ଫଳାଫଳ ପ୍ରକୃତ କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା (Gemini Vision AI) ଦ୍ୱାରା ପ୍ରସ୍ତୁତ ଏକ କମ୍ପ୍ୟୁଟର ଆକଳନ। "
                        "କ୍ୟାମେରାର ଆଲୋକ ଓ ଫଟୋ କୋଣ ଯୋଗୁଁ ନିର୍ଭୁଲତାରେ ପାର୍ଥକ୍ୟ ଆସିପାରେ। "
                        "କୌଣସି ରାସାୟନିକ ବିଷ ସିଞ୍ଚନ ପୂର୍ବରୁ ସ୍ଥାନୀୟ କୃଷି ଅଧିକାରୀଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।"
                    )
                elif language == "hi":
                    default_condition = "पत्ती स्वास्थ्य मूल्यांकन"
                    default_crop = "फसल पत्ती"
                    default_pathogen = "जैविक या पर्यावरणीय कारक"
                    default_severity = "मध्यम"
                    default_causes = "AI द्वारा पत्ती लक्षणों का विश्लेषण किया गया है।"
                    default_pest_type = "कोई स्पष्ट कीट क्षति नहीं पाई गई"
                    default_culprits = ["कोई नहीं देखा गया"]
                    default_pest_sev = "कोई नहीं"
                    default_ipm = ["सप्ताह में एक बार पत्तियों की जांच करते रहें।"]
                    pest_method = "गूगल जेमिनी मल्टीमॉडल ऑप्टिकल निरीक्षण"
                    pest_honesty = "पत्ती के छेदों की पहचान AI विज़न द्वारा सीधे की गई है।"
                    disclaimer_text = (
                        "सूचना: यह परिणाम वास्तविक मल्टीमॉडल AI मॉडल (Gemini Vision) द्वारा तैयार किया गया कंप्यूटर अनुमान है। "
                        "रासायनिक छिड़काव से पहले स्थानीय कृषि विशेषज्ञ से सलाह अवश्य लें।"
                    )
                else:
                    default_condition = "Plant Foliage Assessment"
                    default_crop = "Plant Foliage"
                    default_pathogen = "Biological / Environmental Factor"
                    default_severity = "Moderate"
                    default_causes = "Visual diagnosis evaluated with AI reasoning."
                    default_pest_type = "No visible insect defoliation"
                    default_culprits = ["None observed"]
                    default_pest_sev = "None"
                    default_ipm = ["Conduct weekly visual scouting on leaf undersides."]
                    pest_method = "Google Gemini Multimodal Optical Inspection"
                    pest_honesty = "Evaluated directly via visual defoliation and feeding signs."
                    disclaimer_text = (
                        "Notice: PlantGuard AI diagnostic results are generated by a real vision AI model for educational guidance. "
                        "Lighting, angle, and non-foliage artifacts can influence estimates. "
                        "Always confirm critical crop treatments with your local extension service."
                    )

                disease_prediction = {
                    "condition": real_ai_data.get("primary_diagnosis", default_condition),
                    "crop": real_ai_data.get("crop_identified", default_crop),
                    "pathogen": real_ai_data.get("pathogen_or_agent", default_pathogen),
                    "severity": real_ai_data.get("severity", default_severity),
                    "confidence_percentage": real_ai_data.get("confidence_percentage", 84.0),
                    "symptoms": real_ai_data.get("visual_symptoms", []),
                    "causes": real_ai_data.get("uncertainty_note", default_causes),
                    "prevention": real_ai_data.get("prevention", []),
                    "organic_treatment": real_ai_data.get("organic_treatment", []),
                    "chemical_treatment": real_ai_data.get("chemical_treatment", []),
                    "farmer_explanation": real_ai_data.get("farmer_explanation", ""),
                    "model_transparency": real_ai_data.get("model_transparency", {})
                }

                pest_info = real_ai_data.get("pest_damage", {})
                pest_analysis = {
                    "pest_damage_detected": pest_info.get("detected", False),
                    "damage_type": pest_info.get("damage_type", default_pest_type),
                    "likely_culprits": pest_info.get("likely_culprits", default_culprits),
                    "severity": pest_info.get("severity", default_pest_sev),
                    "confidence_percentage": real_ai_data.get("confidence_percentage", 84.0),
                    "integrated_pest_management": pest_info.get("ipm_measures", default_ipm),
                    "method_transparency": {
                        "method_name": pest_method,
                        "pest_ai_honesty": pest_honesty
                    }
                }

                return jsonify({
                    "success": True,
                    "is_real_ai": True,
                    "metadata": metadata,
                    "disease_prediction": disease_prediction,
                    "pest_analysis": pest_analysis,
                    "needs_followup": real_ai_data.get("needs_followup", False),
                    "followup_questions": real_ai_data.get("followup_questions", []),
                    "uncertainty_note": real_ai_data.get("uncertainty_note", ""),
                    "disclaimer": disclaimer_text
                })

        # 2. Seamless Fallback: Validated Botanical Heuristic & Demo Mode
        disease_result = disease_classifier.predict(image_bytes, metadata, language=language)
        pest_result = pest_analyzer.analyze_pest_damage(image_bytes, metadata, language=language)

        if language == "or":
            if api_error:
                fallback_notice = f"ଗୁଗୁଲ୍ ଜେମିନାଇ AI ଅସ୍ଥାୟୀ ଭାବେ ଅନୁପଲବ୍ଧ ({api_error})। ସୁରକ୍ଷିତ ବଟାନିକାଲ୍ ଫଲବ୍ୟାକ୍ ମୋଡ୍ ବ୍ୟବହୃତ ହୋଇଛି।"
            else:
                fallback_notice = "ବଟାନିକାଲ୍ ଫଲବ୍ୟାକ୍ ମୋଡ୍ ରେ ଚାଲୁଛି। ବାସ୍ତବ AI ପାଇଁ .env ରେ GEMINI_API_KEY ଯୋଡ଼ନ୍ତୁ।"
            disclaimer = (
                "ସୂଚନା: PlantGuard AI ର ଏହି ଫଳାଫଳ କେବଳ ଚାଷୀ ଭାଇଙ୍କ ମାର୍ଗଦର୍ଶନ ପାଇଁ ଏକ କମ୍ପ୍ୟୁଟର ଆକଳନ। "
                "କ୍ୟାମେରାର ଆଲୋକ ଓ ଫଟୋ କୋଣ ଯୋଗୁଁ ନିର୍ଭୁଲତାରେ ପାର୍ଥକ୍ୟ ଆସିପାରେ, ଏହା ୧୦୦% ଗ୍ୟାରେଣ୍ଟି ନୁହେଁ। "
                "କୌଣସି ରାସାୟନିକ ବିଷ ସିଞ୍ଚନ ପୂର୍ବରୁ ନିକଟସ୍ଥ କୃଷି ଅଧିକାରୀଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।"
            )
        elif language == "hi":
            if api_error:
                fallback_notice = f"गूगल जेमिनी AI अस्थायी रूप से अनुपलब्ध ({api_error})। सुरक्षित बॉटनिकल फॉलबैक मोड उपयोग किया गया है।"
            else:
                fallback_notice = "बॉटनिकल फॉलबैक मोड में सक्रिय। वास्तविक AI के लिए .env में GEMINI_API_KEY जोड़ें।"
            disclaimer = (
                "सूचना: PlantGuard AI के परिणाम कंप्यूटर-आधारित शैक्षिक अनुमान हैं। रासायनिक छिड़काव से पहले स्थानीय कृषि विशेषज्ञ से सलाह अवश्य लें।"
            )
        else:
            if api_error:
                fallback_notice = f"Gemini Vision AI temporarily unavailable ({api_error}). Running in safe botanical fallback mode."
            else:
                fallback_notice = "Running in botanical heuristic fallback mode. Add GEMINI_API_KEY in .env for real multimodal AI."
            disclaimer = (
                "Notice: PlantGuard AI diagnostic results are intended for guidance and decision support. "
                "Because environmental lighting and visual similarities can influence confidence, "
                "predictions are not 100% guaranteed. Verify high-consequence findings with an agronomist."
            )

        return jsonify({
            "success": True,
            "is_real_ai": False,
            "fallback_notice": fallback_notice,
            "api_error": api_error,
            "can_retry_ai": bool(api_error and gemini_service.is_available()),
            "metadata": metadata,
            "disease_prediction": disease_result,
            "pest_analysis": pest_result,
            "disclaimer": disclaimer
        })

    except Exception as exc:
        return jsonify({
            "success": False,
            "error": f"An error occurred while analyzing the image: {str(exc)}"
        }), 500


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({
        "success": False,
        "error": "The uploaded file is too large. Maximum supported size is 5 Megabytes."
    }), 413


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting PlantGuard AI on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=True)
