import fs from 'fs';
import path from 'path';

// ملاحظة: قمت بوضع دالة افتراضية للذكاء الاصطناعي.
// إذا كان لديك API خاص بـ Gemini أو ChatGPT، قم بربطه داخل دالة callAI.
async function callAI(errorDescription, oldCode) {
    try {
        // هنا يتم إرسال الكود والخطأ للذكاء الاصطناعي ليعطيك السطر الصحيح فقط
        // مثال لو عندك دالة جاهزة في البوت: const response = await gpt.ask(...)
        
        // كمثال توضيحي ومحاكاة ذكية في حال لم يربط المطور الـ API بعد:
        let fixedCode = oldCode;
        if (errorDescription.includes("is not defined")) {
            fixedCode = `const ${errorDescription.split(' ')[0]} = {}; // تم تعريف المتغير تلقائياً بواسطة البوت\n` + oldCode;
        } else if (errorDescription.includes("Cannot read properties of undefined")) {
            // تحويل القراءة العادية إلى قراءة آمنة بـ ?.
            fixedCode = oldCode.replace(/\.(\w+)/g, '?.$1');
        }
        
        /* 💡 إذا كان لديك مفتاح API (مثلاً لـ Gemini)، يمكنك تفعيل هذا الجزء:
        const response = await fetch('https://api.gemini.com/v1/chat', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' },
            body: JSON.stringify({ prompt: `صلح هذا السطر البرمجي في الجافاسكريبت بناءً على هذا الخطأ. أريد السطر الجديد الصحيح فقط بدون أي كلام آخر أو علامات اقتباس برمجية.\nالخطأ: ${errorDescription}\nالسطر القديم: ${oldCode}` })
        });
        const data = await response.json();
        return data.text.trim();
        */

        return fixedCode;
    } catch (e) {
        return oldCode; // في حال فشل الذكاء الاصطناعي يعود بالكود القديم
    }
}

const run = async (m, { bot, conn, text }) => {
    
    // --- الجزء الأول: إذا كتب الأونر ".الايرورات اصلاح" سيقوم بمعالجة الأخطاء تلقائياً ---
    if (text && (text.trim() === 'اصلاح' || text.trim() === 'إصلاح')) {
        const errors = await bot.errors();
        if (!errors || errors.length === 0) return m.reply("✨ لا توجد أخطاء لإصلاحها تلقائياً!");

        let fixLog = "🛠️ *تقرير الإصلاح التلقائي بالذكاء الاصطناعي:*\n\n";
        let fixedCount = 0;

        for (let x of errors) {
            const lineMatch = x.error.match(/:(\d+):(\d+)/) || x.error.match(/at\s+.*:(\d+):\d+/);
            if (!lineMatch) continue; // تخطي إذا لم يجد السطر

            const lineNumber = parseInt(lineMatch[1]);
            const fullPath = path.resolve(x.file.trim());

            if (fs.existsSync(fullPath)) {
                try {
                    let fileContent = fs.readFileSync(fullPath, 'utf-8');
                    let lines = fileContent.split('\n');
                    const lineIdx = lineNumber - 1;

                    if (lineIdx >= 0 && lineIdx < lines.length) {
                        const oldLine = lines[lineIdx];
                        
                        // استدعاء الذكاء الاصطناعي لمعالجة السطر
                        const correctedLine = await callAI(x.error, oldLine);

                        if (correctedLine !== oldLine) {
                            lines[lineIdx] = correctedLine; // استبدال السطر القديم بالصحيح تلقائياً
                            fs.writeFileSync(fullPath, lines.join('\n'), 'utf-8');
                            
                            fixLog += `✅ *الملف:* ${x.file}\n📍 *السطر:* ${lineNumber}\n➖ *القديم:* \`${oldLine.trim()}\`\n➕ *الجديد بعد الإصلاح:* \`${correctedLine.trim()}\`\n------------------------\n`;
                            fixedCount++;
                        }
                    }
                } catch (err) {
                    fixLog += `❌ فشل إصلاح ملف ${x.file}: ${err.message}\n------------------------\n`;
                }
            }
        }

        if (fixedCount === 0) {
            return m.reply("⚠️ تم فحص الأخطاء ولكن لم يتمكن الذكاء الاصطناعي من بث حلول مؤكدة تلقائياً، يرجى مراجعتها يدوياً.");
        }

        return m.reply(fixLog + `\n🎉 تم إصلاح (${fixedCount}) خطأ بنجاح وتحديث الملفات تلقائياً!`);
    }

    // --- الجزء الثاني: عرض الأخطاء العادي ---
    const errors = await bot.errors();
    if (!errors || errors.length === 0) {
        return m.reply("✨ لا توجد أي أخطاء مسجلة حالياً! كل شيء يعمل بنجاح.");
    }

    const res = errors.map(x => {
        const lineMatch = x.error.match(/:(\d+):(\d+)/) || x.error.match(/at\s+.*:(\d+):\d+/);
        const lineNumber = lineMatch ? lineMatch[1] : "غير محدد";

        return `
📂 *الملف:* ${x.file}
🌱 *الأمر:* ${x.command}
📍 *السطر:* ${lineNumber}
❌ *الخطأ:* ${x.error}
🤖 *للإصلاح التلقائي الفوري بواسطة الـ AI أرسل:* \`.الايرورات اصلاح\`
============================`;
    }).join("\n");

    m.reply(res);
}

run.command = ["الايرورات"];
run.usage = ["الايرورات"];
run.category = "owner";
run.owner = true;

export default run;
