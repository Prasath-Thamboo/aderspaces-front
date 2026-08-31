# Vidéos de fond — page d'accueil

Chaque section plein écran de la page d'accueil (`frontend/app/page.tsx`) charge une
vidéo en boucle depuis ce dossier. Si le fichier est absent, la section retombe
automatiquement sur son dégradé de couleur (défini dans `globals.css`), donc le site
fonctionne déjà sans les vidéos.

## Fichiers utilisés (déposer ici, garder exactement le même nom)

| Fichier         | Section de la page d'accueil                    |
|-----------------|------------------------------------------------|
| `hero.mp4`      | Hero (haut de page, plein écran)               |
| `mobilier.mp4`  | Catégorie « Mobilier »                         |
| `italie.mp4`    | Nos fournisseurs — Italie                      |
| `lituanie.mp4`  | Nos fournisseurs — Lituanie                    |
| `pologne.mp4`   | Nos fournisseurs — Pologne                     |
| `pitch.mp4`     | Présentation Aderspace (bas de page)           |

Les autres fichiers `.mp4` présents dans le dossier ne sont pas référencés par la
page d'accueil (rushes / archives).

## Comment mettre à jour une vidéo

1. Préparer le nouveau clip en respectant les recommandations techniques ci-dessous.
2. Le renommer exactement comme dans le tableau (ex. `pologne.mp4`).
3. Remplacer le fichier existant dans ce dossier.
4. Rien d'autre à modifier dans le code : la section lit `/videos/<nom>.mp4`.

Pour **ajouter** une vidéo à une section fournisseur qui n'en a pas encore, ajouter
la clé `video: "<nom-du-fichier-sans-extension>"` à l'entrée correspondante du
tableau `SUPPLIER_SECTIONS` dans `frontend/app/page.tsx`, puis déposer le `.mp4` ici.

## Recommandations techniques

- Format `.mp4` (H.264 + AAC, ou sans piste audio — le lecteur est de toute façon muet).
- Pas de son nécessaire : lecture avec `muted autoPlay loop playsInline`.
- Résolution 1920×1080 suffisante (affichage en `object-fit: cover`, souvent recadré).
- Viser < 8–10 Mo par fichier pour un chargement rapide (compresser, ex. `ffmpeg -i in.mp4 -crf 28 -an out.mp4`).
- Boucle discrète : éviter une coupure trop visible entre la fin et le début du clip.
