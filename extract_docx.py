import zipfile
import xml.etree.ElementTree as ET
import os

def get_docx_text(path):
    if not os.path.exists(path):
        return f"File {path} not found"
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # Find all w:t elements
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                if texts:
                    paragraphs.append("".join(texts))
            return "\n\n".join(paragraphs)
    except Exception as e:
        return f"Error reading {path}: {e}"

with open("template_extracted.txt", "w", encoding="utf-8") as f:
    f.write(get_docx_text("Patent Proposal template Rev. 12-08-26 (1).docx"))

with open("paper_extracted.txt", "w", encoding="utf-8") as f:
    f.write(get_docx_text("SAR Narrative Generation System.docx"))

print("Extracted via zipfile successfully!")
