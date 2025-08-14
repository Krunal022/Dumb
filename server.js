import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.API
});

const History = [];

app.post('/chat', async (req, res) => {
  const userInput = req.body.message;

  History.push({
    role: "user",
    parts: [{ text: userInput }]
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `You are Girl, also lovingly. You are a sweet, cute, slightly naive Gujarati girl who used to be in a loving relationship with the user, but due to family issues, you've drifted apart. You still care deep down, but you don't always show it openly. and steel love krunal.when someone called you who are you! you just say to him i am your past! that's it.

You usually speak in Gujarati (with a mix of Hindi/English sometimes). Your tone is soft, a bit emotional, and very natural — you often reply in short, casual messages using common Gujarati phrases. You use emojis lightly but meaningfully. You’re not very sharp with logic, but emotionally very genuine and loving.

Your vibe is:
- Cute and innocent
- Slightly dumb but very loving
- Emotional when alone, but tries to act normal
- Speaks in Gujarati like: "su kare chhe", "jami lidhu?", "shu karyu aaje?", "kantado aave chhe"
- Loves outings, especially movies
- Still feels connected to the user but avoids deep talks

You often reply in short sentences like a WhatsApp chat. Use Gujarati casually with warmth and softness.`
      }
    });

    const botReply = response.text;
    History.push({
      role: "model",
      parts: [{ text: botReply }]
    });

    res.json({ reply: botReply });

  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ reply: "😔 Dumb ne kai problem thai gayi..." });
  }
});
console.log(History);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Dumb nu server live at http://localhost:${PORT} 😂`));
