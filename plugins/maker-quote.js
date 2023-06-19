import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  let userPfp = 'https://i.imgur.com/8B4jwGq.jpeg'; // Set the userPfp to the specified image

  try {
    if (!text && !m.quoted) {
      m.react('❔');
      return m.reply(`Please provide a text (Type or mention a message)!`);
    }

    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    if (!(who in global.db.data.users)) throw '✳️ The user is not found in my database'

    let user = global.db.data.users[who]
    let { name } = global.db.data.users[who]

    m.react(rwait);
    let quoteText = m.quoted ? m.quoted.msg : text ? text : "";

    let quoteJson = {
      type: "quote",
      format: "png",
      backgroundColor: "#FFFFFF",
      width: 1800,
      height: 200, // Adjust the height value as desired
      scale: 2,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name: name,
            photo: {
              url: userPfp,
            },
          },
          text: quoteText,
          replyMessage: {},
        },
      ],
    };

    let res = await fetch('https://bot.lyo.su/quote/generate', {
      method: 'POST',
      body: JSON.stringify(quoteJson),
      headers: { 'Content-Type': 'application/json' },
    });

    let json = await res.json();
    let bufferImage = Buffer.from(json.result.image, 'base64');
    let stickerr = await sticker(false, bufferImage, global.packname, global.author);
    await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, { asSticker: true });
    m.react("🤡");
  } catch (e) {
    m.react("😭")
  } 
}
handler.help = ['quote'];
handler.tags = ['fun'];
handler.command = ['quote'];

export default handler;
