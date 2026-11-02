// outils/pages.cjs — textes fixes et structure des pages (français + arabe). Rendu par outils/assembler.cjs.
// Règle du site : rien de commercial ici (prix, avis, chiffres, équipe, FAQ, coordonnées) : tout cela vient de
// contenu/*.json, lu par assets/js/site.js ; une section dont le contenu est vide reste masquée (attribut hidden).
// Les fonctions décrites sont celles vérifiées dans le logiciel (outils/fonctionnalites.json).
const F = require("./fonctionnalites.json");
const { URL_INSTALLEUR, DEPOT_RELEASES } = require("./blocs-version.cjs");
const SITE = require("./site.json");

const DEMO = (h) => h.t("données de démonstration", "بيانات تجريبية");

// Ouverture courte (toutes les pages sauf l'accueil).
const ouvertureCourte = (surtitre, titre, chapo) => (h) => `
  <section class="ouverture-courte">
    ${surtitre ? `<span class="surtitre">${surtitre(h)}</span>` : ""}
    <h1>${titre(h)}</h1>
    ${chapo ? `<p class="promesse">${chapo(h)}</p>` : ""}
  </section>`;

const boutonEssai = (h, classe = "btn btn-or") => `<a class="${classe}" href="${h.r}telechargement.html">${h.icone("telecharger")}${h.t("Essai gratuit de 3 jours", "تجربة مجانية لمدة 3 أيام")}</a>`;
const boutonInscription = (h, classe = "btn btn-ligne") => `<a class="${classe}" data-inscription href="${h.r}contact.html" hidden>${h.icone("whatsapp")}${h.t("S'inscrire sur WhatsApp", "التسجيل عبر واتساب")}</a>`;
const boutonDemo = (h, classe = "btn btn-ligne") => `<button type="button" class="${classe}" data-demo hidden>${h.icone("lecture")}${h.t("Voir la démo", "شاهد العرض")}</button>`;

const listeRole = (h, cle) => `<ul class="coches">${F[cle].map((x) => `<li>${h.icone("check")}<span>${h.esc(h.L === "ar" && x.ar ? x.ar : x.fr)}</span></li>`).join("")}</ul>`;

