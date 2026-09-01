#!/usr/bin/env python
"""Render every PDF referenced by the site content into lightweight WEBP pages.

Browsers cannot reliably preview a PDF inline (mobile Safari/Chrome download it
instead), and the source files here run to hundreds of megabytes. Rendering each
page to WEBP up front lets the popup show the document as a normal image gallery.

    python tools/pdf-to-webp.py --content build/live-content.json --out build/pdf-pages

Outputs build/pdf-pages/<item-id>/page-01.webp ... plus a manifest.json that
tools/publish-pdf-pages.py consumes.

Requires: pymupdf, pillow.
"""
import argparse
import io
import json
import os
import urllib.request

import fitz  # PyMuPDF
from PIL import Image

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36'}


def is_pdf(url):
    return str(url or '').lower().split('?')[0].split('#')[0].endswith('.pdf')


def download(url, cache_dir):
    os.makedirs(cache_dir, exist_ok=True)
    path = os.path.join(cache_dir, url.rsplit('/', 1)[-1])
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return path
    request = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(request) as response, open(path, 'wb') as handle:
        while True:
            chunk = response.read(1 << 20)
            if not chunk:
                break
            handle.write(chunk)
    return path


def render_pdf(pdf_path, out_dir, max_width, max_height, quality):
    os.makedirs(out_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    pages = []
    for index, page in enumerate(doc, start=1):
        rect = page.rect
        zoom = min(max_width / rect.width, max_height / rect.height, 4.0)
        pixmap = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        image = Image.open(io.BytesIO(pixmap.tobytes('ppm'))).convert('RGB')
        name = f'page-{index:02d}.webp'
        target = os.path.join(out_dir, name)
        image.save(target, 'WEBP', quality=quality, method=6)
        pages.append({'name': name, 'width': image.width, 'height': image.height,
                      'bytes': os.path.getsize(target)})
    doc.close()
    return pages


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--content', required=True, help='site content JSON containing the items')
    parser.add_argument('--out', default='build/pdf-pages')
    parser.add_argument('--cache', default='build/pdf-cache')
    parser.add_argument('--max-width', type=int, default=1600)
    parser.add_argument('--max-height', type=int, default=2200)
    parser.add_argument('--quality', type=int, default=80)
    parser.add_argument('--only', default='', help='comma separated item ids to rebuild')
    args = parser.parse_args()

    with open(args.content, encoding='utf-8') as handle:
        content = json.load(handle)

    only = {value.strip() for value in args.only.split(',') if value.strip()}
    manifest = {}
    for item in content.get('items', []):
        source = item.get('fileUrl') or ''
        if not is_pdf(source) or (only and item['id'] not in only):
            continue
        local = download(source, args.cache) if source.startswith('http') else source
        out_dir = os.path.join(args.out, item['id'])
        pages = render_pdf(local, out_dir, args.max_width, args.max_height, args.quality)
        manifest[item['id']] = {'pdfUrl': source, 'pdfBytes': os.path.getsize(local),
                                'dir': item['id'], 'pages': pages}
        total = sum(page['bytes'] for page in pages)
        print(f"{item['id']:32s} {len(pages):3d} pages  "
              f"{os.path.getsize(local)/1e6:8.2f} MB PDF -> {total/1e6:6.2f} MB WEBP", flush=True)

    os.makedirs(args.out, exist_ok=True)
    manifest_path = os.path.join(args.out, 'manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as handle:
        json.dump(manifest, handle, indent=2)
    print(f'\nmanifest: {manifest_path}')


if __name__ == '__main__':
    main()
