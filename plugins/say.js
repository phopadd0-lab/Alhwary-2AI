import { GoogleGenAI } from '@google/genai';

let handler = async (m, { conn, text, command }) => {
    // لو مكتبش الكلام اللي عايز البوت ينطقه
    if (!text) {
        await conn.sendMessage(m.chat, { react: { text: '🙄', key: m.key } });
        return m.reply(`❌ اكتبِ الكلام اللي عايزاني أنطقه يا ملكة!\n*مثال:* \`${command} صباح الخير يا رجالة\``);
    }

    try {
        // ريأكشن التسجيل الحين
        await conn.sendMessage(m.chat, { react: { text: '🗣️', key: m.key } });

        // تشغيل المكتبة الرسمية بالـ API Key بتاعكِ
        const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6KAXU8I1eTGKK3Q1dWBzOjFdIjZjLJ_wV11WuYayR9Iow' });

        // طلب توليد الصوت مباشرة من جيميناي بأعلى جودة ونبرة طبيعية
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `اقرأ النص التالي بنبرة صوت واضحة وطبيعية ومفهومة جداً: "${text}"`,
            config: {
                // إجبار السيرفر يطلع النتيجة كملف صوتي مش نص
                responseMimeType: 'audio/mp3' 
            }
        });

        // تحويل استجابة الصوت لـ Buffer عشان الواتساب يفهمه
        const audioBuffer = Buffer.from(response.text, 'base64');

        if (audioBuffer) {
            // إرسال الفويس كـ ريكورد تلقائي (ptt: true) عشان يظهر إنه بيسجل الحين
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: true 
            }, { quoted: m });
            
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } else {
            return m.reply("😏 سيرفر الصوت مكسل الحين، جربي تاني.");
        }

    } catch (err) {
        console.error(err);
        return m.reply("❌ حصل خطأ أثناء توليد الصوت، تأكدي من النص.");
    }
};

// تشغيل الأمر بـ انطق أو قول
handler.command = ['انطق', 'قول'];
handler.customPrefix = /^(انطق|قول)/i;
handler.command = new RegExp;

export default handler;