// ————————————————————————————————————————————————————————————————— Accueil
const accueil = {
    id: "index", fichier: "index.html", wa: "defaut",
    titre: (h) => h.t("EL-HAKIM PRO — logiciel de gestion de cabinet médical", "EL-HAKIM PRO — برنامج تسيير العيادة الطبية"),
    description: (h) => h.t("Agenda, salle d'attente, consultations, ordonnances et documents en français et en arabe, courbes de croissance, caisse. Sur un poste ou en réseau, sans dépendre d'Internet. Essai gratuit de 3 jours.",
        "المواعيد، قاعة الانتظار، المعاينات، الوصفات والوثائق بالفرنسية والعربية، منحنيات النمو، الصندوق. على حاسوب واحد أو على الشبكة، دون الحاجة إلى الإنترنت. تجربة مجانية لمدة 3 أيام."),
    jsonld: (h) => [{
        "@context": "https://schema.org", "@type": "SoftwareApplication", name: "EL-HAKIM PRO",
        applicationCategory: "BusinessApplication", applicationSubCategory: h.t("Gestion de cabinet médical", "تسيير العيادة الطبية"),
        operatingSystem: "Windows 10, Windows 11", downloadUrl: URL_INSTALLEUR, inLanguage: ["fr", "ar"],
        publisher: { "@type": "Organization", name: SITE.editeur, url: SITE.url },
        screenshot: SITE.url + "assets/img/vue-ensemble.png",
    }],
    ouverture: (h) => `
  <section class="ouverture">
    <div class="ouverture-texte">
      <span class="surtitre">${h.t("Logiciel de gestion de cabinet médical", "برنامج تسيير العيادة الطبية")}</span>
      <h1>${h.t("Votre cabinet, organisé du rendez-vous à <em>l'ordonnance bilingue</em>.", "عيادتكم منظَّمة، من الموعد إلى <em>الوصفة ثنائية اللغة</em>.")}</h1>
      <p class="promesse">${h.t("Agenda, salle d'attente, consultations, ordonnances, certificats et lettres d'orientation en français et en arabe, caisse. Sur un poste ou en réseau — et sans dépendre d'Internet.",
        "المواعيد، قاعة الانتظار، المعاينات، الوصفات، الشهادات ورسائل التوجيه بالفرنسية والعربية، والصندوق. على حاسوب واحد أو على الشبكة — ودون الحاجة إلى الإنترنت.")}</p>
      <div class="actions">${boutonEssai(h)}${boutonInscription(h)}${boutonDemo(h)}</div>
      <ul class="preuves">
        <li>${h.icone("check")}${h.t("Fonctionne hors ligne, données au cabinet", "يعمل دون إنترنت، والبيانات داخل العيادة")}</li>
        <li>${h.icone("check")}${h.t("Plusieurs postes sur le réseau local", "عدة حواسيب على الشبكة المحلية")}</li>
        <li>${h.icone("check")}${h.t("Documents A5 / A4, en-tête français–arabe", "وثائق A5 / A4 بترويسة فرنسية–عربية")}</li>
        <li>${h.icone("check")}${h.t("Courbes de croissance pour la pédiatrie", "منحنيات النمو لطب الأطفال")}</li>
      </ul>
    </div>
    <div class="scene" aria-hidden="false">
      <div class="fenetre"><div class="fenetre-barre"><i></i><i></i><i></i></div>${h.image("vue-ensemble", h.t("Écran principal d'EL-HAKIM PRO (données de démonstration)", "الشاشة الرئيسية لبرنامج EL-HAKIM PRO (بيانات تجريبية)"), { prioritaire: true })}</div>
      <div class="feuille">${h.image("certificat", h.t("Certificat médical A5 bilingue imprimé (données de démonstration)", "شهادة طبية A5 ثنائية اللغة مطبوعة (بيانات تجريبية)"))}</div>
      <span class="etiquette">${h.t("Captures réelles · données de démonstration", "لقطات حقيقية · بيانات تجريبية")}</span>
    </div>
  </section>
  <div class="bande"><div>
    <span><b>${h.t("Mises à jour automatiques", "تحديثات تلقائية")}</b> ${h.t("signées", "موقَّعة")}</span>
    <span><b>${h.t("Sauvegarde complète", "نسخة احتياطية كاملة")}</b> ${h.t("avant chaque mise à jour", "قبل كل تحديث")}</span>
    <span><b>${h.t("Nomenclature", "مدونة")}</b> ${h.t("des médicaments importable", "الأدوية قابلة للاستيراد")}</span>
  </div></div>`,
    corps: (h) => {
        const PROBLEMES = [
            ["Le cahier de rendez-vous déborde et se relit mal.", "دفتر المواعيد ممتلئ ويصعب قراءته.",
             "Agenda du jour, du mois ou de 3 mois ; arrivée, absence ou annulation en un clic.", "جدول مواعيد باليوم أو الشهر أو 3 أشهر؛ الحضور أو الغياب أو الإلغاء بنقرة واحدة."],
            ["Des allers-retours entre le bureau et la salle d'attente.", "ذهاب وإياب بين المكتب وقاعة الانتظار.",
             "Le médecin voit la file d'attente en temps réel et appelle le patient suivant depuis son poste.", "يرى الطبيب قائمة الانتظار مباشرة وينادي المريض التالي من حاسوبه."],
            ["Ordonnances et certificats réécrits à la main, encore et encore.", "وصفات وشهادات تُكتب باليد في كل مرة.",
             "Nomenclature des médicaments, posologie guidée, modèles réutilisables, impression A5 avec votre en-tête français–arabe.", "مدونة الأدوية، جرعات موجَّهة، نماذج جاهزة، وطباعة A5 بترويستكم الفرنسية–العربية."],
            ["Une connexion Internet qui coupe au mauvais moment.", "انقطاع الإنترنت في أسوأ الأوقات.",
             "Tout fonctionne sur les ordinateurs du cabinet ; Internet ne sert qu'aux mises à jour.", "كل شيء يعمل على حواسيب العيادة؛ والإنترنت لا يُستعمل إلا للتحديثات."],
            ["Des courbes de croissance tracées à la main.", "منحنيات نمو تُرسم باليد.",
             "Poids, taille, IMC et périmètre crânien placés sur les courbes CDC 2000, avec percentiles et Z-scores.", "الوزن والطول ومؤشر كتلة الجسم ومحيط الرأس على منحنيات CDC 2000، مع المئينات وقيم Z."],
            ["Une caisse tenue sur un cahier.", "صندوق يُسجَّل في دفتر.",
             "Recettes, dépenses, dettes et traitements en plusieurs séances, avec un journal de caisse A4.", "المداخيل والمصاريف والديون والعلاجات على عدة حصص، مع دفتر صندوق بمقاس A4."],
        ];
        const POINTS = [
            ["croissance", "Pédiatrie", "طب الأطفال", "Les courbes de croissance, prêtes à imprimer", "منحنيات النمو جاهزة للطباعة",
             "Poids, taille, IMC et périmètre crânien sur les références CDC 2000, percentiles et Z-scores, âge corrigé pour les prématurés. Les courbes s'impriment en A4.",
             "الوزن والطول ومؤشر كتلة الجسم ومحيط الرأس وفق مراجع CDC 2000، مع المئينات وقيم Z والعمر المصحَّح للخُدَّج. تُطبع المنحنيات بمقاس A4.",
             "Courbes de croissance d'un enfant", "منحنيات نمو طفل"],
            ["ordonnance", "Ordonnances et documents FR / AR", "الوصفات والوثائق بالفرنسية / العربية", "La posologie en quelques clics", "الجرعات ببضع نقرات",
             "Recherche dans la nomenclature, durée, quantité et posologie à choisir. Ordonnances, certificats, arrêts de travail, bilans, imagerie, comptes rendus, lettres d'orientation : tous avec votre en-tête bilingue et votre logo, en A5 ou A4.",
             "البحث في مدونة الأدوية، ثم اختيار المدة والكمية والجرعة. وصفات، شهادات، عطل مرضية، تحاليل، أشعة، تقارير، رسائل توجيه: كلها بترويستكم ثنائية اللغة وشعاركم، بمقاس A5 أو A4.",
             "Choix guidé de la posologie", "الاختيار الموجَّه للجرعة"],
            ["reseau", "Hors ligne et multi-postes", "دون إنترنت وعلى عدة حواسيب", "Un poste, ou tout le cabinet en réseau", "حاسوب واحد، أو العيادة كلها على الشبكة",
             "Les données restent au cabinet, sur le poste unique ou sur le poste serveur. Le secrétariat et les autres bureaux travaillent par le réseau local, sans Internet.",
             "تبقى البيانات داخل العيادة، على الحاسوب الوحيد أو على الحاسوب الخادم. وتعمل السكرتارية والمكاتب الأخرى عبر الشبكة المحلية دون إنترنت.",
             "Réglages du réseau local", "إعدادات الشبكة المحلية"],
            ["agenda", "Secrétariat", "السكرتارية", "Agenda et salle d'attente en temps réel", "المواعيد وقاعة الانتظار مباشرة",
             "La secrétaire enregistre l'arrivée du patient ; le médecin le voit aussitôt dans la file et l'appelle. Rappels des rendez-vous à l'écran.",
             "تسجّل السكرتيرة وصول المريض فيراه الطبيب فورًا في قائمة الانتظار وينادي عليه. مع تذكير بالمواعيد على الشاشة.",
             "Agenda du jour", "جدول مواعيد اليوم"],
        ];
        return `
<section class="section" id="problemes" aria-labelledby="t-problemes">
  <div class="enveloppe">
    <h2 class="titre-section" id="t-problemes">${h.t("Ce qui change au cabinet", "ما الذي يتغيّر في العيادة")}</h2>
    <ul class="grille-problemes">${PROBLEMES.map(([pf, pa, sf, sa]) => `
      <li><p class="avant">${h.t(pf, pa)}</p><p class="apres">${h.icone("fleche")}<span>${h.t(sf, sa)}</span></p></li>`).join("")}
    </ul>
  </div>
</section>

<section class="section section-papier" id="fonctionnalites" aria-labelledby="t-fonctions">
  <div class="enveloppe">
    <h2 class="titre-section" id="t-fonctions">${h.t("Fonctionnalités", "الميزات")}</h2>
    <p class="chapo">${h.t("Captures réelles du logiciel, avec des données de démonstration.", "لقطات حقيقية من البرنامج، ببيانات تجريبية.")}</p>
    ${POINTS.map(([img, sf, sa, tf, ta, df, da, af, aa], i) => `
    <article class="point${i % 2 ? " inverse" : ""}">
      <div class="point-texte"><span class="surtitre sombre">${h.t(sf, sa)}</span><h3>${h.t(tf, ta)}</h3><p>${h.t(df, da)}</p></div>
      <figure class="point-image">${h.image(img, `${h.t(af, aa)} (${DEMO(h)})`)}</figure>
    </article>`).join("")}
    <h3 class="sous-titre">${h.t("Pour chacun au cabinet", "لكل فرد في العيادة")}</h3>
    <div class="roles">
      <section><h4>${h.t("Le médecin", "الطبيب")}</h4>${listeRole(h, "medecin")}</section>
      <section><h4>${h.t("Le secrétariat", "السكرتارية")}</h4>${listeRole(h, "secretaire")}</section>
      <section><h4>${h.t("Le cabinet", "العيادة")}</h4>${listeRole(h, "cabinet")}</section>
    </div>
  </div>
</section>

<section class="section" id="videos" data-section="videos" hidden aria-labelledby="t-videos">
  <div class="enveloppe">
    <h2 class="titre-section" id="t-videos">${h.t("Vidéos", "فيديوهات")}</h2>
    <p class="chapo">${h.t("La vidéo ne se charge qu'au clic : rien n'est envoyé à YouTube avant.", "لا يُحمَّل الفيديو إلا عند النقر: لا يُرسَل شيء إلى YouTube قبل ذلك.")}</p>
    <div class="grille-videos" data-videos="tous"></div>
  </div>
</section>

<section class="section section-papier" id="avis" data-section="avis" hidden aria-labelledby="t-avis">
  <div class="enveloppe">
    <h2 class="titre-section" id="t-avis">${h.t("Ils utilisent EL-HAKIM PRO", "يستعملون EL-HAKIM PRO")}</h2>
    <div class="grille-avis" data-avis></div>
  </div>
</section>

<section class="section" id="equipe" data-section="equipe" hidden aria-labelledby="t-equipe">
  <div class="enveloppe etroite">
    <h2 class="titre-section" id="t-equipe">${h.t("Qui sommes-nous", "من نحن")}</h2>
    <div class="texte-libre" data-equipe></div>
  </div>
</section>

<section class="section section-papier" id="tarifs" data-section="packs" hidden aria-labelledby="t-tarifs">
  <div class="enveloppe">
    <h2 class="titre-section" id="t-tarifs">${h.t("Tarifs", "الأسعار")}</h2>
    <div data-packs></div>
    <div data-paiement></div>
  </div>
</section>

<section class="section" id="faq" data-section="faq" hidden aria-labelledby="t-faq">
  <div class="enveloppe etroite">
    <h2 class="titre-section" id="t-faq">${h.t("Questions fréquentes", "أسئلة متكررة")}</h2>
    <div class="faq" data-faq></div>
  </div>
</section>

<section class="appel">
  <div class="enveloppe">
    <h2>${h.t("Essayez EL-HAKIM PRO pendant 3 jours", "جرّبوا EL-HAKIM PRO لمدة 3 أيام")}</h2>
    <p>${h.t("Installez-le sur l'ordinateur du cabinet : la période d'essai démarre aussitôt, sans engagement.", "ثبّتوه على حاسوب العيادة: تبدأ الفترة التجريبية فورًا ودون أي التزام.")}</p>
    <div class="actions centre">${boutonEssai(h)}${boutonInscription(h)}</div>
  </div>
</section>`;
    },
};

