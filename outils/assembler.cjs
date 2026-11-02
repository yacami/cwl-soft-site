// outils/assembler.cjs — fabrique les pages du site (français à la racine, arabe dans ar/) depuis outils/pages.cjs.
//   node outils/assembler.cjs
// À relancer seulement quand la MISE EN PAGE ou les textes fixes changent. Le contenu commercial (contenu/*.json) est
// lu par le navigateur : le modifier ne demande aucune étape de fabrication. Les blocs de version sont réécrits par les
// scripts de publication d'EL-HAKIM PRO (voir blocs-version.cjs).
const fs = require("fs");
const path = require("path");
const RACINE = path.join(__dirname, "..");
const SITE = require("./site.json");
const blocs = require("./blocs-version.cjs");
const DIMS = require("../assets/img/dimensions.json");

const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const ICONES = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    lecture: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    telecharger: '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14"/>',
    livre: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    bouclier: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    fleche: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.5-.3Z"/>',
};
const icone = (nom, classe = "ic") => `<svg class="${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nom]}</svg>`;

// Image : WebP + PNG de repli, dimensions écrites (pas de décalage à l'affichage), chargement différé sauf en tête.
function image(r, nom, alt, { prioritaire = false, classe = "" } = {}) {
    const [l, h] = String(DIMS[nom] || "").split("×").map(Number);
    const taille = l ? ` width="${l}" height="${h}"` : "";
    const charge = prioritaire ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
    return `<picture${classe ? ` class="${classe}"` : ""}><source type="image/webp" srcset="${r}assets/img/${nom}.webp"><img src="${r}assets/img/${nom}.png" alt="${esc(alt)}"${taille}${charge}></picture>`;
}

const PAGES_NAV = [
    ["index.html#fonctionnalites", "Fonctionnalités", "الميزات"],
    ["tarifs.html", "Tarifs", "الأسعار", "packs"],
    ["telechargement.html", "Téléchargement", "التحميل"],
    ["documentation.html", "Documentation", "الأدلة"],
    ["contact.html", "Contact", "اتصل بنا"],
];

