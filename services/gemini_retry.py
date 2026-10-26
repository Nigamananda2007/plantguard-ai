"""
PlantGuard AI - Exponential Backoff and Error Categorization for Gemini API.
Handles temporary errors (503 UNAVAILABLE, 429 RESOURCE_EXHAUSTED, 504 DEADLINE_EXCEEDED, timeouts)
with a bounded retry loop, clear localization (Odia, English, Hindi), and API key sanitization.
"""

import time
import random
import logging
from typing import Callable, Any, Tuple, Optional, Dict

logger = logging.getLogger(__name__)


def classify_gemini_error(exc: Exception) -> Tuple[bool, str]:
    """
    Classifies an exception from google-genai or network socket.
    Returns (is_temporary, category)
    Categories: 'high_demand_503', 'rate_limit_429', 'timeout_504', 'network_timeout', 'other'
    """
    err_str = str(exc).lower()

    # 503 Service Unavailable / High demand / Temporary overloaded
    if "503" in err_str or "unavailable" in err_str or "high demand" in err_str or "temporarily overloaded" in err_str:
        return True, "high_demand_503"

    # 429 Rate limit / Quota / Resource exhausted
    if "429" in err_str or "resource_exhausted" in err_str or "rate limit" in err_str or "quota" in err_str or "too many requests" in err_str:
        return True, "rate_limit_429"

    # 504 Deadline exceeded / Gateway timeout
    if "504" in err_str or "deadline_exceeded" in err_str or "gateway timeout" in err_str:
        return True, "timeout_504"

    # Network timeouts & socket issues
    if "timeout" in err_str or "timed out" in err_str or "connection reset" in err_str or "connecterror" in err_str:
        return True, "network_timeout"

    return False, "other"


def get_localized_gemini_error(category: str, language: str = "en", attempts: int = 1) -> str:
    """
    Returns a farmer-friendly, clear localized message explaining the error.
    """
    retry_note_en = f" (Completed {attempts} automatic {'retry' if attempts == 1 else 'retries'})." if attempts > 0 else ""
    retry_note_or = f" (ସିଷ୍ଟମ୍ {attempts} ଥର ସ୍ୱୟଂଚାଳିତ ପ୍ରୟାସ କରିଥିଲା)।" if attempts > 0 else ""
    retry_note_hi = f" (सिस्टम ने {attempts} बार स्वचालित पुनः प्रयास किया)।" if attempts > 0 else ""

    if category == "high_demand_503":
        if language == "or":
            return (
                f"ଗୁଗୁଲ୍ ଜେମିନାଇ AI ସର୍ଭର୍‌ରେ ଏହି ମୁହୂର୍ତ୍ତରେ ଅତ୍ୟଧିକ ଚାପ (High Demand - 503) ରହିଛି{retry_note_or} "
                "ଦୟାକରି କିଛି ସେକେଣ୍ଡ ଅପେକ୍ଷା କରି 'ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ' ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ।"
            )
        elif language == "hi":
            return (
                f"गूगल जेमिनी AI सर्वर पर वर्तमान में अत्यधिक मांग (High Demand - 503) है{retry_note_hi} "
                "कृपया कुछ सेकंड प्रतीक्षा करें और 'पुनः प्रयास करें' बटन पर क्लिक करें।"
            )
        else:
            return (
                f"Google Gemini AI is currently experiencing high demand (503 Service Unavailable){retry_note_en} "
                "Please wait a few moments and click 'Retry' to try again."
            )

    elif category == "rate_limit_429":
        if language == "or":
            return (
                f"ଜେମିନାଇ API ଅନୁରୋଧ ସୀମା (Rate Limit - 429 Too Many Requests) ଶେଷ ହୋଇଛି{retry_note_or} "
                "ଦୟାକରି କିଛି ସେକେଣ୍ଡ ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।"
            )
        elif language == "hi":
            return (
                f"जेमिनी API अनुरोध सीमा (Rate Limit - 429 Too Many Requests) समाप्त हो गई है{retry_note_hi} "
                "कृपया कुछ सेकंड बाद पुनः प्रयास करें।"
            )
        else:
            return (
                f"Gemini API rate limit reached (429 Too Many Requests){retry_note_en} "
                "Please wait a few moments and click 'Retry'."
            )

    elif category in ("timeout_504", "network_timeout"):
        if language == "or":
            return (
                "AI ସର୍ଭିସ୍ ସହିତ ଯୋଗାଯୋଗ ସମୟ ସୀମା (Timeout) ଅତିକ୍ରାନ୍ତ ହୋଇଛି। "
                "ଦୟାକରି ଇଣ୍ଟରନେଟ୍ ଯାଞ୍ଚ କରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।"
            )
        elif language == "hi":
            return (
                "AI सेवा के साथ संचार समय सीमा (Timeout) समाप्त हो गई है। "
                "कृपया इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"
            )
        else:
            return (
                "The AI request timed out before completing. "
                "Please verify your connection and click 'Retry'."
            )

    else:
        if language == "or":
            return "AI ସର୍ଭିସ୍‌ରେ ଏକ ଅପ୍ରତ୍ୟାଶିତ ତ୍ରୁଟି ଦେଖାଦେଇଛି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।"
        elif language == "hi":
            return "AI सेवा में एक अप्रत्याशित त्रुटि आई है। कृपया पुनः प्रयास करें।"
        else:
            return "An unexpected error occurred while communicating with Gemini AI. Please try again."


