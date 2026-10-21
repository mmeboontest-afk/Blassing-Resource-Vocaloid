// ไทม์ไลน์เนื้อเพลง (วินาที นับจากเสียงเพลงเริ่ม) — เวลาที่ผู้ใช้จับเองจากไฟล์เพลง
// who: ชื่อบอท (rin/len/miku/luka/kaito/meiko) หรือ "all" = ทุกตัวส่งพร้อมกัน
// ปรับจูนได้ที่นี่ หรือใช้ env LYRIC_OFFSET_MS เลื่อนทั้งเพลง (ติดลบ = ส่งเร็วขึ้น)
module.exports = [
  { t: 0.24, who: "rin",   text: "-# Dai🎉" },        // ตัวเล็ก
  { t: 0.63, who: "rin",   text: "Dai🎉" },
  { t: 0.85, who: "rin",   text: "Dai🎉" },
  { t: 1.13, who: "rin",   text: "**Dai🎉**" },      // ตัวหนา
  { t: 1.39, who: "rin",   text: "# Dai🎉" },        // ตัวใหญ่

  { t: 1.89, who: "kaito", text: "**Eat** well," },
  { t: 3.2, who: "meiko", text: "**Sleep** well," },
  { t: 4.34, who: "miku",  text: "**Play** well," },
  { t: 5.45, who: "luka",  text: "**Learn** well," },
  { t: 6.6, who: "rin",   text: "**Speak** well," },
  { t: 7.68, who: "len",   text: "**Fight** well" },

  { t: 8.77, who: "all",   text: "# Living quite a normal everyday" },

  { t: 10.83,  who: "kaito", text: "Even if you **can't cry**" },
  { t: 12.13, who: "meiko", text: "Even if you **can't laugh**" },
  { t: 13.06, who: "miku",  text: "Even if you **can't sing**" },
  { t: 14.21, who: "luka",  text: "Even if you **got nothing**" },
  { t: 15.44, who: "rin",   text: "Even if you **can't love**" },
  { t: 16.39, who: "len",   text: "Even if you **aren't loved**" },

  { t: 17.42, who: "all",   text: "# I want you to live" },
];
