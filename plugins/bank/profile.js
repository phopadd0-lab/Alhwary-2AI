async function handler(m, { conn, bot }) {
    // تحديد الشخص: إذا كان هناك ريبلاي (m.quoted) نستخدم صاحب الرسالة، وإلا نستخدم المرسل (m.sender)
    let who = m.quoted ? m.quoted.sender : m.sender;
    
    // جلب بيانات الشخص من قاعدة البيانات
    const user = global.db?.users[who] || {};
    const xp = user.xp || 0;
    const level = user.level || 0;
    const nameLevel = user.nameLevel || 'مـشـاهـد';
    const cookies = user.cookies || 0;
    const warnings = user.warnings || 0;
    const banned = user.banned || false;
    const premium = user.premium || false;
    const name = user.name || 'غير مسجل';
    const age = user.age || 'غير مسجل';

    // جلب الاسم والرقم
    const pushName = await conn.getName(who);
    const phoneNumber = who.split('@')[0];

    const nextLevelXp = (() => {
        const levels = [100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17500, 20000];
        return levels[level] || levels[levels.length - 1];
    })();

    const xpProgress = Math.min(100, Math.floor((xp / nextLevelXp) * 100));
    const status = banned ? 'مـحـظـور' : (premium ? 'بـريـمـيـوم' : 'عـادي');

    const profilePic = await conn.profilePictureUrl(who, 'image').catch(() => 'https://i.pinimg.com/originals/11/26/97/11269786cdb625c60213212aa66273a9.png');

    // رسالة البروفايل بدون إيموجيات مزعجة
    const msg = `╭───────────────╮
  *بـروفـايـل ${pushName}*
╰───────────────╯

📱 *الـرقـم:* ${phoneNumber}
🏷️ *الاسـم:* ${pushName}
📝 *الاسـم الـمـسـجـل:* ${name}
📅 *الـعـمـر:* ${age}
🎭 *الـلـقـب:* ${nameLevel}
📊 *الـمـسـتـوى:* ${level}
⭐ *الـنـقـاط:* ${xp} / ${nextLevelXp}
📈 *الـتـقـدم:* [${'░'.repeat(Math.floor(xpProgress / 10))}${'─'.repeat(10 - Math.floor(xpProgress / 10))}] ${xpProgress}%
🍪 *الـكـوكـيـز:* ${cookies}
⚠️ *الـتـحـذيـرات:* ${warnings}
🏷️ *الـحـالـة:* ${status}

*استمر في التفاعل لترفع مستواك*`;

    const cfg = bot.config.info;
    await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: msg,
        contextInfo: {
            mentionedJid: [who],
            isForwarded: true,
            forwardingScore: 1,
            forwardedNewsletterMessageInfo: {
                newsletterJid: cfg.idChannel,
                newsletterName: cfg.nameChannel,
                serverMessageId: 0
            }
        }
    }, { quoted: m });
}

handler.usage = ["بروفايل"];
handler.category = "bank";
handler.command = ["بروفايل", "profile", "my"];

export default handler;
