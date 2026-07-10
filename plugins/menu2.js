const CATEGORIES = [
  [1, 'download ', 'downloads', '📥'],
  [2, 'group ', 'group', '👥'],
  [3, 'sticker', 'sticker', '🎨'],
  [4, 'owner', 'owner', '🛠️'],
  [5, 'example', 'example', '📖'],
  [6, 'tools', 'tools', '⚡'],
  [7, 'search', 'search', '🔍'],
  [8, 'admin', 'admin', '🧑‍💼'],
  [9, 'games', 'games', '🎮'],
  [10, 'gif', 'gif', '🎞️'],
  [11, 'bank', 'bank', '🏦'],
  [12, 'ai', 'ai', '🤖'],
  [13, 'sub', 'sub', '🧩'],
  [14, 'info', 'info', '📊'],
  [15, 'nicknames', 'nicknames', '🏷️'],
  [16, 'logos', 'logos', '🎯'],
  [17, 'voices', 'voices', '🎤'],
  [18, 'other', 'other', '🌌']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

let handler = async (m, { conn, bot, command, args }) => {
  const { images } = bot.config.info;
  const img = Array.isArray(images) ? images[Math.floor(Math.random() * images.length)] : images;

  const start = Date.now();
  const loading = await conn.sendMessage(m.chat, { text: "🌿 I am waiting " });
  const ping = Date.now() - start;
  if (loading) await conn.sendMessage(m.chat, { delete: loading.key });

  const cmds = await bot.getAllCommands();

  let rank = "👤 عضو";
  if (m.sender.includes("201556853817")) rank = "🍃Developer ";
  else if (m.sender === bot.config.owner) rank = "👑 Owner";
  else if (bot.admins?.includes(m.sender)) rank = "🛡️ Admin";

  const now = new Date();
  const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const day = now.toLocaleDateString('ar-EG', { weekday: 'long' });

  if (!args[0]) {
    const sections = [{
      title: "┏━ 🗂️ الأقسام ━┓",
      rows: CATEGORIES.map(c => ({
        title: `[ ${c[3]} ] ${c[1]}`,
        description: `⚡ عرض أوامر قسم ${c[1]}`,
        id: `.${command} ${c[0]}`
      }))
    }];

    const menuText = `
> 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝐼𝑛 𝐵𝑜𝑡 『𝐴𝐿𝐻𝑊𝐴𝑅𝑌』
> ↵منور يا @${m.sender.split("@")[0]}



> 〘<>〙 المنشن: @${m.sender.split("@")[0]}

> 〘<>〙 الرتبة: ${rank} 

> 〘<> 〙 البينج: ${ping} ms

> 〘<> 〙 اليوم: ${day}

> 〘<> 〙 التاريخ: ${date}
> 〘<> 〙 الوقت: ${time}
 `;
    await conn.sendButtonNormal(m.chat, {
      media: { url: img },
      mediaType: 'image',
      caption: menuText,
      buttons: [
        { name: "single_select", params: { title: "『❄️┆الأقسام┆❄️』", sections } },
        { name: "cta_url", params: { display_text: "『☘️┆القناة┆☘️』", url: "https://whatsapp.com/channel/0029Vb6VF4R3bbUwgCtJlC3U" } },
        { name: "cta_url", params: { display_text: "『🍃┆المطور┆🍃』", url: "https://wa.me/201556853817" } }
      ],
      mentions: [m.sender]
    }, global.reply_status);
    return;
  }

  const cat = getCat(parseInt(args[0]));
  if (!cat) return conn.sendMessage(m.chat, { text: '*❌ اختار رقم صحيح من 1 لـ 18*' }, { quoted: m });

  const categoryCmds = cmds.filter(c => c.category === cat[2]);
  if (!categoryCmds.length) return conn.sendMessage(m.chat, { text: '*❌ القسم فاضي حالياً*' }, { quoted: m });

  const cmdsList = categoryCmds.map(c => {
    const usage = Array.isArray(c.usage) ? c.usage.join('\n┊⇇『 .') : c.usage;
    return `┊⇇『 .${usage} 』`;
  }).join('\n');

  const messageText = `
╭━━━〔 ${cat[3]} 〕━━━╮
『 قسم ${cat[1]} 』
${cmdsList}
━━━━━━━━━━━━━━━
> ┃ 🤖 البوت: 𝑨𝑳𝑯𝑾𝑨𝑹𝒀
> ┃ 👑 المطور: 𝑎𝑙ℎ𝑤𝑎𝑟𝑦
━━━━━━━━━━━━━━━`;

  await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });
};

handler.command = ['منيو', 'menu'];
export default handler;