FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/backend/


EXPOSE 8003

CMD ["uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8003"]
