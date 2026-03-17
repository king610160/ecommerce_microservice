# --- Stage 1: Builder ---
FROM node:22-slim AS builder

WORKDIR /app

# 安裝 pnpm 並處理依賴
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# 複製原始碼
COPY . .

# 【修改點】刪除所有的 ARG VITE_LOGIN_URL 與 ENV 宣告
# 因為現在程式碼改用相對路徑，編譯時不需要知道後端網址
RUN pnpm build


# --- Stage 2: Runner (Nginx) ---
FROM nginx:stable-alpine AS runner

# 複製編譯好的靜態檔案
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]