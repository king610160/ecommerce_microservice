# --- Stage 1: Builder ---
FROM python:3.12-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

# 修正重點：加入 opentelemetry-distro 並執行 bootstrap
RUN pip install --no-cache-dir --user -r requirements.txt \
    pymysql 
    # opentelemetry-distro \
    # opentelemetry-api \
    # opentelemetry-sdk \
    # opentelemetry-exporter-otlp \
    # opentelemetry-instrumentation-fastapi \
    # opentelemetry-instrumentation-logging \
    # opentelemetry-instrumentation-sqlalchemy \
    # opentelemetry-instrumentation-mysql && \
    # # 這行會自動安裝所有對應的 instrumentation 套件
    # /root/.local/bin/opentelemetry-bootstrap -a install

# --- Stage 2: Runner ---
FROM python:3.12-slim AS runner

WORKDIR /app

COPY --from=builder /root/.local /root/.local
COPY . .

# 確保 PATH 包含 .local/bin 才能找到 opentelemetry-instrument
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# 直接啟動 uvicorn，不使用 opentelemetry-instrument
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# # 現在這個指令就能在 $PATH 中找到了
# CMD ["opentelemetry-instrument", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]