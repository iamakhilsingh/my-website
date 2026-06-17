# MedTreat India Security Audit

Date: 2026-06-17  
Repository: `/Users/akhilsingh/my-website`  
Reviewer: Codex adversarial follow-up review

## Stack and deployment detection

- Frontend delivery: static HTML, CSS and JavaScript from `/Users/akhilsingh/my-website/medtreatindia-new-site`
- Build method: `/Users/akhilsingh/my-website/scripts/build-static-site.js`
- Hosting configuration detected in repo: Vercel via `/Users/akhilsingh/my-website/vercel.json`
- Form-processing method: public Google Apps Script web app writing to Google Sheets, configured in `/Users/akhilsingh/my-website/medtreatindia-new-site/google-sheet-apps-script.js`
- Third-party integrations actually present:
  - WhatsApp deep links
  - Google Apps Script / Google Sheets
  - YouTube nocookie embed and `img.youtube.com` thumbnails
  - Google Translate navigation flow
- Protected accounts or file uploads: none found in this repository

## Findings

| Severity | Finding | Affected file and line | Impact | Recommended fix | Fixed | How the fix was tested |
| --- | --- | --- | --- | --- | --- | --- |
| High | Sensitive enquiry details were being prepared for consumer-channel sharing, increasing privacy risk if users continued in WhatsApp. | `/Users/akhilsingh/my-website/medtreatindia-new-site/script.js:448-482` | Patient contact and treatment details could be over-shared through a consumer messaging URL instead of staying minimized at first contact. | Minimize the WhatsApp payload to only the fields needed to continue the conversation and keep the longer message out of the link. | Yes | Reviewed `formMessage()` and `formPayload()` logic, then verified by code scan that only name, country and treatment remain in the prepared WhatsApp message. |
| High | Form submissions lacked strong authoritative validation at the processor and were exposed to spreadsheet formula injection and phone parsing problems. | `/Users/akhilsingh/my-website/medtreatindia-new-site/google-sheet-apps-script.js:28-215` | Invalid submissions, formula-like values, and malformed phone data could land in Sheets or break downstream review. | Validate every field in Apps Script, split phone data into code/local/full fields, store cells as text, and neutralize formula-leading characters. | Yes | Reviewed `validatePayload()`, `asSheetText()`, text formatting, duplicate control, and legacy phone repair logic. |
| High | Initial enquiry forms were missing hardening controls required for medical-travel lead collection. | `/Users/akhilsingh/my-website/medtreatindia-new-site/index.html:114-127`, `/Users/akhilsingh/my-website/medtreatindia-new-site/contact.html:18`, `/Users/akhilsingh/my-website/medtreatindia-new-site/script.js:529-744` | Visitors could submit without consent, with malformed phone or email values, or too quickly for basic abuse filtering. | Add mandatory consent, a sensitive-data warning, honeypot field, start-time field, client validation, duplicate cooldown, and generic status messaging. | Yes | Verified both forms include consent, honeypot and timing fields; reran code scans for form hooks and validation handlers. |
| High | Security headers and clickjacking protections were incomplete for production delivery. | `/Users/akhilsingh/my-website/vercel.json:24-64` | The live site would be easier to frame, sniff, or load with looser default browser policies. | Add CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, and HSTS. | Yes | Confirmed headers are present in `vercel.json` and limited to the actual deployment config instead of mixed header files. |
| Medium | Source-page logging could reveal local file paths or overly specific URLs in the lead sheet. | `/Users/akhilsingh/my-website/medtreatindia-new-site/script.js:438-446` | Internal local preview paths or unsanitized URLs could leak into operational records. | Normalize to a safe path-only value and strip `.html` where appropriate. | Yes | Reviewed `safeSourcePage()` logic and confirmed payloads now use clean path values only. |
| Medium | Build output risked exposing internal operational or setup files. | `/Users/akhilsingh/my-website/scripts/build-static-site.js:9-20` | Setup notes, Apps Script source, and security notes could be published accidentally with the site. | Exclude operational files from the static build. | Yes | Rebuilt the site and confirmed `google-sheet-apps-script.js`, setup markdown files, and launch helpers are absent from `/Users/akhilsingh/my-website/build`. |
| Medium | CSP enforcement would have broken because inline style attributes and JS-applied style properties remained in the homepage animation and roadmap markup. | `/Users/akhilsingh/my-website/medtreatindia-new-site/index.html:169-199`, `/Users/akhilsingh/my-website/medtreatindia-new-site/script.js:922-977`, `/Users/akhilsingh/my-website/medtreatindia-new-site/styles.css:36-49` | A strict `style-src 'self'` policy could block the reveal animation and roadmap rendering, leading to security-policy breakage or pressure to weaken CSP. | Remove inline style usage and replace it with CSS classes. | Yes | Re-scanned the site for `style=`, `setProperty(` and other inline style patterns; no matches remain in the shipped site files. |
| Medium | Canonical host drift between bare and `www` could leave Google with duplicate live URLs and weaker canonical signals. | `/Users/akhilsingh/my-website/vercel.json:6-22` | Search engines could keep treating `medtreatindia.com` and `www.medtreatindia.com` as competing variants. | Add a permanent host redirect to the chosen canonical domain. | Yes | Confirmed the Vercel redirect rule now routes bare-domain requests to `https://www.medtreatindia.com/:path*`. |
| Medium | HSTS asserted subdomain coverage that was not verified during this review. | `/Users/akhilsingh/my-website/vercel.json:60-62` | If unverified subdomains exist, forced HTTPS on all of them could cause avoidable access failures. | Keep long HSTS for the main site, but remove `includeSubDomains` until subdomains are verified. | Yes | Reviewed the final header config and confirmed HSTS is now `max-age=31536000` only. |
| Low | The static-site plus public Apps Script design still relies on `fetch(..., { mode: "no-cors" })`, so the browser cannot authoritatively distinguish an opaque success from a server-side rejection. | `/Users/akhilsingh/my-website/medtreatindia-new-site/script.js:503-517` | The frontend cannot fully prove that the remote processor accepted a submission before continuing to WhatsApp. | Move form handling to a first-party backend or another endpoint that can return verifiable CORS responses. | No | Confirmed the current design still uses `mode: "no-cors"`; documented as an architectural limitation rather than a hidden bug. |
| Low | WhatsApp and ordinary email remain consumer communication channels, not secure medical-record portals. | `/Users/akhilsingh/my-website/medtreatindia-new-site/privacy-policy.html:31-43`, `/Users/akhilsingh/my-website/medtreatindia-new-site/security.html:58-63` | Users might otherwise assume those channels are appropriate for highly sensitive documents. | Keep explicit warnings and route sensitive documents to a separate consent-based process. | Partially | Confirmed the warning language is present on the form, privacy page and security page. |
| Informational | No public file-upload mechanism was found in this repository. | Repository-wide review | The current attack surface does not include file-upload abuse, malware upload, or public object enumeration. | Keep uploads disabled until private storage and access controls exist. | Not needed | Reviewed the repository for file upload fields, multipart handling and storage code; none found. |
| Informational | No committed secrets, exposed `.env` files, database files, backup dumps, or private key files were found in the working tree. | Repository-wide review and git object-name scan | No obvious secret exposure was detected in the reviewed repository state. | Keep secrets out of frontend code and continue using environment or platform secret storage for any future backend. | Not needed | Searched the working tree and git object names for `.env`, key, secret, credential and backup patterns. |

