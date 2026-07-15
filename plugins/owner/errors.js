import fs from 'fs';
import path from 'path';

const run = async (m, { bot, conn, text }) => {

    // --- الجزء الأول: إصلاح الأخطاء يدوياً ---
    if (text && (text.trim() === 'اصلاح' || text.trim() === 'إصلاح')) {
        const errors = await bot.errors();
        if (!errors || errors.length === 0) return m.reply("✨ لا توجد أخطاء لإصلاحها!");

        let fixLog = "🛠️ *تقرير الإصلاح اليدوي:*\n\n";
        let fixedCount = 0;

        for (let x of errors) {
            const lineMatch = x.error.match(/:(\d+):(\d+)/) || x.error.match(/at\s+.*:(\d+):\d+/);
            if (!lineMatch) continue;

            const lineNumber = parseInt(lineMatch[1]);
            const fullPath = path.resolve(x.file.trim());

            if (fs.existsSync(fullPath)) {
                try {
                    let fileContent = fs.readFileSync(fullPath, 'utf-8');
                    let lines = fileContent.split('\n');
                    const lineIdx = lineNumber - 1;

                    if (lineIdx >= 0 && lineIdx < lines.length) {
                        const oldLine = lines[lineIdx];

                        // هنا المطور بنفسه يعدل السطر يدوياً
                        fixLog += `⚠️ *الملف:* ${x.file}\n📍 *السطر:* ${lineNumber}\n➖ *القديم:* \`${oldLine.trim()}\`\n❌ لم يتم إصلاحه تلقائياً، عدله بنفسك.\n------------------------\n`;
                        fixedCount++;
                    }
                } catch (err) {
                    fixLog += `❌ فشل قراءة ملف ${x.file}: ${err.message}\n------------------------\n`;
                }
            }
        }

        if (fixedCount === 0) {
            return m.reply("⚠️ تم فحص الأخطاء لكن لم يتم العثور على أسطر قابلة للتعديل.");
        }

        return m.reply(fixLog + `\n📂 تم عرض (${fixedCount}) خطأ، عدلها يدوياً.`);
    }

    // --- الجزء الثاني: عرض الأخطاء العادي ---
    const errors = await bot.errors();
    if (!errors || errors.length === 0) {
        return m.reply("✨ لا توجد أي أخطاء حالياً! كل شيء يعمل بنجاح.");
    }

    const res = errors.map(x => {
        const lineMatch = x.error.match(/:(\d+):(\d+)/) || x.error.match(/at\s+.*:(\d+):\d+/);
        const lineNumber = lineMatch ? lineMatch[1] : "غير محدد";

        return `
📂 *الملف:* ${x.file}
🌱 *الأمر:* ${x.command}
📍 *السطر:* ${lineNumber}
❌ *الخطأ:* ${x.error}
🤖 *للمراجعة اليدوية أرسل:* \`.الايرورات اصلاح\`
============================`;
    }).join("\n");

    m.reply(res);
}

run.command = ["الايرورات"];
run.usage = ["الايرورات"];
run.category = "𝐴𝐿𝐻𝑊𝐴𝑅𝑌 🔥";
run.owner = true;

export default run;