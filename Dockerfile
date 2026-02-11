FROM node:20-alpine

WORKDIR /app

# Копируем package.json и lockfile
COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN npm ci 2>/dev/null || npm install

COPY . .

# Vite слушает на 0.0.0.0 чтобы было доступно снаружи контейнера
ENV NODE_ENV=development
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
