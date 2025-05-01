import os
import csv

base_folder = "website"
output = []

for model in os.listdir(base_folder):
    model_path = os.path.join(base_folder, model)
    if not os.path.isdir(model_path):
        continue

    # Find the 'all colors' image (image file directly in model folder)
    for file in os.listdir(model_path):
        full_path = os.path.join(model_path, file)
        if os.path.isfile(full_path) and file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            output.append([model, "ALL", "group", os.path.relpath(full_path, base_folder)])

    # Go through color folders
    for color in os.listdir(model_path):
        color_path = os.path.join(model_path, color)
        if not os.path.isdir(color_path):
            continue
        for img in os.listdir(color_path):
            img_path = os.path.join(color_path, img)
            if img.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                output.append([model, color, "single", os.path.relpath(img_path, base_folder)])

# Write to CSV
with open("shopify_image_list.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Model", "Color", "Image Type", "Relative Path"])
    writer.writerows(output)

print("✅ CSV generated as 'shopify_image_list.csv'")
