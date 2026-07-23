const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "medtreatindia-new-site");
const output = path.join(root, "build");
const domain = "https://www.medtreatindia.com";

const excluded = new Set([
  ".DS_Store",
  "README.md",
  "_headers",
  "image-credits.md",
  "google-sheets-setup.md",
  "google-sheet-apps-script.js",
  "security-headers.md",
  "start-localhost.command"
]);

if (!fs.existsSync(source)) {
  throw new Error("Missing medtreatindia-new-site folder.");
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

fs.cpSync(source, output, {
  recursive: true,
  filter: (src) => !excluded.has(path.basename(src))
});

const pages = fs
  .readdirSync(output)
  .filter((file) => file.endsWith(".html"))
  .sort();

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function textFromMatch(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()) : "";
}

const searchIndex = pages.map((page) => {
  const html = fs.readFileSync(path.join(output, page), "utf8");
  const title = textFromMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
    .replace(/\s*[|–-]\s*MedTreat India.*$/i, "")
    .trim();
  const description = textFromMatch(
    html,
    /<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i
  );
  const heading = textFromMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);

  return {
    title: title || heading || "MedTreat India",
    description,
    url: page === "index.html" ? "index.html" : page,
    keywords: [title, heading, description, page.replace(/[-.]/g, " ")].filter(Boolean).join(" ")
  };
});

const hospitalsHtml = fs.readFileSync(path.join(output, "hospitals.html"), "utf8");
const hospitalSlider = hospitalsHtml.match(/<div class="hospital-slider"[^>]*>([\s\S]*?)<\/div>/i);
if (hospitalSlider) {
  const hospitalPattern = /<article[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/article>/gi;
  let hospitalMatch;

  while ((hospitalMatch = hospitalPattern.exec(hospitalSlider[1]))) {
    const hospitalName = decodeHtml(hospitalMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    const location = decodeHtml(hospitalMatch[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());

    searchIndex.push({
      title: hospitalName,
      description: `${location} hospital featured by MedTreat India.`,
      url: "hospitals.html",
      keywords: `${hospitalName} ${hospitalName.replace(/Hospitals?|Healthcare/gi, "")} hospital hospitals ${location}`
    });
  }
}

fs.writeFileSync(path.join(output, "search-index.json"), JSON.stringify(searchIndex));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((page) => {
    const cleanPath = page === "index.html" ? "/" : "/" + page.replace(/\.html$/, "");
    const loc = domain + cleanPath;
    return `  <url><loc>${loc}</loc></url>`;
  }),
  "</urlset>",
  ""
].join("\n");

fs.writeFileSync(path.join(output, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(output, "robots.txt"),
  ["User-agent: *", "Allow: /", `Sitemap: ${domain}/sitemap.xml`, ""].join("\n")
);

console.log(`Built MedTreat India static site into ${output}`);
