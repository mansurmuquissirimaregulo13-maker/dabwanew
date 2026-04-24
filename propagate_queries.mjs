import fs from 'fs/promises';

async function fixEmptyQueries() {
    let html = await fs.readFile('dabwalanews_clone/index.html', 'utf-8');

    // Find all post items
    const postItemRegex = /<li class="post-item[^"]*">([\s\S]*?)<\/li>/g;
    
    html = html.replace(postItemRegex, (match, content) => {
        // Find if there is a query already in any link in this item
        const queryMatch = content.match(/href="\/musica-global\.html\?q=([^"]+)"/);
        if (queryMatch) {
            const query = queryMatch[1];
            // Update all global music links in this item that are empty or point to root
            return match.replace(/href="\/musica-global\.html\?q="/g, `href="/musica-global.html?q=${query}"`)
                        .replace(/href="\/"/g, `href="/musica-global.html?q=${query}"`); // Fallback
        }
        return match;
    });

    await fs.writeFile('dabwalanews_clone/index.html', html);
    console.log('Propagated search queries to thumbnails and post items.');
}

fixEmptyQueries();