## Adversarial review outcome

- Remaining confirmed Critical issues: 0
- Remaining confirmed High issues: 0
- Remaining confirmed Medium issues: 0
- Remaining Low / architectural limitations:
  - public Apps Script + `no-cors` opaque browser response model
  - consumer-channel limitations of WhatsApp and ordinary email

## Tests and verification run

- `npm run build`
- `CI=true npm test -- --watchAll=false`
- `npm ls --depth=0`
- Working-tree scan for unsafe DOM patterns:
  - `style=`
  - `setProperty(`
  - `innerHTML`
  - `outerHTML`
  - `insertAdjacentHTML`
  - `document.write`
  - `eval(`
  - `new Function`
- Canonical tag coverage check across all HTML pages
- Form-hardening field presence check across all pages using `data-consult-form`
- Build artifact check confirming internal setup files are excluded
- Sitemap spot-check for key URLs in `/Users/akhilsingh/my-website/build/sitemap.xml`
- Working-tree and git object-name scan for likely secrets and backup artifacts

## Test results

- Build: passed
- React test suite: passed
- Dependency tree listing: passed
- `npm audit --omit=dev`: could not complete because outbound registry access is blocked in this environment (`getaddrinfo ENOTFOUND registry.npmjs.org`)
- Unsafe DOM pattern scan in shipped site files: no matches after the CSP cleanup
- Canonical coverage: 32 HTML pages with canonical tags, 0 missing
- Build exclusions: confirmed operational setup files are not published

## Notes and limitations

- I was not able to create the requested `security-hardening` branch in this environment because Git ref updates are blocked here; the review work remains in the repository working tree on `main`.
- I did not deploy to production.
- I did not attack or probe any third-party websites.
