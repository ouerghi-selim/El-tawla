# Guide de Déploiement - El Tawla

Ce document fournit des instructions détaillées pour déployer l'application El Tawla sur différentes plateformes.

## Table des matières

- [Préparation au déploiement](#préparation-au-déploiement)
- [Déploiement iOS (App Store)](#déploiement-ios-app-store)
- [Déploiement Android (Play Store)](#déploiement-android-play-store)
- [Déploiement Web](#déploiement-web)
- [Mise à jour de l'application](#mise-à-jour-de-lapplication)
- [Résolution des problèmes courants](#résolution-des-problèmes-courants)

## Préparation au déploiement

Avant de déployer l'application, assurez-vous que :

1. Toutes les fonctionnalités sont testées et fonctionnent correctement
2. Les variables d'environnement sont configurées pour la production
3. La version de l'application est correctement incrémentée dans `app.json`
4. Les assets (icônes, splash screens) sont optimisés et à jour

### Configuration d'EAS (Expo Application Services)

El Tawla utilise EAS pour simplifier le processus de build et de déploiement.

1. Installez EAS CLI :
   ```bash
   npm install -g eas-cli
   ```

2. Connectez-vous à votre compte Expo :
   ```bash
   eas login
   ```

3. Configurez votre projet :
   ```bash
   eas build:configure
   ```

## Déploiement iOS (App Store)

### Prérequis

- Un compte Apple Developer (99$ par an)
- Un Mac avec Xcode installé (version 14 ou supérieure)
- Les certificats et profils de provisionnement configurés

### Étapes de déploiement

1. **Préparation des métadonnées**

   Préparez les éléments suivants pour l'App Store :
   - Captures d'écran (pour iPhone et iPad si applicable)
   - Description de l'application
   - Mots-clés
   - Informations de contact du support
   - URL de politique de confidentialité

2. **Configuration dans App Store Connect**

   - Connectez-vous à [App Store Connect](https://appstoreconnect.apple.com)
   - Créez une nouvelle application en spécifiant le bundle ID
   - Remplissez toutes les informations requises

3. **Configuration d'EAS pour iOS**

   Vérifiez que votre fichier `eas.json` contient une configuration correcte pour iOS :
   ```json
   {
     "build": {
       "production": {
         "ios": {
           "distributionType": "app-store",
           "buildConfiguration": "Release"
         }
       }
     },
     "submit": {
       "production": {
         "ios": {
           "appleId": "your-apple-id@example.com",
           "ascAppId": "your-app-store-connect-app-id",
           "appleTeamId": "your-team-id"
         }
       }
     }
   }
   ```

4. **Création de la build**

   ```bash
   eas build --platform ios --profile production
   ```

5. **Soumission à l'App Store**

   Une fois la build terminée, vous pouvez la soumettre directement :
   ```bash
   eas submit --platform ios --profile production
   ```
   
   Ou manuellement via Transporter ou App Store Connect.

6. **Revue de l'App Store**

   - Votre application sera examinée par l'équipe de révision d'Apple
   - Le processus prend généralement entre 24 et 48 heures
   - Soyez prêt à répondre aux questions ou à résoudre les problèmes signalés

## Déploiement Android (Play Store)

### Prérequis

- Un compte Google Play Developer (frais d'inscription uniques de 25$)
- Une clé de signature pour l'application
- Les assets graphiques requis par Google Play

### Étapes de déploiement

1. **Préparation des métadonnées**

   Préparez les éléments suivants pour le Play Store :
   - Captures d'écran (téléphone, tablette, TV si applicable)
   - Image de fonctionnalité graphique (Feature Graphic)
   - Icône de haute résolution
   - Description courte et longue
   - URL de politique de confidentialité

2. **Configuration dans Google Play Console**

   - Connectez-vous à [Google Play Console](https://play.google.com/console)
   - Créez une nouvelle application
   - Remplissez toutes les informations requises dans la section "Fiche Play Store"

3. **Configuration d'EAS pour Android**

   Vérifiez que votre fichier `eas.json` contient une configuration correcte pour Android :
   ```json
   {
     "build": {
       "production": {
         "android": {
           "buildType": "app-bundle"
         }
       }
     },
     "submit": {
       "production": {
         "android": {
           "serviceAccountKeyPath": "./path/to/service-account.json",
           "track": "production"
         }
       }
     }
   }
   ```

4. **Création de la build**

   ```bash
   eas build --platform android --profile production
   ```

5. **Soumission au Play Store**

   Une fois la build terminée, vous pouvez la soumettre directement :
   ```bash
   eas submit --platform android --profile production
   ```
   
   Ou manuellement via Google Play Console.

6. **Revue du Play Store**

   - Votre application sera examinée par l'équipe de révision de Google
   - Le processus prend généralement entre 1 et 3 jours
   - Vous pouvez d'abord publier en version bêta fermée pour tester

## Déploiement Web

### Prérequis

- Un service d'hébergement web (Netlify, Vercel, AWS, etc.)
- Configuration correcte des variables d'environnement pour le web

### Étapes de déploiement

1. **Création de la build web**

   ```bash
   npx expo export:web
   ```

   Cela générera un dossier `web-build` contenant les fichiers statiques de votre application.

2. **Déploiement sur Netlify**

   - Connectez-vous à [Netlify](https://app.netlify.com/)
   - Créez un nouveau site en important le dossier `web-build`
   - Configurez les variables d'environnement nécessaires
   - Déployez le site

3. **Déploiement sur Vercel**

   - Connectez-vous à [Vercel](https://vercel.com/)
   - Importez votre projet GitHub
   - Configurez le répertoire de build sur `web-build`
   - Configurez les variables d'environnement nécessaires
   - Déployez le site

4. **Configuration d'un domaine personnalisé**

   - Achetez un nom de domaine (si vous n'en avez pas déjà un)
   - Configurez les enregistrements DNS pour pointer vers votre hébergeur
   - Activez HTTPS pour sécuriser votre site

## Mise à jour de l'application

### Mise à jour des applications mobiles

1. Incrémentez les numéros de version dans `app.json` :
   ```json
   {
     "expo": {
       "version": "1.0.1",
       "android": {
         "versionCode": 2
       },
       "ios": {
         "buildNumber": "2"
       }
     }
   }
   ```

2. Créez de nouvelles builds et soumettez-les comme décrit ci-dessus.

### Mise à jour de l'application web

1. Créez une nouvelle build web :
   ```bash
   npx expo export:web
   ```

2. Redéployez les fichiers mis à jour sur votre hébergeur.

## Résolution des problèmes courants

### Problèmes iOS

- **Rejet pour métadonnées incomplètes** : Assurez-vous que toutes les informations requises sont fournies dans App Store Connect.
- **Problèmes de confidentialité** : Vérifiez que votre politique de confidentialité est complète et accessible.
- **Crash au démarrage** : Testez minutieusement sur des appareils réels avant de soumettre.

### Problèmes Android

- **APK trop volumineux** : Utilisez le format App Bundle et activez ProGuard pour réduire la taille.
- **Permissions excessives** : Ne demandez que les permissions strictement nécessaires.
- **Problèmes de compatibilité** : Testez sur différentes versions d'Android et tailles d'écran.

### Problèmes Web

- **Problèmes de rendu** : Testez sur différents navigateurs (Chrome, Firefox, Safari, Edge).
- **Performances lentes** : Optimisez les images et utilisez le lazy loading pour les composants.
- **Problèmes d'API** : Assurez-vous que les API sont accessibles depuis le domaine de votre site web (CORS).

---

Pour toute question ou assistance supplémentaire concernant le déploiement, contactez l'équipe de développement d'El Tawla.
