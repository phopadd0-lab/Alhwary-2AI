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

  if (!m.text) return false;

  const isDev = developerNumbers.includes(m.sender);

  if (!isDev) return false;

  const session = global.addCmdSession?.[m.sender];

  if (!session) return false;

  const input = m.text.trim();

  // ==========================
  // إلغاء العملية بأمان
  // ==========================
  const cancelWords = [
    'الغاء',
    'إلغاء',
    'cancel',
    'stop',
    'exit'
  ];

  if (
    cancelWords.includes(
      input.toLowerCase().trim()
    )
  ) {

    if (
      global.addCmdSession &&
      global.addCmdSession[m.sender]
    ) {
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
    if (
      input.includes('..') ||
      input.startsWith('/') ||
      input.startsWith('\\')
    ) {

      return m.reply("❌ مسار غير مسموح");
    }

    // التأكد من js
    if (!input.endsWith('.js')) {

      return m.reply(
`⚠️ لازم الملف ينتهي بـ .js

مثال:
plugins/tools/test.js`
      );
    }

    // حفظ المسار
    session.filePath = input;

    const fullPath = path.join(
      process.cwd(),
      input
    );

    try {

      const dir = path.dirname(fullPath);

      // إنشاء المجلدات
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true
        });
      }

      // إنشاء الملف لو غير موجود
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(
          fullPath,
          '',
          'utf8'
        );
      }

      // الانتقال للمرحلة التالية
      session.step = 2;

      return m.reply(
`✅ تم إنشاء الملف بنجاح

📁 الملف:
${path.basename(fullPath)}

📍 المسار:
${input}

📥 أرسل الآن الكود بالكامل`
      );

    } catch (err) {

      delete global.addCmdSession[m.sender];

      return m.reply(
`❌ حدث خطأ أثناء إنشاء الملف

${err.message}`
      );
    }
  }

  // ==========================
  // المرحلة 2 : حفظ الكود
  // ==========================
  if (session.step === 2) {

    const fullPath = path.join(
      process.cwd(),
      session.filePath
    );

    try {

      // كتابة الكود داخل الملف
      fs.writeFileSync(
        fullPath,
        m.text,
        'utf8'
      );

      // حذف الجلسة
      delete global.addCmdSession[m.sender];

      return m.reply(
`👑 تم حفظ الكود بنجاح

📁 الملف:
${path.basename(fullPath)}

📍 المسار:
${session.filePath}

🚀 الأمر أصبح جاهز للاستخدام`
      );

    } catch (err) {

      delete global.addCmdSession[m.sender];

      return m.reply(
`❌ حدث خطأ أثناء حفظ الكود

${err.message}`
      );
    }
  }

  return false;
};

handler.command = [
  'اضافة_امر',
  'addcmd',
  'savecmd'
];

handler.category = 'developer';

handler.usage = ['اضافة_امر'];

export default handler;
