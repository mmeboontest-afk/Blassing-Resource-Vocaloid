// ไทม์ไลน์เนื้อเพลง (วินาที นับจากเสียงเพลงเริ่ม) — วิเคราะห์จากไฟล์ song.mp3
// who: ชื่อบอท (rin/len/miku/luka/kaito/meiko) หรือ "all" = ทุกตัวส่งพร้อมกัน
// ปรับจูนได้ที่นี่ หรือใช้ env LYRIC_OFFSET_MS เลื่อนทั้งเพลง (ติดลบ = ส่งเร็วขึ้น)
module.exports = [
  { t: 0.43, who: "rin",   text: "-# Dai🎉" },        // ตัวเล็ก
  { t: 0.70, who: "rin",   text: "Dai🎉" },
  { t: 0.98, who: "rin",   text: "Dai🎉" },
  { t: 1.25, who: "rin",   text: "**Dai🎉**" },      // ตัวหนา
  { t: 1.52, who: "rin",   text: "# Dai🎉" },        // ตัวใหญ่

  { t: 3.10, who: "kaito", text: "**Eat** well," },
  { t: 3.70, who: "meiko", text: "**Sleep** well," },
  { t: 4.20, who: "miku",  text: "**Play** well," },
  { t: 4.80, who: "luka",  text: "**Learn** well," },
  { t: 5.34, who: "rin",   text: "**Speak** well," },
  { t: 5.89, who: "len",   text: "**Fight** well" },

  { t: 6.43, who: "all",   text: "# Living quite a normal everyday" },

  { t: 9.58,  who: "kaito", text: "Even if you **can't cry**" },
  { t: 11.05, who: "meiko", text: "Even if you **can't laugh**" },
  { t: 12.45, who: "miku",  text: "Even if you **can't sing**" },
  { t: 13.93, who: "luka",  text: "Even if you **got nothing**" },
  { t: 15.35, who: "rin",   text: "Even if you **can't love**" },
  { t: 16.80, who: "len",   text: "Even if you **aren't loved**" },

  { t: 18.31, who: "all",   text: "# I want you to live" },
];
