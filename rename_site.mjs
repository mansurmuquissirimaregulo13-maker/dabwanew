import fs from 'fs/promises';

async function renameSite() {
    const files = [
        'dabwalanews_clone/index.html',
        'dabwalanews_clone/musica-global.html',
        'package.json'
    ];

    for (const file of files) {
        try {
            let content = await fs.readFile(file, 'utf-8');
            
            // Replace DA BWALA NEWS and Dabwala News
            content = content.replace(/DA BWALA NEWS/g, 'Mktxo.new');
            content = content.replace(/Dabwala News/gi, 'Mktxo.new');
            content = content.replace(/DabwalaNews/gi, 'Mktxo.new');
            
            await fs.writeFile(file, content);
            console.log(`Updated ${file}`);
        } catch (e) {
            console.error(`Error updating ${file}: ${e.message}`);
        }
    }
}

renameSite();
