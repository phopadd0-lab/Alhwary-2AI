   (async () => {
    try {
        const axios = await import('axios');
        const GEMINI_API_KEY = 'AQ.Ab8RN6KAXU8I1eTGKK3Q1dWBzOjFdIjZjLJ_wV11WuYayR9Iow';
        const botName = 'الهواري';

        // تنظيف أي مستمع قديم في الـ RAM عشان نمنع التداخل والبطء
        conn.ev.removeAllListeners('messages.upsert');

        conn.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const m = chatUpdate.messages[0];
                if (!m.message || m.key.fromMe) return;

                const text = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || '';
                if (!text) return;

                const hasName = text.toLowerCase().includes(botName) || text.includes('بوت') || text.includes('هواري');
                
                if (hasName) {
                    // ريأكشن فوري سريع
                    await conn.sendMessage(m.key.remoteJid, { react: { text: '😏', key: m.key } });

                    // إجبار الـ AI في الـ Prompt إنه يختصر لأقصى درجة عشان ينجز
                    const prompt = `أنت شخص مصري متفرعن، مغرور، ساخر، وقاصف جبهات اسمك "الهواري". رد على هذه الرسالة بجرأة شديدة وبإيجاز شديد جداً (في سطر واحد فقط أو بضع كلمات) وبلهجة صايعة: "${text}"`;

                    // إرسال الطلب مع كبسولة السرعة القصوى (generationConfig)
                    const response = await axios.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            maxOutputTokens: 40, // تقليل الحروف لأقل حجم يجعل المعالجة طلقة
                            temperature: 0.85
                        }
                    });

                    const aiResult = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (aiResult) {
                        await conn.sendMessage(m.key.remoteJid, { react: { text: '👌🏼', key: m.key } });
                        await conn.sendMessage(m.key.remoteJid, { text: aiResult.trim() }, { quoted: m });
                    }
                }
            } catch (err) {}
        });

        m.reply("⚡ *تم حقن نسخة التيربو السريعة في الـ RAM بنجاح! نادي (يا هواري) الحين وشوفي طلقة السرعة بنفس الـ API!*");
    } catch (e) {
        m.reply("❌ خطأ: " + e.message);
    }
})();