function gabarit(page, L) {
    const r = L === "ar" ? "../" : "";
    const t = (fr, ar) => (L === "ar" ? ar : fr);
    const h = { r, t, L, icone, image: (...a) => image(r, ...a), esc, blocs };
    const chemin = (L === "ar" ? "ar/" : "") + (page.fichier === "index.html" ? "" : page.fichier);
    const urlFr = SITE.url + (page.fichier === "index.html" ? "" : page.fichier);
    const urlAr = SITE.url + "ar/" + (page.fichier === "index.html" ? "" : page.fichier);
    const titre = page.titre(h);
    const description = page.description(h);
    const titreComplet = page.fichier === "index.html" ? titre : `${titre} · EL-HAKIM PRO`;
    const autre = L === "ar" ? `../${page.fichier}` : `ar/${page.fichier}`;
    const nav = PAGES_NAV.map(([href, fr, ar, si]) => `<a href="${r}${href}"${si ? ` data-si="${si}" hidden` : ""}${href === page.fichier ? ' aria-current="page"' : ""}>${t(fr, ar)}</a>`).join("");
    const jsonld = (page.jsonld ? page.jsonld(h) : []).concat([{ "@context": "https://schema.org", "@type": "Organization", name: SITE.editeur, url: SITE.url, logo: SITE.url + "assets/img/icone-512.png" }]);
    const indexable = page.fichier !== "404.html";
    return `<!doctype html>
<html lang="${L}" dir="${L === "ar" ? "rtl" : "ltr"}" data-racine="${r}" data-page="${page.id}" data-wa="${page.wa || "defaut"}">
<head>
<meta charset="utf-8">
${page.fichier === "404.html" ? `<script>/* La page 404 est servie à n'importe quelle adresse : ses liens partent de la racine du site. */(function(){var b=document.createElement("base");b.href=location.pathname.indexOf("/cwl-soft-site/")===0?"/cwl-soft-site/":"/";document.head.appendChild(b);})();</script>
` : ""}<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titreComplet)}</title>
<meta name="description" content="${esc(description)}">
${indexable ? `<link rel="canonical" href="${L === "ar" ? urlAr : urlFr}">
<link rel="alternate" hreflang="fr" href="${urlFr}">
<link rel="alternate" hreflang="ar" href="${urlAr}">
<link rel="alternate" hreflang="x-default" href="${urlFr}">` : '<meta name="robots" content="noindex">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="EL-HAKIM PRO · CWL-SOFT">
<meta property="og:title" content="${esc(titreComplet)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${L === "ar" ? urlAr : urlFr}">
<meta property="og:image" content="${SITE.url}assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${L === "ar" ? "ar_DZ" : "fr_DZ"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0f1e33">
<link rel="icon" href="${r}assets/img/icone-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${r}assets/img/icone-180.png">
<link rel="manifest" href="${r}site.webmanifest">
${L === "ar" ? `<link rel="preload" href="${r}assets/fonts/naskh-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}assets/fonts/naskh-700.woff2" as="font" type="font/woff2" crossorigin>` : `<link rel="preload" href="${r}assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}assets/fonts/playfair-700.woff2" as="font" type="font/woff2" crossorigin>`}
<link rel="stylesheet" href="${r}assets/css/site.css">
<script src="${r}assets/js/site.js" defer></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n")}
</head>
<body>
<a class="evitement" href="#contenu">${t("Aller au contenu", "انتقل إلى المحتوى")}</a>
<div class="ciel${page.id === "index" ? "" : " court"}">
  <header class="barre-nav">
    <a class="marque" href="${r}index.html">${image(r, "logo-el-hakim", "")}<span><b>EL-HAKIM PRO</b><small>${t("par CWL-SOFT", "من CWL-SOFT")}</small></span></a>
    <nav class="liens" aria-label="${t("Navigation principale", "التنقل الرئيسي")}">${nav}</nav>
    <a class="langue" href="${autre}"${indexable ? "" : " hidden"} lang="${L === "ar" ? "fr" : "ar"}" hreflang="${L === "ar" ? "fr" : "ar"}">${L === "ar" ? "Français" : "العربية"}</a>
  </header>
${page.ouverture(h)}
</div>
<main id="contenu">
${page.corps(h)}
</main>
<footer class="pied">
  <div class="pied-grille">
    <div class="pied-marque">
      <b>EL-HAKIM PRO</b>
      <p>${t("Logiciel de gestion de cabinet médical, édité par CWL-SOFT.", "برنامج لتسيير العيادة الطبية، من إنتاج CWL-SOFT.")}</p>
    </div>
    <div><h2>${t("Logiciel", "البرنامج")}</h2><ul>
      <li><a href="${r}index.html#fonctionnalites">${t("Fonctionnalités", "الميزات")}</a></li>
      <li data-si="packs" hidden><a href="${r}tarifs.html">${t("Tarifs", "الأسعار")}</a></li>
      <li><a href="${r}telechargement.html">${t("Téléchargement", "التحميل")}</a></li>
      <li><a href="${r}versions.html">${t("Historique des versions", "سجل الإصدارات")}</a></li></ul></div>
    <div><h2>${t("Aide", "المساعدة")}</h2><ul>
      <li><a href="${r}installation.html">${t("Installation", "التثبيت")}</a></li>
      <li><a href="${r}documentation.html">${t("Documentation", "الأدلة")}</a></li>
      <li><a href="${r}contact.html">${t("Contact", "اتصل بنا")}</a></li></ul></div>
    <div><h2>${t("Informations", "معلومات")}</h2><ul>
      <li><a href="${r}mentions-legales.html">${t("Mentions légales", "الإشعارات القانونية")}</a></li>
      <li><a href="${r}confidentialite.html">${t("Confidentialité", "الخصوصية")}</a></li></ul></div>
  </div>
  <p class="pied-bas">© <span data-annee>${new Date().getFullYear()}</span> CWL-SOFT · ${t("Ce site n'utilise ni cookies ni traceurs.", "هذا الموقع لا يستعمل ملفات تعريف الارتباط ولا أدوات التتبع.")}</p>
</footer>
<div class="wa-flottant" data-wa-flottant hidden>
  <span class="wa-horaires" data-wa-horaires hidden></span>
  <a class="wa-bouton" data-wa-lien href="${r}contact.html" target="_blank" rel="noopener">${icone("whatsapp", "ic-wa")}<span>WhatsApp</span></a>
</div>
</body>
</html>
`;
}

function assembler() {
    const pages = require("./pages.cjs");
    const ecrits = [];
    for (const L of ["fr", "ar"]) {
        for (const page of pages) {
            if (L === "ar" && page.fichier === "404.html") continue;
            const sortie = path.join(RACINE, L === "ar" ? "ar" : "", page.fichier);
            fs.mkdirSync(path.dirname(sortie), { recursive: true });
            fs.writeFileSync(sortie, gabarit(page, L));
            ecrits.push(path.relative(RACINE, sortie).replace(/\\/g, "/"));
        }
    }
    blocs.mettreAJourPages(RACINE);
    // Plan du site et robots : pages indexables, avec leur pendant arabe.
    const indexables = pages.filter((p) => p.fichier !== "404.html");
    const loc = (p, L) => SITE.url + (L === "ar" ? "ar/" : "") + (p.fichier === "index.html" ? "" : p.fichier);
    fs.writeFileSync(path.join(RACINE, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${indexables.flatMap((p) => ["fr", "ar"].map((L) => `  <url><loc>${loc(p, L)}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${loc(p, "fr")}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${loc(p, "ar")}"/>
  </url>`)).join("\n")}
</urlset>
`);
    fs.writeFileSync(path.join(RACINE, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}sitemap.xml\n`);
    fs.writeFileSync(path.join(RACINE, "site.webmanifest"), JSON.stringify({
        name: "EL-HAKIM PRO · CWL-SOFT", short_name: "EL-HAKIM PRO", start_url: "./", display: "browser",
        background_color: "#0f1e33", theme_color: "#0f1e33",
        icons: [{ src: "assets/img/icone-180.png", sizes: "180x180", type: "image/png" }, { src: "assets/img/icone-512.png", sizes: "512x512", type: "image/png" }],
    }, null, 2) + "\n");
    return ecrits;
}

if (require.main === module) {
    const ecrits = assembler();
    console.log(`${ecrits.length} pages écrites, sitemap.xml, robots.txt, site.webmanifest.`);
}
module.exports = { assembler, gabarit, image, icone };