// ————————————————————————————————————————————————————————————————— Téléchargement
const telechargement = {
    id: "telechargement", fichier: "telechargement.html", wa: "telechargement",
    titre: (h) => h.t("Télécharger EL-HAKIM PRO", "تحميل EL-HAKIM PRO"),
    description: (h) => h.t("Téléchargez la dernière version d'EL-HAKIM PRO pour Windows 10 et 11 : version, taille, empreinte SHA-256, notes de version et fichiers joints (nomenclature, logos, guides).",
        "حمّلوا آخر إصدار من EL-HAKIM PRO لنظام Windows 10 و11: الإصدار، الحجم، البصمة SHA-256، مستجدات الإصدار والملفات المرفقة."),
    ouverture: ouvertureCourte((h) => h.t("Windows 10 et 11 · essai gratuit de 3 jours", "Windows 10 و11 · تجربة مجانية لمدة 3 أيام"),
        (h) => h.t("Télécharger EL-HAKIM PRO", "تحميل EL-HAKIM PRO"),
        (h) => h.t("Le même fichier sert à la première installation et aux mises à jour.", "نفس الملف يُستعمل للتثبيت الأول وللتحديثات.")),
    corps: (h) => `
<section class="section">
  <div class="enveloppe etroite">
    <div class="carte-telechargement">
      <a class="btn btn-or btn-grand" href="${URL_INSTALLEUR}">${h.icone("telecharger")}${h.t("Télécharger l'installation", "تحميل ملف التثبيت")}</a>
      <p class="fichier-nom" dir="ltr">el-hakim-pro-setup.exe</p>
      <!-- bloc:version -->
<!-- /bloc:version -->
    </div>

    <aside class="encadre" aria-labelledby="t-smartscreen">
      <h2 id="t-smartscreen">${h.icone("bouclier")}${h.t("Si Windows affiche « Windows a protégé votre ordinateur »", "إذا ظهرت رسالة Windows «تمت حماية الكمبيوتر الخاص بك»")}</h2>
      <p>${h.t("C'est le filtre SmartScreen de Windows : il s'affiche pour les logiciels qu'il voit encore peu souvent.", "إنها مصفاة SmartScreen في Windows: تظهر مع البرامج التي لم يتعرّف عليها بعد بشكل كافٍ.")}</p>
      <ol>
        <li>${h.t("Vérifiez d'abord que le fichier vient bien de cette page (empreinte ci-dessous).", "تحقّقوا أولًا من أن الملف آتٍ من هذه الصفحة (البصمة أدناه).")}</li>
        <li>${h.t("Cliquez sur <b>Informations complémentaires</b>.", "انقروا على <b>معلومات إضافية</b>.")}</li>
        <li>${h.t("Cliquez sur <b>Exécuter quand même</b>.", "انقروا على <b>تشغيل على أي حال</b>.")}</li>
      </ol>
      <h3>${h.t("Vérifier l'empreinte du fichier", "التحقق من بصمة الملف")}</h3>
      <p>${h.t("Dans le dossier Téléchargements, ouvrez PowerShell et tapez :", "في مجلد التنزيلات، افتحوا PowerShell واكتبوا:")}</p>
      <pre dir="ltr"><code>Get-FileHash .\\el-hakim-pro-setup.exe -Algorithm SHA256</code></pre>
      <p>${h.t("Le résultat doit être identique à l'empreinte SHA-256 affichée plus haut.", "يجب أن تكون النتيجة مطابقة للبصمة SHA-256 المعروضة أعلاه.")}</p>
    </aside>

    <h2 class="titre-section petit">${h.t("Avant d'installer", "قبل التثبيت")}</h2>
    <ul class="coches">
      <li>${h.icone("check")}<span>${h.t("Un ordinateur sous Windows 10 ou Windows 11, avec environ 1 Go d'espace libre.", "حاسوب بنظام Windows 10 أو Windows 11، مع مساحة فارغة تقارب 1 غيغابايت.")}</span></li>
      <li>${h.icone("check")}<span>${h.t("Le fuseau horaire de Windows réglé sur l'Algérie.", "المنطقة الزمنية في Windows مضبوطة على الجزائر.")}</span></li>
      <li>${h.icone("check")}<span>${h.t("Une imprimante qui accepte le papier A5 et A4.", "طابعة تقبل الورق بمقاس A5 وA4.")}</span></li>
      <li>${h.icone("check")}<span>${h.t("Pour plusieurs ordinateurs : installez d'abord le poste serveur.", "لعدة حواسيب: ثبّتوا الحاسوب الخادم أولًا.")}</span></li>
    </ul>
    <p class="suite"><a href="${h.r}installation.html">${h.t("Voir les étapes d'installation", "عرض خطوات التثبيت")} ${h.icone("fleche")}</a></p>

    <h2 class="titre-section petit">${h.t("Fichiers joints", "الملفات المرفقة")}</h2>
    <p>${h.t("Nomenclature des médicaments, logos de spécialités et guides. Ils sont aussi proposés dans la fenêtre Mises à jour du logiciel.", "مدونة الأدوية، شعارات التخصصات والأدلة. وهي متوفرة أيضًا في نافذة التحديثات داخل البرنامج.")}</p>
    <!-- bloc:fichiers -->
<!-- /bloc:fichiers -->
    <p class="suite"><a href="${h.r}versions.html">${h.t("Historique des versions", "سجل الإصدارات")} ${h.icone("fleche")}</a> · <a href="${DEPOT_RELEASES}/releases" rel="noopener">${h.t("Toutes les versions sur GitHub", "كل الإصدارات على GitHub")}</a></p>
  </div>
</section>`,
};

