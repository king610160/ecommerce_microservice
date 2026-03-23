# --- Stage 1: Builder ---
FROM node:22-slim AS builder

WORKDIR /app

# 安裝 pnpm 並處理依賴
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# 複製原始碼
COPY . .

# 現在程式碼用相對路徑，編譯時不需要知道後端網址
RUN pnpm build


# --- Stage 2: Runner (Nginx) ---
FROM nginx:stable-alpine AS runner

# 複製編譯好的靜態檔案
COPY --from=builder /app/dist /usr/share/nginx/html

# 刪除預設配置 (選配，但比較乾淨)
RUN rm /etc/nginx/conf.d/default.conf

# 複製你的自定義配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 複製靜態檔案
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]