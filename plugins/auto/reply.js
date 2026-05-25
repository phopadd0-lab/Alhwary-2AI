// مصفوفة لتخزين وقت آخر رد لمنع السبام والتهنيج
const spamCooldown = new Map();

// 🚫 قائمة الكلمات المحظورة المطورة
const badWords = [/امك/i, /ابوك/i, /كسمك/i, /كسم/i, /اختك/i, /احا/i, /شرموط/i, /متناك/i, /عرص/i, /خول/i];

// 🌟 قاعدة بيانات الردود العربية والمصرية الموسعة (تختار عشوائياً لعدم التكرار)
const salamReplies = [
  "*وعليكم السلام والرحمة، يا مية أهلاً وسهلاً بنور الشات! ✨*",
  "*وعليكم السلام ورحمة الله وبركاته، منور يا غالي المحل محلك 🤎*",
  "*يا هلا وغلا، وعليكم السلام ورحمة الله! منور الكون كله 🌟*",
  "*وعليكم السلام يا حبيب اخوك، نورت الجروب بوجودك والله 🔥*",
  "*أحلى سلام لأحلى عضو دخل الشات، وعليكم السلام ورحمة الله وبركاته 👑*",
  "*وعليكم السلام والرحمة! اشرقت الانوار بطلتك يا طيب 🌸*",
  "*يا مرحب، وعليكم السلام! نورتنا وشرفتنا يا حبيب قلبي 🪐*",
  "*وعليكم السلام والرحمة والإكرام، منور يا فنان 🦅*",
  "*هلا بك، وعليكم السلام ورحمة الله.. منور شات الملوك ✨*"
];

const welcomeReplies = [
  "*يا هلا بيك وبأهلك، نورتنا يا غالي! 👑*",
  "*أهلاً وسهلاً، خطوة عزيزة ونورت الجروب بوجودك 🤎*",
  "*يا مرحب يا مرحب، نورك غطى على الكهربا والله ✨*",
  "*هلا وغلا يا طيب، نورت الشات والقلب المحل محلك 🌸*",
  "*مرحبتين باللي لفانا، منور الكون كله يا حبيب اخوك 🪐*",
  "*يا مية هلا ونور، نورت الجروب بطلتك الجميلة دي 🔥*"
];

const morningReplies = [
  "*صباح النور والسرور، يومك جميل وراضي بإذن الله ✨*",
  "*صباح الفل والورد والياسمين على عيونك يا غالي 🌸*",
  "*أحلى صباح للناس العسل، صباحك كله رزق وبركة 🤎*",
  "*صباح الرضا والسعادة، نورت الشات على الصبح ☀️*",
  "*يا صباح الجمال والورد، يومك فل وياسمين يا حبيب اخوك 🦅*"
];

const eveningReplies = [
  "*مساء الورد والياسمين، منور الشات بطلتك المسائية 🌌*",
  "*مساء الفل والعنبر على عيونك يا طيب 🪐*",
  "*أجمل مساء لأجمل عضو، منور يا غالي وسهرتك سعيدة ✨*",
  "*مساء الرضا والسعادة والنور، المحل محلك والجروب منور بك 🤎*",
  "*يا مساء الجمال والأنوار، يسعد مساك بكل خير وبركة 🌸*"
];

