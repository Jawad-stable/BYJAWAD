#!/usr/bin/env python
"""Point a document at a folder of ready-made page images.

tools/pdf-to-webp.py renders pages out of the PDF itself, which is fine until a
PDF the renderer cannot decode correctly (the UNI-Led booklet's CMYK artwork came
out with inverted photos and shifted flats). When the pages already exist as
correct images -- exported from the design tool -- this uploads that folder
instead and repoints the item at it.

    set CLOUDFLARE_API_TOKEN=...
    python tools/publish-page-images.py --item visual-id-uni-led-booklet \
        --dir build/uni-led-pages --prefix uploads/visual-id/uni-led/pages-v2 --apply

Files are uploaded in sorted filename order, so name them page-01.webp,
page-02.webp ... Without --apply nothing is written to R2 (dry run: patched JSON
only). Uploading to a fresh prefix rather than overwriting the old page keys
keeps stale copies out of the CDN cache.

Requires: pillow.
"""
import argparse
import concurrent.futures
import datetime
import json
import os
import urllib.parse
import urllib.request

from PIL import Image

ACCOUNT_ID = '013ebfc68c251974021671519f7175ad'
BUCKET = 'byjawad'
PUBLIC_BASE = 'https://pub-68a63d92f34640a18579a875a0e19690.r2.dev'
CONTENT_KEY = 'content/site-content.json'
API = 'https://api.cloudflare.com/client/v4'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36'}
IMAGE_TYPES = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}


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


def load_content(source):
    """Read the live content JSON straight off R2, or a local copy when given one."""
    if source.startswith('http'):
        with urllib.request.urlopen(urllib.request.Request(source, headers=UA)) as response:
            return json.load(response)
    with open(source, encoding='utf-8') as handle:
        return json.load(handle)


def collect(directory):
    files = []
    for name in sorted(os.listdir(directory)):
        extension = os.path.splitext(name)[1].lower()
        if extension in IMAGE_TYPES:
            files.append((name, os.path.join(directory, name), IMAGE_TYPES[extension]))
    if not files:
        raise SystemExit(f'no page images in {directory}')
    return files


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--item', required=True, help='content item id to repoint')
    parser.add_argument('--dir', required=True, help='folder of page images, in filename order')
    parser.add_argument('--prefix', required=True, help='R2 key prefix to upload the pages under')
    parser.add_argument('--content', default=f'{PUBLIC_BASE}/{CONTENT_KEY}')
    parser.add_argument('--out', default='build/patched-content.json')
    parser.add_argument('--apply', action='store_true', help='upload pages and the patched content to R2')
    parser.add_argument('--workers', type=int, default=6)
    args = parser.parse_args()

    content = load_content(args.content)
    items = content.get('items', [])
    item = next((entry for entry in items if entry.get('id') == args.item), None)
    if item is None:
        raise SystemExit(f'no item with id {args.item} (have: {", ".join(sorted(e.get("id", "") for e in items))})')

    prefix = args.prefix.strip('/')
    uploads = []
    pages = []
    for name, path, content_type in collect(args.dir):
        with Image.open(path) as image:
            width, height = image.size
        key = f'{prefix}/{name}'
        uploads.append((key, path, content_type))
        pages.append({'url': public_url(key), 'w': width, 'h': height})

    previous = item.get('pages') or []
    print(f'{args.item}: {len(previous)} page(s) -> {len(pages)} page(s), '
          f'{sum(os.path.getsize(path) for _, path, _ in uploads) / 1e6:.1f} MB')
    item['pages'] = pages

    if args.apply:
        def send(job):
            key, path, content_type = job
            with open(path, 'rb') as handle:
                return put_object(key, handle.read(), content_type)

        done = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            for key in pool.map(send, uploads):
                done += 1
                print(f'  [{done}/{len(uploads)}] {key}', flush=True)

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(content, handle, indent=2, ensure_ascii=False)
    print(f'patched content: {args.out}')

    if args.apply:
        content['updatedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
        body = json.dumps(content, indent=2, ensure_ascii=False).encode('utf-8')
        put_object(CONTENT_KEY, body, 'application/json; charset=utf-8')
        print(f'published {CONTENT_KEY} ({len(body)} bytes)')
    else:
        print('dry run — pass --apply to upload')


if __name__ == '__main__':
    main()
