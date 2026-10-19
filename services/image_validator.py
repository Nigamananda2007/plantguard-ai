"""
Safe Image Validation Service
Validates file extensions, file sizes, MIME integrity, dimensions,
and detects unclear or non-foliage imagery.
"""

import os
from io import BytesIO
from PIL import Image

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 Megabytes
MIN_DIMENSION = 80
MAX_DIMENSION = 5000


def validate_image_file(file_storage):
    """
    Validates uploaded file safely.
    
    Args:
        file_storage: Werkzeug FileStorage object from request.files['image']
        
    Returns:
        tuple: (is_valid: bool, error_message: str | None, metadata: dict | None)
    """
    if not file_storage or not file_storage.filename:
        return False, "No file was selected. Please upload a plant leaf image.", None

    filename = file_storage.filename
    _, ext = os.path.splitext(filename)
    ext = ext.lower()

    # 1. Extension check
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"Unsupported file type '{ext}'. Allowed formats are JPG, JPEG, and PNG.", None

    # 2. File size verification
    file_storage.seek(0, os.SEEK_END)
    size_bytes = file_storage.tell()
    file_storage.seek(0)  # Reset pointer to start

    if size_bytes == 0:
        return False, "Uploaded file is empty (0 bytes).", None

    if size_bytes > MAX_FILE_SIZE_BYTES:
        max_mb = MAX_FILE_SIZE_BYTES // (1024 * 1024)
        return False, f"File size exceeds the {max_mb}MB limit. Please upload a smaller image.", None

    # 3. Read image bytes and verify integrity with Pillow
    try:
        image_bytes = file_storage.read()
        file_storage.seek(0)  # Reset pointer for downstream use
        img = Image.open(BytesIO(image_bytes))
        img.verify()  # Verifies file integrity without decoding full raster
    except Exception as e:
        return False, "Corrupted or invalid image file. Please upload a valid JPG or PNG image.", None

    # Re-open after verify() which can invalidate the image handle
    try:
        img = Image.open(BytesIO(image_bytes))
        img_format = (img.format or "").upper()
        width, height = img.size

        # 4. Check resolution
        if width < MIN_DIMENSION or height < MIN_DIMENSION:
            return False, f"Image resolution ({width}x{height}) is too small. Please upload an image of at least {MIN_DIMENSION}x{MIN_DIMENSION} pixels.", None

        if width > MAX_DIMENSION or height > MAX_DIMENSION:
            return False, f"Image dimensions ({width}x{height}) exceed maximum allowed {MAX_DIMENSION}px.", None

        # 5. Visual clarity and leaf feature sanity check
        # Convert thumbnail to RGB to evaluate color channels and variance
        thumb = img.convert("RGB")
        thumb.thumbnail((120, 120))
        if hasattr(thumb, "get_flattened_data"):
            pixels = list(thumb.get_flattened_data())
        else:
            pixels = list(thumb.getdata())

        total_pixels = len(pixels)
        if total_pixels == 0:
            return False, "Unable to read pixel data from image.", None

        # Check for extreme blur / single solid color
        # Calculate standard deviation or variance of brightness
        brightness_values = [(0.299 * r + 0.587 * g + 0.114 * b) for (r, g, b) in pixels]
        mean_brightness = sum(brightness_values) / total_pixels
        variance = sum((b - mean_brightness) ** 2 for b in brightness_values) / total_pixels

        if variance < 25:  # Extremely flat, blank, or completely dark/white image
            return False, "The image appears blank, flat, or extremely unclear. Please provide a clear, well-lit photo of a plant leaf.", None

        # Check for plant foliage presence (green, olive, yellow-green, or brownish vegetation tones)
        foliage_like_pixels = 0
        for r, g, b in pixels:
            # Green dominant or yellow-green or leaf chlorosis/necrotic brown
            is_greenish = (g > r * 0.9 and g > b * 1.05 and g > 30)
            is_foliage_brown = (r > 60 and g > 40 and b < r * 0.75 and abs(r - g) < 60)
            is_yellowish = (r > 90 and g > 90 and b < g * 0.7)
            if is_greenish or is_foliage_brown or is_yellowish:
                foliage_like_pixels += 1

        foliage_ratio = foliage_like_pixels / total_pixels

        # If less than 8% of pixels have plant-like color and variance is low, warn user
        if foliage_ratio < 0.08:
            return False, (
                "The uploaded image does not appear to contain recognizable plant foliage or leaves. "
                "Please upload a close-up photo of a plant leaf."
            ), None

        metadata = {
            "format": img_format,
            "width": width,
            "height": height,
            "size_kb": round(size_bytes / 1024, 2),
            "foliage_ratio": round(foliage_ratio, 3)
        }

        return True, None, metadata

    except Exception as e:
        return False, f"Failed to analyze image structure: {str(e)}", None
