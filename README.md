# PokecardApp

Application web de gestion de cartes Pokémon, avec authentification Google, base de données de Pokémon et cartes illustrées.

---

## Prérequis

- [Node.js](https://nodejs.org/) >= 18.x
- [Angular](https://angular.io/) 19.x
- [.NET](https://dotnet.microsoft.com/en-us/download) 8.x
- [MySQL](https://www.mysql.com/) >= 8.0

---

## Structure du projet

- **Frontend Angular** : `front-pokedex-pokemon-card`
- **Backend .NET** : `API-pokedex-pokemon-card`
- **Peuplement d’images et données cartes** : [PokemonCardPictures](https://github.com/DombryBaptiste/PokemonCardPictures)

---

## 1. Lancer le frontend (Angular)

```bash
cd front-pokedex-pokemon-card
# Modifier `src/environments/environment.ts` avec le bon ClientId Google
npm install
ng serve
```

### 2. Lancer le backend (.NET Core)
```bash
cd API-pokedex-pokemon-card
# Copier le fichier de configuration
cp appsettings.json appsettings.Development.json

# Modifier dans ce fichier :
# - La chaîne de connexion MySQL
# - Le ClientId Google

dotnet run
```


### 3. Base de donnée

- La base *pokedexdb* est créée automatiquement au démarrage si la configuration est correcte.
- Les tables et données de base (Pokémons) sont insérées par le backend.

### 4. Peuplement BDD

Pour ajouter les cartes (images + données) :
```bash
git clone https://github.com/DombryBaptiste/PokemonCardPictures.git
cd PokemonCardPictures
```

Créer un fichier .env a la racine du nouveau projet:
```env
MYSQL_HOST=localhost
MYSQL_DATABASE=pokedexdb
MYSQL_USER=user
MYSQL_PASSWORD=password
```
Puis exécuter le script
```bash
python3 insert_pokemon.py
```

📦 Les cartes seront insérées dans la table PokemonCards, à partir du dossier pokemon-card-pictures/.
📁 Un dossier logs/ est généré automatiquement avec les détails du traitement.
Il suffit de mettre a jour le *environment.ts* pour modifier et pointer vers le chemin du nouveau projet
```ts
...
storageCardImage: 'C:/.../pokemon-cards-pictures',
...
```
