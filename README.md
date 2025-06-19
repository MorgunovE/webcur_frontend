# WebCur Frontend

Application web éducative pour explorer les devises, entreprises et actions en bourse. Développée avec Vue.js, Vuex, Vuetify et consomme l’API WebCur.

## Ce projet sur GitHub

Retrouvez ce projet sur GitHub :  
[https://github.com/MorgunovE/webcur_frontend](https://github.com/MorgunovE/webcur_frontend)

## Intégration continue avec GitHub Actions

Ce projet utilise un pipeline GitHub Actions pour exécuter automatiquement les tests à chaque push ou pull request.  
Le workflow installe les dépendances, lance les tests unitaires et effectue une vérification du lint.

[https://github.com/MorgunovE/webcur_frontend/actions](https://github.com/MorgunovE/webcur_frontend/actions)

## Fonctionnalités

- Authentification JWT (connexion, inscription, déconnexion)
- Visualisation des devises populaires et de leur historique
- Conversion de devises en temps réel
- Gestion des devises favorites (ajout, suppression, liste)
- Visualisation des entreprises cotées et de leur historique
- Gestion des actions favorites (ajout, suppression, liste)
- Calcul du coût d’achat d’une action avec conversion de devise
- Interface utilisateur moderne avec Vuetify
- Graphiques interactifs (historique devises, actions, entreprises)
- Gestion de compte utilisateur (modification, suppression)
- Responsive design

## Technologies utilisées

- Vue.js 3
- Vuex (gestion d’état)
- Vue Router
- Vuetify (UI)
- Axios (requêtes HTTP)
- Chart.js (graphiques)
- Jest + Vue Test Utils (tests unitaires)
- ESLint (lint)
- GitHub Actions (CI)

## Configuration

Créez un fichier `.env` à la racine du projet avec la variable suivante :

```
VUE_APP_API_URL=http://localhost:5000
```

> Par défaut, l’application communique avec l’API backend sur `http://localhost:5000`.

## Documentation de l’interface

- Accueil : vue d’ensemble, devises populaires
- Devises : détails, historique, conversion, favoris
- Entreprises : détails, historique, entreprises populaires
- Actions : détails, historique, favoris, calcul d’achat
- Compte : gestion du profil, favoris, suppression

## Lancer le projet en local

1. **Installer Node.js (>= 16) et npm.**
2. **Installer les dépendances :**
   ```sh
   npm install
   ```
3. **Configurer les variables d’environnement dans `.env`.**
4. **Démarrer l’application :**
   ```sh
   npm run serve
   ```
5. **Accéder à l’interface :**
   - Frontend : `http://localhost:8080/` (par défaut)
   - L’API backend doit être accessible sur `http://localhost:5000/`

6. **Docker :**
   - Si Docker est installé, vous pouvez lancer l’application avec :
     ```sh
     docker build -t webcur-frontend .
     docker run -p 8080:80 webcur-frontend
     ```
     
## Lancer le projet en production

1. **Compiler l’application :**
   ```sh
   npm run build
   ```
2. **Déployer le dossier `dist/` sur un serveur web (Nginx, Apache, etc.)**

## Lancer les tests

- **Tests unitaires :**
  ```sh
  npm run test:unit
  ```
  ou pour exécuter le test spécifique pour les devises :

```bash
npm run test:unit -- tests/unit/api/devises.spec.js
```
  

- **Tests end-to-end :**
  ```sh
  npm run test:e2e
  ```
  ou our exécuter tous les tests en mode CI (ligne de commande):
    ```sh
      npm run test:e2e:ci
    ```
  ou our exécuter un seul fichier de test :
    ```sh
      npm run test:e2e:ci -- cypress/e2e/auth.cy.js
    ```

## Lint du code

```sh
npm run lint
```

ou pour corriger automatiquement les erreurs de style :

```sh
npx eslint . --fix
```

ou pour formater le code avec Prettier :

```sh
npx prettier --write .
```

## Exemples d’utilisation

- **Connexion :**  
  Accédez à `/login`, entrez vos identifiants pour obtenir un token JWT.
- **Conversion de devises :**  
  Utilisez la page Devises pour convertir un montant d’une devise à une autre.
- **Ajout d’une devise favorite :**  
  Depuis la page Compte, sélectionnez une devise et ajoutez-la à vos favoris.
- **Visualisation d’une entreprise :**  
  Accédez à `/companies/AAPL` pour voir les infos et l’historique d’Apple.

## Dépendance au backend

Ce frontend nécessite l’API WebCur (voir [WebCur_BackEnd](https://github.com/MorgunovE/WebCur_BackEnd)).

## Licence

MIT License © 2025 Morgunov Evgenii