// ————————————————————————————————————————————————————————————————— Installation
const installation = {
    id: "installation", fichier: "installation.html", wa: "installation",
    titre: (h) => h.t("Installer EL-HAKIM PRO", "تثبيت EL-HAKIM PRO"),
    description: (h) => h.t("Installer EL-HAKIM PRO sur un poste unique ou en réseau (serveur multi-postes et postes clients), premier démarrage, licence et mises à jour.",
        "تثبيت EL-HAKIM PRO على حاسوب واحد أو على الشبكة (خادم وحواسيب عميلة)، التشغيل الأول، الترخيص والتحديثات."),
    ouverture: ouvertureCourte((h) => h.t("Installation", "التثبيت"), (h) => h.t("Installer EL-HAKIM PRO", "تثبيت EL-HAKIM PRO"),
        (h) => h.t("L'essentiel en une page. Tous les détails, avec les écrans, sont dans le Guide d'installation et de configuration.", "الأساسي في صفحة واحدة. وكل التفاصيل مع الصور في دليل التثبيت والإعداد.")),
    corps: (h) => `
<section class="section">
  <div class="enveloppe etroite texte-libre">
    <h2>${h.t("1. Choisir l'organisation du cabinet", "1. اختيار تنظيم العيادة")}</h2>
    <div class="tableau-defilant"><table>
      <thead><tr><th>${h.t("Votre cabinet", "عيادتكم")}</th><th>${h.t("Ce qu'il faut installer", "ما يجب تثبيته")}</th></tr></thead>
      <tbody>
        <tr><td>${h.t("Un seul ordinateur", "حاسوب واحد")}</td><td>${h.t("<b>Poste unique</b> sur cet ordinateur.", "<b>حاسوب وحيد</b> على هذا الحاسوب.")}</td></tr>
        <tr><td>${h.t("Plusieurs ordinateurs (médecin, secrétariat…)", "عدة حواسيب (الطبيب، السكرتارية…)")}</td><td>${h.t("<b>Serveur multi-postes</b> sur l'ordinateur principal, celui qui garde les données. Les autres l'utilisent par le réseau du cabinet.", "<b>خادم متعدد الحواسيب</b> على الحاسوب الرئيسي الذي يحفظ البيانات. والحواسيب الأخرى تستعمله عبر شبكة العيادة.")}</td></tr>
        <tr><td>${h.t("Un ordinateur de plus, pour un cabinet déjà équipé", "حاسوب إضافي لعيادة مجهَّزة")}</td><td>${h.t("<b>Poste client</b> sur cet ordinateur.", "<b>حاسوب عميل</b> على هذا الحاسوب.")}</td></tr>
      </tbody></table></div>
    <p class="note">${h.t("Toutes les données sont gardées sur le poste unique ou sur le serveur. Le serveur doit être allumé, avec EL-HAKIM PRO ouvert, pour que les autres postes travaillent.", "كل البيانات محفوظة على الحاسوب الوحيد أو على الخادم. يجب أن يكون الخادم مشغَّلًا وEL-HAKIM PRO مفتوحًا عليه لكي تعمل الحواسيب الأخرى.")}</p>

    <h2>${h.t("2. Installer", "2. التثبيت")}</h2>
    <ol class="etapes">
      <li>${h.t("Réglez le fuseau horaire de Windows sur l'Algérie.", "اضبطوا المنطقة الزمنية في Windows على الجزائر.")}</li>
      <li>${h.t(`Téléchargez <b>el-hakim-pro-setup.exe</b> depuis la <a href="${h.r}telechargement.html">page Téléchargement</a>, puis double-cliquez dessus.`, `حمّلوا <b dir="ltr">el-hakim-pro-setup.exe</b> من <a href="${h.r}telechargement.html">صفحة التحميل</a>، ثم انقروا عليه مرتين.`)}</li>
      <li>${h.t("Si Windows affiche « Windows a protégé votre ordinateur » : <b>Informations complémentaires</b>, puis <b>Exécuter quand même</b>.", "إذا ظهرت رسالة «تمت حماية الكمبيوتر الخاص بك»: <b>معلومات إضافية</b> ثم <b>تشغيل على أي حال</b>.")}</li>
      <li>${h.t("Gardez le dossier proposé (pour une mise à jour : le même dossier que l'installation actuelle).", "احتفظوا بالمجلد المقترح (عند التحديث: نفس مجلد التثبيت الحالي).")}</li>
      <li>${h.t("Choisissez le rôle de l'ordinateur : <b>Poste unique</b>, <b>Serveur multi-postes</b> ou <b>Poste client</b> (avec l'adresse du serveur, par exemple 192.168.1.10).", "اختاروا دور الحاسوب: <b>حاسوب وحيد</b> أو <b>خادم متعدد الحواسيب</b> أو <b>حاسوب عميل</b> (مع عنوان الخادم، مثلًا 192.168.1.10).")}</li>
      <li>${h.t("Pour un serveur, acceptez le réglage du pare-feu demandé par Windows : il n'ouvre que le port 3001, et seulement au réseau local.", "بالنسبة للخادم، وافقوا على ضبط جدار الحماية الذي يطلبه Windows: يفتح المنفذ 3001 فقط وللشبكة المحلية فقط.")}</li>
      <li>${h.t("Cliquez sur <b>Fermer</b> : le raccourci EL-HAKIM PRO est sur le Bureau.", "انقروا على <b>إغلاق</b>: اختصار EL-HAKIM PRO على سطح المكتب.")}</li>
    </ol>

    <h2>${h.t("3. Premier démarrage", "3. التشغيل الأول")}</h2>
    <ol class="etapes">
      <li>${h.t("Connectez-vous avec le compte de départ indiqué dans le guide, puis changez son mot de passe tout de suite.", "سجّلوا الدخول بالحساب الأولي المذكور في الدليل، ثم غيّروا كلمة المرور فورًا.")}</li>
      <li>${h.t("L'assistant vous guide en quatre étapes : identité du cabinet (en français et en arabe), logo, nomenclature des médicaments, fin.", "يرافقكم المساعد في أربع خطوات: هوية العيادة (بالفرنسية والعربية)، الشعار، مدونة الأدوية، ثم النهاية.")}</li>
      <li>${h.t("Créez un compte pour chaque personne du cabinet (médecin, secrétaire).", "أنشئوا حسابًا لكل شخص في العيادة (طبيب، سكرتير(ة)).")}</li>
    </ol>

    <h2>${h.t("4. Essai et licence", "4. التجربة والترخيص")}</h2>
    <p>${h.t("À l'installation, EL-HAKIM PRO fonctionne en période d'essai pendant 3 jours. Ensuite, il faut une licence, liée à l'ordinateur (le serveur, dans un cabinet en réseau) :", "عند التثبيت، يعمل EL-HAKIM PRO في فترة تجريبية لمدة 3 أيام. بعد ذلك يلزم ترخيص مرتبط بالحاسوب (الخادم في عيادة متصلة بالشبكة):")}</p>
    <ol class="etapes">
      <li>${h.t("Ouvrez <b>Licence &amp; Abonnement</b> et copiez le <b>code machine</b>.", "افتحوا <b>الترخيص والاشتراك</b> وانسخوا <b>رمز الجهاز</b>.")}</li>
      <li>${h.t(`Envoyez ce code à CWL-SOFT (<a href="${h.r}contact.html">contact</a>).`, `أرسلوا هذا الرمز إلى CWL-SOFT (<a href="${h.r}contact.html">اتصل بنا</a>).`)}</li>
      <li>${h.t("Activez le fichier de licence ou la clé reçue au même endroit.", "فعّلوا ملف الترخيص أو المفتاح المستلم من نفس المكان.")}</li>
    </ol>

    <h2>${h.t("5. Mises à jour", "5. التحديثات")}</h2>
    <p>${h.t("Le logiciel vérifie lui-même les nouvelles versions et les fichiers joints. Avant chaque mise à jour, une sauvegarde complète est faite ; en cas de problème, tout est remis comme avant automatiquement. Dans un cabinet en réseau, mettez à jour le serveur en premier.", "يتحقق البرنامج بنفسه من الإصدارات الجديدة والملفات المرفقة. قبل كل تحديث تُنجز نسخة احتياطية كاملة؛ وعند حدوث مشكل يُعاد كل شيء كما كان تلقائيًا. في عيادة متصلة بالشبكة، حدّثوا الخادم أولًا.")}</p>

    <p class="suite"><a class="btn btn-sombre" href="${h.r}documentation.html">${h.icone("livre")}${h.t("Lire le guide complet", "قراءة الدليل الكامل")}</a></p>
  </div>
</section>`,
};

