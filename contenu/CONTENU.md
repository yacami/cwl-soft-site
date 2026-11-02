# Dossier `contenu/` — ce que vous remplissez

Tout ce qui est **commercial** sur le site vient d'ici : rien n'est inventé ailleurs.
**Règle :** un fichier vide (ou un champ vide) = la section correspondante est **masquée**. Jamais de texte d'exemple
visible sur le site.

Chaque texte affiché existe en deux langues : `{ "fr": "…", "ar": "…" }`. Si `ar` est vide, le texte français est
affiché aussi sur la version arabe (la section n'est pas masquée pour autant).

Les fichiers sont au format JSON (sauf `equipe.md`). Pour vérifier un fichier avant de l'envoyer :
https://jsonlint.com (aucune donnée n'y est conservée), ou demandez-moi.

---

## `contact.json` — WhatsApp, e-mail, horaires (indispensable)
```json
{
  "whatsapp": "",
  "email": "",
  "telephone": "",
  "horaires": { "fr": "", "ar": "" },
  "adresse": { "fr": "", "ar": "" },
  "messages": {
    "defaut": { "fr": "", "ar": "" },
    "inscription": { "fr": "", "ar": "" },
    "pack": { "fr": "", "ar": "" }
  }
}
```
- `whatsapp` : numéro au format international **sans + ni espaces**, ex. `213555123456`. Vide = bouton WhatsApp masqué.
- `horaires` : affichés à côté du bouton WhatsApp, ex. « Réponse du samedi au jeudi, 9 h – 18 h ».
- `messages` : messages pré-remplis. Dans `pack`, `{pack}` est remplacé par le nom du pack consulté
  (ex. « Bonjour, je souhaite le pack {pack}. »). Vide = message par défaut neutre fourni par le site.

## `packs.json` — packs et prix
```json
[
  {
    "id": "",
    "nom": { "fr": "", "ar": "" },
    "prix": 0,
    "devise": "DA",
    "taxe": "HT",
    "duree": "PREMIUM_1Y",
    "postes": 1,
    "inclus": [ { "fr": "", "ar": "" } ],
    "recommande": false,
    "note": { "fr": "", "ar": "" }
  }
]
```
- `prix` : nombre, sans espace ni devise (ex. `25000`). `taxe` : `"HT"` ou `"TTC"` (obligatoire, affiché).
- `duree` : un des types de licence du logiciel : `PREMIUM_6M` (6 mois), `PREMIUM_1Y` (1 an), `PREMIUM_LIFETIME` (à vie).
- `postes` : nombre de postes compris (laisser `0` si non concerné : la ligne est masquée).
- `inclus` : une ligne par avantage ; sert aussi au tableau comparatif.
- `recommande` : `true` pour un seul pack (mis en avant).
Fichier vide (`[]`) = section Tarifs et page Tarifs masquées.

## `paiement.json` — modalités de paiement
```json
{
  "moyens": [ { "nom": { "fr": "", "ar": "" }, "details": { "fr": "", "ar": "" } } ],
  "etapes": [ { "fr": "", "ar": "" } ],
  "delaiLicence": { "fr": "", "ar": "" }
}
```
- `moyens` : ex. CCP, BaridiMob, virement bancaire, espèces — avec les coordonnées à afficher dans `details`.
- `etapes` : ex. « Payez », « Envoyez la preuve et le code machine sur WhatsApp », « Recevez votre licence ».
- `delaiLicence` : ex. « Licence envoyée sous 24 h ouvrées ».

## `avis.json` — avis de clients
```json
[
  {
    "nom": "",
    "titre": { "fr": "", "ar": "" },
    "ville": "",
    "texte": { "fr": "", "ar": "" },
    "date": "AAAA-MM-JJ",
    "consentement": { "donne": false, "date": "AAAA-MM-JJ", "moyen": "" }
  }
]
```
- **Seuls les avis avec `"consentement": { "donne": true, … }` sont affichés.** `moyen` : comment l'accord a été
  donné (ex. « message WhatsApp du 12/10/2026 ») — gardez la preuve.
- `titre` : ex. « Pédiatre ». `nom` : tel que le client accepte qu'il apparaisse (ex. « Dr K. B. »).
- Pas de note en étoiles inventée : il n'y en a pas dans ce format.

## `equipe.md` — qui sommes-nous
Texte libre en Markdown (titres `##`, paragraphes, listes). Partie arabe après une ligne contenant seulement
`---ar---`. Fichier vide = section masquée.

## `videos.json` — démo et tutoriels
```json
[ { "youtube": "", "type": "demo", "titre": { "fr": "", "ar": "" }, "duree": "" } ]
```
- `youtube` : l'identifiant seul (dans `https://www.youtube.com/watch?v=AbCdEf12345`, c'est `AbCdEf12345`).
- `type` : `"demo"` (une seule : elle alimente le bouton « Voir la démo ») ou `"tutoriel"`.
- Les vidéos ne doivent montrer que des **données de démonstration**. Aucune vidéo = bouton « Voir la démo » et
  section Vidéos masqués. Le lecteur YouTube n'est chargé qu'au clic (rien n'est envoyé à YouTube avant).

## `faq.json` — questions fréquentes
```json
[ { "question": { "fr": "", "ar": "" }, "reponse": { "fr": "", "ar": "" } } ]
```

## `legal.json` — mentions légales (loi 18-07 pour la confidentialité)
```json
{
  "raisonSociale": "",
  "formeJuridique": "",
  "registreCommerce": "",
  "nif": "",
  "nis": "",
  "articleImposition": "",
  "adresse": "",
  "responsablePublication": "",
  "emailDonneesPersonnelles": "",
  "derniereMiseAJour": "AAAA-MM-JJ"
}
```
- L'hébergeur (GitHub Pages, GitHub Inc.) est indiqué par le site lui-même.
- Champs vides = lignes masquées ; tant que `raisonSociale` est vide, les pages Mentions légales et
  Confidentialité affichent « En cours de rédaction ».

## Fichiers tenus par le développeur (vous n'y touchez pas)
- `outils/fonctionnalites.json` : fonctions du logiciel, vérifiées dans le code (reformulables, jamais d'imaginaires).
  Les pages sont refaites par `node outils/assembler.cjs` après une modification.
- `donnees/version.json`, `donnees/fichiers.json`, `donnees/historique.json` : écrits automatiquement à chaque
  publication d'une version ou de fichiers joints (scripts `publier-version` et `publier-fichiers` d'EL-HAKIM PRO).

## Après une modification
Enregistrez le fichier sur GitHub (bouton « Commit changes ») : le site est à jour une à deux minutes plus tard, sans
autre manipulation. Les fichiers de `contenu/` sont lus par le navigateur du visiteur.
