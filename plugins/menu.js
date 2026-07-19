const CATEGORIES = [
    [1, 'التـحـمـيـل', 'downloads', '↳'],
    [2, 'الـمـجـمـوعـات', 'group', '↳'],
    [3, 'الـمـلـصـقـات', 'sticker', '↳'],
    [4, 'الـمـطـوريـن', 'owner', '↳'],
    [5, 'الـادوات', 'tools', '↳'],
    [6, 'الـبـحـث', 'search', '↳'],
    [7, 'الادمــن', 'admin', '↳'],
    [8, 'الالــعـاب', 'games', '↳'],
    [9, 'الچيف', 'gif', '↳'],
    [10, 'الـبــنـك', 'bank', '↳'],
    [11, 'الـذكـاء الاصـطـنـاعـي', 'ai', '↳'],
    [12, 'الـبـوتـات الـفـرعـي', 'sub', '↳'],
    [13, 'مـعـلومـات الـبـوت', 'info', '↳'],
    [14, 'الـالــقــاب', 'nicknames', '↳'],
    [15, 'الـلـوجـوهــات', 'logos', '↳'],
    [16, 'تـغـيـر الاصـوات', 'voices', '↳'],
    [23, 'أخــرى', 'other', '↳']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);
const IMAGE_URL = "https://b.top4top.io/p_3851yg85t0.jpg";

