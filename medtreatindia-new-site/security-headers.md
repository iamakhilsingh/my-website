# Security Headers Guide

Use HTTPS for the domain and enable these headers at the hosting/CDN layer.

```http
Strict-Transport-Security: max-age=60; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; frame-src https://www.youtube-nocookie.com https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

Notes:

- The website is static and does not store consultation form data.
- Form submissions open a WhatsApp message draft that the visitor can review before sending.
- Do not add analytics, chat widgets, pixels, or embedded maps unless their scripts are also reflected in the Content Security Policy. The current policy allows the approved YouTube testimonial embed.
- If a hosting platform supports per-site headers, copy the same values into that platform instead of editing the HTML.
- Keep the company WhatsApp number out of visible page text. If it changes, update only `script.js`.
