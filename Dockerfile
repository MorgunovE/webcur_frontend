# Stage de build
FROM node:20-alpine AS build
LABEL authors="Evgenii Morgunov"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p /app/test-logs && \
    npm run test:unit -- --json --outputFile=/app/test-logs/unit-test-results.json || true

RUN npm install --save-dev cypress
RUN npm run build
RUN npx cypress run --reporter mochawesome --reporter-options reportDir=/app/test-logs || true

FROM nginx:alpine
LABEL authors="Evgenii Morgunov"
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# docker run --rm -v %cd%/test-logs:/app/test-logs webcur-frontend