"""
Unit and Integration Tests for PlantGuard AI Chat Features.
Tests both Feature 1 (Report Follow-up Chat) and Feature 2 (Standalone AI Chat Page),
including input validation, API key absence handling, mock Gemini API success & errors,
language handling (Odia, English, Hindi), and report context injection.
"""

import unittest
from unittest.mock import patch, MagicMock
from app import app, gemini_chat_service


class TestPlantGuardAIChat(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

    def test_standalone_chat_page_route(self):
        """Verify GET /chat returns standalone chat interface."""
        res = self.client.get("/chat")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"PlantGuard AI", res.data)
        self.assertIn(b"standaloneChatMessages", res.data)
        self.assertIn(b"standaloneChatInput", res.data)
        self.assertIn(b"newChatBtn", res.data)
        self.assertIn(b"/static/js/chat.js", res.data)

    def test_index_page_contains_chat_nav_and_report_card(self):
        """Verify GET / renders navigation links to /chat and the report follow-up chat card."""
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'href="/chat"', res.data)
        self.assertIn(b'id="reportChatCard"', res.data)
        self.assertIn(b'id="reportChatMessages"', res.data)
        self.assertIn(b'id="reportChatInput"', res.data)
        self.assertIn(b'id="reportChatResetBtn"', res.data)

    def test_health_check_includes_chat_status(self):
        """Verify GET /api/health includes chat engine configuration status."""
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("chat_ai_configured", data)
        self.assertIn("chat_model", data)
        self.assertEqual(data["chat_model"], "gemini-3.8-flash")

    def test_chat_endpoint_invalid_payload(self):
        """Verify POST /api/chat rejects non-JSON requests."""
        res = self.client.post("/api/chat", data="not a json")
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("JSON", data["error"])

    def test_chat_endpoint_missing_message(self):
        """Verify POST /api/chat rejects missing message parameter."""
        res = self.client.post("/api/chat", json={})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Message is required", data["error"])

    def test_chat_endpoint_empty_message(self):
        """Verify POST /api/chat rejects whitespace-only messages."""
        res = self.client.post("/api/chat", json={"message": "   \n\t  "})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Message is required", data["error"])

    def test_chat_endpoint_message_length_limit(self):
        """Verify POST /api/chat rejects messages exceeding 1000 characters."""
        long_message = "A" * 1001
        res = self.client.post("/api/chat", json={"message": long_message})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("maximum limit", data["error"])

    def test_chat_endpoint_missing_api_key_honest_rejection(self):
        """
        Verify POST /api/chat returns honest 503 notice when GEMINI_API_KEY
        is not configured, without pretending a fake response is from Gemini.
        """
        with patch.object(gemini_chat_service, "is_available", return_value=False):
            res = self.client.post("/api/chat", json={
                "message": "How do I cure tomato blight?",
                "language": "en"
            })
            self.assertEqual(res.status_code, 503)
            data = res.get_json()
            self.assertFalse(data["success"])
            self.assertTrue(data.get("api_key_missing"))
            self.assertIn("GEMINI_API_KEY", data["error"])
            self.assertIn("disclaimer", data)

    def test_chat_service_system_instruction_odia(self):
        """Verify system instruction contains Odia guidance and agricultural safety rules."""
        instruction = gemini_chat_service.build_system_instruction(language="or")
        self.assertIn("ଓଡ଼ିଆ", instruction)
        self.assertIn("PlantGuard AI", instruction)
        self.assertIn("Integrated Pest Management", instruction)

    def test_chat_service_system_instruction_with_report_context(self):
        """Verify system instruction incorporates report context for Feature 1."""
        report_ctx = {
            "crop": "Tomato",
            "condition": "Early Blight",
            "confidence": 88.5,
            "severity": "Moderate",
            "pathogen": "Alternaria solani",
            "symptoms": ["Concentric rings", "Yellow halo"],
            "pest_damage": {"detected": False},
            "organic_treatment": ["Neem oil spray", "Copper fungicide"],
            "chemical_treatment": ["Mancozeb (use with caution)"],
            "prevention": ["Crop rotation", "Drip irrigation"]
        }
        instruction = gemini_chat_service.build_system_instruction(
            language="en",
            report_context=report_ctx
        )
        self.assertIn("Tomato", instruction)
        self.assertIn("Early Blight", instruction)
        self.assertIn("Alternaria solani", instruction)
        self.assertIn("Neem oil spray", instruction)
        self.assertIn("Concentric rings", instruction)

    @patch.object(gemini_chat_service, "is_available", return_value=True)
    def test_chat_endpoint_mocked_gemini_success(self, mock_available):
        """Verify successful Gemini chat response handling."""
        mock_reply = "Prune infected lower foliage immediately and apply diluted organic neem oil spray."
        with patch.object(gemini_chat_service, "chat", return_value=(mock_reply, None)) as mock_chat:
            res = self.client.post("/api/chat", json={
                "message": "What should I do first for early blight?",
                "language": "en",
                "history": [
                    {"role": "user", "text": "I noticed brown spots."},
                    {"role": "model", "text": "It looks like Early Blight."}
                ],
                "report_context": {
                    "crop": "Tomato",
                    "condition": "Early Blight",
                    "confidence": 88.5,
                    "severity": "Moderate"
                }
            })
            self.assertEqual(res.status_code, 200)
            data = res.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["reply"], mock_reply)
            self.assertEqual(data["model"], "gemini-3.8-flash")
            self.assertTrue(data["has_report_context"])
            self.assertIn("disclaimer", data)

            mock_chat.assert_called_once()
            args, kwargs = mock_chat.call_args
            self.assertEqual(kwargs["message"], "What should I do first for early blight?")
            self.assertEqual(kwargs["language"], "en")
            self.assertEqual(len(kwargs["history"]), 2)
            self.assertEqual(kwargs["report_context"]["crop"], "Tomato")

    @patch.object(gemini_chat_service, "is_available", return_value=True)
    def test_chat_endpoint_gemini_api_error_handling(self, mock_available):
        """Verify graceful error reporting when Gemini API returns an error or quota exhaustion."""
        with patch.object(gemini_chat_service, "chat", return_value=(None, "Gemini API error: Quota exceeded")) as mock_chat:
            res = self.client.post("/api/chat", json={
                "message": "How often should I spray?",
                "language": "en"
            })
            self.assertEqual(res.status_code, 502)
            data = res.get_json()
            self.assertFalse(data["success"])
            self.assertIn("Quota exceeded", data["error"])

    @patch.object(gemini_chat_service, "is_available", return_value=True)
    def test_chat_endpoint_503_high_demand_handling(self, mock_available):
        """Verify /api/chat returns structured HTTP 503 and Retry-After header during high demand."""
        mock_err = {
            "message": "Google Gemini AI is currently experiencing high demand (503 Service Unavailable).",
            "status_code": 503,
            "can_retry": True,
            "category": "high_demand_503"
        }
        with patch.object(gemini_chat_service, "chat", return_value=(None, mock_err)):
            res = self.client.post("/api/chat", json={
                "message": "Is this plant healthy?",
                "language": "en"
            })
            self.assertEqual(res.status_code, 503)
            data = res.get_json()
            self.assertFalse(data["success"])
            self.assertTrue(data["can_retry"])
            self.assertIn("503", data["error"])
            self.assertEqual(res.headers.get("Retry-After"), "5")

    @patch.object(gemini_chat_service, "is_available", return_value=True)
    def test_chat_endpoint_429_rate_limit_handling(self, mock_available):
        """Verify /api/chat returns structured HTTP 429 and Retry-After header on quota/rate limit."""
        mock_err = {
            "message": "Gemini API rate limit reached (429 Too Many Requests).",
            "status_code": 429,
            "can_retry": True,
            "category": "rate_limit_429"
        }
        with patch.object(gemini_chat_service, "chat", return_value=(None, mock_err)):
            res = self.client.post("/api/chat", json={
                "message": "What is tomato blight?",
                "language": "en"
            })
            self.assertEqual(res.status_code, 429)
            data = res.get_json()
            self.assertFalse(data["success"])
            self.assertTrue(data["can_retry"])
            self.assertIn("429", data["error"])
            self.assertEqual(res.headers.get("Retry-After"), "5")

    @patch.object(gemini_chat_service, "is_available", return_value=True)
    def test_chat_endpoint_504_timeout_handling(self, mock_available):
        """Verify /api/chat returns structured HTTP 504 on deadline/timeout."""
        mock_err = {
            "message": "The AI request timed out before completing.",
            "status_code": 504,
            "can_retry": True,
            "category": "timeout_504"
        }
        with patch.object(gemini_chat_service, "chat", return_value=(None, mock_err)):
            res = self.client.post("/api/chat", json={
                "message": "Diagnose my leaf",
                "language": "en"
            })
            self.assertEqual(res.status_code, 504)
            data = res.get_json()
            self.assertFalse(data["success"])
            self.assertTrue(data["can_retry"])

    @patch.object(gemini_chat_service, "is_available", return_value=True)
    def test_chat_endpoint_unexpected_exception_safety(self, mock_available):
        """Verify /api/chat catches unexpected backend exceptions and returns safe JSON 500 without crashing."""
        with patch.object(gemini_chat_service, "chat", side_effect=RuntimeError("Unexpected connection reset")):
            res = self.client.post("/api/chat", json={
                "message": "Explain photosynthesis",
                "language": "en"
            })
            self.assertEqual(res.status_code, 500)
            data = res.get_json()
            self.assertFalse(data["success"])
            self.assertTrue(data["can_retry"])
            self.assertIn("unexpected error", data["error"].lower())

    def test_gemini_client_reuse_does_not_leak_memory(self):
        """Verify is_available() reuses client instance instead of recreating genai.Client repeatedly."""
        with patch.dict("os.environ", {"GEMINI_API_KEY": "AIzaSyTestKeyForClientReuse"}):
            service = gemini_chat_service.__class__()
            # Initial client
            first_client = service.client
            # Multiple calls to is_available
            for _ in range(5):
                service.is_available()
            # Must remain the exact same client object instance
            self.assertIs(service.client, first_client)

    def test_multilingual_chat_translations(self):
        """Verify translations.js contains navigation and chat keys for English, Odia, and Hindi."""
        res = self.client.get("/static/js/translations.js")
        self.assertEqual(res.status_code, 200)
        content = res.data.decode("utf-8")

        # English keys
        self.assertIn("nav_chat", content)
        self.assertIn("Plant AI Chat", content)
        self.assertIn("report_chat_title", content)

        # Odia keys
        self.assertIn("କୃଷି AI ଚାଟ୍", content)
        self.assertIn("ଏହି ରିପୋର୍ଟ ସମ୍ପର୍କରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ", content)

        # Hindi keys
        self.assertIn("कृषि AI चैट", content)
        self.assertIn("इस रिपोर्ट के बारे में सवाल पूछें", content)
        res.close()


if __name__ == "__main__":
    unittest.main()
