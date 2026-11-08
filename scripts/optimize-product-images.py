#!/usr/bin/env python3
"""Build lightweight product previews without modifying the original assets."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageOps
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'client/public'
OUTPUT = PUBLIC / 'product-thumbnails'
INDEX = ROOT / 'client/src/data/product-index.json'
VARIANTS = ROOT / 'client/src/data/product-image-variants.json'
DIMENSIONS = ROOT / 'client/src/data/product-body-image-dimensions.json'
OUTPUT.mkdir(parents=True, exist_ok=True)
products = json.loads(INDEX.read_text(encoding='utf-8'))
covers = {p.get('image', '') for p in products if p.get('image', '').startswith('/product-images/')}
images = set(covers)
body_images = set()
for path in (PUBLIC / 'product-content').glob('*.json'):
    product = json.loads(path.read_text(encoding='utf-8'))
    images.update(image for image in product.get('gallery', []) if image.startswith('/product-images/'))
    for tag in re.findall(r'<img\b[^>]*>', product.get('html', ''), flags=re.I):
        match = re.search(r'\ssrc\s*=\s*(["\'])(.*?)\1', tag, flags=re.I)
        if match and match.group(2).startswith(('/product-images/', '/news-images/')):
            body_images.add(match.group(2))

def optimize(source):
    path = PUBLIC / source.lstrip('/')
    with Image.open(path) as opened:
        image = ImageOps.exif_transpose(opened)
        image.load()
    if image.mode not in ('RGB', 'RGBA'):
        image = image.convert('RGBA' if 'transparency' in image.info else 'RGB')
    width = image.width
    item = {'thumbnail': source, 'card': source, 'originalWidth': width, 'cardWidth': width}
    original_size = path.stat().st_size
    targets = [(240, 'thumbnail')]
    if source in covers:
        targets.append((640, 'card'))
    for size, key in targets:
        if max(image.size) <= size:
            continue
        preview = image.copy()
        preview.thumbnail((size, size), Image.Resampling.LANCZOS)
        destination = OUTPUT / f'{path.stem}-{size}.webp'
        preview.save(destination, 'WEBP', quality=82, method=4)
        # Reuse the original if a derivative offers no meaningful saving.
        if destination.stat().st_size >= original_size * .9:
            destination.unlink()
            continue
        item[key] = '/product-thumbnails/' + destination.name
        if key == 'card':
            item['cardWidth'] = preview.width
    return source, item

with ThreadPoolExecutor(max_workers=4) as pool:
    variants = dict(pool.map(optimize, sorted(images)))
VARIANTS.write_text(json.dumps(variants, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
dimensions = {}
for source in sorted(body_images):
    with Image.open(PUBLIC / source.lstrip('/')) as opened:
        dimensions[source] = list(ImageOps.exif_transpose(opened).size)
DIMENSIONS.write_text(json.dumps(dimensions, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(f'Processed {len(variants)} original product images; created {len(list(OUTPUT.glob("*.webp")))} previews.')
print(f'Recorded dimensions for {len(dimensions)} product-description images.')
print(f'Preview bytes: {sum(p.stat().st_size for p in OUTPUT.glob("*.webp")):,}')
