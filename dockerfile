FROM node:latest
WORKDIR /api_escola

COPY . .
Run rm -rf node_modules
Run npm i express mysql body-parser sequelize multer --save

CMD "npm", "start"
EXPOSE 3001