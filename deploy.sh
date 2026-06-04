#!/bin/bash
set -e # Arrête le script immédiatement si une commande renvoie un code d'erreur

echo "🔄 Étape 1 : Récupération du code via Git..."
git pull origin main

echo "🏗️ Étape 2 : Build et relance des conteneurs Docker..."
# Docker va détecter les fichiers modifiés et ne re-compiler que le nécessaire
docker compose up -d --build

echo "🧹 Étape 3 : Nettoyage des anciennes images..."
docker image prune -f

echo "✅ Application mise à jour avec succès !"
