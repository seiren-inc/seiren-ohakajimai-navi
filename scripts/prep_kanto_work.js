const fs = require("fs");
const path = require("path");

const MISSING_PATH = path.join(process.cwd(), "data/imports/kanto_missing_candidates.json");
const WORK_PATH = path.join(process.cwd(), "data/imports/kanto_missing_work.json");

const PREF_ORDER = ["長野県", "埼玉県", "東京都", "群馬県", "山梨県", "千葉県", "茨城県", "栃木県", "神奈川県"];

async function main() {
    const missing = JSON.parse(fs.readFileSync(MISSING_PATH, "utf-8"));
    
    // Group by prefecture
    const groups = {};
    missing.forEach(item => {
        if (!groups[item.prefectureName]) groups[item.prefectureName] = [];
        groups[item.prefectureName].push(item);
    });

    // Create ordered list of tasks
    const tasks = [];
    PREF_ORDER.forEach(pref => {
        if (groups[pref]) {
            tasks.push({
                prefecture: pref,
                items: groups[pref],
                status: "pending"
            });
        }
    });

    // Add any remaining
    Object.keys(groups).forEach(pref => {
        if (!PREF_ORDER.includes(pref)) {
            tasks.push({
                prefecture: pref,
                items: groups[pref],
                status: "pending"
            });
        }
    });

    fs.writeFileSync(WORK_PATH, JSON.stringify(tasks, null, 2));
    console.log(`Organized ${missing.length} items into ${tasks.length} prefecture tasks.`);
}

main().catch(console.error);
