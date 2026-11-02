/* CWL-SOFT · EL-HAKIM PRO — script unique du site (chargé en « defer », jamais bloquant).
   Il lit contenu/*.json et n'affiche une section que si son contenu existe : sans contenu, ou sans JavaScript, les
   sections commerciales restent masquées. Aucun cookie, aucune mesure d'audience, aucune requête vers un tiers avant
   un clic (WhatsApp, YouTube). Les textes viennent du fichier JSON ; ils sont insérés en texte, jamais en HTML brut. */
(function () {
    "use strict";
    var racine = document.documentElement.getAttribute("data-racine") || "";
    var L = document.documentElement.lang === "ar" ? "ar" : "fr";
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    var T = {
        fr: {
            waDefaut: "Bonjour, je souhaite des informations sur EL-HAKIM PRO.",
            waInscription: "Bonjour, je souhaite m'inscrire à EL-HAKIM PRO.",
            waPack: "Bonjour, je souhaite le pack {pack} d'EL-HAKIM PRO.",
            waTelechargement: "Bonjour, j'ai une question sur le téléchargement d'EL-HAKIM PRO.",
            waInstallation: "Bonjour, j'ai besoin d'aide pour installer EL-HAKIM PRO.",
            waDocumentation: "Bonjour, j'ai une question sur l'utilisation d'EL-HAKIM PRO.",
            waTarifs: "Bonjour, je souhaite des informations sur les tarifs d'EL-HAKIM PRO.",
            recommande: "Recommandé", choisir: "Choisir ce pack", postes: function (n) { return n > 1 ? n + " postes" : "1 poste"; },
            duree: { PREMIUM_6M: "Licence de 6 mois", PREMIUM_1Y: "Licence d'un an", PREMIUM_LIFETIME: "Licence à vie" },
            comparer: "Comparer les packs", inclus: "Inclus",
            paiement: "Paiement", moyens: "Moyens de paiement", etapes: "Comment ça se passe",
            demo: "Démonstration", tutoriel: "Tutoriel", fermer: "Fermer",
            whatsapp: "WhatsApp", email: "E-mail", telephone: "Téléphone", horaires: "Horaires", adresse: "Adresse",
            copie: "Copié", copier: "Copier"
        },
        ar: {
            waDefaut: "السلام عليكم، أرغب في معلومات حول EL-HAKIM PRO.",
            waInscription: "السلام عليكم، أرغب في التسجيل في EL-HAKIM PRO.",
            waPack: "السلام عليكم، أرغب في باقة {pack} من EL-HAKIM PRO.",
            waTelechargement: "السلام عليكم، لدي سؤال حول تحميل EL-HAKIM PRO.",
            waInstallation: "السلام عليكم، أحتاج إلى مساعدة لتثبيت EL-HAKIM PRO.",
            waDocumentation: "السلام عليكم، لدي سؤال حول استعمال EL-HAKIM PRO.",
            waTarifs: "السلام عليكم، أرغب في معلومات حول أسعار EL-HAKIM PRO.",
            recommande: "الأنسب", choisir: "اختيار هذه الباقة", postes: function (n) { return n > 1 ? n + " حواسيب" : "حاسوب واحد"; },
            duree: { PREMIUM_6M: "ترخيص لمدة 6 أشهر", PREMIUM_1Y: "ترخيص لمدة سنة", PREMIUM_LIFETIME: "ترخيص مدى الحياة" },
            comparer: "مقارنة الباقات", inclus: "مشمول",
            paiement: "الدفع", moyens: "طرق الدفع", etapes: "كيف تتم العملية",
            demo: "عرض توضيحي", tutoriel: "درس", fermer: "إغلاق",
            whatsapp: "واتساب", email: "البريد الإلكتروني", telephone: "الهاتف", horaires: "أوقات العمل", adresse: "العنوان",
            copie: "تم النسخ", copier: "نسخ"
        }
    }[L];

    // Texte bilingue { fr, ar } → texte de la langue de la page (repli sur le français si l'arabe est vide).
    function tx(o) {
        if (o == null) return "";
        if (typeof o === "string") return o.trim();
        return String((L === "ar" && o.ar && String(o.ar).trim()) ? o.ar : (o.fr || "")).trim();
    }
    function el(tag, attrs, enfants) {
        var e = document.createElement(tag);
        if (attrs) for (var k in attrs) {
            if (attrs[k] == null || attrs[k] === false) continue;
            if (k === "texte") e.textContent = attrs[k]; else if (k === "classe") e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
        }
        (enfants || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
        return e;
    }
    function lire(nom) {
        return fetch(racine + "contenu/" + nom, { cache: "no-cache" }).then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return /\.json$/.test(nom) ? r.json() : r.text();
        }).catch(function () { return null; });
    }
    function montrer(sel, oui) { $$(sel).forEach(function (e) { e.hidden = !oui; }); }
    function svgCoche() {
        var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.setAttribute("class", "ic"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor");
        s.setAttribute("stroke-width", "2"); s.setAttribute("aria-hidden", "true");
        var p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", "M20 6 9 17l-5-5"); s.appendChild(p);
        return s;
    }
    function jsonLd(objet) { var s = el("script", { type: "application/ld+json" }); s.textContent = JSON.stringify(objet); document.head.appendChild(s); }

    // ——— Empreinte : bouton Copier (le texte reste sélectionnable sans JavaScript)
    $$("[data-copier]").forEach(function (b) {
        if (!navigator.clipboard) return;
        b.hidden = false;
        b.addEventListener("click", function () {
            var cible = document.getElementById(b.getAttribute("data-copier"));
            navigator.clipboard.writeText(cible.textContent.trim()).then(function () {
                b.textContent = T.copie; b.classList.add("fait");
                setTimeout(function () { b.textContent = T.copier; b.classList.remove("fait"); }, 2000);
            });
        });
    });

    // ——— WhatsApp : bouton flottant, boutons d'inscription, boutons de pack
    var contact = null;
    function lienWa(texte) { return "https://wa.me/" + contact.whatsapp + "?text=" + encodeURIComponent(texte); }
    function messageWa(cle, pack) {
        var m = contact.messages || {};
        if (cle === "pack") return (tx(m.pack) || T.waPack).replace(/\{pack\}/g, pack || "");
        if (cle === "inscription") return tx(m.inscription) || T.waInscription;
        var parPage = { telechargement: T.waTelechargement, installation: T.waInstallation, documentation: T.waDocumentation, tarifs: T.waTarifs };
        return parPage[cle] || tx(m.defaut) || T.waDefaut;
    }
    function preparerContact(c) {
        contact = c && /^\d{8,15}$/.test(String(c.whatsapp || "").replace(/\D/g, "")) ? c : null;
        if (contact) contact.whatsapp = String(contact.whatsapp).replace(/\D/g, "");
        if (contact) {
            var bloc = $("[data-wa-flottant]"), lien = $("[data-wa-lien]"), horaires = $("[data-wa-horaires]");
            lien.href = lienWa(messageWa(document.documentElement.getAttribute("data-wa")));
            lien.setAttribute("aria-label", "WhatsApp" + (tx(c.horaires) ? " — " + tx(c.horaires) : ""));
            if (tx(c.horaires)) { horaires.textContent = tx(c.horaires); horaires.hidden = false; }
            bloc.hidden = false;
            $$("[data-inscription]").forEach(function (a) { a.href = lienWa(messageWa("inscription")); a.target = "_blank"; a.rel = "noopener"; a.hidden = false; });
        }
        // Page Contact : coordonnées publiées seulement si elles existent.
        var liste = $("[data-contact]");
        if (liste && c) {
            var lignes = [];
            if (contact) lignes.push([T.whatsapp, el("a", { href: lienWa(messageWa("defaut")), target: "_blank", rel: "noopener", dir: "ltr", texte: "+" + contact.whatsapp })]);
            if (tx(c.email)) lignes.push([T.email, el("a", { href: "mailto:" + tx(c.email), dir: "ltr", texte: tx(c.email) })]);
            if (tx(c.telephone)) lignes.push([T.telephone, el("a", { href: "tel:" + tx(c.telephone).replace(/[^\d+]/g, ""), dir: "ltr", texte: tx(c.telephone) })]);
            if (tx(c.horaires)) lignes.push([T.horaires, el("b", { texte: tx(c.horaires) })]);
            if (tx(c.adresse)) lignes.push([T.adresse, el("b", { texte: tx(c.adresse) })]);
            lignes.forEach(function (l) { liste.appendChild(el("li", null, [el("span", { texte: l[0] }), l[1]])); });
            if (lignes.length) { liste.hidden = false; montrer('[data-si-vide="contact"]', false); }
        }
    }

    // ——— Packs, comparatif et paiement
    function prix(n) { return Number(n).toLocaleString("fr-FR").replace(/ | /g, " "); }
    function rendrePacks(packs, paiement) {
        packs = (Array.isArray(packs) ? packs : []).filter(function (p) { return tx(p.nom) && typeof p.prix === "number" && p.prix > 0 && /^(HT|TTC)$/.test(p.taxe || ""); });
        if (!packs.length) { montrer('[data-si-vide="packs"]', true); return; }
        montrer('[data-si="packs"]', true); montrer('[data-section="packs"]', true); montrer('[data-si-vide="packs"]', false);
        $$("[data-packs]").forEach(function (cible) {
            var grille = el("div", { classe: "packs" });
            packs.forEach(function (p) {
                var inclus = (p.inclus || []).map(tx).filter(Boolean);
                var bouton = contact
                    ? el("a", { classe: "btn " + (p.recommande ? "btn-or" : "btn-sombre"), href: lienWa(messageWa("pack", tx(p.nom))), target: "_blank", rel: "noopener", texte: T.choisir })
                    : el("a", { classe: "btn " + (p.recommande ? "btn-or" : "btn-sombre"), href: racine + "contact.html", texte: T.choisir });
                grille.appendChild(el("article", { classe: "pack" + (p.recommande ? " recommande" : "") }, [
                    p.recommande ? el("span", { classe: "ruban", texte: T.recommande }) : null,
                    el("h3", { texte: tx(p.nom) }),
                    el("p", { classe: "prix" }, [prix(p.prix) + " " + (p.devise || "DA"), el("small", { texte: p.taxe })]),
                    el("p", { classe: "meta", texte: [T.duree[p.duree] || "", p.postes > 0 ? T.postes(p.postes) : ""].filter(Boolean).join(" · ") }),
                    inclus.length ? el("ul", { classe: "coches" }, inclus.map(function (i) { return el("li", null, [svgCoche(), el("span", { texte: i })]); })) : null,
                    tx(p.note) ? el("p", { classe: "meta", texte: tx(p.note) }) : null,
                    bouton
                ]));
            });
            cible.appendChild(grille);
            // Comparatif : une ligne par avantage cité dans au moins un pack.
            var avantages = [];
            packs.forEach(function (p) { (p.inclus || []).map(tx).filter(Boolean).forEach(function (i) { if (avantages.indexOf(i) < 0) avantages.push(i); }); });
            if (packs.length > 1 && avantages.length) {
                var tete = el("tr", null, [el("th", { scope: "col", texte: T.inclus })].concat(packs.map(function (p) { return el("th", { scope: "col", texte: tx(p.nom) }); })));
                var corps = avantages.map(function (a) {
                    return el("tr", null, [el("th", { scope: "row", texte: a })].concat(packs.map(function (p) {
                        var oui = (p.inclus || []).map(tx).indexOf(a) >= 0;
                        return el("td", { classe: oui ? "oui" : "non", texte: oui ? "✓" : "—", "aria-label": oui ? "oui" : "non" });
                    })));
                });
                cible.appendChild(el("div", { classe: "comparatif" }, [el("h3", { classe: "titre-section petit", texte: T.comparer }),
                    el("div", { classe: "tableau-defilant" }, [el("table", null, [el("thead", null, [tete]), el("tbody", null, corps)])])]));
            }
        });
        // Paiement
        paiement = paiement || {};
        var moyens = (paiement.moyens || []).filter(function (m) { return tx(m.nom); });
        var etapes = (paiement.etapes || []).map(tx).filter(Boolean);
        if (!moyens.length && !etapes.length && !tx(paiement.delaiLicence)) return;
        $$("[data-paiement]").forEach(function (cible) {
            var bloc = el("div", { classe: "paiement" });
            if (moyens.length) bloc.appendChild(el("div", null, [el("h3", { texte: T.moyens }), el("ul", { classe: "moyens" }, moyens.map(function (m) {
                return el("li", null, [el("b", { texte: tx(m.nom) }), tx(m.details) ? el("span", { texte: tx(m.details) }) : null]);
            }))]));
            if (etapes.length || tx(paiement.delaiLicence)) bloc.appendChild(el("div", null, [el("h3", { texte: T.etapes }),
                etapes.length ? el("ol", { classe: "etapes" }, etapes.map(function (e) { return el("li", { texte: e }); })) : null,
                tx(paiement.delaiLicence) ? el("p", { classe: "note", texte: tx(paiement.delaiLicence) }) : null]));
            cible.appendChild(bloc);
        });
    }

    // ——— Vidéos : façade, le lecteur YouTube (sans cookie) n'est chargé qu'au clic
    function iframeYoutube(id, titre) {
        return el("iframe", { src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0", title: titre,
            allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: "", referrerpolicy: "strict-origin-when-cross-origin" });
    }
    function rendreVideos(videos) {
        videos = (Array.isArray(videos) ? videos : []).filter(function (v) { return /^[\w-]{6,20}$/.test(v.youtube || "") && tx(v.titre); });
        $$("[data-videos]").forEach(function (cible) {
            var filtre = cible.getAttribute("data-videos");
            var liste = videos.filter(function (v) { return filtre === "tous" || v.type === filtre; });
            liste.forEach(function (v) {
                var b = el("button", { type: "button", classe: "video" }, [el("span", null, [tx(v.titre), el("small", { texte: (v.type === "demo" ? T.demo : T.tutoriel) + (v.duree ? " · " + v.duree : "") })])]);
                b.addEventListener("click", function () { b.replaceWith(el("div", { classe: "video" }, [iframeYoutube(v.youtube, tx(v.titre))])); }, { once: true });
                cible.appendChild(b);
            });
            var section = cible.closest("[data-section]");
            if (section && liste.length) section.hidden = false;
        });
        var demo = videos.filter(function (v) { return v.type === "demo"; })[0];
        if (!demo) return;
        $$("[data-demo]").forEach(function (b) {
            b.hidden = false;
            b.addEventListener("click", function () {
                var d = el("dialog", { classe: "dialogue-demo", "aria-label": tx(demo.titre) });
                var fermer = el("button", { type: "button", classe: "fermer", "aria-label": T.fermer, texte: "×" });
                d.appendChild(fermer); d.appendChild(el("div", { classe: "cadre" }, [iframeYoutube(demo.youtube, tx(demo.titre))]));
                fermer.addEventListener("click", function () { d.close(); });
                d.addEventListener("close", function () { d.remove(); });
                d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
                document.body.appendChild(d);
                if (d.showModal) d.showModal(); else d.setAttribute("open", "");
            });
        });
    }

    // ——— Avis : uniquement ceux dont le client a donné son accord
    function rendreAvis(avis) {
        var cible = $("[data-avis]");
        if (!cible) return;
        avis = (Array.isArray(avis) ? avis : []).filter(function (a) { return a.consentement && a.consentement.donne === true && tx(a.texte) && tx(a.nom); });
        avis.forEach(function (a) {
            var qui = [tx(a.titre), tx(a.ville)].filter(Boolean).join(" · ");
            cible.appendChild(el("figure", { classe: "avis" }, [el("blockquote", { texte: tx(a.texte) }),
                el("figcaption", null, [el("b", { texte: tx(a.nom) }), qui ? " — " + qui : ""])]));
        });
        if (avis.length) montrer('[data-section="avis"]', true);
    }

    // ——— Qui sommes-nous : Markdown simple (titres, paragraphes, listes, gras), rendu en nœuds texte
    function rendreEquipe(md) {
        var cible = $("[data-equipe]");
        if (!cible || !md || !md.trim()) return;
        var parties = md.split(/^\s*---ar---\s*$/m);
        var texte = (L === "ar" && parties[1] && parties[1].trim()) ? parties[1] : parties[0];
        if (!texte.trim()) return;
        var liste = null;
        function enLigne(t, parent) {
            t.split(/(\*\*[^*]+\*\*)/).forEach(function (m) {
                if (/^\*\*[^*]+\*\*$/.test(m)) parent.appendChild(el("strong", { texte: m.slice(2, -2) })); else if (m) parent.appendChild(document.createTextNode(m));
            });
            return parent;
        }
        texte.split(/\r?\n/).forEach(function (ligne) {
            var t = ligne.trim(), m;
            if ((m = /^[-*]\s+(.*)$/.exec(t))) { if (!liste) { liste = el("ul"); cible.appendChild(liste); } liste.appendChild(enLigne(m[1], el("li"))); return; }
            liste = null;
            if (!t) return;
            if ((m = /^#{2,4}\s+(.*)$/.exec(t))) cible.appendChild(el("h3", { texte: m[1] }));
            else cible.appendChild(enLigne(t, el("p")));
        });
        montrer('[data-section="equipe"]', true);
    }

    // ——— FAQ : accordéon natif (<details>) + données structurées FAQPage
    function rendreFaq(faq) {
        var cible = $("[data-faq]");
        if (!cible) return;
        faq = (Array.isArray(faq) ? faq : []).filter(function (q) { return tx(q.question) && tx(q.reponse); });
        if (!faq.length) return;
        faq.forEach(function (q) { cible.appendChild(el("details", null, [el("summary", { texte: tx(q.question) }), el("p", { classe: "reponse", texte: tx(q.reponse) })])); });
        montrer('[data-section="faq"]', true);
        jsonLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(function (q) {
            return { "@type": "Question", name: tx(q.question), acceptedAnswer: { "@type": "Answer", text: tx(q.reponse) } };
        }) });
    }

    // ——— Pages légales : lignes masquées tant que le champ est vide
    function rendreLegal(l) {
        if (!l || !$("[data-legal-redaction]")) return;
        $$("[data-legal]").forEach(function (e) {
            var cle = e.getAttribute("data-legal"), v = tx(l[cle]);
            if (cle === "derniereMiseAJour" && /^\d{4}-\d{2}-\d{2}$/.test(v)) v = v.split("-").reverse().join("/");
            e.textContent = v;
        });
        $$("[data-legal-ligne]").forEach(function (e) { e.hidden = !tx(l[e.getAttribute("data-legal-ligne")]); });
        $$("[data-legal-email]").forEach(function (a) { var v = tx(l[a.getAttribute("data-legal-email")]); a.textContent = v; a.href = "mailto:" + v; });
        var complet = !!tx(l.raisonSociale);
        montrer("[data-legal-editeur]", complet);
        montrer("[data-legal-redaction]", !complet);
        montrer("[data-legal-maj]", /^\d{4}-\d{2}-\d{2}$/.test(tx(l.derniereMiseAJour)));
    }

    // ——— Chargement : uniquement ce dont la page a besoin
    var besoins = { contact: true };
    if ($("[data-packs]") || $('[data-si="packs"]')) { besoins.packs = true; besoins.paiement = true; }
    if ($("[data-videos]") || $("[data-demo]")) besoins.videos = true;
    if ($("[data-avis]")) besoins.avis = true;
    if ($("[data-equipe]")) besoins.equipe = true;
    if ($("[data-faq]")) besoins.faq = true;
    if ($("[data-legal-redaction]")) besoins.legal = true;
    var noms = { contact: "contact.json", packs: "packs.json", paiement: "paiement.json", videos: "videos.json", avis: "avis.json", equipe: "equipe.md", faq: "faq.json", legal: "legal.json" };
    var cles = Object.keys(besoins);
    Promise.all(cles.map(function (k) { return lire(noms[k]); })).then(function (res) {
        var d = {};
        cles.forEach(function (k, i) { d[k] = res[i]; });
        preparerContact(d.contact);
        if (besoins.packs) rendrePacks(d.packs, d.paiement);
        if (besoins.videos) rendreVideos(d.videos);
        if (besoins.avis) rendreAvis(d.avis);
        if (besoins.equipe) rendreEquipe(d.equipe);
        if (besoins.faq) rendreFaq(d.faq);
        if (besoins.legal) rendreLegal(d.legal);
    });
})();
