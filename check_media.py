import zipfile
import os

with zipfile.ZipFile("SAR Narrative Generation System.docx") as z:
    imgs = [f for f in z.namelist() if f.startswith("word/media/")]
    print("Found images:", imgs)
    os.makedirs("extracted_media", exist_ok=True)
    for img in imgs:
        z.extract(img, "extracted_media")

media_dir = os.path.join("extracted_media", "word", "media")
if os.path.exists(media_dir):
    for f in os.listdir(media_dir):
        fp = os.path.join(media_dir, f)
        print(f"{f}: {os.path.getsize(fp)} bytes")
