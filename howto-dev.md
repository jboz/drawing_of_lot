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
