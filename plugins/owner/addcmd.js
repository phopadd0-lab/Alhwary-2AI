import fs from 'fs';
import path from 'path';

// مصفوفة عالمية لحفظ الجلسات المؤقتة
global.addCmdSession = global.addCmdSession || {};

const handler = async (m, { conn, text, isDeveloper }) => {
  // التحقق أن المستخدم هو المطور
  if (!isDeveloper) return m.reply("❌ ~ هذا الأمر خاص بشيوخ الديرة (المطورين) فقط! ~ 👑");

  // إذا كان المطور يريد إلغاء العملية
  if (text === 'الغاء' || text === 'cancel') {
    if (global.addCmdSession[m.sender]) {
      delete global.addCmdSession[m.sender];
      return m.reply("✅ ~ تم إلغاء عملية إضافة الأمر بنجاح.");
    }
    return m.reply("🔹 ~ ما عندك أي جلسة قائمة حالياً يا خوي.");
  }

  // بداية الجلسة: طلب اسم ومسار الملف
  global.addCmdSession[m.sender] = { step: 1 };
  
  return m.reply(
    `*☕ مـجـلـس إضـافـة الأوامـر الـجـديـدة*\n\n` +
    `يا مرحب بيك يا مطورنا، أرسل الحين *مسار الملف واسمه مع الصيغة* اللى تبغى تحفظ الكود فيه.\n\n` +
    `*أمثلة على المسارات المتاحة عندك:*\n` +
    `• \`plugins/ai/hawary.js\`\n` +
    `• \`plugins/main/menu.js\`\n\n` +
    `_لإلغاء العملية في أي وقت، أرسل كلمة: (الغاء)_`
  );
};

// --- دالة استقبال الرسائل (المرحلة الثانية والثالثة) ---
handler.before = async function (m, { isDeveloper }) {
  // التحقق أن المستخدم مطور ولديه جلسة مفتوحة ولها نص
  if (!isDeveloper || !global.addCmdSession || !global.addCmdSession[m.sender] || !m.text) return false;

  const session = global.addCmdSession[m.sender];

  // المرحلة الأولى: استلام اسم ومسار الملف
  if (session.step === 1) {
    if (m.text.toLowerCase() === 'الغاء') return false; // نترك المعالج الأساسي يتعامل معها

    const filePath = path.resolve(m.text.trim());
    
    // التحقق من الصيغة (تأكد أن الملف ينتهي بـ .js)
    if (!filePath.endsWith('.js')) {
      m.reply("⚠️ ~ خطأ في المسار! لازم اسم الملف ينتهي بصيغة الجافاسكريبت \`.js\`\nأرسل المسار الصحيح مرة ثانية:");
      return true;
    }

    // حفظ المسار والانتقال للمرحلة الثانية
    session.filePath = filePath;
    session.step = 2;

    m.reply(`✅ *تم اعتماد المسار:*\n\`${m.text}\`\n\n📥 الحين يا وافي، *أرسل كود الجافاسكريبت بالكامل* اللى تبي تحطه في الملف:`);
    return true;
  }

  // المرحلة الثانية: استلام الكود وحفظه
  if (session.step === 2) {
    if (m.text.toLowerCase() === 'الغاء') return false;

    const code = m.text;
    const targetPath = session.filePath;

    try {
      // التأكد من وجود المجلدات (إذا كان المجلد جديد يقوم بإنشائه تلقائياً)
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // كتابة وحفظ الملف
      fs.writeFileSync(targetPath, code, 'utf8');

      m.reply(`👑 *أبـشـر يـا خـوي، تـم الـحـفـظ بـنـجـاح!*\n\n📁 *الملف:* \`${path.basename(targetPath)}\`\n📍 *المسار:* \`${targetPath}\`\n\n_الأمر الحين جاهز وجاري تشغيله في البوت تلقائياً._`);
      
      // إنهاء الجلسة وحذفها
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
