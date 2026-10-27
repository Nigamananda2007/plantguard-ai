"""
Tests for Gemini API Exponential Backoff, Error Classification, and Localization.
Verifies bounded retries, total duration deadline, 503/429 detection, API key masking,
and Odia/English messaging.
"""

import unittest
from unittest.mock import MagicMock
from services.gemini_retry import (
    classify_gemini_error,
    get_localized_gemini_error,
    execute_with_retry
)


class TestGeminiRetry(unittest.TestCase):
    def test_classify_503_high_demand(self):
        """Verify 503 UNAVAILABLE / high demand is classified as temporary with status 503."""
        e1 = Exception("ServerError 503 UNAVAILABLE. This model is currently experiencing high demand.")
        is_temp, cat, status = classify_gemini_error(e1)
        self.assertTrue(is_temp)
        self.assertEqual(cat, "high_demand_503")
        self.assertEqual(status, 503)

        e2 = Exception("The service is temporarily overloaded.")
        is_temp2, cat2, status2 = classify_gemini_error(e2)
        self.assertTrue(is_temp2)
        self.assertEqual(cat2, "high_demand_503")
        self.assertEqual(status2, 503)

    def test_classify_429_rate_limit(self):
        """Verify 429 RESOURCE_EXHAUSTED / quota exceeded is classified as temporary with status 429."""
        e = Exception("ClientError 429 RESOURCE_EXHAUSTED. Quota exceeded for quota metric.")
        is_temp, cat, status = classify_gemini_error(e)
        self.assertTrue(is_temp)
        self.assertEqual(cat, "rate_limit_429")
        self.assertEqual(status, 429)

    def test_classify_504_deadline_exceeded(self):
        """Verify 504 DEADLINE_EXCEEDED is classified as temporary with status 504."""
        e = Exception("ServerError 504 DEADLINE_EXCEEDED. Deadline expired before operation could complete.")
        is_temp, cat, status = classify_gemini_error(e)
        self.assertTrue(is_temp)
        self.assertEqual(cat, "timeout_504")
        self.assertEqual(status, 504)

    def test_classify_permanent_error_not_retried(self):
        """Verify 404 NOT_FOUND or 400 INVALID_ARGUMENT are not classified as temporary."""
        e_404 = Exception("ClientError 404 NOT_FOUND. Model not found.")
        is_temp, cat, status = classify_gemini_error(e_404)
        self.assertFalse(is_temp)
        self.assertEqual(status, 502)

        e_400 = Exception("ClientError 400 INVALID_ARGUMENT. Bad image format.")
        is_temp2, cat2, status2 = classify_gemini_error(e_400)
        self.assertFalse(is_temp2)

    def test_retry_immediate_success(self):
        """Verify callable succeeds on first attempt without sleeping."""
        mock_fn = MagicMock(return_value="OK")
        mock_sleep = MagicMock()

        res, err = execute_with_retry(mock_fn, max_retries=2, sleep_fn=mock_sleep)
        self.assertEqual(res, "OK")
        self.assertIsNone(err)
        self.assertEqual(mock_fn.call_count, 1)
        self.assertEqual(mock_sleep.call_count, 0)

    def test_retry_succeeds_on_second_attempt_with_backoff(self):
        """Verify temporary error triggers exponential backoff and succeeds on attempt 2."""
        mock_fn = MagicMock(side_effect=[
            Exception("503 UNAVAILABLE. Spike in demand."),
            "RECOVERED_SUCCESS"
        ])
        mock_sleep = MagicMock()

        res, err = execute_with_retry(
            mock_fn,
            max_retries=2,
            initial_delay=1.0,
            backoff_factor=2.0,
            sleep_fn=mock_sleep
        )
        self.assertEqual(res, "RECOVERED_SUCCESS")
        self.assertIsNone(err)
        self.assertEqual(mock_fn.call_count, 2)
        self.assertEqual(mock_sleep.call_count, 1)
        # Sleep delay should be >= 1.0s (initial delay + jitter)
        first_delay = mock_sleep.call_args[0][0]
        self.assertGreaterEqual(first_delay, 1.0)

    def test_retry_bounded_does_not_retry_indefinitely(self):
        """Verify retry stops strictly after max_retries attempts (total max_retries + 1 calls)."""
        mock_fn = MagicMock(side_effect=Exception("503 UNAVAILABLE. High demand."))
        mock_sleep = MagicMock()

        max_retries = 2
        res, err = execute_with_retry(
            mock_fn,
            max_retries=max_retries,
            initial_delay=0.5,
            backoff_factor=2.0,
            sleep_fn=mock_sleep,
            language="en"
        )
        self.assertIsNone(res)
        self.assertIsNotNone(err)
        # Total calls = 1 initial + 2 retries = 3
        self.assertEqual(mock_fn.call_count, 3)
        self.assertEqual(mock_sleep.call_count, 2)
        self.assertEqual(err["attempts_made"], 3)
        self.assertTrue(err["is_temporary"])
        self.assertEqual(err["category"], "high_demand_503")
        self.assertEqual(err["status_code"], 503)
        self.assertIn("503", err["message"])

    def test_retry_stops_when_max_total_duration_exceeded(self):
        """Verify retry aborts when total elapsed request duration approaches deadline."""
        mock_fn = MagicMock(side_effect=Exception("503 UNAVAILABLE. High demand."))
        mock_sleep = MagicMock()

        # Simulate clock advancing past deadline
        times = [0.0, 10.0, 18.5, 25.0]
        def mock_time():
            return times.pop(0) if times else 30.0

        res, err = execute_with_retry(
            mock_fn,
            max_retries=5,
            initial_delay=1.0,
            max_total_duration=15.0,
            sleep_fn=mock_sleep,
            time_fn=mock_time
        )
        self.assertIsNone(res)
        self.assertIsNotNone(err)
        # Should abort early without continuing to 5 retries
        self.assertLessEqual(mock_fn.call_count, 2)
        self.assertTrue(err["is_temporary"])

    def test_retry_aborts_immediately_on_non_temporary_error(self):
        """Verify non-temporary error fails immediately on 1st attempt without sleeping."""
        mock_fn = MagicMock(side_effect=Exception("ClientError 404 NOT_FOUND"))
        mock_sleep = MagicMock()

        res, err = execute_with_retry(mock_fn, max_retries=3, sleep_fn=mock_sleep)
        self.assertIsNone(res)
        self.assertIsNotNone(err)
        self.assertEqual(mock_fn.call_count, 1)
        self.assertEqual(mock_sleep.call_count, 0)
        self.assertFalse(err["is_temporary"])

    def test_retry_masks_api_key_in_error_payload(self):
        """Verify API key is redacted from error strings."""
        secret_key = "AIzaSySecret123456789"
        mock_fn = MagicMock(side_effect=Exception(f"Call with {secret_key} failed: 429 quota"))
        mock_sleep = MagicMock()

        res, err = execute_with_retry(
            mock_fn,
            max_retries=1,
            api_key_to_redact=secret_key,
            sleep_fn=mock_sleep
        )
        self.assertIsNone(res)
        self.assertNotIn(secret_key, err["raw_error"])
        self.assertIn("[REDACTED_API_KEY]", err["raw_error"])

    def test_localized_error_messages(self):
        """Verify clear natural Odia and English error messages for 503 and 429."""
        # Odia 503
        msg_or_503 = get_localized_gemini_error("high_demand_503", language="or", attempts=2)
        self.assertIn("ଅତ୍ୟଧିକ ଚାପ", msg_or_503)
        self.assertIn("503", msg_or_503)
        self.assertIn("ପୁନର୍ବାର ଚେଷ୍ଟା", msg_or_503)

        # English 503
        msg_en_503 = get_localized_gemini_error("high_demand_503", language="en", attempts=2)
        self.assertIn("high demand", msg_en_503.lower())
        self.assertIn("503", msg_en_503)
        self.assertIn("retry", msg_en_503.lower())

        # Odia 429
        msg_or_429 = get_localized_gemini_error("rate_limit_429", language="or", attempts=2)
        self.assertIn("ଅନୁରୋଧ ସୀମା", msg_or_429)
        self.assertIn("429", msg_or_429)

        # English 429
        msg_en_429 = get_localized_gemini_error("rate_limit_429", language="en", attempts=2)
        self.assertIn("rate limit", msg_en_429.lower())
        self.assertIn("429", msg_en_429)


if __name__ == "__main__":
    unittest.main()