// ————————————————————————————————————————————————————————————————— Documentation
const GUIDES = [
    ["EL-HAKIM-PRO-Guide-Installation", "Guide d'installation et de configuration", "دليل التثبيت والإعداد",
     "Installer, configurer le cabinet, créer les comptes, travailler en réseau, licence, sauvegardes.", "التثبيت، إعداد العيادة، إنشاء الحسابات، العمل على الشبكة، الترخيص، النسخ الاحتياطية."],
    ["EL-HAKIM-PRO-Guide-Utilisation", "Guide d'utilisation", "دليل الاستعمال",
     "Patients, agenda, salle d'attente, consultation, ordonnances, documents, croissance, caisse.", "المرضى، المواعيد، قاعة الانتظار، المعاينة، الوصفات، الوثائق، النمو، الصندوق."],
    ["EL-HAKIM-PRO-Demarrage-Rapide", "Démarrage rapide", "البدء السريع",
     "Deux pages à imprimer et à garder près du poste.", "صفحتان للطباعة والاحتفاظ بهما قرب الحاسوب."],
];
const documentation = {
    id: "documentation", fichier: "documentation.html", wa: "documentation",
    titre: (h) => h.t("Documentation", "الأدلة"),
    description: (h) => h.t("Guides d'EL-HAKIM PRO à lire en ligne ou à télécharger en PDF : installation et configuration, utilisation, démarrage rapide.",
        "أدلة EL-HAKIM PRO للقراءة على الإنترنت أو للتحميل بصيغة PDF: التثبيت والإعداد، الاستعمال، البدء السريع."),
    ouverture: ouvertureCourte((h) => h.t("Aide", "المساعدة"), (h) => h.t("Documentation", "الأدلة"),
        (h) => h.t("Les guides suivent toujours la dernière version du logiciel.", "تتوافق الأدلة دائمًا مع آخر إصدار من البرنامج.")),
    corps: (h) => `
<section class="section">
  <div class="enveloppe">
    ${h.L === "ar" ? `<p class="note">الأدلة متوفرة حاليًا باللغة الفرنسية.</p>` : ""}
    <ul class="grille-guides">${GUIDES.map(([nom, tf, ta, df, da]) => `
      <li class="guide" data-guide="${nom}">
        ${h.icone("livre", "ic-guide")}
        <h2>${h.t(tf, ta)}</h2>
        <p>${h.t(df, da)}</p>
        <p class="liens-guide">
          <a class="btn btn-sombre" href="${h.r}docs/${nom}.html" lang="fr">${h.t("Lire en ligne", "قراءة على الإنترنت")}</a>
          <a class="btn btn-ligne-sombre" href="${DEPOT_RELEASES}/releases/latest/download/${nom}.pdf">${h.icone("telecharger")}PDF</a>
        </p>
      </li>`).join("")}
    </ul>
    <div data-section="videos-tutoriels" hidden>
      <h2 class="titre-section petit">${h.t("Tutoriels vidéo", "دروس بالفيديو")}</h2>
      <div class="grille-videos" data-videos="tutoriel"></div>
    </div>
  </div>
</section>`,
};

