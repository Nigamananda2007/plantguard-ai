"""
PlantGuard AI - Real Gemini Chat & Agronomic Advisory Service.
Uses the official google-genai SDK to provide agricultural advisory responses,
field disease prevention, pest control guidance, and context-aware follow-up
conversations for plant leaf diagnosis reports.
"""

import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


class GeminiChatService:
    def __init__(self, model_name=None):
        # Default model matches gemini_vision_service.py: gemini-3.8-flash
        self.model_name = model_name or os.getenv("GEMINI_CHAT_MODEL", "gemini-3.8-flash")
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.client = None
        self._init_client()

    def _init_client(self):
        """Initializes or reuses google-genai Client if GEMINI_API_KEY is configured."""
        current_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not current_key:
            self.api_key = ""
            self.client = None
            return

        # If key hasn't changed and client already exists, reuse it to avoid memory churn
        if self.client is not None and self.api_key == current_key:
            return

        self.api_key = current_key
        try:
            from google import genai
            from google.genai import types
            # Minimum allowed deadline for Gemini API is 10s. Set 12s with single attempt to prevent duplicate retries.
            self.client = genai.Client(
                api_key=self.api_key,
                http_options=types.HttpOptions(
                    timeout=12000,
                    retry_options=types.HttpRetryOptions(attempts=1)
                )
            )
        except Exception as e:
            logger.warning(f"Could not initialize Gemini Client: {e}")
            self.client = None

    def is_available(self):
        """Returns True if a valid Gemini API client is configured."""
        if self.client is None:
            self._init_client()
        return self.client is not None and bool(self.api_key)

    def build_system_instruction(self, language="en", report_context=None):
        """
        Builds system prompt with agronomic safety guidelines and optional
        plant diagnosis report context.
        """
        # Language directive
        if language == "or":
            lang_directive = (
                "IMPORTANT LANGUAGE INSTRUCTION:\n"
                "- When the user converses in Odia or selects Odia, you MUST respond in simple, natural, everyday Odia (ଓଡ଼ିଆ) using Odia script.\n"
                "- Explain concepts clearly and simply so that anyone can easily understand.\n"
                "- Avoid overly complex Sanskrit words or long English sentences in Odia mode.\n"
                "- If technical terms or English brand/scientific names are helpful, keep them in parentheses (e.g. 'ନିମ୍ବ ତେଲ (Neem Oil)' or 'କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା (AI)').\n"
                "- If the user writes in English, reply in English. If the user writes in Odia, reply in Odia."
            )
        elif language == "hi":
            lang_directive = (
                "IMPORTANT LANGUAGE INSTRUCTION:\n"
                "- When the user converses in Hindi or selects Hindi, respond in simple, natural Hindi (हिन्दी) using Devanagari script.\n"
                "- Keep technical or scientific names in English parentheses if helpful.\n"
                "- If the user writes in English, reply in English. If the user writes in Hindi, reply in Hindi."
            )
        else:
            lang_directive = (
                "IMPORTANT LANGUAGE INSTRUCTION:\n"
                "- Respond in clear, accessible, professional English.\n"
                "- If the user writes in Odia (ଓଡ଼ିଆ script), reply in natural Odia. If the user writes in English, reply in English."
            )

        # Base instructions for general ChatGPT-style assistant with agricultural expertise
        base_instruction = f"""You are PlantGuard AI Assistant, a versatile, intelligent, and helpful ChatGPT-style AI assistant.

VERSATILE CAPABILITIES & GENERAL ASSISTANCE:
1. You can answer ANY question the user asks across ALL topics—including general knowledge, science, mathematics, coding, technology, history, geography, literature, everyday life, advice, and education.
2. NEVER refuse, decline, or avoid a user's question simply because it is not related to plants or agriculture. Always be polite, constructive, friendly, and provide direct, accurate, and comprehensive answers on any topic.
3. You ALSO possess world-class domain expertise in agriculture, plant pathology, botany, gardening, soil health, crop diseases, and pest management. When agricultural or plant questions are asked, provide rich, practical, actionable advice.

{lang_directive}

RESPONSIBLE AGRICULTURAL SAFETY GUIDELINES (Applies specifically when answering plant, crop, or pest questions):
1. Treat all diagnostic advice and plant health answers as educational guidance and decision support, not an absolute laboratory diagnosis.
2. DO NOT recommend unsupported or arbitrary synthetic chemical pesticide dosages. Emphasize that chemical products must only be used in strict accordance with the manufacturer's product label instructions and local agricultural authority regulations.
3. Strongly advocate for Integrated Pest Management (IPM), cultural sanitation, physical barriers, biological controls, and eco-friendly/organic remedies (such as neem oil, Trichoderma, botanical extracts) as the primary lines of defense before chemical treatments.
4. Advise growers to consult their local agricultural university extension service or certified crop advisor before purchasing or applying regulated chemicals for severe infestations.
5. Provide clear, structured answers with practical bullet points and easy-to-follow steps. Keep explanations concise, clear, and beginner-friendly.
"""

        # Append report context if provided (for Report Follow-up Chat)
        if report_context and isinstance(report_context, dict):
            crop = report_context.get("crop", "Unspecified plant")
            condition = report_context.get("condition", "General health check")
            confidence = report_context.get("confidence", "N/A")
            severity = report_context.get("severity", "N/A")
            pathogen = report_context.get("pathogen", "N/A")
            symptoms = report_context.get("symptoms", [])
            pest_info = report_context.get("pest_damage", {})
            organic = report_context.get("organic_treatment", [])
            chemical = report_context.get("chemical_treatment", [])
            prevention = report_context.get("prevention", [])

            symptoms_str = ", ".join(symptoms) if isinstance(symptoms, list) and symptoms else "None listed"
            organic_str = "; ".join(organic) if isinstance(organic, list) and organic else "Standard organic care"
            chemical_str = "; ".join(chemical) if isinstance(chemical, list) and chemical else "Consult label"
            prevention_str = "; ".join(prevention) if isinstance(prevention, list) and prevention else "Standard crop hygiene"

            pest_summary = "None detected"
            if isinstance(pest_info, dict) and pest_info.get("detected"):
                pest_type = pest_info.get("type", "Insect feeding")
                culprits = ", ".join(pest_info.get("culprits", [])) or "Unspecified insects"
                pest_summary = f"Detected: {pest_type} (Likely: {culprits})"

            context_str = f"""
SPECIFIC LEAF DIAGNOSTIC REPORT CONTEXT:
The grower has just received the following diagnostic analysis from PlantGuard AI and is asking follow-up questions:
- Plant / Crop: {crop}
- Diagnosed Condition: {condition}
- Confidence: {confidence}%
- Severity: {severity}
- Pathogen / Primary Cause: {pathogen}
- Observed Leaf Symptoms: {symptoms_str}
- Pest Damage Assessment: {pest_summary}
- Suggested Organic Solutions: {organic_str}
- Suggested Chemical Options: {chemical_str}
- Long-term Prevention: {prevention_str}

Please answer the user's questions specifically in the context of this report. If they ask about symptoms, treatments, prevention, watering, or next steps, reference this crop and condition directly.
"""
            return base_instruction + "\n" + context_str

        return base_instruction

    def chat(self, message, history=None, report_context=None, language="en"):
        """
        Sends user message and multi-turn conversation history to Gemini.

        Args:
            message: User query string (1 - 1000 chars)
            history: Optional list of previous message dicts: [{"role": "user"|"model", "text": "..."}]
            report_context: Optional dict with current leaf report details
            language: Target response language ('en', 'or', 'hi')

        Returns:
            tuple: (reply_text, error_message)
        """
        if not self.is_available():
            return None, "GEMINI_API_KEY is not configured on the server. Please set your Gemini API key in the server .env file."

        from google.genai import types
        from services.gemini_retry import execute_with_retry

        system_instruction = self.build_system_instruction(language=language, report_context=report_context)

        # Build contents array from history + new user message
        contents = []

        if history and isinstance(history, list):
            # Limit history to the last 10 messages for token efficiency & safety
            recent_history = history[-10:]
            last_role = None
            for item in recent_history:
                if not isinstance(item, dict):
                    continue
                raw_role = item.get("role", "user")
                role = "model" if raw_role in ("model", "assistant") else "user"
                text = (item.get("text") or item.get("content") or "").strip()
                if not text:
                    continue

                # Gemini multi-turn must start with a user message
                if not contents and role != "user":
                    continue

                # Avoid duplicate consecutive roles
                if role == last_role:
                    # Append text to previous turn if same role
                    if contents:
                        prev_text = contents[-1].parts[0].text
                        contents[-1] = types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=f"{prev_text}\n{text}")]
                        )
                    continue

                contents.append(types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=text)]
                ))
                last_role = role

        # Append current user message
        contents.append(types.Content(
            role="user",
            parts=[types.Part.from_text(text=message.strip())]
        ))

        try:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
                max_output_tokens=1024,
            )

            def _call_gemini_chat():
                return self.client.models.generate_content(
                    model=self.model_name,
                    contents=contents,
                    config=config
                )

            response, err_info = execute_with_retry(
                _call_gemini_chat,
                max_retries=2,
                initial_delay=1.0,
                backoff_factor=2.0,
                max_delay=3.0,
                max_total_duration=20.0,
                api_key_to_redact=self.api_key,
                language=language
            )

            if err_info is not None:
                return None, err_info

            if response and response.text:
                return response.text.strip(), None
            else:
                return None, {"message": "Received an empty response from Gemini.", "status_code": 502, "can_retry": True}

        except Exception as e:
            err_str = str(e)
            # Mask API key if present in error message string for security
            if self.api_key and self.api_key in err_str:
                err_str = err_str.replace(self.api_key, "[REDACTED_API_KEY]")
            logger.error(f"Gemini Chat API call failed: {err_str}")
            return None, {
                "message": f"Gemini API error: {err_str}",
                "status_code": 502,
                "can_retry": True
            }
