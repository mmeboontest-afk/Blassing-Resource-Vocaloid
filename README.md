# Vocaloid "Blessing" Discord bots

## ขั้นตอน
1. เชิญบอททั้ง 6 ตัวเข้าเซิร์ฟเวอร์ (scope: `bot` + `applications.commands`)
   สิทธิ์: View Channel, Send Messages, Read Message History (ใช้กับ /delete) / Rin เพิ่ม Connect + Speak
2. อัปโค้ดโฟลเดอร์นี้ขึ้น GitHub แล้วสร้าง **Web Service** บน Render (Build: `npm install`, Start: `node index.js`)
3. ใส่ Environment Variables: MIKU_TOKEN, LEN_TOKEN, RIN_TOKEN, LUKA_TOKEN, KAITO_TOKEN, MEIKO_TOKEN
4. เข้าห้องเสียง แล้วพิมพ์ `/play` ในห้องแชทที่อยากให้บอทส่งเนื้อเพลง
   → Rin เข้าห้อง รอ 5 วิ เล่นเพลง แล้วบอทผลัดกันส่งเนื้อเพลงตามจังหวะ

## จูนจังหวะ
- แก้เวลาแต่ละบรรทัดใน `lyrics.js`
- เลื่อนทั้งเพลง: env `LYRIC_OFFSET_MS` (ค่าเริ่มต้น -250; ข้อความมาช้า → ใส่ -400, มาเร็ว → -100)
