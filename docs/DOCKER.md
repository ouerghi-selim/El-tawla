# Guide d'utilisation Docker pour El Tawla

Ce document explique comment utiliser Docker pour exécuter l'application El Tawla dans un environnement de développement conteneurisé.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
- [Docker Compose](https://docs.docker.com/compose/install/) installé sur votre machine

## Configuration

Le projet El Tawla inclut deux fichiers de configuration Docker :

1. `Dockerfile` - Définit l'image Docker pour l'application
2. `docker-compose.yml` - Configure les services nécessaires pour exécuter l'application

## Démarrer l'application avec Docker

1. Clonez le dépôt et naviguez dans le répertoire du projet :
   ```bash
   git clone https://github.com/ouerghi-selim/El-tawla.git
   cd El-tawla
   ```

2. Construisez et démarrez les conteneurs avec Docker Compose :
   ```bash
   docker-compose up
   ```

   Pour exécuter en arrière-plan (mode détaché) :
   ```bash
   docker-compose up -d
   ```

3. Accédez à l'application :
   - Interface Expo : http://localhost:19002
   - Application mobile : Scannez le QR code depuis l'interface Expo avec l'application Expo Go sur votre appareil

## Arrêter l'application

Pour arrêter les conteneurs en cours d'exécution :
```bash
docker-compose down
```

## Commandes utiles

- Reconstruire les images (après modification du Dockerfile) :
  ```bash
  docker-compose build
  ```

- Voir les logs des conteneurs :
  ```bash
  docker-compose logs -f
  ```

- Exécuter des commandes dans le conteneur :
  ```bash
  docker-compose exec app npm install <package-name>
  ```

- Redémarrer les conteneurs :
  ```bash
  docker-compose restart
  ```

## Résolution des problèmes courants

### Problème d'accès aux ports

Si vous rencontrez des erreurs indiquant que les ports sont déjà utilisés, vérifiez qu'aucune autre instance d'Expo ou de Metro bundler n'est en cours d'exécution sur votre machine.

### Problèmes de connexion depuis un appareil mobile

Pour permettre à votre appareil mobile de se connecter à l'application exécutée dans Docker :

1. Assurez-vous que votre téléphone et votre ordinateur sont sur le même réseau Wi-Fi
2. Remplacez `localhost` par l'adresse IP de votre ordinateur dans les paramètres de l'application Expo

### Problèmes de performance

Si l'application est lente dans Docker, vous pouvez augmenter les ressources allouées à Docker dans les paramètres de Docker Desktop.

## Notes importantes

- Le mode `network_mode: "host"` est utilisé dans le docker-compose.yml pour permettre l'accès depuis des appareils externes. Cette configuration fonctionne bien sur Linux, mais peut nécessiter des ajustements sur macOS ou Windows.
- Les volumes sont configurés pour permettre le rechargement à chaud (hot reloading) pendant le développement.
- Les modules node sont installés à l'intérieur du conteneur pour éviter les problèmes de compatibilité entre différents systèmes d'exploitation.

---

Pour toute question ou assistance supplémentaire concernant la configuration Docker, contactez l'équipe de développement d'El Tawla.
