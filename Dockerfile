FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances globales
RUN npm install -g expo-cli eas-cli

# Copier les fichiers de configuration
COPY package*.json ./
COPY app.json ./
COPY tsconfig.json ./
COPY babel.config.js ./
COPY eas.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port pour Expo
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

# Commande par défaut pour démarrer l'application
CMD ["npm", "start"]
