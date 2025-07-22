// 1. ต้อง import ก่อนใช้!
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ถ้าใช้ ES Module ให้เปลี่ยนเป็น import

// 2. สร้าง instance โดยใช้ API KEY จาก env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { zodiacCardName, soulCardName } = req.body;

        if (!zodiacCardName || !soulCardName) {
            return res.status(400).json({ error: 'Missing card names in request body' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        ...[prompt แบบเดิมของคุณ]...
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text(); // อย่าลืม await!

        res.status(200).json({ interpretation: text });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate interpretation from AI.' });
    }
}
