import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, isOwner, command }) => {
    // حماية الأمر للمطور فقط لسلامة ملفات السيرفر
    if (!isOwner) return m.reply("❌ *هذا الأمر مخصص للمطور الأساسي للبوت فقط!*");

    await m.reply("🔍 *جاري قراءة ملفات السيرفر كود كود ومراجعة الأخطاء والخصائص...*");

    try {
        const pluginsDir = path.resolve('./plugins');
        if (!fs.existsSync(pluginsDir)) {
            return m.reply("❌ لم يتم العثور على مجلد `plugins` في مسار البوت الأساسي.");
        }

        // دالة مخصصة لجلب كافة ملفات الـ .js داخل المجلدات الفرعية
        function getFiles(dir) {
            let results = [];
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                file = path.join(dir, file);
                const stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    results = results.concat(getFiles(file));
                } else if (file.endsWith('.js')) {
                    results.push(file);
                }
            });
            return results;
        }

        const allFiles = getFiles(pluginsDir);
        let errorCount = 0;
        let reportText = `*━━━━━━╎ ❨  🖥️ مـراجـعـة الـسـورس  ❩╎━━━━━━*\n`;
        reportText += `📂 *إجمالي الملفات المكتشفة:* ${allFiles.length} ملف برميجي.\n\n`;

        for (let i = 0; i < allFiles.length; i++) {
            const filePath = allFiles[i];
            const relativePath = path.relative(process.cwd(), filePath);
            
            let fileCommands = "غير محدد";
            let fileDesc = "لا يوجد وصف متوفر لهذه الميزة";
            let fileStatus = "✅ كود سليم ومطابق";
            let fixSuggestion = "";

            try {
                // استيراد ديناميكي للملف لفحص الأخطاء البرمجية الفورية بالملي
                const fileUrl = `file://${filePath}`;
                const module = await import(fileUrl + `?update=${Date.now()}`);
                const exported = module.default || module;

                // قراءة الخصائص والأوامر بناءً على إعدادات الـ handler المتناسقة مع بوتك
                if (exported) {
                    if (exported.command) {
                        fileCommands = Array.isArray(exported.command) ? exported.command.join(', .') : exported.command;
                    }
                    if (exported.help) {
                        fileDesc = Array.isArray(exported.help) ? exported.help.join(', ') : exported.help;
                    } else if (exported.NovaUltra?.description) {
                        fileDesc = exported.NovaUltra.description;
                    }
                }

                // فحص وجود دالة التشغيل الأساسية في الملف
                const hasHandler = exported.handler || typeof exported === 'function' || exported.execute;
                if (!hasHandler) {
                    fileStatus = "⚠️ *الملف ناقص أو لا يحتوي على دالة تشغيل*";
                }

            } catch (err) {
                errorCount++;
                fileStatus = `❌ *يحتوي على خطأ برميجي (كراش)!*`;
                fixSuggestion = `💡 *سبب الخطأ:* _${err.message}_\n🔧 *الإصلاح:* افتحي الملف وراجعي إغلاق الأقواس أو الرموز الناقصة.`;
            }

            // بناء فقرة التقرير لكل ملف
            reportText += `📄 *الملف (${i + 1}):* \`${relativePath}\`\n`;
            reportText += `🎯 *الأمر:* \`.${fileCommands}\`\n`;
            reportText += `📝 *الميزة:* _${fileDesc}_\n`;
            reportText += `🚦 *الحالة:* ${fileStatus}\n`;

            if (fixSuggestion) {
                reportText += `${fixSuggestion}\n`;
            }
            reportText += `─────────────────\n`;

            // تقسيم الرسالة إذا كانت طويلة جداً لكي لا يعلق الواتساب
            if (reportText.length > 3500) {
                await conn.sendMessage(m.chat, { text: reportText }, { quoted: m });
                reportText = ``;
            }
        }

        // إرسال الخاتمة والملخص النهائي للتفتيش
        if (reportText.length > 0) {
            reportText += `\n📍 *الملخص:* فحص ${allFiles.length} ملف | ✅ سليم: ${allFiles.length - errorCount} | ❌ تالف: ${errorCount}\n\n`;
            reportText += `*━━━━╎㇀  𝐒𝐇𝐀𝐃𝐎𝐖 𝐁𝐎𝐓 㙎╎━━━━*`;
            
            return await conn.sendMessage(m.chat, { text: reportText }, { quoted: m });
        }

    } catch (e) {
        return m.reply("❌ حدث خطأ غير متوقع أثناء عملية مراجعة الملفات.");
    }
};

handler.help = ['راجع_الأكواد'];
handler.tags = ['owner'];
// الكلمات التي تشغل الأمر للمطور
handler.command = ['فحص_الملفات', 'فحص_الاكواد', 'المراجعة', 'فحص', 'مراجعة'];

export default handler;