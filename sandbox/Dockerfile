# FROM node:18-slim

# # Install dependencies required by Chromium
# RUN apt-get update && apt-get install -y \
#     chromium \
#     chromium-driver \
#     ca-certificates \
#     fonts-liberation \
#     libatk-bridge2.0-0 \
#     libnss3 \
#     libxss1 \
#     libasound2 \
#     --no-install-recommends && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# COPY sandboxRunner.js .

# # Install puppeteer-core (uses system Chromium)
# RUN npm install puppeteer-core

# # Non-root user
# USER node

# ENTRYPOINT ["node", "sandboxRunner.js"]



FROM node:18-slim

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    ca-certificates \
    libnss3 \
    libxss1 \
    libasound2 \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY sandboxRunner.js .

RUN npm install puppeteer-core

ENTRYPOINT ["node", "sandboxRunner.js"]
