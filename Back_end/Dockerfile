FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install


COPY . .

RUN npm run tsc


EXPOSE 3000
CMD ["node", "build/index.js"]