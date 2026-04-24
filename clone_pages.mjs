import fs from 'fs/promises';
import path from 'path';
import https from 'https';

const BASE_DIR = 'dabwalanews_clone';
const ASSET_EXTENSIONS = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp3'];

async function getRedirectUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                resolve(res.headers.location);
            } else {
                resolve(url);
            }
        }).on('error', reject);
    });
}

async function download(url, dest, retries = 3) {
    if (require('fs').existsSync(dest)) return;
    return new Promise((resolve, reject) => {
        const dir = path.dirname(dest);
        try { if (!require('fs').existsSync(dir)) require('fs').mkdirSync(dir, { recursive: true }); } catch(e){}
        
        const request = () => {
            https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    return download(res.headers.location, dest, retries).then(resolve).catch(reject);
                }
                if (res.statusCode !== 200) {
                    if (retries > 0) { setTimeout(request, 2000); retries--; return; }
                    return reject(new Error('Status: ' + res.statusCode));
                }
                const file = require('fs').createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => file.close(resolve));
            }).on('error', (err) => {
                if (retries > 0) { setTimeout(request, 2000); retries--; } else { reject(err); }
            });
        };
        request();
    });
}

async function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchHtml(res.headers.location).then(resolve).catch(reject);
            }
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
        }).on('error', reject);
    });
}

function cleanHtml(html, currentSlug) {
    // 1. Remove Wayback boilerplate
    let cleaned = html.replace(/<!-- BEGIN WAYBACK TOOLBAR INSERT -->[\s\S]*?<!-- END WAYBACK TOOLBAR INSERT -->/gi, '');
    cleaned = cleaned.replace(/<script[^>]*src="[^"]*archive\.org\/_static\/js\/[^"]*">[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<link[^>]*href="[^"]*archive\.org\/_static\/css\/[^"]*"[^>]*>/gi, '');
    cleaned = cleaned.replace(/<script[^>]*src="[^"]*archive\.org\/includes\/[^"]*">[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<script[^>]*src="[^"]*archive\.org\/components\/[^"]*">[\s\S]*?<\/script>/gi, '');
    
    // Catch the annoying head wrapper if present
    cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<title>Wayback Machine<\/title>[\s\S]*?<\/head>/gi, '<head>');
    cleaned = cleaned.replace(/<body[^>]*class="navia"[\s\S]*?<div class="ia-banners"[\s\S]*?<\/div>[\s\S]*?<div id="topnav"[\s\S]*?<\/div>/gi, '<body>');
    
    // 2. Identify and Rewrite Assets
    const waybackRegex = /(?:https:\/\/web\.archive\.org)?\/web\/([0-9]+)([a-z_]*)\/(https?:\/\/[^"'\s<>$,\)\*]+)/g;
    const assetsFound = [];

    const depth = currentSlug.split('/').filter(Boolean).length;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';

    cleaned = cleaned.replace(waybackRegex, (match, ts, mod, originalUrl) => {
        try {
            const urlObj = new URL(originalUrl);
            const cleanUrl = originalUrl.split('?')[0].split('#')[0];
            const isAsset = ASSET_EXTENSIONS.some(ext => cleanUrl.toLowerCase().endsWith(ext));

            if (isAsset) {
                let localPath = path.join('assets', urlObj.hostname, urlObj.pathname).split('?')[0].replace(/\\/g, '/');
                if (localPath.endsWith('/')) localPath += 'index';
                
                assetsFound.push({
                    url: `https://web.archive.org/web/${ts}id_/${originalUrl}`,
                    dest: path.join(BASE_DIR, localPath)
                });
                return prefix + localPath;
            } else if (originalUrl.includes('dabwalanews.com')) {
                return originalUrl.replace(/https?:\/\/dabwalanews\.com\//, '/');
            }
            return originalUrl;
        } catch (e) { return match; }
    });

    // Fix LiteSpeed Lazyload artifacts
    cleaned = cleaned.replace(/data-src=/g, 'src=');
    cleaned = cleaned.replace(/data-srcset=/g, 'srcset=');
    cleaned = cleaned.replace(/src="data:image\/svg\+xml;base64,[^"]*"/g, ''); // Remove placeholders
    
    // Remove remaining wayback prefixes
    cleaned = cleaned.replace(/(?:https:\/\/web\.archive\.org)?\/web\/[0-9]+[a-z_]*\//g, '');

    return { cleaned, assetsFound };
}

async function processPage(slug) {
    const rawUrl = `https://web.archive.org/web/0/https://dabwalanews.com/${slug}`;
    console.log(`Processing: ${slug}`);
    
    try {
        const redirected = await getRedirectUrl(rawUrl);
        // We want the 'id_' version for the actual fetch to get raw content
        const idUrl = redirected.replace(/\/web\/([0-9]+)\//, '/web/$1id_/');
        
        console.log(`  Source: ${idUrl}`);
        const html = await fetchHtml(idUrl);
        
        const { cleaned, assetsFound } = cleanHtml(html, slug);
        
        const pageDir = path.join(BASE_DIR, slug);
        await fs.mkdir(pageDir, { recursive: true });
        await fs.writeFile(path.join(pageDir, 'index.html'), cleaned);

        console.log(`  Assets: ${assetsFound.length} found. Downloading...`);
        let success = 0;
        for (const asset of assetsFound) {
            try {
                await download(asset.url, asset.dest);
                success++;
            } catch (e) {}
        }
        console.log(`  Done: ${success}/${assetsFound.length}`);
    } catch (e) {
        console.error(`  ERROR: ${e.message}`);
    }
}

(async () => {
    const slugs = [
        'kid-mc-sempre-aqui-ft-paulelson-altifridi/',
        'monsta-tic-tac/',
        'monsta-leo-beatz-bala/',
        'phedilson-escolhas/',
        'lipesky-mogli-ft-helcirio-aureo-ricardo/',
        'mr-bow-pfumela/',
        'rei-bravo-chefe-dos-bandidos/',
        'kiba-the-seven-something/'
    ];

    for (const slug of slugs) {
        await processPage(slug);
    }
    console.log('\n--- EVERYTHING DONE ---');
})();
