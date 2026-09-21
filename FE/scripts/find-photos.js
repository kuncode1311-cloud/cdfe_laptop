const fs = require('fs');
const path = require('path');

async function searchWikimedia(query, limit = 5) {
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|mime&format=json`;
  const res = await fetch(endpoint, {
    headers: { 'User-Agent': 'TNTP-Laptop-Asset-Finder/1.0 (contact: admin@tntplaptop.vn)' }
  });
  const data = await res.json();
  if (!data.query || !data.query.pages) return [];
  const results = [];
  for (const k in data.query.pages) {
    const p = data.query.pages[k];
    if (p.imageinfo && p.imageinfo[0] && p.imageinfo[0].mime.startsWith('image/')) {
      results.push({
        title: p.title,
        url: p.imageinfo[0].url,
        width: p.imageinfo[0].width,
        height: p.imageinfo[0].height,
        mime: p.imageinfo[0].mime
      });
    }
  }
  return results;
}

async function main() {
  const queries = [
    'Intel Core i9 box',
    'USB-C hub',
    'laptop stand',
    'laptop sleeve',
    'gaming mousepad rgb'
  ];
  for (const q of queries) {
    console.log(`\n=== SEARCH: "${q}" ===`);
    const items = await searchWikimedia(q, 3);
    items.forEach(it => console.log(`- ${it.title} (${it.width}x${it.height}) -> ${it.url}`));
  }
}

main().catch(console.error);
