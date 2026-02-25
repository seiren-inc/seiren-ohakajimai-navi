import * as fs from 'fs';
import * as path from 'path';

const PENDING_PATH = path.resolve(__dirname, '../data/imports/pending.json');

const UPDATES = [
    { jisCode: "072125", municipality: "南相馬市", url: "https://www.city.minamisoma.lg.jp/portal/sections/13/1360/13601/10/1616.html" },
    { jisCode: "062111", municipality: "東根市", url: "https://www.city.higashine.yamagata.jp/news/3046" },
    { jisCode: "062138", municipality: "南陽市", url: "https://www.city.nanyo.yamagata.jp/okuyamisinsei/3351" },
    { jisCode: "042030", municipality: "塩竈市", url: "https://www.city.shiogama.miyagi.jp/soshiki/50/52370.html" },
    { jisCode: "012246", municipality: "千歳市", url: "https://www.city.chitose.lg.jp/docs/8290.html" },
    { jisCode: "014320", municipality: "新十津川町", url: "https://www.town.shintotsukawa.lg.jp/hotnews/detail/00002827.html" },
    { jisCode: "014621", municipality: "南富良野町", url: "https://www.town.minamifurano.hokkaido.jp/kurashi-info/farewell/%E6%96%8E%E5%A0%B4%E3%83%BB%E5%A2%93%E5%9C%B0/" }
];

function main() {
    if (!fs.existsSync(PENDING_PATH)) {
        console.error("pending.json not found.");
        return;
    }

    const pending = JSON.parse(fs.readFileSync(PENDING_PATH, 'utf-8'));
    let updateCount = 0;

    UPDATES.forEach(update => {
        const record = pending.find((r: any) => r.jisCode === update.jisCode);
        if (record) {
            record.url = update.url;
            record.linkStatus = "UPDATED";
            updateCount++;
            console.log(`Updated ${update.municipality} (${update.jisCode})`);
        } else {
            console.warn(`Record not found for ${update.municipality} (${update.jisCode})`);
        }
    });

    fs.writeFileSync(PENDING_PATH, JSON.stringify(pending, null, 2));
    console.log(`Total updated: ${updateCount}`);
}

main();
