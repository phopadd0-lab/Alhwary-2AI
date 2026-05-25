import { createRequire } from 'module';
import { format } from 'util';

export default {
  command: [">", "=>", "==>"],
  description: "Advanced Shytan Eval Engine 2026",
  category: "owner",
  usage: [">", "=>", "==>"],
  usePrefix: false,
  owner: true,
  async execute(m, { bot, conn }) {
    const body = m.text || '';
    // تحديد نوع السهم المستخدم لمعرفة طريقة التعامل مع الرسالة
    const match = body.match(/^(==>|=>|>)\s*/);
    if (!match) return;
    
    const prefix = match[1];
    const codeText = body.substring(prefix.length).trim();

    if (!codeText) return m.reply('ex: => m');

    try {
      const require = createRequire(import.meta.url);
      const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

      // حقن الاختصارات الشيطانية والذكية لتسهيل الكتابة السريعة من الشات
      const vars = {
        conn,
        bot,
        sock: conn,
        c: conn, // اختصار للاتصال بالواتساب
        m,
        jid: m.key.remoteJid,
        j: m.key.remoteJid, // اختصار لآيدي الشات أو الجروب الحالي
        reply: m.reply.bind(m),
        r: m.reply.bind(m), // اختصار للرد السريع
        print: (...args) => m.reply(format(...args)),
        require,
        process,
        Array: CustomArray
      };

      // معالجة الكود تلقائياً بناءً على نوع السهم لإرجاع القيم مباشرة
      let processedCode = (prefix === '=>' || prefix === '==>') ? `return (${codeText})` : codeText;

      const executeCode = new AsyncFunction(...Object.keys(vars), processedCode);
      let result = await executeCode(...Object.values(vars));

      // إذا استخدمت السهم الثلاثي ==> سيتم تفعيل وضع الشبح وحذف كودك فوراً لإخفاء الأثر
      if (prefix === '==>') {
        await conn.sendMessage(m.key.remoteJid, { delete: m.key }).catch(() => {});
      }

      if (result !== undefined) {
        await m.reply(format(result));
      }
    } catch (err) {
      await m.reply(`❌ خطأ في التنفيذ:\n${err.stack || err.message || err}`);
    }
  }
};

class CustomArray extends Array {
  constructor(...args) {
    if (args.length === 1 && typeof args[0] === 'number') {
      super(Math.min(args[0], 10000));
    } else {
      super(...args);
    }
  }
}
