import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = async (m, { conn, isOwner }) => {
    // 🔒 حماية المطور
    if (!isOwner) return m.reply("❌ عذراً، هذا الأمر مخصص لمالك السورس فقط لحماية ملفات السيرفر.");

    await m.react("📦");
    m.reply("📦 جارٍ تجميع وضغط ملفات السورس بصيغة TAR الذكية... انتظر لحظة.");

    const backupName = `ElHawary_Backup_${new Date().toISOString().slice(0, 10)}.tar.gz`;
    const backupPath = path.join(process.cwd(), backupName);

    // استخدام أمر tar المدمج تلقائياً في أي سيرفر لينكس في الدنيا بدلاً من zip
    // مع استثناء المجلدات الثقيلة لتقليل المساحة وسرعة الإرسال
    exec(`tar --exclude='node_modules' --exclude='.git' --exclude='*.tar.gz' --exclude='*.zip' -czf ${backupName} .`, async (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return m.reply("❌ حدث خطأ أثناء الضغط، يبدو أن الاستضافة تمنع إنشاء ملفات أرشيفية.");
        }

        try {
            await m.react("📤");
            
            // إرسال الملف المضغوط مباشرة
            await conn.sendMessage(m.chat, { 
                document: fs.readFileSync(backupPath), 
                mimetype: 'application/gzip', 
                fileName: backupName,
                caption: `*✅ تم أخذ نسخة احتياطية كاملة (TAR.GZ) بنجاح!*\n\n📦 *اسم الملف:* ${backupName}\n\n*⚡ سورس الهواري الخارق 2026 ⚡*`
            }, { quoted: m });

            // تنظيف السيرفر وحذف الملف بعد إرساله
            fs.unlinkSync(backupPath);
            await m.react("✅");

        } catch (e) {
            console.error(e);
            return m.reply("❌ تم ضغط الملف، ولكن فشل إرساله عبر الواتساب (قد يكون الحجم أكبر من المسموح به).");
        }
    });
};

const cmd = ["نسخة", "نسخه", "backup", "سورس"];
run.usage = cmd;
run.command = cmd;
run.category = "owner";

export default run;