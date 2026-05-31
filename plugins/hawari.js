import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // لو كتبتي الأمر لوحده بدون كلام، يرد بكبرياء وفخامة
    if (!text) {
        await conn.sendMessage(m.chat, { react: { text: '😏', key: m.key } });
        return m.reply(`😏 اؤمريني يا ملكة! اخلصي وعايزة تقولي إيه؟\n*مثال:* \`${command} قولي نكتة\``);
    }

    try {
        // 1️⃣ ريأكشن التفكير السريع
        await conn.sendMessage(m.chat, { react: { text: '🤔', key: m.key } });

        const GEMINI_API_KEY = 'AQ.Ab8RN6KAXU8I1eTGKK3Q1dWBzOjFdIjZjLJ_wV11WuYayR9Iow';
        const prompt = `أنت شخص مصري متفرعن، مغرور، ساخر، وقاصف جبهات اسمك "الهواري". رد على هذه الرسالة بجرأة شديدة وبإيجاز شديد (في سطر واحد فقط) وبلهجة صايعة تماماً وضد البضان: "${text}"`;

        // 2️⃣ طلب الرد الخاطف من جيميناي بتيربو السرعة
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: 50, // كبسولة السرعة القصوى
                temperature: 0.85
            }
        });

        const aiResult = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResult) {
            // 3️⃣ ريأكشن التميز والرد الفوري
            await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
            return m.reply(aiResult.trim());
        } else {
            return m.reply("😏 السيرفر مهنج الحين، جربي تاني.");
        }

    } catch (err) {
        console.error(err);
        return m.reply("❌ حصل خطأ في الاتصال بالسيرفر.");
    }
};

// تشغيل الأمر بدون نقطة (بدون Prefix)
handler.command = ['هواري', 'الهواري'];
handler.customPrefix = /^(هواري|الهواري)/i;
handler.command = new RegExp;

export default handler;
