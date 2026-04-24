
import fs from 'fs';
import https from 'https';
import path from 'path';

const assets = [
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/litespeed/ucss/884e569e5589f3b02eca274819e1af17.css?ver=56286",
    "dest": "assets/dabwalanews.com/wp-content/litespeed/ucss/884e569e5589f3b02eca274819e1af17.css"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",
    "dest": "assets/ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325-32x32.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325-32x32.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325-192x192.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325-192x192.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325-180x180.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/cropped-Screenshot_20240927-100325-180x180.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/daah01-scaled.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/daah01-scaled.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://landings-cdn.adsterratech.com/referralBanners/png/728%20x%2090%20px.png",
    "dest": "assets/landings-cdn.adsterratech.com/referralBanners/png/728%20x%2090%20px.png"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/10/Screenshot_20241004-031338-780x470.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/10/Screenshot_20241004-031338-780x470.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/hq720-2.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/hq720-2.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-780x470.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-780x470.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/632x632bb-632x470.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/632x632bb-632x470.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240928-084428-780x470.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240928-084428-780x470.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-780x470.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-780x470.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-084303-1-390x220-1.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-084303-1-390x220-1.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-083406-1-390x220-1.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-083406-1-390x220-1.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/hq720-2-220x150.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/hq720-2-220x150.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-220x150.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-220x150.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/632x632bb-220x150.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/632x632bb-220x150.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240928-084428-220x150.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240928-084428-220x150.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-390x220.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-390x220.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-300x169.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-300x169.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-768x433.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-768x433.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-390x220.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-390x220.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-300x169.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-300x169.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-1024x576.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-1024x576.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-768x432.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1-768x432.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/maxresdefault-1.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/632x632bb-390x220.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/632x632bb-390x220.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/10/Screenshot_20241004-031338-390x220.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/10/Screenshot_20241004-031338-390x220.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-083406-1-390x220-1-300x169.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-083406-1-390x220-1-300x169.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240928-084428-390x220.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240928-084428-390x220.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-084303-1-390x220-1-300x169.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Screenshot_20240407-084303-1-390x220-1-300x169.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/hq720-2-390x220.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/hq720-2-390x220.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/hq720-2-300x169.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/hq720-2-300x169.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/10/Screenshot_20241004-031338-220x150.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/10/Screenshot_20241004-031338-220x150.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-150x150.webp",
    "dest": "assets/dabwalanews.com/wp-content/uploads/2024/09/Monsta-1-1024x577-1-150x150.webp"
  },
  {
    "url": "https://web.archive.org/web/20241127203649id_/https://scripts.cleverwebserver.com/0eef447c915853cb8cbfee35074300b7.js",
    "dest": "assets/scripts.cleverwebserver.com/0eef447c915853cb8cbfee35074300b7.js"
  }
];

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