// ————————————————————————————————————————————————————————————————— Versions
const versions = {
    id: "versions", fichier: "versions.html", wa: "defaut",
    titre: (h) => h.t("Historique des versions", "سجل الإصدارات"),
    description: (h) => h.t("Toutes les versions d'EL-HAKIM PRO avec leurs nouveautés, leur date et leur empreinte SHA-256.", "كل إصدارات EL-HAKIM PRO مع مستجداتها وتاريخها وبصمتها SHA-256."),
    ouverture: ouvertureCourte((h) => h.t("Mises à jour", "التحديثات"), (h) => h.t("Historique des versions", "سجل الإصدارات"),
        (h) => h.t("Le logiciel installe lui-même les nouvelles versions ; voici ce qui a changé.", "يثبّت البرنامج الإصدارات الجديدة بنفسه؛ وهذا ما تغيّر.")),
    corps: (h) => `
<section class="section">
  <div class="enveloppe etroite historique">
    ${h.L === "ar" ? `<p class="note">مستجدات الإصدارات مكتوبة بالفرنسية.</p>` : ""}
    <!-- bloc:historique -->
<!-- /bloc:historique -->
    <p class="suite"><a href="${DEPOT_RELEASES}/releases" rel="noopener">${h.t("Toutes les versions sur GitHub", "كل الإصدارات على GitHub")} ${h.icone("fleche")}</a></p>
  </div>
</section>`,
};

