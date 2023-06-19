import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

const handler = async (m, { conn, text }) => {
  const userPfp = 'https://i.imgur.com/8B4jwGq.jpeg'; // Set the userPfp to the specified image

  try {
    if (!text && !m.quoted) {
      m.react('❔');
      return m.reply('Please provide a text (Type or mention a message)!');
    }

    const who = m.quoted ? m.quoted.sender : m.mentionedJid?.[0] ?? (m.fromMe ? conn.user.jid : m.sender);
    if (!(who in global.db.data.users)) throw '✳️ The user is not found in my database';

    const user = global.db.data.users[who];
    const { name } = global.db.data.users[who];

    m.react(rwait);
    const quoteText = m.quoted ? m.quoted.msg : text ?? '';

    const quoteJson = {
      type: 'quote',
      format: 'png',
      backgroundColor: '#FFFFFF',
      width: 1800,
      height: 200, // Adjust the height value as desired
      scale: 2,
      messages: [
        {
          entities: [],
          avatar: true,
          from: {
            id: 1,
            name,
            photo: {
              url: userPfp,
            },
          },
          text: quoteText,
          replyMessage: {},
        },
      ],
    };

    const res = await fetch('https://bot.lyo.su/quote/generate', {
      method: 'POST',
      body: JSON.stringify(quoteJson),
      headers: { 'Content-Type': 'application/json' },
    });

    const buffer = await res.arrayBuffer();
    const bufferImage = Buffer.from(buffer);
    
    const stickerr = await sticker(false, bufferImage, global.packname, global.author);
    await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, { asSticker: true });
    m.react('🤡');
  } catch (e) {
    console.error(e); // This will print the error message and its stack trace
    m.react('🤡');
  }
};

handler.help = ['quote'];
handler.tags = ['fun'];
handler.command = ['quote'];

export default handler;
