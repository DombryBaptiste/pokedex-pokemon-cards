# README - Déploiement de l’application Pokedex Pokemon Cards avec Docker

## Prérequis

- Docker installé sur ta machine  
- Docker Compose installé  

## Étapes pour lancer l’application

### 1. Configuration Spécifique Docker 

Pour gérer la configuration de l’application dans l’environnement Docker, crée un fichier appsettings.Docker.json à la racine du projet backend avec le contenu suivant (exemple) :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=mysql;port=3306;database=pokedex-pokemon-db;user=root;password=secret"
  },
  "Jwt": {
    "Key": "une-cle-secrete-tres-longue-pour-le-token-jwt",
    "Issuer": "http://localhost:5001",
    "Audience": "http://localhost:5001"
  }
}
```

### 2. Démarrer MySQL

```bash
docker-compose up -d mysql
```

### 3. Démarrer Le backend et le frontend

```bash
docker-compose up -d backend
docker-compose up -d frontend
```

## Accès aux app

Backend accessible sur : http://localhost:5001

Frontend accessible sur : http://localhost:4200
