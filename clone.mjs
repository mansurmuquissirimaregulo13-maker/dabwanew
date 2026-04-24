import fs from 'fs/promises';
import path from 'path';

async function run() {
    const htmlContent = await fs.readFile('dabwalanews_archive.html', 'utf-8');

    // 1. Remove Wayback Machine artifacts
    let cleanedHtml = htmlContent.replace(/<!-- BEGIN WAYBACK TOOLBAR INSERT -->[\s\S]*?<!-- END WAYBACK TOOLBAR INSERT -->/gi, '');
    cleanedHtml = cleanedHtml.replace(/<link[^>]*href="https:\/\/web-static\.archive\.org[^>]*>/gi, '');
    cleanedHtml = cleanedHtml.replace(/<script[^>]*src="https:\/\/web-static\.archive\.org[^>]*><\/script>/gi, '');
    cleanedHtml = cleanedHtml.replace(/<script[^>]*>\s*__wm\.wombat[\s\S]*?<\/script>/gi, '');
    cleanedHtml = cleanedHtml.replace(/<script[^>]*>\s*__wm\.init[\s\S]*?<\/script>/gi, '');
    cleanedHtml = cleanedHtml.replace(/<script[^>]*>\s*window\.RufflePlayer[\s\S]*?<\/script>/gi, '');
    cleanedHtml = cleanedHtml.replace(/<!-- End Wayback Rewrite JS Include -->/gi, '');

    // 2. Identify Assets and Links
    // This regex looks for anything that looks like a URL (absolute or wayback-relative)
    const waybackRegex = /(?:https:\/\/web\.archive\.org)?\/web\/([0-9]+)([a-z_]*)\/(https?:\/\/[^"'\s<>$,\)\*]+)/g;
    
    const assetsToDownload = new Map();
    const linkRewrites = new Map();
    const assetExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

    let match;
    while ((match = waybackRegex.exec(htmlContent)) !== null) {
        const fullWaybackUrl = match[0];
        const timestamp = match[1];
        const modifier = match[2];
        const originalUrl = match[3];
        
        const cleanOriginal = originalUrl.split('?')[0].split('#')[0];
        const isAsset = assetExtensions.some(ext => cleanOriginal.toLowerCase().endsWith(ext));

        if (isAsset) {
            try {
                const urlObj = new URL(originalUrl);
                let localPath = path.join('assets', urlObj.hostname, urlObj.pathname);
                if (localPath.endsWith(path.sep)) localPath += 'index';
                localPath = localPath.split('?')[0].replace(/\\/g, '/');

                // Raw download URL
                const downloadUrl = `https://web.archive.org/web/${timestamp}id_/${originalUrl}`;

                assetsToDownload.set(localPath, {
                    url: downloadUrl,
                    dest: localPath
                });
                linkRewrites.set(fullWaybackUrl, '/' + localPath);
            } catch (e) {}
        }
    }

    // 3. Rewrite HTML
    let finalHtml = cleanedHtml;
    // Replace wayback URLs with local paths
    const sortedKeys = Array.from(linkRewrites.keys()).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        finalHtml = finalHtml.split(key).join(linkRewrites.get(key));
    }

    // Also catch any remaining /web/TIMESTAMP/https:// links to dabwalanews and point them to root
    finalHtml = finalHtml.replace(/(?:https:\/\/web\.archive\.org)?\/web\/[0-9]+[a-z_]*\/https?:\/\/dabwalanews\.com\//g, '/');
    
    // Fix attributes for cloned functionality
    finalHtml = finalHtml.replace(/data-src=/g, 'src=');
    finalHtml = finalHtml.replace(/data-srcset=/g, 'srcset=');

    await fs.mkdir('dabwalanews_clone', { recursive: true });
    await fs.writeFile('dabwalanews_clone/index.html', finalHtml);

    // 4. Enhanced Download Script with Retries
    const downloadData = Array.from(assetsToDownload.values());
    const downloadScript = `
import fs from 'fs';
import https from 'https';
import path from 'path';

const assets = ${JSON.stringify(downloadData, null, 2)};

async function download(url, dest, retries = 3) {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const request = () => {
            https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (res) => {
                if (res.statusCode === 301 || res.statusCode === 302) {
                    return download(res.headers.location, dest, retries).then(resolve).catch(reject);
                }
                if (res.statusCode !== 200) {
                    if (retries > 0) {
                        console.log('Retrying ' + url + ' (Status ' + res.statusCode + ')');
                        setTimeout(request, 2000);
                        retries--;
                        return;
                    }
                    return reject(new Error('Status: ' + res.statusCode));
                }
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => file.close(resolve));
            }).on('error', (err) => {
                if (retries > 0) {
                    console.log('Retrying ' + url + ' (' + err.message + ')');
                    setTimeout(request, 2000);
                    retries--;
                } else {
                    if (fs.existsSync(dest)) fs.unlinkSync(dest);
                    reject(err);
                }
            });
        };
        request();
    });
}

(async () => {
    console.log('Downloading ' + assets.length + ' assets...');
    let success = 0;
    let failed = 0;
    for (const asset of assets) {
        const dest = path.join('dabwalanews_clone', asset.dest);
        try {
            await download(asset.url, dest);
            success++;
        } catch (e) {
            console.log('Failed: ' + asset.url + ' -> ' + e.message);
            failed++;
        }
    }
    console.log('Done! Success: ' + success + ', Failed: ' + failed);
})();
`;
    await fs.writeFile('download_assets.mjs', downloadScript);
    console.log('Found ' + assetsToDownload.size + ' unique assets.');
}

run();
