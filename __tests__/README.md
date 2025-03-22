# Tests de fonctionnalités pour El Tawla

Ce répertoire contient les tests unitaires et d'intégration pour toutes les fonctionnalités de l'application El Tawla.

## Structure des tests

Les tests sont organisés par fonctionnalité, avec un fichier de test dédié pour chaque fonctionnalité majeure :

- `UIComponents.test.js` - Tests des composants UI réutilisables
- `ReviewsFeature.test.js` - Tests du système d'avis amélioré
- `LocalizationFeature.test.js` - Tests de la fonctionnalité de localisation
- `AdminDashboardFeature.test.js` - Tests de l'interface administrateur
- `LoyaltyProgramFeature.test.js` - Tests du programme de fidélité
- `EnhancedBookingFeature.test.js` - Tests du système de réservation amélioré
- `RestaurantDetailsFeature.test.js` - Tests des détails des restaurants
- `SocialFeatures.test.js` - Tests des fonctionnalités sociales
- `IntegratedPaymentFeature.test.js` - Tests du système de paiement intégré

## Exécution des tests

Pour exécuter tous les tests :

```bash
npm test
```

Pour exécuter un test spécifique :

```bash
npm test -- -t "nom du test"
```

## Couverture des tests

Ces tests couvrent les aspects suivants de chaque fonctionnalité :

1. Rendu correct des composants
2. Interactions utilisateur (clics, saisies, etc.)
3. Navigation entre les écrans
4. Traitement des données
5. Support multilingue
6. Adaptation RTL pour l'arabe

## Mocks

Les tests utilisent des mocks pour simuler :

- Les traductions via i18next
- Le contexte de langue
- Les composants externes comme Expo Linear Gradient
- Les icônes
- Les données des restaurants, réservations, avis, etc.

## Ajout de nouveaux tests

Lors de l'ajout de nouvelles fonctionnalités, veuillez créer des tests correspondants en suivant la structure existante.
