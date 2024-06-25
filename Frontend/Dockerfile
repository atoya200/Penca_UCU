FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Use the official Nginx image to serve the Angular app
FROM nginx:alpine
COPY --from=build /app/dist/penca-ucu /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]