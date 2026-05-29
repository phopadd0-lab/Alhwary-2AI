import fs from 'fs';
import path from 'path';

// 👑 قائمة أرقام المطورين المسموح لهم
const developerNumbers = [
  '201556853817@s.whatsapp.net', 
  '201211883781@s.whatsapp.net'  
];

global.addCmdSession = global.addCmdSession || {};

const handler = async (m, { conn, text }) => {
  const isDev = developerNumbers.includes(m.sender);
  if (!isDev) return m.reply("❌ ~ هذا الأمر خاص بمطورة البوت فقط! ~ 👑");

  // بداية الجلسة: طلب اسم ومسار الملف
  global.addCmdSession[m.sender] = { step: 1 };
  
  return m.reply(
    `*☕ مـجـلـس إضـافـة الأوامـر الـجـديـدة*\n\n` +
    `يا مرحب بيك يا مطورنا، أرسل الحين *مسار الملف واسمه مع الصيغة* اللى تبغى تحفظ الكود فيه.\n\n` +
    `*أمثلة على المسارات المتاحة عندك:*\n` +
    `• \`plugins/ai/hawary.js\`\n` +
    `• \`plugins/auto/reply.js\`\n\n` +
    `_لإلغاء العملية في أي وقت، أرسل كلمة: (الغاء)_`
  );
};

// --- دالة استقبال الرسائل وفحص الخطوات ---
handler.before = async function (m) {
  const isDev = developerNumbers.includes(m.sender);
  if (!isDev || !global.addCmdSession || !global.addCmdSession[m.sender] || !m.text) return false;

  const session = global.addCmdSession[m.sender];
  const input = m.text.trim();

  // 🔥 طوق النجاة: لو كتبت إلغاء في أي خطوة، يتم تدمير الجلسة فوراً والخروج الآمن
  if (input === 'الغاء' || input === 'إلغاء' || input.toLowerCase() === 'cancel') {
    delete global.addCmdSession[m.sender];
    m.reply("✅ ~ تم إلغاء عملية إضافة الأمر وفض المجلس بنجاح! البوت حر الآن.");
    return true; // نرجع true عشان البوت يعرف إننا قفلنا الجلسة وميعلقش
  }

  // المرحلة الأولى: استلام اسم ومسار الملف
  if (session.step === 1) {
    // التحقق من الصيغة (تأكد أن الملف ينتهي بـ .js)
    if (!input.endsWith('.js')) {
      m.reply("⚠️ ~ خطأ في المسار! لازم اسم الملف ينتهي بصيغة الجافاسكريبت \`.js\`\nأرسل المسار الصحيح مرة ثانية، أو أرسل *الغاء* للخروج:");
      return true;
    }

    // حفظ المسار النسبي الآمن والانتقال للمرحلة الثانية
    session.filePath = input;
    session.step = 2;

    m.reply(`✅ *تم اعتماد المسار:*\n\`${input}\`\n\n📥 الحين يا وافي، *أرسل كود الجافاسكريبت بالكامل* اللى تبي تحطه في الملف:`);
    return true;
  }

  // المرحلة الثانية: استلام الكود وحفظه
  if (session.step === 2) {
    const code = m.text;
    const targetPath = path.join(process.cwd(), session.filePath);

    try {
      // التأكد من وجود المجلدات قبل الكتابة
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // كتابة وحفظ الملف بنجاح
      fs.writeFileSync(targetPath, code, 'utf8');

      m.reply(`👑 *أبـشـر يـا خـوي، تـم الـحـفـظ بـنـجـاح!*\n\n📁 *الملف:* \`${path.basename(targetPath)}\`\n📍 *المسار:* \`${session.filePath}\`\n\n_الأمر الحين جاهز للاستخدام الفوري_`);
      
      // إنهاء الجلسة وحذفها بأمان
      delete global.addCmdSession[m.sender];
    } catch (error) {
      m.reply(`❌ ~ حدث خطأ أثناء حفظ الملف يا خوي:\n\`\`\`${error.message}\`\`\``);
      delete global.addCmdSession[m.sender];
    }
    return true;
  }
};

handler.usage = ["اضافة_امر"];
handler.category = "developer";
handler.command = ["اضافة_امر", "addcmd", "savecmd"];

export default handler;
