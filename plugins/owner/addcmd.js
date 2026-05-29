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

  // بداية الجلسة: الانتقال للخطوة 1
  global.addCmdSession[m.sender] = { step: 1 };
  
  let txt = `*☕ مـجـلـس إضـافـة الأوامـر الـجـديـدة*\n\n` +
            `يا مرحب بيك يا مطورنا، أرسل الحين *مسار الملف واسمه مع الصيغة* اللى تبغى تحفظ الكود فيه.\n\n` +
            `*أمثلة على المسارات المتاحة عندك:*\n` +
            `• \`plugins/ai/hawary.js\`\n` +
            `• \`plugins/auto/reply.js\`\n\n` +
            `_يمكنك إلغاء العملية بالضغط على الزر أدناه في أي وقت._`;

  // 🔘 إرسال الرسالة مع زر الإلغاء التفاعلي
  return conn.sendMessage(m.chat, {
    text: txt,
    buttons: [
      { buttonId: 'الغاء', buttonText: { displayText: '❌ إلغاء العملية' }, type: 1 }
    ],
    headerType: 1,
    viewOnce: true
  }, { quoted: m });
};

// --- دالة استقبال الرسائل وفحص الخطوات ---
handler.before = async function (m) {
  const isDev = developerNumbers.includes(m.sender);
  if (!isDev || !global.addCmdSession || !global.addCmdSession[m.sender] || !m.text) return false;

  const session = global.addCmdSession[m.sender];
  const input = m.text.trim();

  // 🔥 طوق النجاة بالزرار: لو ضغطتي على الزرار أو كتبتي إلغاء، يتدمر المجلس فوراً
  if (input === 'الغاء' || input === 'إلغاء' || input.toLowerCase() === 'cancel') {
    delete global.addCmdSession[m.sender];
    m.reply("✅ ~ تم إلغاء عملية إضافة الأمر وفض المجلس بنجاح! البوت حر الآن.");
    return true; 
  }

  // المرحلة الأولى: استلام اسم ومسار الملف
  if (session.step === 1) {
    if (!input.endsWith('.js')) {
      let errorTxt = "⚠️ ~ خطأ في المسار! لازم اسم الملف ينتهي بصيغة الجافاسكريبت \`.js\`\nأرسل المسار الصحيح مرة ثانية، أو اضغطي إلغاء:";
      
      conn.sendMessage(m.chat, {
        text: errorTxt,
        buttons: [
          { buttonId: 'الغاء', buttonText: { displayText: '❌ إلغاء العملية' }, type: 1 }
        ],
        headerType: 1,
        viewOnce: true
      }, { quoted: m });
      
      return true;
    }

    // حفظ المسار الآمن والانتقال للمرحلة الثانية
    session.filePath = input;
    session.step = 2;

    let codeTxt = `✅ *تم اعتماد المسار:*\n\`${input}\`\n\n📥 الحين يا وافي، *أرسل كود الجافاسكريبت بالكامل* اللى تبي تحطه في الملف:`;

    conn.sendMessage(m.chat, {
      text: codeTxt,
      buttons: [
        { buttonId: 'الغاء', buttonText: { displayText: '❌ إلغاء العملية' }, type: 1 }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    return true;
  }

  // المرحلة الثانية: استلام الكود وحفظه
  if (session.step === 2) {
    const code = m.text;
    const targetPath = path.join(process.cwd(), session.filePath);

    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // كتابة وحفظ الملف بنجاح
      fs.writeFileSync(targetPath, code, 'utf8');

      m.reply(`👑 *أبـشـر يـا خـوي، تـم الـحـفـظ بـنـجـاح!*\n\n📁 *الملف:* \`${path.basename(targetPath)}\`\n📍 *المسار:* \`${session.filePath}\`\n\n_الأمر الحين جاهز للاستخدام الفوري_`);
      
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