def execute_with_retry(
    callable_fn: Callable[[], Any],
    max_retries: int = 2,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0,
    max_delay: float = 4.0,
    api_key_to_redact: Optional[str] = None,
    language: str = "en",
    sleep_fn: Callable[[float], None] = time.sleep
) -> Tuple[Optional[Any], Optional[Dict[str, Any]]]:
    """
    Executes a callable with bounded exponential backoff for temporary 503/429/timeout errors.

    Args:
        callable_fn: Zero-arg function executing the Gemini SDK call.
        max_retries: Max number of retries after initial attempt (default 2, total 3 calls max).
        initial_delay: Initial sleep in seconds before first retry.
        backoff_factor: Multiplier for exponential growth.
        max_delay: Upper cap on sleep interval.
        api_key_to_redact: Optional API key string to redact from raw error messages.
        language: User language ('en', 'or', 'hi') for localized error message.
        sleep_fn: Sleep function (injectable for instant unit tests).

    Returns:
        (result, None) on success.
        (None, error_info_dict) on final failure.
    """
    attempt = 0
    while True:
        try:
            result = callable_fn()
            return result, None

        except Exception as e:
            is_temp, category = classify_gemini_error(e)
            raw_err = str(e)
            if api_key_to_redact and api_key_to_redact in raw_err:
                raw_err = raw_err.replace(api_key_to_redact, "[REDACTED_API_KEY]")

            if is_temp and attempt < max_retries:
                # Calculate exponential delay with small jitter
                delay = min(max_delay, initial_delay * (backoff_factor ** attempt))
                delay += random.uniform(0.05, 0.25)
                logger.warning(
                    f"Temporary Gemini error ({category}): {raw_err[:120]}. "
                    f"Retrying attempt {attempt + 1}/{max_retries} in {delay:.2f}s..."
                )
                attempt += 1
                sleep_fn(delay)
                continue

            # Retries exhausted or non-temporary error
            logger.error(
                f"Gemini API call failed (category={category}, attempts={attempt + 1}): {raw_err[:200]}"
            )
            localized_msg = get_localized_gemini_error(category, language=language, attempts=attempt)
            error_info = {
                "is_temporary": is_temp,
                "category": category,
                "raw_error": raw_err,
                "message": localized_msg,
                "attempts_made": attempt + 1,
                "can_retry": True
            }
            return None, error_info
