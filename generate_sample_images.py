"""
Sample Image Generator for PlantGuard AI Demo Mode
Generates synthetic leaf images demonstrating healthy leaves, early blight,
late blight, and pest chewing damage for instant testing.
"""

import os
import math
from PIL import Image, ImageDraw

def create_sample_leaf(output_path, leaf_type="healthy"):
    # 500x500 image with light neutral background
    width, height = 500, 500
    img = Image.new("RGB", (width, height), (245, 247, 244))
    draw = ImageDraw.Draw(img)

    # Base leaf coordinates (ovate shape)
    # Draw leaf silhouette
    leaf_poly = [
        (250, 60),   # Leaf Tip
        (320, 130),
        (370, 230),
        (350, 340),
        (280, 410),
        (255, 450),  # Petiole junction
        (245, 450),
        (220, 410),
        (150, 340),
        (130, 230),
        (180, 130)
    ]

    base_leaf_color = (46, 125, 50)  # Forest Green
    if leaf_type == "healthy":
        base_leaf_color = (56, 142, 60)
    elif leaf_type == "early_blight":
        base_leaf_color = (76, 140, 55)
    elif leaf_type == "late_blight":
        base_leaf_color = (55, 100, 50)
    elif leaf_type == "pest_damage":
        base_leaf_color = (67, 135, 58)

    # Draw base leaf blade
    draw.polygon(leaf_poly, fill=base_leaf_color, outline=(35, 90, 35))

    # Draw main vein
    draw.line([(250, 80), (250, 450)], fill=(76, 175, 80), width=4)
    # Secondary veins
    for y, angle in [(150, 35), (210, 40), (270, 42), (330, 45)]:
        # Right veins
        draw.line([(250, y), (250 + int(math.cos(math.radians(angle)) * 90), y - int(math.sin(math.radians(angle)) * 25))], fill=(80, 160, 80), width=2)
        # Left veins
        draw.line([(250, y), (250 - int(math.cos(math.radians(angle)) * 90), y - int(math.sin(math.radians(angle)) * 25))], fill=(80, 160, 80), width=2)

    # Petiole stem
    draw.rectangle([246, 440, 254, 480], fill=(40, 95, 40))

    if leaf_type == "early_blight":
        # Add necrotic brown spots with yellow halos (concentric rings)
        lesion_centers = [(210, 220), (300, 270), (230, 330), (310, 170)]
        for cx, cy in lesion_centers:
            # Yellow chlorotic halo
            draw.ellipse([cx - 36, cy - 36, cx + 36, cy + 36], fill=(195, 175, 40))
            # Outer brown ring
            draw.ellipse([cx - 26, cy - 26, cx + 26, cy + 26], fill=(110, 65, 30))
            # Inner lighter brown
            draw.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(140, 85, 40))
            # Center target bullseye
            draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(70, 40, 20))

    elif leaf_type == "late_blight":
        # Add large dark water-soaked irregular patches
        dark_patches = [
            [(160, 180), (230, 190), (220, 250), (150, 240)],
            [(270, 280), (350, 290), (330, 370), (260, 350)],
            [(220, 100), (260, 95), (270, 140), (210, 130)]
        ]
        for patch in dark_patches:
            draw.polygon(patch, fill=(45, 40, 35), outline=(90, 85, 75))
            # Whitish mildew margin
            for pt in patch:
                draw.ellipse([pt[0] - 6, pt[1] - 6, pt[0] + 6, pt[1] + 6], fill=(210, 215, 205))

    elif leaf_type == "pest_damage":
        # Punch irregular chewing holes (holes match background color)
        chewed_holes = [
            [(310, 220), 28],
            [(190, 280), 24],
            [(330, 320), 32],
            [(210, 170), 18],
            [(260, 250), 16]
        ]
        for (hx, hy), radius in chewed_holes:
            # Chewed hole with ragged edge
            draw.ellipse([hx - radius, hy - radius, hx + radius, hy + radius], fill=(245, 247, 244), outline=(40, 60, 30), width=2)
            # Brownish oxidized feeding margin
            draw.ellipse([hx - radius - 2, hy - radius - 2, hx + radius + 2, hy + radius + 2], outline=(100, 75, 40), width=1)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "JPEG", quality=92)
    print(f"Generated sample image: {output_path}")

if __name__ == "__main__":
    target_dir = os.path.join(os.path.dirname(__file__), "static", "samples")
    create_sample_leaf(os.path.join(target_dir, "sample_healthy_tomato.jpg"), "healthy")
    create_sample_leaf(os.path.join(target_dir, "sample_early_blight.jpg"), "early_blight")
    create_sample_leaf(os.path.join(target_dir, "sample_late_blight.jpg"), "late_blight")
    create_sample_leaf(os.path.join(target_dir, "sample_pest_damage.jpg"), "pest_damage")
