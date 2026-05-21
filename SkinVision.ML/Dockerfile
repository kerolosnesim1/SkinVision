FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Copy model weights (~81 MB baked into image)
COPY model/ ./model/

EXPOSE 8000

ENV SKINVISION_MODEL_PATH=/app/model/EfficientNet_B3_model.pth

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
