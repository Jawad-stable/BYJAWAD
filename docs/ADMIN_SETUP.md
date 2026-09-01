# Portfolio Admin Setup

This site does not hard-code the Cloudflare R2 URL or admin token.

1. Deploy `cloudflare-worker.js` with an R2 binding named `CONTENT_BUCKET`.
2. Set Worker vars:
   - `PUBLIC_ASSET_BASE_URL`: your public R2 asset base URL.
   - `ALLOWED_ORIGIN`: your website origin.
   - `CONTENT_KEY`: optional, defaults to `content/site-content.json`.
3. Set the secret:
   - `wrangler secret put ADMIN_TOKEN`
4. Put the Worker URL in `site-config.js`:
   - `apiBaseUrl: 'https://your-worker.your-subdomain.workers.dev'`
5. Open `admin.html`, enter the same API URL and token, then upload and save content.

The public pages call `GET /api/content`. The admin panel uses the protected `/api/admin/*` routes.

## Documents are shown as images, not as PDFs

A PDF in a browser tab is a download prompt on most phones, and these brand books
are big (one booklet was 291 MB). So every document is stored twice:

- `pages`: an ordered list of WEBP page images (`{ url, w, h }`) — this is what the
  popup shows, one page under the next, loading only what the reader scrolls to.
- `pdfUrl` / `pdfSize`: the original PDF, offered as a labelled download link.

Uploading a PDF through `admin.html` does this automatically: the page renders it
with pdf.js and uploads the page images alongside the PDF. If that step fails the
PDF still uploads and the item falls back to a plain link.

To (re)build pages for documents already in the content JSON, use the scripts in
`tools/` — they need `pymupdf` and `pillow`:

```
python tools/pdf-to-webp.py --content build/live-content.json --out build/pdf-pages
set CLOUDFLARE_API_TOKEN=...
python tools/publish-pdf-pages.py --manifest build/pdf-pages/manifest.json \
    --content build/live-content.json --out build/patched-content.json --apply
```

`--apply` uploads the images to R2 and republishes `content/site-content.json`;
leave it off for a dry run.
