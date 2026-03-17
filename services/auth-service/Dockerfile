# --- Stage 1: Builder ---
FROM python:3.12-slim AS builder

WORKDIR /app

# 設定環境變數，禁止 Python 產生 pyc 檔案且不緩衝輸出，有助於容器日誌紀錄
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

# 安裝原本的套件，同時加上 OTel 核心套件
RUN pip install --no-cache-dir --user -r requirements.txt \
    pymysql \
    opentelemetry-api \
    opentelemetry-sdk \
    opentelemetry-exporter-otlp \
    opentelemetry-instrumentation-fastapi \
    opentelemetry-instrumentation-logging \
    opentelemetry-instrumentation-sqlalchemy \
    opentelemetry-instrumentation-mysql

# --- Stage 2: Runner ---
FROM python:3.12-slim AS runner

WORKDIR /app

# 從 Builder 階段複製安裝好的套件
COPY --from=builder /root/.local /root/.local
# 複製應用程式原始碼
COPY . .

# 確保 /root/.local/bin 在 PATH 中，這樣才能執行 uvicorn
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 預設 Port，之後可以在啟動時透過環境變數覆蓋
EXPOSE 8000

# 使用 opentelemetry-instrument 包裹啟動指令
# 自動讀取環境變數來決定把 Trace 送到哪裡
CMD ["opentelemetry-instrument", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]