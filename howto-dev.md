# Installation spécific

Pour ceux qui souhaite forker ce projet il sera nécessaire de faire quelques adaptations pour utiliser l'application.

1. Créé votre propre projet firebase

Par mesure de sécurité des données les informations relative à la connection firebase ne sont pas partagées.
Je vous invite donc à vous créer un projet firebase et à renseigner son nom dans le fichier _.firebaserc_.

2. Renseigner la configuration du projet firebase

Créé un fichier _webapp\src\environments\firebase-config.ts_.

```typescript
export const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxx",
  authDomain: "mon-projet.firebaseapp.com",
  databaseURL: "https://mon-projet.firebaseio.com",
  projectId: "mon-projet",
  storageBucket: "mon-projet.appspot.com",
  messagingSenderId: "xxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
};
```

3. configurer l'accès firebase côté functions

Ouvrir la page [Compte de service](https://console.firebase.google.com/project/mon-projet/settings/serviceaccounts/adminsdk) de la console Firebase.

Cliquer sur 'Générer une nouvelle clé clé privée'

Placer le fichier télécharger dans le répertoire _functions/src_ et nommer le _firebase-config.json_.

Dans le ficjier _functions/src/server.ts_ changer la propriété _databaseURL_.
