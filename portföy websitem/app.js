(function () {
  "use strict";

  const form = document.getElementById("portfolio-form");
  const projectsContainer = document.getElementById("projects-container");
  const template = document.getElementById("project-row-template");
  const addProjectBtn = document.getElementById("add-project");
  const previewBtn = document.getElementById("preview-btn");
  const submitBtn = document.getElementById("submit-btn");

  const GOOGLE_FONTS = {
    Inter: "Inter:wght@400;600;700",
    Roboto: "Roboto:wght@400;500;700",
    Poppins: "Poppins:wght@400;600;700",
    Montserrat: "Montserrat:wght@400;600;700",
    "Playfair Display": "Playfair+Display:wght@400;600;700",
    Merriweather: "Merriweather:wght@400;700",
    "DM Sans": "DM+Sans:wght@400;600;700",
  };

  function escapeHtml(s) {
    if (s == null || s === "") return "";
    const d = document.createElement("div");
    d.textContent = String(s);
    return d.innerHTML;
  }

  function slugify(name) {
    return String(name || "portfolyo")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "portfolyo";
  }

  function parseSkills(raw) {
    if (!raw || !String(raw).trim()) return [];
    return String(raw)
      .split(/[\n,]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Fotoğraf okunamadı."));
      reader.readAsDataURL(file);
    });
  }

  function collectProjects() {
    const rows = projectsContainer.querySelectorAll(".project-row");
    const list = [];
    rows.forEach((row) => {
      const title = row.querySelector(".proj-title")?.value?.trim() || "";
      const desc = row.querySelector(".proj-desc")?.value?.trim() || "";
      const link = row.querySelector(".proj-link")?.value?.trim() || "";
      if (title || desc || link) list.push({ title, desc, link });
    });
    return list;
  }

  async function getFormData() {
    const fd = new FormData(form);
    const rounded = fd.get("rounded") === "on";
    let photoDataUrl = "";
    const photoFile = fd.get("photoFile");
    if (photoFile instanceof File && photoFile.size > 0) {
      photoDataUrl = await fileToDataUrl(photoFile);
    }
    return {
      fullName: (fd.get("fullName") || "").trim(),
      jobTitle: (fd.get("jobTitle") || "").trim(),
      tagline: (fd.get("tagline") || "").trim(),
      bio: (fd.get("bio") || "").trim(),
      photoUrl: (fd.get("photoUrl") || "").trim(),
      photoDataUrl,
      email: (fd.get("email") || "").trim(),
      phone: (fd.get("phone") || "").trim(),
      location: (fd.get("location") || "").trim(),
      github: (fd.get("github") || "").trim(),
      linkedin: (fd.get("linkedin") || "").trim(),
      twitter: (fd.get("twitter") || "").trim(),
      website: (fd.get("website") || "").trim(),
      skills: parseSkills(fd.get("skills")),
      projects: collectProjects(),
      colorPrimary: fd.get("colorPrimary") || "#6366f1",
      colorAccent: fd.get("colorAccent") || "#22d3ee",
      colorBg: fd.get("colorBg") || "#0f172a",
      colorText: fd.get("colorText") || "#f1f5f9",
      fontFamily: fd.get("fontFamily") || "Inter",
      rounded,
    };
  }

  function fontLinkTag(fontFamily) {
    const spec = GOOGLE_FONTS[fontFamily];
    if (!spec) return "";
    const href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
    return `<link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${href}" rel="stylesheet" />`;
  }

  function cssFontStack(fontFamily) {
    if (fontFamily === "system-ui") {
      return 'system-ui, "Segoe UI", Roboto, sans-serif';
    }
    return `"${fontFamily}", system-ui, sans-serif`;
  }

  function buildPortfolioHTML(d) {
    const radius = d.rounded ? "14px" : "4px";
    const radiusSm = d.rounded ? "10px" : "3px";
    const skillsHtml = d.skills
      .map(
        (s) =>
          `<span class="skill">${escapeHtml(s)}</span>`
      )
      .join("");

    const projectsHtml = d.projects
      .map((p) => {
        const title = escapeHtml(p.title || "Proje");
        const desc = escapeHtml(p.desc);
        const hasLink = p.link && /^https?:\/\//i.test(p.link);
        const inner = hasLink
          ? `<a class="project-card" href="${escapeHtml(p.link)}" target="_blank" rel="noopener noreferrer"><h3>${title}</h3><p>${desc || "—"}</p><span class="project-link">Siteyi aç →</span></a>`
          : `<div class="project-card project-card-static"><h3>${title}</h3><p>${desc || "—"}</p></div>`;
        return `<div class="project-wrap">${inner}</div>`;
      })
      .join("");

    const social = [];
    if (d.github) social.push({ href: d.github, label: "GitHub" });
    if (d.linkedin) social.push({ href: d.linkedin, label: "LinkedIn" });
    if (d.twitter) social.push({ href: d.twitter, label: "X" });
    if (d.website) social.push({ href: d.website, label: "Web" });

    const socialHtml = social
      .map(
        (x) =>
          `<a href="${escapeHtml(x.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(x.label)}</a>`
      )
      .join("");

    const contactBits = [];
    if (d.email)
      contactBits.push(
        `<a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a>`
      );
    if (d.phone)
      contactBits.push(`<span>${escapeHtml(d.phone)}</span>`);
    if (d.location)
      contactBits.push(`<span>${escapeHtml(d.location)}</span>`);

    const photoSrc = d.photoDataUrl || d.photoUrl;
    const hasPhoto = Boolean(photoSrc) && (/^data:image\//i.test(photoSrc) || /^https?:\/\//i.test(photoSrc));
    const photoBlock = hasPhoto
      ? `<div class="hero-photo"><img src="${escapeHtml(photoSrc)}" alt="" width="120" height="120" loading="lazy" /></div>`
      : "";

    return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(d.fullName)} — Portföy</title>
  ${fontLinkTag(d.fontFamily)}
  <style>
    :root {
      --primary: ${d.colorPrimary};
      --accent: ${d.colorAccent};
      --bg: ${d.colorBg};
      --text: ${d.colorText};
      --muted: color-mix(in srgb, var(--text) 65%, transparent);
      --radius: ${radius};
      --radius-sm: ${radiusSm};
      --font: ${cssFontStack(d.fontFamily)};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--accent); }
    .wrap { max-width: 900px; margin: 0 auto; padding: 3rem 1.25rem 4rem; }
    header.hero {
      display: grid;
      gap: 1rem;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
    }
    @media (min-width: 640px) {
      header.hero.has-photo { grid-template-columns: auto 1fr; align-items: center; gap: 2rem; }
    }
    .hero-photo img {
      width: 120px; height: 120px; object-fit: cover;
      border-radius: ${d.rounded ? "50%" : "4px"};
      border: 3px solid color-mix(in srgb, var(--primary) 40%, transparent);
    }
    h1 { margin: 0; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; letter-spacing: -0.03em; }
    .job { margin: 0.25rem 0 0; color: var(--primary); font-weight: 600; font-size: 1.05rem; }
    .tagline { margin: 0.5rem 0 0; color: var(--muted); font-size: 1.1rem; }
    section { margin-bottom: 2.75rem; }
    section h2 {
      margin: 0 0 1rem;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.02em;
    }
    .bio { margin: 0; white-space: pre-wrap; }
    .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill {
      padding: 0.35rem 0.75rem;
      background: color-mix(in srgb, var(--primary) 18%, transparent);
      color: var(--text);
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      font-weight: 500;
    }
    .projects { display: grid; gap: 1rem; }
    @media (min-width: 560px) { .projects { grid-template-columns: 1fr 1fr; } }
    .project-wrap { min-width: 0; }
    .project-card {
      display: block;
      height: 100%;
      padding: 1.25rem;
      background: color-mix(in srgb, var(--text) 6%, transparent);
      border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
      border-radius: var(--radius);
      text-decoration: none;
      color: inherit;
      transition: border-color 0.15s, transform 0.15s;
    }
    .project-card:hover { border-color: color-mix(in srgb, var(--primary) 50%, transparent); transform: translateY(-2px); }
    .project-card h3 { margin: 0 0 0.5rem; font-size: 1.05rem; }
    .project-card p { margin: 0; color: var(--muted); font-size: 0.95rem; }
    .project-link { display: inline-block; margin-top: 0.75rem; font-size: 0.85rem; font-weight: 600; color: var(--accent); }
    .project-card-static { cursor: default; }
    .project-card-static:hover { transform: none; }
    footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
    }
    .contact-line { display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; align-items: center; color: var(--muted); font-size: 0.95rem; }
    .social { display: flex; flex-wrap: wrap; gap: 0.75rem 1rem; margin-top: 1rem; }
    .social a { font-weight: 600; text-decoration: none; }
    .social a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="hero${photoBlock ? " has-photo" : ""}">
      ${photoBlock}
      <div>
        <h1>${escapeHtml(d.fullName)}</h1>
        ${d.jobTitle ? `<p class="job">${escapeHtml(d.jobTitle)}</p>` : ""}
        ${d.tagline ? `<p class="tagline">${escapeHtml(d.tagline)}</p>` : ""}
      </div>
    </header>

    <section aria-labelledby="about">
      <h2 id="about">Hakkımda</h2>
      <p class="bio">${escapeHtml(d.bio)}</p>
    </section>

    ${
      skillsHtml
        ? `<section aria-labelledby="skills"><h2 id="skills">Yetenekler</h2><div class="skills">${skillsHtml}</div></section>`
        : ""
    }

    ${
      projectsHtml
        ? `<section aria-labelledby="projects"><h2 id="projects">Projeler</h2><div class="projects">${projectsHtml}</div></section>`
        : ""
    }

    <footer>
      <h2 style="margin-top:0">İletişim</h2>
      <div class="contact-line">${contactBits.join(" · ") || "—"}</div>
      ${
        socialHtml
          ? `<nav class="social" aria-label="Sosyal bağlantılar">${socialHtml}</nav>`
          : ""
      }
    </footer>
  </div>
</body>
</html>`;
  }

  function addProjectRow() {
    const node = template.content.cloneNode(true);
    const row = node.querySelector(".project-row");
    const idx = projectsContainer.children.length + 1;
    row.querySelector(".project-row-title").textContent = "Proje " + idx;
    row.querySelector(".btn-remove").addEventListener("click", () => {
      row.remove();
      renumberProjects();
    });
    projectsContainer.appendChild(node);
  }

  function renumberProjects() {
    projectsContainer.querySelectorAll(".project-row").forEach((row, i) => {
      row.querySelector(".project-row-title").textContent = "Proje " + (i + 1);
    });
  }

  addProjectBtn.addEventListener("click", () => addProjectRow());

  function downloadBlob(filename, text) {
    const blob = new Blob([text], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function openPreview(html) {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = await getFormData();
    const html = buildPortfolioHTML(d);
    const name = slugify(d.fullName);
    downloadBlob(`portfoy-${name}.html`, html);
  });

  previewBtn.addEventListener("click", async () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = await getFormData();
    openPreview(buildPortfolioHTML(d));
  });

  addProjectRow();
})();