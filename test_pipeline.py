"""
Automated Pipeline Verification Test for PlantGuard AI
Tests server endpoints, validation filters, disease classification, and pest engine.
"""

import unittest
import io
from app import app


class TestPlantGuardAI(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

    def test_index_route(self):
        """Verify index route renders correctly."""
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertIn(b"PlantGuard AI", res.data)
        self.assertIn(b"Agricultural", res.data)

    def test_health_check(self):
        """Verify health check endpoint."""
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["sample_dir_exists"])

    def test_sample_list(self):
        """Verify sample images listing."""
        res = self.client.get("/api/samples")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertGreaterEqual(len(data["samples"]), 4)

    def test_analyze_sample_early_blight(self):
        """Verify analyzing sample early blight."""
        res = self.client.post("/api/analyze", data={"sample_id": "sample_early_blight.jpg"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        disease = data["disease_prediction"]
        self.assertIn("Early Blight", disease["condition"])
        self.assertGreater(disease["confidence_percentage"], 65.0)
        self.assertIn("Alternaria solani", disease["pathogen"])
        self.assertIn("organic_treatment", disease)
        self.assertIn("disclaimer", data)

    def test_analyze_sample_pest_damage(self):
        """Verify analyzing sample pest damage."""
        res = self.client.post("/api/analyze", data={"sample_id": "sample_pest_damage.jpg"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        pest = data["pest_analysis"]
        self.assertTrue(pest["pest_damage_detected"])
        self.assertIn("Leaf Chewing", pest["damage_type"])
        self.assertGreater(len(pest["likely_culprits"]), 0)

    def test_invalid_file_rejection(self):
        """Verify rejection of invalid text file uploaded as leaf image."""
        fake_file = (io.BytesIO(b"Hello world, this is a plain text file, not a leaf image."), "test.txt")
        res = self.client.post("/api/analyze", data={"image": fake_file})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("Unsupported file type", data["error"])

    def test_blank_or_unclear_image_rejection(self):
        """Verify rejection of solid white image with no leaf features."""
        from PIL import Image
        img = Image.new("RGB", (200, 200), (255, 255, 255))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        buf.seek(0)
        fake_file = (buf, "blank_white.jpg")

        res = self.client.post("/api/analyze", data={"image": fake_file})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertTrue("blank" in data["error"].lower() or "foliage" in data["error"].lower())

    def test_multilingual_assets(self):
        """Verify multilingual assets and language selector presence."""
        # Check translations dictionary asset
        res_trans = self.client.get("/static/js/translations.js")
        self.assertEqual(res_trans.status_code, 200)
        self.assertIn(b"translations", res_trans.data)
        self.assertIn("ଭାଷା".encode("utf-8"), res_trans.data)
        self.assertIn("भाषा".encode("utf-8"), res_trans.data)

        # Check index HTML has selector with Odia and Hindi options
        res_index = self.client.get("/")
        self.assertEqual(res_index.status_code, 200)
        self.assertIn(b"langSelect", res_index.data)
        self.assertIn(b'value="or"', res_index.data)
        self.assertIn(b'value="hi"', res_index.data)
        self.assertIn("ଓଡ଼ିଆ".encode("utf-8"), res_index.data)
        self.assertIn("हिन्दी".encode("utf-8"), res_index.data)
        res_trans.close()
        res_index.close()

    def test_real_ai_fallback_integrity(self):
        """Verify that when no API key is set, system safely executes validated fallback."""
        from unittest.mock import patch
        from app import gemini_service
        with patch.object(gemini_service, "is_available", return_value=False):
            res = self.client.get("/api/health")
            self.assertEqual(res.status_code, 200)
            data = res.get_json()
            self.assertIn("real_ai_configured", data)

            # Test analysis with fallback notice
            res_analyze = self.client.post("/api/analyze", data={"sample_id": "sample_healthy_tomato.jpg"})
            self.assertEqual(res_analyze.status_code, 200)
            analyze_data = res_analyze.get_json()
            self.assertTrue(analyze_data["success"])
            self.assertFalse(analyze_data["is_real_ai"])
            self.assertIn("fallback_notice", analyze_data)

    def test_persistent_ai_assistant_elements(self):
        """Verify persistent floating AI Assistant button and chat panel are present in HTML."""
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        html = res.data.decode("utf-8")
        self.assertIn('id="aiAssistantFloatingBtn"', html)
        self.assertIn('id="aiAssistantPanel"', html)
        self.assertIn('id="aiPanelNewChatBtn"', html)
        self.assertIn('id="aiPanelMessages"', html)
        self.assertIn('id="aiPanelInput"', html)
        self.assertIn('id="aiPanelSendBtn"', html)
        self.assertIn('ai_assistant.js', html)

    def test_chat_page_route(self):
        """Verify dedicated standalone /chat page renders correctly."""
        res = self.client.get("/chat")
        self.assertEqual(res.status_code, 200)
        html = res.data.decode("utf-8")
        self.assertIn("PlantGuard AI", html)
        self.assertIn('id="standaloneChatMessages"', html)
        self.assertIn('id="standaloneChatInput"', html)
        self.assertIn('id="newChatBtn"', html)

    def test_chat_endpoint_validation(self):
        """Verify input validation on /api/chat endpoint."""
        # Non-JSON payload
        res = self.client.post("/api/chat", data="plain text")
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])

        # Empty message
        res = self.client.post("/api/chat", json={"message": "   "})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data["success"])
        self.assertIn("empty", data["error"].lower())

    def test_chat_endpoint_honest_error_when_no_api_key(self):
        """Verify /api/chat returns honest error and never generates fake answers when API key is missing."""
        from unittest.mock import patch
        from app import gemini_chat_service

        with patch.object(gemini_chat_service, "is_available", return_value=False):
            # Test English general question
            res_en = self.client.post("/api/chat", json={
                "message": "What is photosynthesis and why is it important?",
                "language": "en"
            })
            self.assertEqual(res_en.status_code, 503)
            data_en = res_en.get_json()
            self.assertFalse(data_en["success"])
            self.assertTrue(data_en.get("api_key_missing"))
            self.assertIn("GEMINI_API_KEY", data_en["error"])

            # Test Odia general question
            res_or = self.client.post("/api/chat", json={
                "message": "ଆଲୋକଶ୍ଳେଷଣ କ’ଣ?",
                "language": "or"
            })
            self.assertEqual(res_or.status_code, 503)
            data_or = res_or.get_json()
            self.assertFalse(data_or["success"])
            self.assertTrue(data_or.get("api_key_missing"))
            self.assertIn("GEMINI_API_KEY", data_or["error"])

    def test_chat_general_prompt_instruction(self):
        """Verify system instruction supports ANY question (not only plant questions) and Odia."""
        from services.gemini_chat_service import GeminiChatService
        service = GeminiChatService()

        # English instruction
        instr_en = service.build_system_instruction(language="en")
        self.assertIn("ANY question", instr_en)
        self.assertIn("general knowledge", instr_en.lower())

        # Odia instruction
        instr_or = service.build_system_instruction(language="or")
        self.assertIn("ଓଡ଼ିଆ", instr_or)
        self.assertIn("ANY question", instr_or)

    def test_chat_endpoint_success_with_active_service(self):
        """Verify /api/chat returns successful reply when Gemini service is configured."""
        from unittest.mock import patch
        from app import gemini_chat_service

        with patch.object(gemini_chat_service, 'is_available', return_value=True):
            with patch.object(gemini_chat_service, 'chat', return_value=('Photosynthesis converts sunlight into chemical energy.', None)):
                res = self.client.post("/api/chat", json={
                    "message": "Explain photosynthesis in brief",
                    "history": [{"role": "user", "text": "Hello"}],
                    "language": "en"
                })
                self.assertEqual(res.status_code, 200)
                data = res.get_json()
                self.assertTrue(data["success"])
                self.assertIn("Photosynthesis", data["reply"])
                self.assertEqual(data["language"], "en")

    def test_gemini_model_configuration(self):
        """Verify that Gemini model configuration defaults to gemini-3.8-flash for both vision and chat."""
        from app import gemini_service, gemini_chat_service
        self.assertEqual(gemini_service.model_name, "gemini-3.8-flash")
        self.assertEqual(gemini_chat_service.model_name, "gemini-3.8-flash")

        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get("chat_model"), "gemini-3.8-flash")
        self.assertEqual(data.get("vision_model"), "gemini-3.8-flash")


if __name__ == "__main__":
    unittest.main()
