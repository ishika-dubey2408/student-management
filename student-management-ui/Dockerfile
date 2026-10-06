
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["npm", "run", "serve:ssr:student-management-ui", "--", "--host", "0.0.0.0", "--port", "4000"]