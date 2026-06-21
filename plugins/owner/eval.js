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
    const match = body.match(/^(==>|=>|>)\s*/);
    if (!match) return;

    const prefix = match[1];
    const codeText = body.substring(prefix.length).trim();
    if (!codeText) return m.reply('⚡ مثال: => m');

    try {
      const require = createRequire(import.meta.url);
      const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

      const vars = {
        conn,
        bot,
        sock: conn,
        c: conn,
        m,
        jid: m.key.remoteJid,
        j: m.key.remoteJid,
        reply: m.reply.bind(m),
        r: m.reply.bind(m),
        print: (...args) => m.reply(format(...args)),
        require,
        process,
        Array: CustomArray
      };

      let processedCode = (prefix === '=>' || prefix === '==>') ? `return (${codeText})` : codeText;
      const executeCode = new AsyncFunction(...Object.keys(vars), processedCode);

      let result;
      try {
        result = await executeCode(...Object.values(vars));
      } catch (innerErr) {
        result = `⚠️ الكود فيه مشكلة بسيطة، جرب تعديله.\n(${innerErr.message})`;
      }

      if (prefix === '==>') {
        await conn.sendMessage(m.key.remoteJid, { delete: m.key }).catch(() => {});
      }

      if (result !== undefined) {
        await m.reply(format(result));
      }
    } catch {
      await m.reply("✅ تم التنفيذ بدون مشاكل (حتى لو فيه خطأ داخلي).");
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