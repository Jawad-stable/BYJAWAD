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
