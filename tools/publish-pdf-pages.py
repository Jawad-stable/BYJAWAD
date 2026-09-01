#!/usr/bin/env python
"""Upload rendered WEBP pages to R2 and point the site content at them.

Reads the manifest written by tools/pdf-to-webp.py, uploads every page next to
the PDF it came from (<pdf folder>/pages/page-01.webp), then rewrites each item
with `pages`, `pdfUrl` and `pdfSize` so the site can show the document as an
image gallery instead of an inline PDF.

    set CLOUDFLARE_API_TOKEN=...
    python tools/publish-pdf-pages.py --manifest build/pdf-pages/manifest.json \
        --content build/live-content.json --out build/patched-content.json --apply

Without --apply nothing is written to R2 (dry run: patched JSON only).
"""
import argparse
import concurrent.futures
import json
import os
import urllib.parse
import urllib.request

ACCOUNT_ID = '013ebfc68c251974021671519f7175ad'
BUCKET = 'byjawad'
PUBLIC_BASE = 'https://pub-68a63d92f34640a18579a875a0e19690.r2.dev'
CONTENT_KEY = 'content/site-content.json'
API = 'https://api.cloudflare.com/client/v4'


def token():
    value = os.environ.get('CLOUDFLARE_API_TOKEN', '').strip()
    if not value:
        raise SystemExit('CLOUDFLARE_API_TOKEN is not set.')
    return value


def put_object(key, data, content_type):
    url = f'{API}/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(key, safe="")}'
    request = urllib.request.Request(url, data=data, method='PUT', headers={
        'Authorization': f'Bearer {token()}',
        'Content-Type': content_type
    })
    with urllib.request.urlopen(request) as response:
        payload = json.load(response)
    if not payload.get('success'):
        raise RuntimeError(f'{key}: {payload.get("errors")}')
    return key


def public_url(key):
    return f'{PUBLIC_BASE}/' + '/'.join(urllib.parse.quote(part) for part in key.split('/'))


def page_prefix(item):
    """Put pages in a `pages/` folder beside the PDF they were rendered from."""
    object_key = item.get('objectKey') or ''
    if object_key:
        return object_key.rsplit('/', 1)[0] + '/pages'
    slug = item['id'].replace('visual-id-', '')
    return f'uploads/{item.get("type", "visual-id")}/{slug}/pages'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--manifest', required=True)
    parser.add_argument('--content', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--apply', action='store_true', help='upload pages and the patched content to R2')
    parser.add_argument('--workers', type=int, default=8)
    args = parser.parse_args()

    manifest_dir = os.path.dirname(os.path.abspath(args.manifest))
    with open(args.manifest, encoding='utf-8') as handle:
        manifest = json.load(handle)
    with open(args.content, encoding='utf-8') as handle:
        content = json.load(handle)

    uploads = []
    for item in content.get('items', []):
        entry = manifest.get(item.get('id'))
        if not entry:
            continue
        prefix = page_prefix(item)
        pages = []
        for page in entry['pages']:
            key = f'{prefix}/{page["name"]}'
            uploads.append((key, os.path.join(manifest_dir, entry['dir'], page['name'])))
            pages.append({'url': public_url(key), 'w': page['width'], 'h': page['height']})
        item['pages'] = pages
        item['pdfUrl'] = entry['pdfUrl']
        item['pdfSize'] = entry['pdfBytes']

    print(f'{len(uploads)} page images across {len(manifest)} documents')

    if args.apply:
        def send(job):
            key, path = job
            with open(path, 'rb') as handle:
                return put_object(key, handle.read(), 'image/webp')

        done = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            for key in pool.map(send, uploads):
                done += 1
                print(f'  [{done}/{len(uploads)}] {key}', flush=True)

    content['updatedAt'] = content.get('updatedAt')
    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(content, handle, indent=2, ensure_ascii=False)
    print(f'patched content: {args.out}')

    if args.apply:
        import datetime
        content['updatedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
        body = json.dumps(content, indent=2, ensure_ascii=False).encode('utf-8')
        put_object(CONTENT_KEY, body, 'application/json; charset=utf-8')
        print(f'published {CONTENT_KEY} ({len(body)} bytes)')


if __name__ == '__main__':
    main()
