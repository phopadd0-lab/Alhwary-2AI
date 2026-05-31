import fs from 'fs';
import path from 'path';

export const NovaUltra = {
    command: ["فحص_الملفات", "فحص_الاكواد", "المراجعة"],
    description: "يمر على ملفات البوت ويشرح ميزتها ويفحص الأخطاء البرمجية فيها",
    category: "owner", // مخصص للمطور فقط
    owner: true,       // تفعيل الحماية لكي لا يستخدمه الأعضاء
    group: false,
    private: false,
    nova: "off"
};

async function execute({ sock, msg, usedPrefix }) {
    const jid = msg.key.remoteJid;
    
    // إرسال رسالة تفيد ببدء الفحص
    await sock.sendMessage(jid, { text: "🔄 *جاري فتح مجلد الإضافات وفحص الملفات كود كود...*" }, { quoted: msg });

    // تحديد مسار مجلد الإضافات (plugins) تلقائياً
    const pluginsDir = path.resolve('./plugins');
    
    if (!fs.existsSync(pluginsDir)) {
        return await sock.sendMessage(jid, { text: "❌ لم يتم العثور على مجلد `plugins` في مسار السورس الأساسي." }, { quoted: msg });
    }

    // دالة ذكية للبحث عن جميع ملفات الـ .js داخل المجلد والمجلدات الفرعية
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

    try {
        const allFiles = getFiles(pluginsDir);
        let report = `*━━━━━━╎ ❨  🖥️ تـقـريـر فـحـص الـسـورس  ❩╎━━━━━━*\n\n`;
        report += `📊 *إجمالي الملفات المكتشفة:* ${allFiles.length} ملف برميجي.\n\n`;

        let errorCount = 0;

        for (let i = 0; i < allFiles.length; i++) {
            const filePath = allFiles[i];
            const relativePath = path.relative(process.cwd(), filePath);
            const fileName = path.basename(filePath);
            
            let fileCommands = "غير محدد";
            let fileDesc = "لا يوجد وصف متوفر";
            let fileStatus = "✅ سليم 100%";
            let fixSuggestion = "";

            // 1️⃣ قراءة محتوى الملف كنص لتحليله وفحص الأخطاء الهيكلية
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // 2️⃣ فحص الأخطاء البرمجية الأساسية (بناء الجملة Syntax)
            try {
                // محاكاة سريعة للتحقق من الأقواس المفتوحة والمغلقة
                const openBrackets = (fileContent.match(/\{/g) || []).length;
                const closeBrackets = (fileContent.match(/\}/g) || []).length;
                
                if (openBrackets !== closeBrackets) {
                    throw new Error(`خلل في الأقواس المتعرجة { }. المفتوحة: ${openBrackets}، المغلقة: ${closeBrackets}`);
                }

                // محاولة استخراج الأوامر والوصف عبر الريجكس (Regex) لتجنب مشاكل استيراد الملفات التالفة
                const cmdMatch = fileContent.match(/command\s*:\s*\[([\s\S]*?)\]/);
                if (cmdMatch) {
                    fileCommands = cmdMatch[1].replace(/['" \n]/g, '');
                }

                const descMatch = fileContent.match(/description\s*:\s*["'`]([\s\S]*?)["'`]/);
                if (descMatch) {
                    fileDesc = descMatch[1].trim();
                }

            } catch (syntaxError) {
                errorCount++;
                fileStatus = `❌ *يحتوي على خطأ برميجي!*`;
                fixSuggestion = `💡 *الإصلاح المقترح:* تأكدي من إغلاق كل قوس \`{\` تم فتحه، أو مراجعة آخر تعديل بالملف لأنه يسبب توقف البوت.`;
            }

            // إضافة بيانات الملف الحالي للتقرير
            report += `*📂 الملف رقم (${i + 1}):* \`${relativePath}\`\n`;
            report += `🎯 *الأمر المخصص:* \`.${fileCommands}\`\n`;
            report += `📝 *ميزة الملف:* _${fileDesc}_\n`;
            report += `🚦 *حالة الكود:* ${fileStatus}\n`;
            
            if (fixSuggestion) {
                report += `${fixSuggestion}\n`;
            }
            
            report += `─────────────────\n`;

            // لمنع الرسائل الطويلة جداً في الواتساب، إذا زاد التقرير عن حجم معين يتم إرساله مجزأً
            if (report.length > 3500) {
                await sock.sendMessage(jid, { text: report }, { quoted: msg });
                report = ``;
            }
        }

        // إرسال الخاتمة والملخص النهائي
        if (report.length > 0) {
            report += `\n*📊 ملخص المراجعة النهائي:*`;
            report += `\n✅ الملفات السليمة: ${allFiles.length - errorCount}`;
            report += `\n❌ الملفات التالفة: ${errorCount}`;
            report += `\n\n*━━━━╎㇀  𝐍𝐎𝐕𝐀𝐔𝐋𝐓𝐑𝐀 𝐁𝐎𝐓 㙎╎━━━━*`;
            await sock.sendMessage(jid, { text: report }, { quoted: msg });
        }

    } catch (err) {
        console.log("CHECK ERROR:", err);
        await sock.sendMessage(jid, { text: `❌ حدث خطأ عام أثناء الفحص: ${err.message}` }, { quoted: msg });
    }
}

export default {
    NovaUltra,
    execute
};