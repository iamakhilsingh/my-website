const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteRoot = path.join(root, "medtreatindia-new-site");
const manifest = require(path.join(siteRoot, "assets", "optimized", "image-manifest.json"));
const variantToSource = new Map();
const optimizedBaseToSource = new Map();

for (const [src, entry] of Object.entries(manifest)) {
  for (const variant of entry.variants) {
    variantToSource.set(variant.avif, src);
    variantToSource.set(variant.fallback, src);
  }
  const firstVariant = entry.variants[0];
  const base = firstVariant.fallback.replace(/-\d+\.[^.]+$/, "");
  optimizedBaseToSource.set(base, src);
}

const htmlFiles = fs
  .readdirSync(siteRoot)
  .filter((file) => file.endsWith(".html"))
  .sort();

function parseAttrs(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ` ${key}="${String(value).replace(/"/g, "&quot;")}"`)
    .join("");
}

function srcset(variants, field) {
  return variants.map((variant) => `${variant[field]} ${variant.width}w`).join(", ");
}

function largestVariant(entry) {
  return entry.variants[entry.variants.length - 1];
}

function defaultSizes(src, attrs) {
  if (attrs.class && attrs.class.includes("whatsapp-icon")) return "32px";
  if (src.includes("/logos/")) return "180px";
  if (src.includes("/brand/")) return "(max-width: 720px) 180px, 260px";
  if (src.includes("/hospitals/")) return "(max-width: 760px) 86vw, 360px";
  if (src.includes("/testimonials/")) return "(max-width: 760px) 90vw, 520px";
  if (src.includes("/blog/")) return "(max-width: 760px) 92vw, 580px";
  if (src.includes("/images/home-care-consultation")) return "100vw";
  if (src.includes("/images/max-hospital-night")) return "(max-width: 760px) 92vw, 1100px";
  return "(max-width: 760px) 92vw, 520px";
}

function shouldUsePicture(src) {
  return !src.includes("/brand/") && !src.includes("/logos/");
}

function isFooterImage(html, index) {
  const before = html.slice(0, index);
  return before.lastIndexOf("<footer") > before.lastIndexOf("</footer>");
}

function isHeaderImage(html, index) {
  const before = html.slice(0, index);
  return before.lastIndexOf("<header") > before.lastIndexOf("</header>");
}

function isHeroImage(file, src) {
  return file === "index.html" && src === "assets/images/home-care-consultation.png";
}

function imageAttrs(file, html, index, tag, src, entry) {
  const attrs = parseAttrs(tag);
  const chosen = largestVariant(entry);

  attrs.src = chosen.fallback;
  attrs.width = String(src.includes("whatsapp-icon") ? chosen.width : entry.width);
  attrs.height = String(src.includes("whatsapp-icon") ? chosen.height : entry.height);
  attrs.decoding = "async";

  if (isHeroImage(file, src)) {
    attrs.loading = "eager";
    attrs.fetchpriority = "high";
  } else if (isHeaderImage(html, index)) {
    attrs.loading = "eager";
  } else if (isFooterImage(html, index) || attrs.class?.includes("whatsapp-icon")) {
    attrs.loading = "lazy";
  } else if (!attrs.loading && !attrs.fetchpriority) {
    attrs.loading = "lazy";
  }

  attrs.sizes = defaultSizes(src, attrs);
  attrs.srcset = srcset(entry.variants, "fallback");
  return attrs;
}

function pictureMarkup(entry, attrs) {
  const avifSource = `<source type="image/avif" srcset="${srcset(entry.variants, "avif")}" sizes="${attrs.sizes}" />`;
  return `<picture>${avifSource}<img${attrsToString(attrs)} /></picture>`;
}

function preloadMarkup(entry) {
  const avif = largestVariant(entry).avif;
  return [
    `<link rel="preload" as="image" href="${avif}"`,
    ` imagesrcset="${srcset(entry.variants, "avif")}"`,
    ` imagesizes="100vw" type="image/avif" fetchpriority="high" />`
  ].join("");
}

function sourceKeyFor(src) {
  if (manifest[src]) return src;
  if (variantToSource.has(src)) return variantToSource.get(src);
  for (const [base, source] of optimizedBaseToSource.entries()) {
    if (src.startsWith(base + "-")) return source;
  }
  return "";
}

function addFormScript(html) {
  if (!html.includes("data-consult-form")) return html;
  if (html.includes('src="forms.js"')) return html;
  return html.replace(
    /<script src="script\.js" defer><\/script>/,
    '<script src="script.js" defer></script><script src="forms.js" defer></script>'
  );
}

function normalizeFooterLogoSource(html) {
  return html.replace(/(<footer[\s\S]*?<\/footer>)/g, (footer) => {
    return footer.replaceAll(
      'src="assets/brand/medtreatindia-logo-wordmark-transparent.png"',
      'src="assets/brand/medtreatindia-logo-wordmark-dark.png"'
    );
  });
}

for (const file of htmlFiles) {
  const filePath = path.join(siteRoot, file);
  let html = fs.readFileSync(filePath, "utf8");
  html = normalizeFooterLogoSource(html);

  html = html.replace(/<picture>([\s\S]*?)<\/picture>/g, (match) => {
    const img = match.match(/<img\b[^>]*>/);
    return img ? img[0] : match;
  });

  html = html.replace(/<img\b[^>]*>/g, (tag, index) => {
    const attrs = parseAttrs(tag);
    const src = attrs.src;
    if (!src || src.startsWith("http") || src.startsWith("data:")) {
      if (src && src.includes("img.youtube.com")) {
        attrs.loading = attrs.loading || "lazy";
        attrs.decoding = attrs.decoding || "async";
        attrs.width = attrs.width || "480";
        attrs.height = attrs.height || "360";
        return `<img${attrsToString(attrs)} />`;
      }
      return tag;
    }

    const sourceKey = sourceKeyFor(src);
    const entry = manifest[sourceKey];
    if (!entry) return tag;
    const nextAttrs = imageAttrs(file, html, index, tag, sourceKey, entry);
    if (!shouldUsePicture(sourceKey)) {
      return `<img${attrsToString(nextAttrs)} />`;
    }
    return pictureMarkup(entry, nextAttrs);
  });

  if (file === "index.html") {
    const hero = manifest["assets/images/home-care-consultation.png"];
    if (html.includes('rel="preload" as="image"')) {
      html = html.replace(/<link rel="preload" as="image"[^>]*\/>/, preloadMarkup(hero));
    } else {
      html = html.replace(
        '<link rel="icon" href="assets/brand/medtreatindia-logo-icon.png" />',
        `<link rel="icon" href="assets/brand/medtreatindia-logo-icon.png" />\n    ${preloadMarkup(hero)}`
      );
    }
  }

  html = addFormScript(html);
  fs.writeFileSync(filePath, html);
}

console.log(`Updated performance markup in ${htmlFiles.length} HTML files.`);
