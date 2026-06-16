"""Quick smoke test for the /predict endpoint.

Sends a synthetic image + metadata and prints the JSON response.
Optionally requests a Grad-CAM heatmap.
"""
import io
import json
import urllib.request
from PIL import Image

img = Image.new("RGB", (300, 300), color=(180, 120, 80))
buf = io.BytesIO()
img.save(buf, format="JPEG")
img_bytes = buf.getvalue()

boundary = "----TestBoundary123"
parts = []

parts.append(f"--{boundary}")
parts.append('Content-Disposition: form-data; name="file"; filename="test.jpg"')
parts.append("Content-Type: image/jpeg")
parts.append("")

parts.append(f"--{boundary}")
parts.append('Content-Disposition: form-data; name="age"')
parts.append("")
parts.append("45")

parts.append(f"--{boundary}")
parts.append('Content-Disposition: form-data; name="sex"')
parts.append("")
parts.append("male")

parts.append(f"--{boundary}")
parts.append('Content-Disposition: form-data; name="anatom_site"')
parts.append("")
parts.append("head/neck")

parts.append(f"--{boundary}")
parts.append('Content-Disposition: form-data; name="include_heatmap"')
parts.append("")
parts.append("true")

parts.append(f"--{boundary}--")
parts.append("")

header = "\r\n".join(parts[:4]).encode() + b"\r\n"
footer_parts = parts[4:]
footer = "\r\n".join(footer_parts).encode()

body = header + img_bytes + b"\r\n" + footer

req = urllib.request.Request(
    "http://localhost:8000/predict",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
)
resp = urllib.request.urlopen(req)
result = json.loads(resp.read())
print(json.dumps(result, indent=2))
