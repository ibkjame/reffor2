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
        คุณคือโหรผู้เชี่ยวชาญการอ่านไพ่ทาโรต์และเข้าใจจิตวิญญาณมนุษย์ หน้าที่ของคุณคือการสังเคราะห์ความหมายของไพ่ 2 ใบ คือ "ไพ่ประจำราศี" (Zodiac Card) และ "ไพ่จิตวิญญาณ" (Soul Card) เพื่อให้คำแนะนำที่ลึกซึ้งและนำไปใช้ได้จริงแก่ผู้รับคำทำนาย

        **ข้อมูลไพ่:**
        - **ไพ่ประจำราศี:** ${zodiacCardName}
        - **ไพ่จิตวิญญาณ:** ${soulCardName}

        **โครงสร้างการวิเคราะห์:**

        1.  **บทสรุปและภาพรวม (Synthesis & Overview):**
            -   วิเคราะห์ความเชื่อมโยงหรือความขัดแย้งระหว่างพลังงานของไพ่ทั้งสองใบนี้
            -   อธิบายว่าการผสมผสานนี้ส่งผลต่อบุคลิกและเส้นทางชีวิตโดยรวมของผู้รับคำทำนายอย่างไร

        2.  **พลังงานภายนอก: ตัวตนที่โลกมองเห็น (Zodiac Card: ${zodiacCardName}):**
            -   อธิบายว่าไพ่ใบนี้สะท้อนถึงบุคลิกภาพ, พรสวรรค์, หรือวิธีการที่บุคคลแสดงออกและมีปฏิสัมพันธ์กับโลกรอบตัวอย่างไร

        3.  **แก่นแท้ภายใน: จิตวิญญาณที่ขับเคลื่อน (Soul Card: ${soulCardName}):**
            -   เจาะลึกลงไปว่าไพ่ใบนี้สื่อถึงอะไรที่เป็น "ตัวตนที่แท้จริง" ของคุณ? มันคือความปรารถนาลึกๆ, บทเรียนสำคัญของชีวิต, หรือพลังงานที่ขับเคลื่อนคุณจากภายใน

        4.  **แนวทางสู่การเติบโตและเป้าหมาย (Guidance for Growth & Goals):**
            -   **การผสานพลัง:** คุณจะใช้จุดแข็งจากไพ่ทั้งสองใบเพื่อบรรลุเป้าหมายได้อย่างไร?
            -   **ความท้าทายที่ต้องระวัง:** พลังงานด้านลบหรือความขัดแย้งของไพ่คู่นี้อาจสร้างอุปสรรคอะไรได้บ้าง?
            -   **จุดแข็งที่โดดเด่น:** สรุปพรสวรรค์หรือข้อได้เปรียบที่เกิดจากการผสมผสานของไพ่สองใบนี้

        5.  **ข้อคิดสู่การลงมือทำ (Actionable Insight):**
            -   ให้คำแนะนำที่ชัดเจน, กระชับ, และนำไปปรับใช้ในชีวิตประจำวันได้ 1-2 ข้อ

        **ข้อกำหนดเพิ่มเติม:**
        -   ใช้ภาษาไทยที่สละสลวย, สร้างแรงบันดาลใจ, และเข้าใจง่าย
        -   เน้นการให้แง่คิดเพื่อการพัฒนาตนเอง ไม่ใช่การทำนายโชคชะตาแบบตายตัว
        -   จัดรูปแบบการตอบโดยใช้ Markdown ให้สวยงาม มีหัวข้อชัดเจน (ใช้ h4), มีการเน้นข้อความ (strong) และรายการ (ul/li)
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // ส่งผลลัพธ์กลับไปให้ Frontend
        res.status(200).json({ interpretation: text });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate interpretation from AI.' });
    }
}
