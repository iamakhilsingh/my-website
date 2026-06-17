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
