import fs from 'fs/promises';

async function updateLinks() {
    let html = await fs.readFile('dabwalanews_clone/index.html', 'utf-8');

    // Regex to find links to posts and extract the title text
    // <a href="/slug/">Title</a>
    const linkRegex = /<a\s+[^>]*href="\/([^"/]+)\/"[^>]*>(.*?)<\/a>/g;
    
    html = html.replace(linkRegex, (match, slug, title) => {
        // Only target the specific music post slugs if possible, 
        // but we can target all slugs that aren't categories/pages.
        if (['categoria', 'sobre', 'contacto', 'politica', 'author'].some(word => slug.includes(word))) {
            return match;
        }

        // Clean title for search (remove 'Baixar mp3', '[2024]', etc)
        let query = title.replace(/&#8211;/g, '-')
                         .replace(/&#038;/g, '&')
                         .replace(/\(Baixar mp3\)/gi, '')
                         .replace(/\[[0-9]+\]/g, '')
                         .replace(/<[^>]+>/g, '')
                         .trim();
        
        return `<a href="/musica-global.html?q=${encodeURIComponent(query)}">${title}</a>`;
    });

    await fs.writeFile('dabwalanews_clone/index.html', html);
    console.log('Synchronized homepage links with global music engine.');
}

updateLinks();
