

# Mini Projet API GCP

API Python (FastAPI) déployée sur Google Cloud Run.

## Membres
- Membre 1 : Mélissa TRESO
- Membre 2 Jade MERLE REMOND
- Membre 3 Olivia PERET

## Stack
- Python / FastAPI
- Google Cloud Storage
- Vertex AI
- Docker / Cloud Run


## Répartition du travail

### Melissa
- Initialisation du projet et structure du repo Git
- Implémentation des endpoints `/hello`, `/status`
- Implémentation des endpoints `/data` GET et POST avec intégration Google Cloud Storage
- Création de Buckets, API dans Google Cloud


### Jade
- Implémentation de l'endpoint `/poem` avec intégration Vertex AI
- Dockerfile de l'API
- Configuration des variables d'environnement
- Déploiement de l'API sur Cloud Run
- Création et initialisation du fichier `data.json` dans Google Cloud Storage


### Olivia
- Développement du frontend React
- Dockerfile du frontend 
- Déploiement du frontend sur Cloud Run
- Rédaction du README




## Notre projet 

Quand vous lancez l'application, vous accédez à un site web simple qui vous permet de faire trois choses :
- Voir et ajouter des poèmes stockées dans le cloud via Google Cloud Storage
- Générer un poème écrit par une IA (Vertex AI) en cliquant sur un bouton
- Consulter l'état du serveur et un message de bienvenue 

Derrière ce site, une API REST gère toutes ces fonctionnalités. Le frontend React communique avec cette API, qui elle-même interagit avec les services Google Cloud.

## Comment on l'a construit 

Le projet est divisé en deux parties : un backend et un frontend, tous les deux conteneurisés et déployés sur Google Cloud.

**Backend** 

Le backend expose 5 endpoints : 
- GET /hello qui retourne un message de bienvenue.
- GET /status qui donne la date et l'heure du serveur.
- GET /data qui lit un fichier JSON stocké dans Google Cloud Storage.
- POST /data qui permet d'y ajouter une entrée.
- GET /poem qui génère un poème via Vertex AI.

**Frontend** 
On a développé une interface pour que tous les utilisateurs puissent interagir avec notre code sans passer par leur terminal.

**Outils utilisés :**

- FastAPI + Uvicorn pour le serveur Python
- google-cloud-storage pour lire et écrire dans GCS
- google-generativeai pour appeler la Gemini API
- React + Vite pour le frontend
- Docker pour conteneuriser les deux applications
- Google Cloud Run pour le déploiement
- Git + GitHub pour le travail collaboratif en équipe

**Note sur Vertex AI**

Le sujet demande l'utilisation de `google-cloud-aiplatform` pour générer les poèmes via Vertex AI. Lors du développement, nous avons rencontré des limitations sur notre projet GCP : les modèles Gemini Publisher ne sont pas accessibles via l'API Vertex AI (erreur 404 "Publisher Model not found"), liées aux restrictions du compte d'essai gratuit et à l'absence d'acceptation des CGU Gemini sur Vertex AI.

Nous avons donc utilisé la librairie `google-generativeai` avec la **Gemini API** (`generativelanguage.googleapis.com`), qui offre les mêmes fonctionnalités de génération de texte via Gemini 2.5 Flash. Le endpoint `GET /poem` fonctionne correctement en local et sur Cloud Run.


## Lancer le projet en local

### Prérequis
- Python 3.11+
- Node.js 20+
- Docker
- Un projet GCP avec un bucket GCS et un compte de service

### Variables d'environnement
Créer un fichier `.env` dans `api/` :


### Lancer l'API
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

### Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

## Build et déploiement Docker

```bash
# API
cd api
docker build -t mini-projet-api .
docker run -p 8080:8080 --env-file .env mini-projet-api

# Frontend
cd frontend
docker build -t mini-projet-frontend .
docker run -p 3000:80 mini-projet-frontend
```

## Déploiement sur Cloud Run

```bash
gcloud run deploy mini-projet-api \
  --source ./api \
  --region europe-west1 \
  --allow-unauthenticated

gcloud run deploy mini-projet-frontend \
  --source ./frontend \
  --region europe-west1 \
  --allow-unauthenticated
```


## Liens
- API Cloud Run : https://mini-projet-api-1047861355085.us-central1.run.app/docs
- Image Docker Hub : https://hub.docker.com/r/jademr/mini-projet-api
- Frontend : https://mini-projet-frontend-1047861355085.europe-west1.run.app