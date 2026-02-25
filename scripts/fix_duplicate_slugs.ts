
import fs from 'fs';
import path from 'path';

function main() {
    const pendingPath = path.join(process.cwd(), "data/imports/pending.json");
    const data = JSON.parse(fs.readFileSync(pendingPath, "utf-8"));

    data.forEach(r => {
        // Resolve Taishi-cho
        if (r.municipality === "太子町" && r.municipalitySlug === "taishi-cho") {
            if (r.prefecture === "大阪府") r.municipalitySlug = "osaka-taishi-cho";
            if (r.prefecture === "兵庫県") r.municipalitySlug = "hyogo-taishi-cho";
        }
        // Resolve Inami-cho / Inami-cho
        if ((r.municipality === "稲美町" || r.municipality === "印南町") && r.municipalitySlug === "inami-cho") {
            if (r.prefecture === "兵庫県") r.municipalitySlug = "hyogo-inami-cho";
            if (r.prefecture === "和歌山県") r.municipalitySlug = "wakayama-inami-cho";
        }
    });

    fs.writeFileSync(pendingPath, JSON.stringify(data, null, 2));
    console.log("Duplicate slugs resolved.");
}
main();
