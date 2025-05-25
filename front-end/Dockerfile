# copy content from the current directory to /app in the container
FROM node:alpine

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]