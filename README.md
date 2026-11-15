# Soutien scolaire dans les Ardennes (SSA)

Site de présentation et de réservation pour des cours particuliers à domicile et de l'aide aux devoirs
dans les Ardennes, avec **premier cours gratuit**.
Aucune installation : double-clique sur `index.html` pour l'ouvrir dans ton navigateur.

## Organisation

```
index.html          Accueil
tarifs.html         Grille de tarifs, calculateur, paiement CESU et démarches des parents
a-propos.html       Qui sommes-nous (depuis 2021, rendez-vous avec les parents)
mentions-legales.html, confidentialite.html   Pages légales (lues dans config.legal)

base.css             Couleurs, polices, remise à zéro   ← change les couleurs ici
layout.css           En-tête, menu, sections, pied de page
components.css       Boutons, cartes, badges
home.css             Haut de page, cours, matières, étapes, tarifs, questions
booking.css          Section de réservation et formulaire
page.css             Pages tarifs, qui sommes-nous, pages légales

config.js            Contacts, réservation, tarifs, vidéo, photos   ← le fichier à modifier
ui.js                Menu mobile, apparition douce, bandeau « Réserver »
content.js           Écrit dans la page ce qui vient de config.js
booking.js           Vérification et envoi du formulaire
tarifs.js            Grille et calculateur (depuis config.prices)
legal.js             Remplit les pages légales (depuis config.legal)

favicon.svg          Icône de l'onglet
hero-cours.jpg       Photo de fond du haut de page
cours-1.jpg          Photo de la galerie
cours-2.jpg          Photo de la galerie
cours-3.jpg          Photo de la page d'accueil
formulaire-ssa.jpg   Photo de fond du formulaire
```

## À faire avant de publier (tout se passe dans `config.js`)

1. **E-mail** : déjà réglé sur ardennesoutienscolaire08@gmail.com (config.js). Active FormSubmit : après la mise en ligne, envoie une 1re demande de test et clique sur le lien reçu par e-mail.
2. **Mentions légales** : remplis `legal.nom` (nom et prénom, ou ce que la loi t'autorise à afficher : à vérifier), `legal.adresse` (facultatif) et `legal.telephone`. Les champs vides s'affichent en jaune « À compléter ».
3. **Tarifs** : `prices.levels` (tarif net par heure et par niveau) et `prices.weeklyDiscount` (réduction par heure selon le nombre de cours par semaine).
4. **Téléphone / WhatsApp** : `contact.phone` et `contact.whatsapp` (cachés tant qu'ils sont vides).
5. **Créneaux et jours sans cours** : `booking.slots` et `booking.closedDays`.
6. **CESU et statut** : les règles dépendent de ton titre de séjour (plafond de 964 h/an pour un titre étudiant ; l'employeur doit faire vérifier ton titre par la préfecture au moins 2 jours ouvrables avant l'embauche). Vérifie auprès de ton université ou de la préfecture.

## Photos et vidéo

- **Photo du haut de page** : c'est `hero-cours.jpg`, en plein fond derrière le titre. Pour la changer, remplace ce fichier
  (même nom, JPG, format paysage, 1600 px de large minimum, moins de 300 Ko). Vérifie que tu as le droit de l'utiliser
  (photo à toi, image libre de droits ou générée pour toi), et évite les photos où l'on reconnaît un enfant sans accord écrit des parents.
- **Vidéo** : mets le fichier (MP4) à la racine du site et écris son chemin dans `media.video` de `config.js`
  (ex. `"presentation.mp4"`). Garde-la légère (moins de 20 Mo).
- **Galerie** : les photos `cours-1.jpg`, `cours-2.jpg` et `cours-3.jpg` sont déjà branchées dans `media.photos` de `config.js`. Pour en changer ou en ajouter, copie-les à la racine et modifie la liste (texte `alt` obligatoire, `position` facultatif pour choisir la partie visible).
- La section « En images » n'apparaît que s'il y a au moins une vidéo ou une photo.

## Polices

Titres : Bricolage Grotesque. Textes : Plus Jakarta Sans (chargées depuis Google Fonts, voir le `<head>` de `index.html`).
Pour changer de police, modifie le lien dans `index.html` et les deux lignes `--font-display` et `--font` de `base.css`.

## Mettre le site en ligne

**GitHub Pages** (gratuit) : crée un dépôt public, envoie tous les fichiers à la racine (index.html en haut), puis Settings → Pages → Branch `main`, dossier `/ (root)`. Le site est en ligne en quelques minutes.
Attention : les conditions de GitHub Pages n'autorisent pas un usage comme hébergement gratuit d'une activité commerciale. Le risque existe ; si GitHub refuse un jour, le même dossier se glisse tel quel sur **Cloudflare Pages** ou **Netlify** (gratuits).
Vercel (offre gratuite) est réservé à un usage non commercial.
Mets ensuite l'adresse du site dans la bio de ton profil ou dans un message de présentation.

## Formulaire de contact (FormSubmit)

Le formulaire envoie les demandes à FormSubmit (`booking.formEndpoint` dans `config.js`), qui te les transmet par e-mail.
- **Premier envoi** : FormSubmit envoie un e-mail d'activation à l'adresse du formulaire. Clique sur le lien qu'il contient,
  sinon les demandes ne partent pas. Fais un envoi de test après la mise en ligne.
- **Cacher ton adresse** : après l'activation, FormSubmit te donne un code aléatoire à la place de l'adresse
  (`https://formsubmit.co/ajax/CODE`). Remets ce lien dans `formEndpoint` pour ne pas montrer ton e-mail dans le code du site.
- Les demandes arrivent sous forme de tableau : parent, téléphone, e-mail, enfant, niveau, matières, commune, lieu, créneaux, message.
