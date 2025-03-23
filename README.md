# El Tawla - Application de Réservation de Restaurants

![El Tawla Logo](assets/icons/logo.png)

El Tawla (La Table) est une application de réservation de restaurants inspirée de TheFork mais spécialement adaptée au marché tunisien. Cette application permet aux utilisateurs de découvrir, réserver et évaluer des restaurants en Tunisie, tout en offrant aux restaurateurs une plateforme pour gérer leurs réservations et leur présence en ligne.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Guide d'utilisation](#guide-dutilisation)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Contribution](#contribution)
- [Licence](#licence)

## ✨ Fonctionnalités

### Pour les utilisateurs
- **Découverte de restaurants** : Recherche par localisation, cuisine, prix ou évaluations
- **Réservation améliorée** : Réservation en temps réel avec confirmation instantanée
- **Système de fidélité** : Accumulation de points pour des récompenses et réductions
- **Détails des restaurants** : Photos, menus, horaires, et informations détaillées
- **Fonctionnalités sociales** : Partage d'expériences et recommandations à des amis
- **Paiement intégré** : Paiement sécurisé directement dans l'application
- **Système d'avis amélioré** : Évaluations détaillées avec photos et commentaires
- **Support multilingue** : Disponible en français, arabe et anglais

### Pour les restaurateurs
- **Interface administrateur** : Gestion des réservations, menus et promotions
- **Tableau de bord analytique** : Statistiques et rapports sur les performances
- **Gestion du personnel** : Attribution des rôles et permissions
- **Promotions ciblées** : Création d'offres spéciales pour attirer de nouveaux clients

## 🏗️ Architecture

El Tawla est développé avec les technologies suivantes :

- **React Native** avec la nouvelle architecture pour le développement mobile
- **Expo** pour simplifier le développement et le déploiement
- **Redux** pour la gestion de l'état global
- **TypeScript** pour un typage statique
- **i18next** pour l'internationalisation

L'application suit une architecture modulaire avec les composants suivants :

```
El-tawla/
├── app/                  # Écrans de l'application (utilisant Expo Router)
│   ├── (tabs)/           # Écrans principaux avec navigation par onglets
│   ├── admin/            # Interface d'administration pour les restaurateurs
│   ├── auth/             # Écrans d'authentification
│   ├── restaurant/       # Détails des restaurants et réservations
│   └── settings/         # Paramètres utilisateur
├── assets/               # Ressources statiques (images, polices, etc.)
│   ├── icons/            # Icônes de l'application
│   └── patterns/         # Motifs tunisiens pour le design
├── components/           # Composants réutilisables
│   └── tunisian/         # Composants avec design tunisien
├── store/                # Configuration Redux et slices
│   └── slices/           # Slices Redux pour chaque fonctionnalité
├── utils/                # Utilitaires et helpers
│   └── i18n/             # Configuration de l'internationalisation
└── tests/                # Tests unitaires et d'intégration
```

## 🚀 Installation

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI
- Android Studio (pour le développement Android)
- Xcode (pour le développement iOS, macOS uniquement)

### Étapes d'installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/ouerghi-selim/El-tawla.git
   cd El-tawla
   ```

2. Installer les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Démarrer l'application en mode développement :
   ```bash
   npx expo start
   ```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
API_URL=https://api.eltawla.com
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Configuration de l'API

L'application communique avec une API RESTful. Assurez-vous que l'URL de l'API est correctement configurée dans le fichier `.env`.

## 📱 Guide d'utilisation

### Utilisateurs

1. **Inscription/Connexion** : Créez un compte ou connectez-vous avec vos identifiants
2. **Recherche de restaurants** : Utilisez les filtres pour trouver des restaurants selon vos préférences
3. **Réservation** : Sélectionnez une date, une heure et le nombre de personnes
4. **Paiement** : Payez directement via l'application si le restaurant le permet
5. **Évaluation** : Après votre visite, laissez un avis et des photos

### Restaurateurs

1. **Tableau de bord** : Accédez à vos statistiques et réservations en cours
2. **Gestion des réservations** : Acceptez, refusez ou modifiez les réservations
3. **Menu** : Mettez à jour votre menu et vos prix
4. **Promotions** : Créez des offres spéciales pour attirer plus de clients
5. **Personnel** : Gérez les accès de votre équipe à l'interface d'administration

## 🧪 Tests

El Tawla dispose d'une suite de tests complète pour assurer la qualité du code et le bon fonctionnement des fonctionnalités.

### Exécution des tests

```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Couverture des tests
npm run test:coverage
```

## 📦 Déploiement

### iOS (App Store)

1. Configurez votre compte développeur Apple
2. Préparez les assets et métadonnées de l'application
3. Créez une build de production :
   ```bash
   eas build --platform ios --profile production
   ```
4. Soumettez la build à l'App Store Connect

### Android (Play Store)

1. Configurez votre compte développeur Google
2. Préparez les assets et métadonnées de l'application
3. Créez une build de production :
   ```bash
   eas build --platform android --profile production
   ```
4. Soumettez l'APK ou le bundle AAB au Google Play Console

### Web

1. Créez une build de production :
   ```bash
   npx expo export:web
   ```
2. Déployez le contenu du dossier `web-build` sur votre hébergeur préféré

## 👥 Contribution

Nous accueillons les contributions à El Tawla ! Voici comment vous pouvez contribuer :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'feat: add amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

Veuillez suivre nos conventions de nommage et de commit pour maintenir la cohérence du projet.

## 📄 Licence

El Tawla est sous licence [MIT](LICENSE).

---

Développé avec ❤️ pour la Tunisie par l'équipe El Tawla.
