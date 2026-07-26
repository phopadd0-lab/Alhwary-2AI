import fs from 'fs';
import path from 'path';
import axios from 'axios';

async function handler(m, { conn, text }) {
    try {
        const filePath = path.resolve('./media/menu_img.jpg');
        
        // التأكد من وجود المجلد
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let imageBuffer = null;

        // --- 1. الحالة الأولى: إدخال رابط صورة مباشرة بعد الأمر ---
        if (text && text.match(/^https?:\/\/.+/i)) {
            const imageUrl = text.trim();
            await m.reply('⏳ *جاري تحميل الصورة من الرابط ورسخها كصورة للقائمة...*');
            
            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(response.data, 'binary');
            } catch (err) {
                return await m.reply('❌ فشل تحميل الصورة من الرابط! تأكد من أن الرابط مباشر وصحيح.');
            }
        } 
        
        // --- 2. الحالة الثانية: الرد (ريبلاي) على صورة مرفوعة ---
        else {
            const q = m.quoted ? m.quoted : m;
            const mime = (q.msg || q).mimetype || '';

            if (mime && mime.startsWith('image/')) {
                await m.reply('⏳ *جاري حفظ الصورة المرفقة كصورة للقائمة...*');
                imageBuffer = await q.download();
            }
        }

        // لو مفيش رابط ولا صورة مرفوعة
        if (!imageBuffer) {
            return await m.reply(
                '⚠️ *طريقة الاستخدام:*\n\n' +
                '1️⃣ أرسل رابط الصورة مباشرة بعد الأمر:\n' +
                '• `.setmenuimg https://example.com/image.jpg`\n\n' +
                '2️⃣ أو قم بالرد (ريبلاي) على أي صورة مكتوباً الأمر.'
            );
        }

        // حفظ الصورة في ملف البوت
        fs.writeFileSync(filePath, imageBuffer);

        await m.reply('✅ *تم تحديث صورة القائمة بنجاح!* 🖼️\nستظهر هذه الصورة الجديدة عند طلب قائمة الأوامر.');

    } catch (error) {
        console.error('Error in setmenuimg handler:', error);
        await m.reply('❌ حدث خطأ أثناء تغيير صورة القائمة.');
    }
}

handler.customPrefix = /^\./;
handler.command = new RegExp('^(تغير|setmenuimg|setmenuimage)$', 'i');

export default handler;