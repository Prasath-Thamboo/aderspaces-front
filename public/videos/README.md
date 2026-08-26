# Vidéos de fond — page d'accueil

Chaque section plein écran de la page d'accueil (`frontend/app/page.tsx`) charge une
vidéo en boucle depuis ce dossier. Tant qu'un fichier n'est pas présent, la section
retombe automatiquement sur son dégradé de couleur (défini dans `globals.css`), donc
le site fonctionne déjà sans les vidéos.

Fichiers attendus (à déposer ici, mêmes noms) :

| Fichier            | Section                          |
|--------------------|-----------------------------------|
| `hero.mp4`         | Hero (accueil)                    |
| `mobilier.mp4`     | Mobilier                          |
| `imprimantes.mp4`  | Imprimantes                       |
| `cartouches.mp4`   | Encre & Cartouches                |
| `reparation.mp4`   | Service de réparation             |
| `pitch.mp4`        | Présentation Aderspace            |

Recommandations techniques :

- Format `.mp4` (H.264 + AAC ou sans audio — le lecteur est de toute façon muet).
- Pas de son nécessaire : les vidéos sont chargées avec `muted autoPlay loop playsInline`.
- Résolution 1920×1080 suffisante (affichage en `object-fit: cover`, souvent redimensionné).
- Viser < 8–10 Mo par fichier pour un chargement rapide (compresser, ex. `ffmpeg -crf 28`).
- Boucle discrète : éviter une coupure trop visible entre la fin et le début du clip.