// ————————————————————————————————————————————————————————————————— Tarifs
const tarifs = {
    id: "tarifs", fichier: "tarifs.html", wa: "tarifs",
    titre: (h) => h.t("Tarifs", "الأسعار"),
    description: (h) => h.t("Packs et licences EL-HAKIM PRO, modalités de paiement et réception de la licence.", "باقات وتراخيص EL-HAKIM PRO، طرق الدفع واستلام الترخيص."),
    ouverture: ouvertureCourte((h) => h.t("Licences", "التراخيص"), (h) => h.t("Tarifs", "الأسعار"),
        (h) => h.t("Commencez par l'essai gratuit de 3 jours, puis choisissez votre licence.", "ابدؤوا بالتجربة المجانية لمدة 3 أيام، ثم اختاروا ترخيصكم.")),
    corps: (h) => `
<section class="section">
  <div class="enveloppe">
    <div data-section="packs" hidden><div data-packs></div><div data-paiement></div></div>
    <div class="vide" data-si-vide="packs">
      <p>${h.t("Les tarifs ne sont pas encore publiés sur ce site. Contactez-nous pour les connaître.", "الأسعار غير منشورة بعد على هذا الموقع. اتصلوا بنا لمعرفتها.")}</p>
      <p><a class="btn btn-sombre" href="${h.r}contact.html">${h.t("Nous contacter", "اتصلوا بنا")}</a></p>
    </div>
  </div>
</section>`,
};

// ————————————————————————————————————————————————————————————————— Contact
const contact = {
    id: "contact", fichier: "contact.html", wa: "defaut",
    titre: (h) => h.t("Contact", "اتصل بنا"),
    description: (h) => h.t("Contacter CWL-SOFT pour EL-HAKIM PRO : informations, licence, assistance.", "الاتصال بـ CWL-SOFT بخصوص EL-HAKIM PRO: معلومات، ترخيص، مساعدة."),
    ouverture: ouvertureCourte((h) => h.t("CWL-SOFT", "CWL-SOFT"), (h) => h.t("Contact", "اتصل بنا"),
        (h) => h.t("Une question, une licence, une aide pour l'installation : écrivez-nous.", "سؤال، ترخيص، مساعدة في التثبيت: راسلونا.")),
    corps: (h) => `
<section class="section">
  <div class="enveloppe etroite">
    <ul class="coordonnees" data-contact hidden></ul>
    <div class="vide" data-si-vide="contact">
      <p>${h.t("Les coordonnées de CWL-SOFT seront publiées ici prochainement.", "ستُنشر هنا معلومات الاتصال بـ CWL-SOFT قريبًا.")}</p>
      <p>${h.t(`En attendant, les <a href="${h.r}documentation.html">guides</a> répondent aux questions d'installation et d'utilisation.`, `في انتظار ذلك، تجيب <a href="${h.r}documentation.html">الأدلة</a> عن أسئلة التثبيت والاستعمال.`)}</p>
    </div>
    <aside class="encadre clair">
      <h2>${h.t("Pour une licence", "للحصول على ترخيص")}</h2>
      <p>${h.t("Joignez le <b>code machine</b> affiché dans <b>Licence &amp; Abonnement</b> (sur le serveur, pour un cabinet en réseau).", "أرفقوا <b>رمز الجهاز</b> الظاهر في <b>الترخيص والاشتراك</b> (على الخادم، بالنسبة لعيادة متصلة بالشبكة).")}</p>
    </aside>
  </div>
</section>`,
};

// ————————————————————————————————————————————————————————————————— Pages légales
const ligneLegale = (h, cle, fr, ar) => `<div data-legal-ligne="${cle}" hidden><dt>${h.t(fr, ar)}</dt><dd data-legal="${cle}"></dd></div>`;
const enRedaction = (h) => `<p class="encadre attention" data-legal-redaction>${h.t("Page en cours de rédaction : l'identité de l'éditeur sera complétée prochainement.", "الصفحة قيد التحرير: ستُستكمل هوية الناشر قريبًا.")}</p>`;
const mentions = {
    id: "mentions", fichier: "mentions-legales.html", wa: "defaut",
    titre: (h) => h.t("Mentions légales", "الإشعارات القانونية"),
    description: (h) => h.t("Mentions légales du site de CWL-SOFT, éditeur d'EL-HAKIM PRO.", "الإشعارات القانونية لموقع CWL-SOFT، ناشر EL-HAKIM PRO."),
    ouverture: ouvertureCourte(null, (h) => h.t("Mentions légales", "الإشعارات القانونية"), null),
    corps: (h) => `
<section class="section">
  <div class="enveloppe etroite texte-libre">
    ${enRedaction(h)}
    <div data-legal-editeur hidden>
      <h2>${h.t("Éditeur du site", "ناشر الموقع")}</h2>
      <dl class="fiche">
        ${ligneLegale(h, "raisonSociale", "Raison sociale", "الاسم التجاري")}
        ${ligneLegale(h, "formeJuridique", "Forme juridique", "الشكل القانوني")}
        ${ligneLegale(h, "registreCommerce", "Registre du commerce", "السجل التجاري")}
        ${ligneLegale(h, "nif", "NIF", "رقم التعريف الجبائي")}
        ${ligneLegale(h, "nis", "NIS", "رقم التعريف الإحصائي")}
        ${ligneLegale(h, "articleImposition", "Article d'imposition", "مادة الضريبة")}
        ${ligneLegale(h, "adresse", "Adresse", "العنوان")}
        ${ligneLegale(h, "responsablePublication", "Responsable de la publication", "مسؤول النشر")}
      </dl>
    </div>
    <h2>${h.t("Hébergement", "الاستضافة")}</h2>
    <p>${h.t("Ce site est hébergé par GitHub Pages, service de GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.", "هذا الموقع مستضاف لدى GitHub Pages، خدمة تابعة لشركة GitHub, Inc.، 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107، الولايات المتحدة.")}</p>
    <p>${h.t("Les fichiers d'installation sont distribués depuis GitHub (dépôt public el-hakim-pro-releases).", "تُوزَّع ملفات التثبيت من GitHub (المستودع العام el-hakim-pro-releases).")}</p>
    <h2>${h.t("Propriété intellectuelle", "الملكية الفكرية")}</h2>
    <p>${h.t("EL-HAKIM PRO, son nom, son logo et les contenus de ce site appartiennent à leur éditeur. Les captures d'écran présentées ne contiennent que des données de démonstration.", "EL-HAKIM PRO واسمه وشعاره ومحتويات هذا الموقع ملك لناشرها. لقطات الشاشة المعروضة لا تحتوي إلا على بيانات تجريبية.")}</p>
    <p class="meta" data-legal-maj hidden>${h.t("Dernière mise à jour :", "آخر تحديث:")} <span data-legal="derniereMiseAJour"></span></p>
  </div>
</section>`,
};

