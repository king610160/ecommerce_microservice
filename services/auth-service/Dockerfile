# --- Stage 1: Builder ---
FROM python:3.12-slim AS builder

WORKDIR /app

# 禁用快取以減少體積
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 先複製 requirements 並安裝
COPY requirements.txt .
# 直接安裝到系統路徑，不加 --user
RUN pip install --no-cache-dir uvicorn pymysql -r requirements.txt

# --- Stage 2: Runner ---
FROM python:3.12-slim AS runner

WORKDIR /app

# 直接從 Builder 複製整個 site-packages
# 這是 Python 存放套件的標準路徑
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# 測試：如果還是噴錯，可以在這裡加一個 RUN which uvicorn 檢查
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]