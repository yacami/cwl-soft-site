# Site CWL-SOFT · EL-HAKIM PRO

Site statique (HTML, CSS, JavaScript simple), publié par GitHub Pages. Ni cookies, ni traceurs, ni étape de
construction obligatoire.

| Dossier | Rôle | Qui le modifie |
|---|---|---|
| `contenu/` | Textes commerciaux : packs, paiement, avis, vidéos, FAQ, équipe, contact, mentions légales. Vide = section masquée. Mode d'emploi : `contenu/CONTENU.md`. | L'éditeur, directement sur GitHub |
| `donnees/` | Version publiée, historique, fichiers joints. | Les scripts de publication d'EL-HAKIM PRO |
| `outils/` | Fabrication des pages (`assembler.cjs`), textes fixes FR/AR (`pages.cjs`), fonctionnalités vérifiées, blocs de version. | Le développeur |
| `assets/` | Feuille de style, script, polices, images (captures avec données de démonstration uniquement). | Le développeur |
| `docs/` | Guides HTML lisibles en ligne (les PDF sont sur la page de la dernière version). | Le développeur |
| racine, `ar/` | Pages françaises et arabes, produites par `node outils/assembler.cjs`. | Générées |

Adresse publique : `outils/site.json` (à changer quand le domaine sera branché, puis relancer l'assembleur).