const confidentialite = {
    id: "confidentialite", fichier: "confidentialite.html", wa: "defaut",
    titre: (h) => h.t("Confidentialité", "الخصوصية"),
    description: (h) => h.t("Politique de confidentialité du site de CWL-SOFT (loi n° 18-07) : ni cookies, ni traceurs, ni formulaire.", "سياسة الخصوصية لموقع CWL-SOFT (القانون رقم 18-07): لا ملفات تعريف ارتباط ولا أدوات تتبع ولا استمارات."),
    ouverture: ouvertureCourte(null, (h) => h.t("Confidentialité", "الخصوصية"), (h) => h.t("Ce que ce site fait — et ne fait pas — de vos données.", "ما يفعله هذا الموقع ببياناتكم، وما لا يفعله.")),
    corps: (h) => `
<section class="section">
  <div class="enveloppe etroite texte-libre">
    ${enRedaction(h)}
    <h2>${h.t("Ce site", "هذا الموقع")}</h2>
    <ul>
      <li>${h.t("Aucun cookie, aucun traceur publicitaire ou de mesure d'audience.", "لا ملفات تعريف ارتباط، ولا أدوات تتبع إشهارية أو لقياس الجمهور.")}</li>
      <li>${h.t("Aucun formulaire : le site ne collecte ni nom, ni e-mail, ni numéro de téléphone.", "لا استمارات: لا يجمع الموقع اسمًا ولا بريدًا إلكترونيًا ولا رقم هاتف.")}</li>
      <li>${h.t("Les polices de caractères et les images sont servies par le site lui-même.", "الخطوط والصور مقدَّمة من الموقع نفسه.")}</li>
      <li>${h.t("L'hébergeur, GitHub, enregistre l'adresse IP des visiteurs pour la sécurité et le bon fonctionnement du service, selon sa propre", "يسجّل المستضيف GitHub عناوين IP للزوار لأغراض الأمن وحسن سير الخدمة، وفق")} <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">${h.t("déclaration de confidentialité", "بيان الخصوصية الخاص به")}</a>.</li>
      <li>${h.t("Le bouton WhatsApp ouvre WhatsApp seulement quand vous cliquez ; le message pré-rempli est modifiable avant envoi.", "زر واتساب لا يفتح واتساب إلا عند النقر؛ ويمكن تعديل الرسالة المعدّة مسبقًا قبل إرسالها.")}</li>
      <li>${h.t("Les vidéos ne sont chargées depuis YouTube (mode sans cookie) qu'après un clic sur la vidéo.", "لا تُحمَّل الفيديوهات من YouTube (وضع دون ملفات تعريف الارتباط) إلا بعد النقر عليها.")}</li>
    </ul>
    <h2>${h.t("Le logiciel EL-HAKIM PRO", "برنامج EL-HAKIM PRO")}</h2>
    <p>${h.t("Les dossiers des patients sont enregistrés dans la base de données installée sur l'ordinateur du cabinet (le poste unique ou le serveur). Le logiciel se connecte à Internet pour vérifier et télécharger les mises à jour et les fichiers joints.", "تُحفظ ملفات المرضى في قاعدة البيانات المثبّتة على حاسوب العيادة (الحاسوب الوحيد أو الخادم). ويتصل البرنامج بالإنترنت للتحقق من التحديثات والملفات المرفقة وتحميلها.")}</p>
    <h2>${h.t("Vos droits (loi n° 18-07 du 10 juin 2018)", "حقوقكم (القانون رقم 18-07 المؤرخ في 10 يونيو 2018)")}</h2>
    <p>${h.t("La loi n° 18-07 relative à la protection des personnes physiques dans le traitement des données à caractère personnel vous donne un droit d'information, d'accès, de rectification et d'opposition.", "يمنحكم القانون رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي حق الإعلام والولوج والتصحيح والاعتراض.")}</p>
    <p data-legal-ligne="emailDonneesPersonnelles" hidden>${h.t("Pour les exercer, écrivez à", "لممارستها، راسلوا")} <a data-legal-email="emailDonneesPersonnelles" href="#"></a>.</p>
    <p class="meta" data-legal-maj hidden>${h.t("Dernière mise à jour :", "آخر تحديث:")} <span data-legal="derniereMiseAJour"></span></p>
  </div>
</section>`,
};

// ————————————————————————————————————————————————————————————————— 404
const page404 = {
    id: "404", fichier: "404.html", wa: "defaut",
    titre: () => "Page introuvable",
    description: () => "Cette page n'existe pas ou a été déplacée.",
    ouverture: ouvertureCourte(() => "Erreur 404", () => "Page introuvable", () => "Cette page n'existe pas ou a été déplacée."),
    corps: (h) => `
<section class="section">
  <div class="enveloppe etroite centre">
    <p class="actions centre"><a class="btn btn-sombre" href="${h.r}index.html" data-lien-racine>Retour à l'accueil</a>
    <a class="btn btn-ligne-sombre" href="${h.r}telechargement.html" data-lien-racine>Télécharger EL-HAKIM PRO</a></p>
  </div>
</section>`,
};

module.exports = [accueil, telechargement, installation, documentation, versions, tarifs, contact, mentions, confidentialite, page404];
