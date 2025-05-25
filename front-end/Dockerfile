# copy content from the current directory to /app in the container
FROM node:alpine

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]