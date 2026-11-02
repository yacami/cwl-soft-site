// outils/blocs-version.cjs
// Blocs STATIQUES des pages Téléchargement et Versions, fabriqués depuis donnees/*.json (écrits par les scripts de
// publication d'EL-HAKIM PRO). Ils sont réécrits dans le HTML, en français (racine) et en arabe (ar/), entre deux
// marqueurs :   <!-- bloc:nom --> … <!-- /bloc:nom -->
// Ainsi la version, la taille, l'empreinte et les fichiers joints s'affichent même sans JavaScript.
// Utilisé par outils/assembler.cjs et par le script de publication d'EL-HAKIM PRO (scripts/publication/site.cjs).
const fs = require("fs");
const path = require("path");

const DEPOT_RELEASES = "https://github.com/yacami/el-hakim-pro-releases";
const URL_INSTALLEUR = `${DEPOT_RELEASES}/releases/latest/download/el-hakim-pro-setup.exe`;

const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const date = (iso) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Africa/Algiers" }); };
const mo = (o, L) => {
    if (o == null) return "";
    if (o < 1048576) return Math.max(1, Math.round(o / 1024)).toLocaleString("fr-FR") + (L === "ar" ? " ك.ب" : " Ko");
    return (o / 1048576).toLocaleString("fr-FR", { maximumFractionDigits: 1 }) + (L === "ar" ? " م.ب" : " Mo");
};
const enLigne = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
const T = {
    fr: { version: "Version", date: "Publiée le", taille: "Taille", sha: "Empreinte SHA-256", copier: "Copier", nouveautes: "Nouveautés de la version", actuelle: "actuelle", vide: "Les informations de version seront affichées après la prochaine publication.", videH: "L'historique sera affiché après la prochaine publication." },
    ar: { version: "الإصدار", date: "تاريخ النشر", taille: "الحجم", sha: "البصمة SHA-256", copier: "نسخ", nouveautes: "مستجدات الإصدار", actuelle: "الحالي", vide: "ستظهر معلومات الإصدار بعد النشر القادم.", videH: "سيظهر سجل الإصدارات بعد النشر القادم." },
};

// Notes de version (Markdown simple du CHANGELOG, en français) → HTML. La partie « Pour le support » n'est jamais publiée.
function notesHtml(md) {
    const texte = String(md || "").split(/\n### Pour le support/)[0];
    let html = "", liste = false;
    for (const ligne of texte.split(/\r?\n/)) {
        const t = ligne.trim();
        const puce = /^[-*]\s+(.*)$/.exec(t);
        if (puce) { if (!liste) { html += "<ul>"; liste = true; } html += `<li>${enLigne(puce[1])}</li>`; continue; }
        if (liste) { html += "</ul>"; liste = false; }
        if (!t) continue;
        const titre = /^#{2,6}\s+(.*)$/.exec(t);
        html += titre ? `<p class="titre-notes"><strong>${enLigne(titre[1])}</strong></p>` : `<p>${enLigne(t)}</p>`;
    }
    return html + (liste ? "</ul>" : "");
}
// Sur la page arabe, les notes restent en français : elles sont marquées comme telles (lecture de gauche à droite).
const notes = (md, L) => (L === "ar" ? `<div lang="fr" dir="ltr" class="notes-fr">${notesHtml(md)}</div>` : notesHtml(md));

function blocVersion(v, L = "fr") {
    const t = T[L];
    if (!v || !v.version) return `<p class="note-discrete">${t.vide}</p>`;
    return `<dl class="fiche-version">
  <div><dt>${t.version}</dt><dd>${esc(v.version)}</dd></div>
  <div><dt>${t.date}</dt><dd>${date(v.date)}</dd></div>
  <div><dt>${t.taille}</dt><dd>${mo(v.taille, L)}</dd></div>
  <div class="large"><dt>${t.sha}</dt><dd class="empreinte"><code id="empreinte" dir="ltr">${esc(v.sha256)}</code>
    <button type="button" class="copier" data-copier="empreinte" hidden>${t.copier}</button></dd></div>
</dl>
<details class="notes"><summary>${t.nouveautes} ${esc(v.version)}</summary>${notes(v.notes, L)}</details>`;
}

function blocFichiers(f, L = "fr") {
    const liste = (f && Array.isArray(f.fichiers) ? f.fichiers : []).slice().sort((a, b) => String(a.description || a.nom).localeCompare(String(b.description || b.nom), "fr"));
    if (!liste.length) return "";
    return `<ul class="fichiers">${liste.map((x) => `
  <li><a href="${esc(`${DEPOT_RELEASES}/releases/latest/download/${encodeURIComponent(x.nom)}`)}" download>
    <span class="nom" lang="fr">${esc(x.description || x.nom)}</span>
    <span class="meta" dir="ltr">${esc(x.nom)} · ${mo(x.taille, "fr")}</span></a></li>`).join("")}
</ul>`;
}

function blocHistorique(h, L = "fr") {
    const t = T[L];
    const liste = Array.isArray(h) ? h : [];
    if (!liste.length) return `<p class="note-discrete">${t.videH}</p>`;
    return liste.map((v, i) => `
<article class="version${i === 0 ? " derniere" : ""}" id="v${esc(v.version)}">
  <header><h2>${t.version} ${esc(v.version)}${i === 0 ? ` <span class="badge">${t.actuelle}</span>` : ""}</h2>
    <p class="meta">${date(v.date)}${v.taille ? ` · ${mo(v.taille, L)}` : ""}${v.page ? ` · <a href="${esc(v.page)}" rel="noopener">GitHub</a>` : ""}</p></header>
  ${notes(v.notes, L)}
  ${v.sha256 ? `<p class="sha">SHA-256 : <code dir="ltr">${esc(v.sha256)}</code></p>` : ""}
</article>`).join("");
}

function remplacerBloc(html, nom, contenu) {
    const re = new RegExp(`(<!-- bloc:${nom} -->)[\\s\\S]*?(<!-- /bloc:${nom} -->)`);
    if (!re.test(html)) throw new Error(`marqueurs du bloc « ${nom} » introuvables`);
    return html.replace(re, (_, a, b) => `${a}\n${contenu}\n${b}`);
}

const lireJson = (f, defaut) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return defaut; } };

/** Réécrit les blocs de telechargement.html et versions.html (FR et AR) depuis donnees/*.json. Renvoie les fichiers modifiés. */
function mettreAJourPages(racine) {
    const d = path.join(racine, "donnees");
    const v = lireJson(path.join(d, "version.json"), null), f = lireJson(path.join(d, "fichiers.json"), null), h = lireJson(path.join(d, "historique.json"), []);
    const modifies = [];
    const ecrire = (fichier, blocs) => {
        const chemin = path.join(racine, fichier);
        if (!fs.existsSync(chemin)) return;
        const avant = fs.readFileSync(chemin, "utf8");
        let html = avant;
        for (const [nom, contenu] of blocs) html = remplacerBloc(html, nom, contenu);
        if (html !== avant) { fs.writeFileSync(chemin, html); modifies.push(fichier); }
    };
    for (const [L, dossier] of [["fr", ""], ["ar", "ar/"]]) {
        ecrire(`${dossier}telechargement.html`, [["version", blocVersion(v, L)], ["fichiers", blocFichiers(f, L)]]);
        ecrire(`${dossier}versions.html`, [["historique", blocHistorique(h, L)]]);
    }
    return modifies;
}

module.exports = { URL_INSTALLEUR, DEPOT_RELEASES, notesHtml, blocVersion, blocFichiers, blocHistorique, remplacerBloc, mettreAJourPages };
