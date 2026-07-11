
import fs from "fs";
import path from "path";

const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants.filter(p => p?.phoneNumber).map(p => p.phoneNumber);
        const author = event.author;
        let txt;

        const users = participants.length 
            ? participants.map(p => '@' + p.split('@')[0]).join(' and ') 
            : 'No users';
        const authorTag = author ? '@' + author.split('@')[0] : 'Unknown';

        const messages = {
            add: `♡ Welcome ${users}${authorTag === users ? "" : `\nby ${authorTag}`}`,
            remove: `${users} has been removed from the group${authorTag === users ? "" : `\nby ${authorTag}`}`,
            promote: `♡ Congrats Admin ${users}\nby ${authorTag}`,
            demote: `♡ You are now a member ${users}\nby ${authorTag}`
        };

        txt = messages[eventType];
        if (!txt) return null;

        if (global.db.groups[event.chat].noWelcome === true) return 9999;

        const img = ["remove", "add"].includes(eventType) 
            ? (event.userUrl || "https://files.catbox.moe/hm9iq4.jpg") 
            : "https://files.catbox.moe/hm9iq4.jpg";

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: ctx.config?.info.nameBot || "WhatsApp Bot",
            body: "A simple WhatsApp bot for beginners, by OWNER",
            mentions: author ? [author, ...participants] : participants,
            newsletter: {
                name: 'OWNER',
                jid: '201556853817@newsletter'
            },
            big: ["remove", "add"].includes(eventType)
        });

    } catch (e) {
        console.error(e);
    }
    return null;
};

const access = async (msg, checkType, time) => {
    const conn = await msg.client();

    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };

    const messages = {
        cooldown: `*♡⏳ Wait ${time || 'a few'} seconds ⏳♡*\n⊱⋅ ──────────── ⋅⊰\n> *_You need to wait a bit, this command cannot be spammed_*`,
        owner: `*♡ 🇩🇪 This command is for developers only 🇩🇪♡*\n⊱⋅ ──────────── ⋅⊰\n> *_You must be a bot developer to use this command_*`,
        group: `*♡💠 This command works only in groups 💠♡*\n⊱⋅ ──────────── ⋅⊰\n> *_You must use this command inside a group_*`,
        admin: `*♡📯 This command is for admins only 📯♡*\n⊱⋅ ──────────── ⋅⊰\n> *_You are just a member, you need admin rights_*`,
        private: `*♡🏷️ This command works only in private chat 🏷️♡*\n⊱⋅ ──────────── ⋅⊰\n> *_Use this command in private chat only_*`,
        botAdmin: `*♡📌 I must be an admin to execute this command 📌♡*\n⊱⋅ ──────────── ⋅⊰\n> *_Make me admin to use this command_*`,
        noSub: `*♡🫒 This command works only in the main bot 🫒♡*`,
        disabled: `*♡🗃️ Command disabled (under maintenance) 🗃️♡*\n⊱⋅ ──────────── ⋅⊰\n> *_This command is under maintenance, will be back soon_*`,
        error: `*✦♡⚠️ Unexpected error ⚠️♡✦*

⊱⋅ ──────────── ⋅⊰
❌ Contact developers to fix the issue ❌
⊱⋅ ──────────── ⋅⊰

💡 Quick fix: type ".developer" to get the developer's number 👑`
    };

    if (conn && messages[checkType]) {
        await conn.msgUrl(msg.chat, messages[checkType], {
            img: "https://i.pinimg.com/originals/02/c3/51/02c351dfd4eb72a62f225ce964dc510d.jpg",
            title: "Alerts | Warnings",
            body: "Bot alerts: Read the message to learn more",
            newsletter: {
                name: 'OWNER',
                jid: '201556853817@newsletter'
            },
            big: false
        }, quoted);
        return false;  
    }
    return null;  
};

export { access, group };