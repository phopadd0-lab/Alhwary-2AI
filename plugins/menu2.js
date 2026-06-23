import os from 'os';

const CATEGORIES = [
  [1, 'التـحـمـيـل', 'downloads', '📥'],
  [2, 'الـمـجـمـوعـات', 'group', '👥'],
  [3, 'الـمـلـصـقـات', 'sticker', '🎨'],
  [4, 'الـمـطـوريـن', 'owner', '🛠️'],
  [5, 'امـثـلـه', 'example', '📖'],
  [6, 'الـادوات', 'tools', '⚡'],
  [7, 'الـبـحـث', 'search', '🔍'],
  [8, 'الادمــن', 'admin', '🧑‍💼'],
  [9, 'الالــعـاب', 'games', '🎮'],
  [10, 'الچيف', 'gif', '🎞️'],
  [11, 'الـبــنـك', 'bank', '🏦'],
  [12, 'الـذكـاء الاصـطـنـاعـي', 'ai', '🤖'],
  [13, 'الـبـوتـات الـفـرعـي', 'sub', '🧩'],
  [14, 'مـعـلومـات الـبـوت', 'info', '📊'],
  [15, 'الـالــقــاب', 'nicknames', '🏷️'],
  [16, 'الـلـوجـوهــات', 'logos', '🎯'],
  [17, 'تـغـيـر الاصـوات', 'voices', '🎤'],
  [18, 'أخــرى', 'other', '✨']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

let handler = async (m, { conn, bot, command, args }) => {
  const { images } = bot.config.info;
  const img = Array.isArray(images) ? images[Math.floor(Math.random() * images.length)] : images;

  // حساب الرام
  const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB";

  // حساب البنج
  const start = Date.now();
  await conn.sendMessage(m.chat, { text: "⏳ جاري قياس البنج..." });
  const ping = Date.now() - start;

  // عدد الأوامر
  const commandCount = bot.stats?.commands || 0;

  // الرتبة
  let rank = "👤 عضو";
  if (m.sender === bot.config.owner) rank = "👑 Owner";
  else if (bot.admins?.includes(m.sender)) rank = "🛡️ Admin";

  // الوقت والتاريخ
  const now = new Date();
  const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (!args[0]) {
    const sections = [{
      title: "⚡ ~ الأقسام ~ 🚀",
      rows: CATEGORIES.map(c => ({
        title: `${c[0]} ~ ${c[1]} ${c[3]}`,
        description: `اضغط لعرض أوامر قسم ${c[1]}`,
        id: `.${command} ${c[0]}`
      }))
    }];

    const menuText = `
⚡━━━⟦ الـمـنـيـو ⟧━━━⚡
👋 أهلاً → [ @${m.sender.split("@")[0]} ]
👑 رتبتك → ${rank}
🕒 الوقت → ${time}
📅 التاريخ → ${date}
📊 عدد الأوامر → ${commandCount}
💾 الرام → ${totalRam}
📡 البنج → ${ping} ms
━━━━━━━━━━━━━━━━━━━━━━━
> اختار قسم من القائمة ⬇️
`;

    await conn.sendButtonNormal(m.chat, {
      media: { url: img },
      mediaType: 'image',
      caption: menuText,
      buttons: [
        { name: "single_select", params: { title: "⚡ الأقسام 🚀", sections: sections } },
        { name: "cta_url", params: { display_text: "📎 القناة 🚀", url: "https://t.me/YourChannel" } },
        { name: "cta_url", params: { display_text: "👨‍💻 المطور ⚡", url: "https://wa.me/201234567890" } }
      ],
      mentions: [m.sender],
      newsletter: {
        name: '𝐕𝐈𝐈7 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363225356834044@newsletter'
      }
    }, global.reply_status);
    return;
  }

  const selected = parseInt(args[0]);
  const cat = getCat(selected);
  if (!cat) {
    await conn.sendMessage(m.chat, { text: '*❌ اختار رقم صحيح من 1 لـ 18*' }, { quoted: m });
    return;
  }

  const cmds = await bot.getAllCommands();
  const categoryCmds = cmds.filter(c => c.category === cat[2]);

  if (!categoryCmds.length) {
    await conn.sendMessage(m.chat, { text: '*❌ القسم فاضي*' }, { quoted: m });
    return;
  }

  const cmdsList = categoryCmds.map(c => `${cat[3]} /${c.usage?.join(`\n${cat[3]} /`)}`).join('\n');

  await conn.sendMessage(m.chat, { text: `
⚡━━━⟦ ${cat[1]} ${cat[3]} ⟧━━━⚡
${cmdsList}
━━━━━━━━━━━━━━━━━━━━━━━
👑 ${bot?.config?.info?.nameBot || 'POMNI-AI'}
` }, { quoted: m });
};

handler.command = ['منيو', 'menu'];
export default handler;