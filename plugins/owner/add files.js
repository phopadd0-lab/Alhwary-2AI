import fs from 'fs';
import path from 'path';

// 👑 أرقام المطورين
const developerNumbers = [
  '201556853817@s.whatsapp.net',
  '201211883781@s.whatsapp.net'
];

// حفظ الجلسات
global.addCmdSession = global.addCmdSession || {};

const handler = async (m) => {
  const isDev = developerNumbers.includes(m.sender);
  if (!isDev) {
    return m.reply("❌ هذا الأمر خاص بالمطور فقط");
  }

  // إنشاء جلسة جديدة
  global.addCmdSession[m.sender] = {
    step: 1
  };

  return m.reply(
`╭─┈─┈─┈─⟞🛡️⟝─┈─┈─┈─╮
┃ 👑 إضافة أمر جديد
╰─┈─┈─┈─⟞🛡️⟝─┈─┈─┈─╯

📁 أرسل الآن:
اسم ومسار الملف بالكامل

✦ مثال:
plugins/ai/test.js

✦ مثال:
plugins/tools/menu.js

❌ للإلغاء:
الغاء`
  );
};

// ==========================
// متابعة الخطوات
// ==========================
handler.before = async function (m) {
  // جلب النص بأضمن طريقة برمجية ممكنة لمنع مشاكل الـ multi-line
  const rawText = m.text || m.msg?.text || '';
  if (!rawText) return false;

  const isDev = developerNumbers.includes(m.sender);
  if (!isDev) return false;

  const session = global.addCmdSession?.[m.sender];
  if (!session) return false;

  const input = rawText.trim();

  // ==========================
  // إلغاء العملية بأمان
  // ==========================
  const cancelWords = ['الغاء', 'إلغاء', 'cancel', 'stop', 'exit'];
  if (cancelWords.includes(input.toLowerCase())) {
    if (global.addCmdSession && global.addCmdSession[m.sender]) {
      delete global.addCmdSession[m.sender];
    }
    await m.reply(
`✅ تم إلغاء العملية بنجاح

🗑️ تم حذف الجلسة الحالية
🚀 يمكنك بدء عملية جديدة بأي وقت`
    );
    return true;
  }

  // ==========================
  // المرحلة 1 : المسار
  // ==========================
  if (session.step === 1) {
    // حماية المسارات
    if (input.includes('..') || input.startsWith('/') || input.startsWith('\\')) {
      return m.reply("❌ مسار غير مسموح لحماية السيرفر من الاختراق الكشميري");
    }

    // التأكد من امتداد الـ js
    if (!input.endsWith('.js')) {
      return m.reply(
`⚠️ لازم الملف ينتهي بـ .js

مثال:
plugins/tools/test.js`
      );
    }

    // حفظ المسار
    session.filePath = input;
    const fullPath = path.join(process.cwd(), input);

    try {
      const dir = path.dirname(fullPath);

      // إنشاء المجلدات لو مش موجودة
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // إنشاء ملف فارغ مؤقتاً لتهيئة المساحة
      fs.writeFileSync(fullPath, '', 'utf8');

      // الانتقال للمرحلة التالية
      session.step = 2;

      return m.reply(
`✅ تم إنشاء الملف بنجاح

📁 الملف:
${path.basename(fullPath)}

📍 المسار:
${input}

📥 أرسل الآن الكود بالكامل (انسخي الكود كله وابعتيه هنا الحين)`
      );

    } catch (err) {
      delete global.addCmdSession[m.sender];
      return m.reply(`❌ حدث خطأ أثناء إنشاء الملف:\n${err.message}`);
    }
  }

  // ==========================
  // المرحلة 2 : حفظ الكود الصافي
  // ==========================
  if (session.step === 2) {
    const fullPath = path.join(process.cwd(), session.filePath);

    try {
      // كتابة الكود بالاعتماد على النص الخام الصافي لضمان عدم سقوط أي سطر أو رمز خلفي
      fs.writeFileSync(fullPath, rawText, 'utf8');

      // حذف الجلسة لإنهاء العملية بنجاح
      delete global.addCmdSession[m.sender];

      return m.reply(
`👑 تم حفظ الكود بنجاح واستقرار!

📁 الملف:
${path.basename(fullPath)}

📍 المسار:
${session.filePath}

🚀 الأمر أصبح جاهز للاستخدام فوراً في سورس الهواري`
      );

    } catch (err) {
      delete global.addCmdSession[m.sender];
      return m.reply(`❌ حدث خطأ أثناء حفظ الكود داخل السيرفر:\n${err.message}`);
    }
  }

  return false;
};

handler.command = ['اضافة_امر', 'addcmd', 'savecmd'];
handler.category = 'developer';
handler.usage = ['اضافة_امر'];

export default handler;