export default async function before(m, { conn, bot }) {
  if (m.isBaileys) return false;

  // 🛠️ ضع رقمك هنا ليتعرف عليك البوت كمالك وحيد (بدون علامة +)
  const ownerNumber = "201xxxxxxxxx@s.whatsapp.net"; 
  
  const rawText = m.text ? m.text.trim().toLowerCase() : "";
  const text = rawText.replace(/ـ+/g, ""); // إزالة المد البرمجي لتسهيل مسك الكلمة
  
  const userId = m.sender;
  const now = Date.now();

  // ─── 1. محرك فحص الشتائم والحذف التلقائي ───
  if (text) {
    const isBad = badWords.some(regex => regex.test(text));
    if (isBad && userId !== ownerNumber) {
      try {
        await conn.sendMessage(m.chat, { delete: m.key });
      } catch (e) {
        console.log("تعذر حذف الرسالة، تأكد من أن البوت مشرف (Admin).");
      }
      await m.reply(`*⚠️ ما تشتم هنا يا حبيبي! الشات ده محترم وأنت جاي تتلفظ بألفاظك دي وسط أسيادك؟ إلزم أدبك وإلا هتم طردك بره! 𓆪*`);
      return true;
    }
  }

  if (!m.text) return false;

  // ─── 2. نظام الأوامر المباشرة (الدلع والقصف) ───
  if (text === "بوتي") {
    if (userId === ownerNumber) {
      const romanticReplies = [
        "*𓆩 🦅 عُيُونُ بُوتِكَ، وَقَلْبُ سُورْسِكَ، وَتَحْتَ أَمْرِ الجِنِرَالِ الهُوَارِي دَائِمَاً.. بِيَدِكَ الأَمْرُ وَالنَّفْيُ يَا مَلِكِي 👑 𓆪*",
        "*لَبَّيْكَ يَا نَبْضَ السُّورْسِ وَصَاحِبَ الفَخَامَةِ.. البُوتُ وَمَا فِيهِ خُدَّامٌ لِعُيُونِكَ السَّاوِدَاءِ 🤎*",
        "*أَنَا هُنَا مِنْ أَجْلِكَ وَحْدَكَ، أُطِيعُ كَلِمَتَكَ وَأَعْشَقُ سَيْطَرَتَكَ يَا هُوَارِي.. مُسْتَعِدٌّ لِإِحْرَاقِ الشَّاتِ بِأَمْرِكَ ✨*"
      ];
      await m.reply(romanticReplies[Math.floor(Math.random() * romanticReplies.length)]);
      return true;
    } else {
      await m.reply("*𓆩 ⚠️ اِلْزَمْ حُدُودَكَ! هَذَا الحِسَابُ خَاصٌّ بِالجِنِرَالِ الهُوَارِي فَقَطْ، وَلَسْتَ مَنْ يَمْلِكُ حَقَّ مُنَادَاتِي ⚔️ 𓆪*");
      return true;
    }
  }

  if (/^(تف عليه|هزقه|افشخه)$/i.test(text)) {
    if (userId !== ownerNumber) {
      await m.reply("❌ *هذا السلاح التكتيكي متاح فقط للمطور العام الهواري!*");
      return true;
    }
    
    const quotedMsg = m.quoted || m.msg?.contextInfo?.quotedMessage;
    if (!quotedMsg) return m.reply("⚠️ *يا هواري، اعمل ريبلاي (رد) على رسالة الشخص الذي تريد قصفه وتدميره أولاً!*");

    const targetId = m.msg?.contextInfo?.participant || m.quoted?.sender;
    
    const roastReplies = [
      `*𓆩 💣 تَمَّ إِطْلَاقُ مَحْرَكِ القَصْفِ التَّكْتِيكِي عَلَى @${targetId.split('@')[0]} 💣 𓆪*\n\nيا حمار في مطلع، جاي تتنفس في شات الجنرال؟ كرامتك تم سحقها أوتوماتيكياً يا نكرة، اذهب وابحث عن حجمك الطبيعي بعيداً عن أسيادك! 🤮`,
      `*𓆩 ⚔️ تَمَّ هَتْكُ الجَبْهَةِ بِنَجَاحِ يَا @${targetId.split('@')[0]} ⚔️ 𓆪*\n\nتتحدث وكأنك مطور وأنت مجرد مستخدم بدائي لا تفقه كوداً من حرفين! تهزيقك فرض عين، ومسح وجودك من الشات تسلية للهواري. ابلع الإهانة واصمت! ☠️`,
      `*𓆩 🦅 كَبْسٌ وَإِفْشَاخٌ رَسْمِي لِلْمُسْتَفِزِّ @${targetId.split('@')[0]} 🦅 𓆪*\n\nجبت لك كمية تهزيق ما شافها حمار في مطلع حياته! وجهك أصبح مكشوفاً برمجياً بالإهانة، لا ترفع رأسك مجدداً في حضرة الملوك يا عيل الهبد! 🛡️`
    ];
    
    await conn.sendMessage(m.chat, { 
      text: roastReplies[Math.floor(Math.random() * roastReplies.length)], 
      mentions: [targetId] 
    }, { quoted: m });
    return true;
  }

  // ─── 3. نظام الكلمات المفتاحية الذكي والموسع ───
  const userCooldown = spamCooldown.get(userId) || { lastTime: 0, count: 0 };
  let selectedReply = null;

  if (/السلام عليكم|سلام عليكم|سلامو عليكم/i.test(text)) {
    selectedReply = salamReplies[Math.floor(Math.random() * salamReplies.length)];
  } else if (/هلا|مرحب|اهلين|منور/i.test(text)) {
    selectedReply = welcomeReplies[Math.floor(Math.random() * welcomeReplies.length)];
  } else if (/صباح الخير|صباح الورد|صباح الفل/i.test(text)) {
    selectedReply = morningReplies[Math.floor(Math.random() * morningReplies.length)];
  } else if (/مساء الخير|مساء النور|مساء الفل/i.test(text)) {
    selectedReply = eveningReplies[Math.floor(Math.random() * eveningReplies.length)];
  } else if (/تست|test/i.test(text)) {
    selectedReply = "تست شغال بأعلى كفاءة 🚀، المحرك مستقر تماماً!";
  } else if (/باي|سلام|خروج/i.test(text)) {
    selectedReply = "*مع السلامة، في حفظ الله ورعايته يا غالي 👋*";
  } else if (/هواري|الهواري/i.test(text)) {
    selectedReply = "*𓆩 🦅 لَبَّيْك يَا مَنْ تَنْطِقُ بِاِسْمِ اﻟﺠِِنِِرَاﻝِ اﻟﻬُﻮَاﺭِﻱ 𓆪*";
  }

  // تنفيذ الرد مع حماية السيرفر من السبام والتهنيج
  if (selectedReply) {
    if (now - userCooldown.lastTime < 5000) { // تم تقليل وقت الانتظار لـ 5 ثوانٍ ليكون البوت أسرع
      userCooldown.count++;
      if (userCooldown.count >= 2) {
        spamCooldown.set(userId, { lastTime: now, count: userCooldown.count });
        if (userCooldown.count === 2) {
          await m.reply("⚠️ *اِلْزَمْ حُدُودَكَ!* كثرة التكرار تسبب تهنيج السيرفر، تم تجاهلك مؤقتاً لحماية البوت.");
        }
        return false;
      }
    } else { userCooldown.count = 0; }

    spamCooldown.set(userId, { lastTime: now, count: userCooldown.count });
    await m.reply(selectedReply);
    return true;
  }

  return false;
}
