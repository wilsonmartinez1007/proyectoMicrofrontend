FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Port donde sirve single-spa Angular
EXPOSE 4200

CMD ["npm", "run", "serve:single-spa:inventario-mf"]
