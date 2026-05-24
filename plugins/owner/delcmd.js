import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, text, args, isDeveloper }) => {
  // التحقق أن المستخدم هو المطور
  if (!isDeveloper) return m.reply("❌ ~ هذا الأمر خاص بشيوخ الديرة (المطورين) فقط! ~ 👑");

  if (!text) {
    return m.reply(
      `*☕ مـجـلـس إلـغـاء وإيـقـاف الأوامـر (حـذف نـهـائـي)*\n\n` +
      `يا مرحب بيك يا مطورنا، أرسل مسار الملف اللى تبي تحذفه وتوقفه نهائياً من البوت.\n\n` +
      `*طريقة الاستخدام:*\n` +
      `• \`.ايقاف_امر plugins/ai/test.js\`\n\n` +
      `_⚠️ تنبيه: هذا الأمر سيقوم بحذف ملف الكود تماماً من السيرفر._`
    );
  }

  const targetPath = path.resolve(text.trim());

  // التأكد من أن الملف موجود بالفعل قبل حذفه
  if (!fs.existsSync(targetPath)) {
    return m.reply(`⚠️ ~ العذر منك يا خوي، هالملف مو موجود في هذا المسار:\n\`${text}\``);
  }

  try {
    // حذف الملف نهائياً
    fs.unlinkSync(targetPath);

    m.reply(`🗑️ *أبـشـر يـا خـوي، تـم إلـغـاء الأمـر بـنـجـاح!*\n\n📁 *الملف المحذوف:* \`${path.basename(targetPath)}\`\n📍 *المسار:* \`${text}\`\n\n_تم إيقاف وحذف الكود نهائياً من السيرفر._`);
  } catch (error) {
    m.reply(`❌ ~ حدث خطأ أثناء محاولة حذف الملف يا خوي:\n\`\`\`${error.message}\`\`\``);
  }
};

handler.usage = ["ايقاف_امر"];
handler.category = "developer";
handler.command = ["ايقاف_امر", "حذف_امر", "delcmd"];

export default handler;
