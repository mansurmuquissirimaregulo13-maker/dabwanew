import fs from 'fs/promises';

async function finalCleanup() {
    let html = await fs.readFile('dabwalanews_clone/index.html', 'utf-8');

    // 1. Remove all remains of Wayback URLs
    html = html.replace(/(?:https?:)?\/\/web\.archive\.org\/web\/[0-9]+(?:[a-z_]+)?\//gi, '');
    
    // 2. Remove DNS prefetch to archive.org
    html = html.replace(/<link rel="dns-prefetch" href="[^"]*archive\.org[^"]*"\/>/gi, '');
    
    // 3. Fix absolute URLs pointing to dabwalanews.com to local but keep static/uploads paths if they are local
    html = html.replace(/https:\/\/dabwalanews\.com\//g, '/');
    html = html.replace(/https:\/\/www\.dabwalanews\.com\//g, '/');
    
    // 4. Remove any JSON-LD schema traces of archive.org
    html = html.replace(/https:\/\/web\.archive\.org\/web\/[0-9]+\/https:\/\/schema\.org/g, 'https://schema.org');

    await fs.writeFile('dabwalanews_clone/index.html', html);
    console.log('Final cleanup of Wayback Machine artifacts complete.');
}

finalCleanup();
