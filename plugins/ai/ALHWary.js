import axios from 'axios';

let handler = async (m, { conn, text, command }) => {
    // لو كتبتي الكلمة لوحدها بدون كلام، يرد بفخامة
    if (!text) {
        await conn.sendMessage(m.chat, { react: { text: '😏', key: m.key } });
        return m.reply(`😏 اؤمريني يا ملكة! اخلصي وعايزة تقولي إيه؟\n*مثال:* \`${command} قولي نكتة\``);
    }

    // المفاتيح المتأمنة جوة الكود
    const GEMINI_KEY = 'AQ.Ab8RN6KAXU8I1eTGKK3Q1dWBzOjFdIjZjLJ_wV11WuYayR9Iow';
    const CHATGPT_KEY = 'حطي_المفتاح_الجديد_هنا'; // 👈 امسحي الجملة دي وحطي مفتاح شات جي بي تي الجديد بالملي

    const prompt = `أنت شخص مصري متفرعن، مغرور، ساخر، وقاصف جبهات اسمك "الهواري". رد على هذه الرسالة بجرأة شديدة وبإيجاز شديد (في سطر واحد فقط) وبلهجة صايعة تماماً وضد البضان: "${text}"`;

    await conn.sendMessage(m.chat, { react: { text: '🤔', key: m.key } });

    // 1️⃣ الخطة (أ): جيميناي السريع
    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 50, temperature: 0.85 }
        }, { timeout: 4000 }); // لو ماردش في 4 ثواني يقلب فوراً

        const aiResult = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiResult) {
            await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return m.reply(aiResult.trim());
        }
    } catch (geminiErr) {
        console.log("جيميناي ماردش.. بنحول على شات جي بي تي الحين تلقائياً...");
    }

    // 2️⃣ الخطة (ب) التلقائية: شات جي بي تي (لو جيميناي وقع أو هنج)
    try {
        if (!CHATGPT_KEY || CHATGPT_KEY.includes('حطي')) {
            return m.reply("❌ سيرفر جيميناي مهنج ومفتاح شات جي بي تي الجديد مش متضاف صح.");
        }

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini', // الموديل التيربو السريع الاقتصادي
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50,
            temperature: 0.85
        }, {
            headers: { 'Authorization': `Bearer ${CHATGPT_KEY}`, 'Content-Type': 'application/json' }
        });

        const gptResult = response.data?.choices?.[0]?.message?.content;
        if (gptResult) {
            await conn.sendMessage(m.chat, { react: { text: '🚀', key: m.key } });
            return m.reply(gptResult.trim());
        }
    } catch (gptErr) {
        console.error(gptErr);
        return m.reply("😏 السيرفرين مهنجين الحين يا ملكة، جربي كمان شوية.");
    }
};

// تشغيل كأمر صريح بدون نقطة بشكل رسمي ومضمون
handler.command = ['بوت', 'ولا'];
handler.customPrefix = /^(هواري|الهواري)/i;
handler.command = new RegExp;

export default handler;
