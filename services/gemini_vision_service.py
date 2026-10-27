"""
Real AI Vision & Diagnostic Service using the official google-genai SDK.
Analyzes plant leaf images for microbial diseases, insect feeding damage,
deficiencies, and generates calibrated problem-specific agronomic recommendations.
Includes graceful fallback when API key is missing or quota is exhausted.
"""

import os
import json
import base64
from dotenv import load_dotenv

# Load local .env if present
load_dotenv()


class GeminiVisionService:
    def __init__(self, model_name=None):
        self.model_name = model_name or os.getenv("GEMINI_VISION_MODEL", "gemini-3.8-flash")
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.client = None
        self._init_client()

    def _init_client(self):
        """Initializes or reuses google-genai Client if key is configured."""
        current_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not current_key:
            self.api_key = ""
            self.client = None
            return

        # Reuse existing client if API key has not changed to prevent memory leaks
        if self.client is not None and self.api_key == current_key:
            return

        self.api_key = current_key
        try:
            from google import genai
            from google.genai import types
            # Minimum allowed deadline for Gemini API is 10s. Set 12s with single attempt to avoid duplicate retries.
            self.client = genai.Client(
                api_key=self.api_key,
                http_options=types.HttpOptions(
                    timeout=12000,
                    retry_options=types.HttpRetryOptions(attempts=1)
                )
            )
        except Exception as e:
            self.client = None

    def is_available(self):
        """Returns True if a real Gemini API client is configured."""
        if self.client is None:
            self._init_client()
        return self.client is not None and bool(self.api_key)

    def analyze_plant_leaf(self, image_bytes, mime_type="image/jpeg", language="en", user_answers=None):
        """
        Submits leaf image to real Gemini Vision model for comprehensive plant health diagnosis.
        
        Args:
            image_bytes: Raw bytes of uploaded leaf image
            mime_type: MIME string (e.g. 'image/jpeg' or 'image/png')
            language: Target language ('en', 'or', 'hi')
            user_answers: Optional dict of answers to follow-up questions (plant name, watering, visible pests)
            
        Returns:
            dict with structured AI diagnosis, or None if unavailable/failed.
        """
        if not self.is_available():
            return None, "API key not configured in .env"

        from google.genai import types
        from services.gemini_retry import execute_with_retry

        lang_instruction = "Respond in English."
        if language == "or":
            lang_instruction = (
                "IMPORTANT LANGUAGE INSTRUCTION: You MUST respond entirely in simple, natural, everyday Odia (ଓଡ଼ିଆ) using Odia script. "
                "This report is for rural farmers with little or no formal schooling. "
                "Do NOT use difficult Sanskrit words or English paragraphs. Explain technical terms simply (for example, explain Late Blight as 'ପତ୍ର ଓ ଗଛକୁ ଶୀଘ୍ର ପଚାଇଦେଉଥିବା ରୋଗ - ପଛୁଆ ଝାଉଁଳା (Late Blight)'). "
                "All visual symptoms, pest descriptions, damage types, culprits, immediate actions, organic remedies, prevention steps, chemical instructions, precautions, and uncertainty notes MUST be in natural Odia. "
                "Keep botanical or scientific names in English parentheses if helpful, but all explanations and advice must be in simple, practical Odia."
            )
        elif language == "hi":
            lang_instruction = (
                "IMPORTANT LANGUAGE INSTRUCTION: Respond in simple, natural Hindi (हिन्दी) using Devanagari script so that farmers can easily understand. "
                "All visual symptoms, pest descriptions, immediate actions, organic and chemical treatments, and prevention steps MUST be in Hindi. "
                "Keep botanical/scientific names in English parentheses if helpful."
            )

        followup_context_str = ""
        if user_answers and isinstance(user_answers, dict):
            followup_context_str = f"""
Additional context provided by the grower:
- Crop / Plant name: {user_answers.get('plant_name', 'Not specified')}
- Watering frequency: {user_answers.get('watering', 'Not specified')}
- Visible insects on leaves: {user_answers.get('insects_seen', 'Not specified')}
- Sunlight / Location: {user_answers.get('sunlight', 'Not specified')}
Please integrate this field context into your diagnostic reasoning.
"""

        prompt = f"""
You are an expert plant pathologist, agronomist, and computer vision AI.
Analyze this plant leaf photo carefully for real-world diagnostic assistance.
{lang_instruction}

{followup_context_str}

Perform the following tasks:
1. Verify if this image depicts a plant leaf or plant foliage. If not, state clearly that it is not a recognizable plant.
2. Identify the plant/crop species if discernible.
3. Observe visible symptoms: necrotic spots, chlorosis (yellowing), fungal mycelium/pustules, wilting, water-soaked lesions, leaf discoloration, physical holes/chewing damage, or leaf miner galleries.
4. Classify the likely issue:
   - Microbial Disease (Fungal, Bacterial, Viral, Oomycete), OR
   - Pest / Insect Feeding Damage (Caterpillars, Beetles, Leafminers, Mites, Aphids), OR
   - Abiotic / Nutrient Deficiency / Overwatering / Sunscald, OR
   - Healthy foliage without significant damage.
5. Provide honest uncertainty: Explain what cannot be proven from an image alone (e.g. viral vs abiotic yellowing, root issues, or microscopic pests). Never promise a 100% guaranteed cure.
6. Provide problem-specific, safe recommendations:
   - Immediate cultural actions (pruning, adjusting water, airflow).
   - Eco-friendly / Organic treatment (neem, bio-fungicides, mechanical removal).
   - Chemical options (mention with strong caution and pre-harvest safety interval instructions).
   - Preventive long-term practices.
7. If critical information is missing to confirm between two issues, generate 2-3 brief follow-up questions for the grower.

Output MUST be a valid JSON object matching this exact schema:
{{
  "is_plant_leaf": true,
  "crop_identified": "Identified plant species name",
  "primary_diagnosis": "Primary condition name (e.g. Tomato Early Blight or Caterpillar Chewing)",
  "pathogen_or_agent": "Scientific pathogen, insect agent, or environmental factor",
  "confidence_percentage": 85.0,
  "confidence_assessment": "Short explanation of visual certainty",
  "severity": "Mild, Moderate, High, or Critical",
  "visual_symptoms": [
    "Symptom 1",
    "Symptom 2"
  ],
  "pest_damage": {{
    "detected": true,
    "damage_type": "Description of physical insect feeding",
    "likely_culprits": ["Caterpillar (e.g. Hornworm)", "Flea beetle"],
    "severity": "Moderate",
    "ipm_measures": [
      "IPM measure 1",
      "IPM measure 2"
    ]
  }},
  "uncertainty_note": "Clear explanation of uncertainty and differential alternatives",
  "immediate_actions": [
    "Immediate step 1",
    "Immediate step 2"
  ],
  "organic_treatment": [
    "Organic treatment 1",
    "Organic treatment 2"
  ],
  "prevention": [
    "Prevention practice 1",
    "Prevention practice 2"
  ],
  "chemical_treatment": [
    "Chemical treatment 1 with precaution",
    "Chemical treatment 2"
  ],
  "needs_followup": false,
  "followup_questions": [
    "Follow-up question 1?",
    "Follow-up question 2?"
  ]
}}
Do NOT wrap in markdown fences other than raw json or ```json.
"""

        try:
            # Prepare image part for official google-genai SDK
            image_part = types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            )

            # Call real Gemini multimodal model with bounded exponential backoff
            def _call_gemini_vision():
                return self.client.models.generate_content(
                    model=self.model_name,
                    contents=[image_part, prompt],
                    config=types.GenerateContentConfig(
                        temperature=0.2,
                        response_mime_type="application/json"
                    )
                )

            response, err_info = execute_with_retry(
                _call_gemini_vision,
                max_retries=2,
                initial_delay=1.0,
                backoff_factor=2.0,
                max_delay=3.0,
                max_total_duration=20.0,
                api_key_to_redact=self.api_key,
                language=language
            )

            if err_info is not None:
                return None, err_info.get("message", "Gemini Vision API error.")

            raw_text = response.text.strip()
            # Clean possible markdown wrap
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]

            parsed_data = json.loads(raw_text.strip())

            # Annotate with real AI transparency flag localized to selected language
            if language == "or":
                transparency = {
                    "active_engine": f"ଗୁଗୁଲ୍ ଜେମିନାଇ ଭିଜନ୍ AI (Google Gemini 3.8 Flash - ବାସ୍ତବ AI)",
                    "weights_status": "ଗୁଗୁଲ୍ AI ଷ୍ଟୁଡିଓ ମାଧ୍ୟମରେ ସିଧାସଳଖ ପତ୍ର ଫଟୋ ବିଶ୍ଳେଷଣ ସକ୍ରିୟ।",
                    "dataset_compatibility": "ବିଶ୍ୱସ୍ତରୀୟ ଲକ୍ଷ ଲକ୍ଷ ଫସଲ ଓ ପତ୍ର ରୋଗ ତଥ୍ୟ ଉପରେ ପ୍ରଶିକ୍ଷିତ।",
                    "honest_note": (
                        "ଏହି ପରୀକ୍ଷା ରିପୋର୍ଟଟି ଏକ ପ୍ରକୃତ କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା (Gemini AI Vision) ଦ୍ୱାରା ପତ୍ରର ଚିତ୍ର ଦେଖି ପ୍ରସ୍ତୁତ କରାଯାଇଛି। "
                        "ଏହା କେବଳ ଚାଷୀ ଭାଇଙ୍କ ସହାୟତା ପାଇଁ ଏକ ବୈଜ୍ଞାନିକ ଆକଳନ। "
                        "ଗୁରୁତର ସମସ୍ୟାରେ କୀଟନାଶକ ପ୍ରୟୋଗ ପୂର୍ବରୁ ସ୍ଥାନୀୟ କୃଷି ବିଶେଷଜ୍ଞଙ୍କ ମତାମତ ନିଅନ୍ତୁ।"
                    )
                }
            elif language == "hi":
                transparency = {
                    "active_engine": f"गूगल जेमिनी विज़न AI (Google Gemini 3.8 Flash - वास्तविक AI)",
                    "weights_status": "गूगल AI स्टूडियो के माध्यम से सीधे पत्ती फोटो विश्लेषण सक्रिय।",
                    "dataset_compatibility": "वैश्विक फसल एवं पादप रोग डेटासेट पर प्रशिक्षित।",
                    "honest_note": (
                        "यह रिपोर्ट एक वास्तविक मल्टीमॉडल AI मॉडल (Gemini) द्वारा पत्ती की तस्वीर देखकर तैयार की गई है। "
                        "यह केवल किसानों के मार्गदर्शन हेतु एक वैज्ञानिक अनुमान है। कीटनाशक प्रयोग से पहले कृषि विशेषज्ञ की सलाह लें।"
                    )
                }
            else:
                transparency = {
                    "active_engine": f"Google Gemini 3.8 Flash Vision & Diagnostic Reasoning (Real AI)",
                    "weights_status": "Real-time multimodal neural vision inference active via Google AI Studio API.",
                    "dataset_compatibility": "Trained on massive real-world multimodal agricultural & botanical datasets.",
                    "honest_note": (
                        "This diagnosis was generated by an active real AI multimodal vision model (Gemini). "
                        "Predictions are diagnostic estimates based on visible optical patterns. "
                        "Always confirm critical crop decisions with a certified regional agronomist."
                    )
                }
            parsed_data["model_transparency"] = transparency
            return parsed_data, None

        except Exception as e:
            err_str = str(e)
            if self.api_key and self.api_key in err_str:
                err_str = err_str.replace(self.api_key, "[REDACTED_API_KEY]")
            return None, f"Gemini Vision API error: {err_str}"
