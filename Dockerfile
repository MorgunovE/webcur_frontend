# Stage de build
FROM node:20-alpine AS build
LABEL authors="Evgenii Morgunov"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run test:unit
RUN npm run build

# Stage de production
FROM nginx:alpine
LABEL authors="Evgenii Morgunov"
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]