async function handler(m, { conn, bot, command, args, text }) {

    // --- منطق أوامر الأزرار: معلومات النظام ---
    if (command === 'sysinfo') {
        const usedRAM = (process.memoryUsage().rss / 1024 / 1024).toFixed(0);
        const freeMemory = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(0);
        const latency = (Date.now() - m.messageTimestamp * 1000);
        return await conn.sendMessage(m.chat, { text: `┌─── ⚙️ [ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎 ] ⚙️ ───┐\n│\n│ 📊 الذاكرة المستخدمة: ${usedRAM} MB\n│ ☄️ الذاكرة الحرة: ${freeMemory} MB\n│ ⚡ سرعة الاستجابة: ${latency} ms\n│ 🖥️ المنصة: ${process.platform}\n│ 🟢 الحالة: ONLINE\n│\n└─── ❖ [ EL-HAWARY CORE ] ❖ ───` }, { quoted: m });
    }

    // --- منطق أوامر الأزرار: إعادة التشغيل ---
    if (command === 'restart') {
        await m.reply('🔄 جاري إعادة تشغيل النظام، انتظر لحظة...');
        return process.exit();
    }

    // --- منطق أوامر الأزرار: قسم الشكاوى ---
    if (command === 'report') {
        return await m.reply('🛡️ | مرحباً بك في قسم الدعم الفني والشكاوى.\n\nفضلاً، قم بكتابة تفاصيل المشكلة أو الأخطاء التي واجهتها في البوت في الرسالة القادمة وسيقوم المطور بمراجعتها في أقرب وقت.');
    }

    // --- منطق أوامر الأزرار: قائمة التقييم النجوم ---
    if (command === 'rate') {
        const rateSections = [{
            title: "🌟 اختر تقييمك للبوت 🌟",
            rows: [
                { title: "⭐⭐⭐⭐ Stars", description: "ممتاز - سريع وبدون أخطاء", id: ".submitrate 5" },
                { title: "⭐⭐⭐⭐ Star", description: "جيد جداً - يحتاج لتطوير بسيط", id: ".submitrate 4" },
                { title: "⭐⭐⭐ Stars", description: "متوسط - هناك بعض البطء", id: ".submitrate 3" },
                { title: "⭐⭐ Stars", description: "سيء - يحتوي على أخطاء", id: ".submitrate 2" },
                { title: "⭐ Star", description: "سيء جداً - لا يعمل بشكل جيد", id: ".submitrate 1" }
            ]
        }];

        await conn.sendButtonNormal(m.chat, {
            caption: "⭐ **قسم تقييم جودة الخدمة**\n\nرأيك يهمنا جداً لتطوير البوت وتحسين أدائه. من فضلك اختر عدد النجوم الذي تراه مناسباً لتجربتك:",
            buttons: [
                { name: "single_select", params: { title: "点击选择 🌟 [ اضغط للتقييم ]", sections: rateSections } }
            ]
        }, m);
        return;
    }

    // --- منطق استقبال النتيجة بعد اختيار النجوم ---
    if (command === 'submitrate') {
        const stars = args[0] || '5';
        return await m.reply(`✨ شكراً لك يا صديقي على تقييمك بـ (${stars}/5) نجوم! تم تسجيل رأيك وسيساعدنا هذا في تحسين كفاءة البوت.`);
    }

    // --- منطق القائمة الرئيسية ---
    const selected = parseInt(args[0]);

    if (!selected && !args[0]) {
        const sections = [{
            title: " [ SELECT COMMAND MODULE ] ",
            rows: CATEGORIES.map(c => ({
                title: `[ ${c[1]} ]`,
                description: `Load module: ${c[2]}`,
                id: `.${command} ${c[0]}`
            }))
        }];

        const menuText = `┌─── ❖ [ 𝑨𝑳𝑯𝑾𝑨𝒀𝒀  ] ❖ ───┐
│
│ 🕊️ أهلاً بك يا صديقي في نظامنا.
│ نحن هنا لخدمتك بكل هدوء.
│
│ 📜 ❲ قـوانـيـن الاسـتـخـدام ❳ :
│ 1. يمنع السب أو الإساءة للبوت.
│ 2. يمنع الإزعاج بالأوامر المتكررة.


└─── ❖ [ 𝐴𝐿𝐻𝑊𝐴𝑅Y ] ❖ ───`;

        await conn.sendButtonNormal(m.chat, {
            media: { url: IMAGE_URL },
            mediaType: 'image',
            caption: menuText,
            buttons: [
                { name: "cta_url", params: { display_text: "『🍃| الـمـطـور |🍃』", url: "https://wa.me/+201556853817" } },
                { name: "cta_url", params: { display_text: "🍷 | الـقـنـاه", url: "https://whatsapp.com/channel/0029Vb6VF4R3bbUwgCtJlC3U" } },
                { name: "quick_reply", params: { display_text: "『🪻| الـشـكـاوي |🪻』", id: ".report" } },
                { name: "quick_reply", params: { display_text: "『⭐| التـقـيـيـم |⭐』", id: ".rate" } },
                { name: "quick_reply", params: { display_text: "『🌀| مـعـلـومـات الـسـيـسـتـم|🌀』", id: ".sysinfo" } },
                { name: "quick_reply", params: { display_text: "『🌿| تـحـديـث الـبـوت|🌿』", id: ".restart" } },
                { name: "single_select", params: { title: "[『❄️┆الاقـسـام┆❄️』]", sections: sections } }
            ],
            mentions: [m.sender]
        }, global.reply_status || m);
        return;
    }

    // --- منطق عرض الأقسام عند اختيار قسم من القائمة ---
    const cat = getCat(selected);
    if (!cat) return;
    const cmds = await bot.getAllCommands();
    const categoryCmds = cmds.filter(c => c.category === cat[2]);
    if (!categoryCmds.length) return;
    const cmdsList = categoryCmds.map(c => `│ ↳ /${c.usage?.join(`\n│ ↳ /`)}`).join('\n');
    await conn.sendMessage(m.chat, { text: `┌─── [ MODULE: ${cat[1]} ] ───┐\n│\n${cmdsList}\n│\n└─── [ EL-HAWARY CORE ] ───┘` }, { quoted: m });
}

handler.customPrefix = /^\./; 
handler.command = new RegExp('^(المهام|اوامر|الاوامر|menu|القائمة|🔥|\\.|sysinfo|restart|report|rate|submitrate)$', 'i');

export default handler;
