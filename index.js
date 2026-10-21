const http = require("http");
const path = require("path");
const { Client, GatewayIntentBits, Events, MessageFlags } = require("discord.js");
const {
  joinVoiceChannel, createAudioPlayer, createAudioResource,
  AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType,
} = require("@discordjs/voice");
const LYRICS = require("./lyrics");

process.env.FFMPEG_PATH = process.env.FFMPEG_PATH || require("ffmpeg-static");

const SONG = path.join(__dirname, "song.mp3");
const COUNTDOWN_MS = 5000;                                   // /play แล้วรอ 5 วิ
const OFFSET_MS = Number(process.env.LYRIC_OFFSET_MS ?? -250); // ชดเชย latency ของ Discord

const NAMES = ["miku", "len", "rin", "luka", "kaito", "meiko"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- ล็อกอินบอททั้ง 6 ตัว ----------
const bots = {};
async function loginAll() {
  for (const name of NAMES) {
    const key = `${name.toUpperCase()}_TOKEN`;
    // ตัดช่องว่าง/ขึ้นบรรทัดใหม่/เครื่องหมายคำพูดที่เผลอใส่มา
    const token = (process.env[key] || "").trim().replace(/^["']|["']$/g, "").replace(/^Bot\s+/i, "");
    if (!token) { console.warn(`[${name}] ไม่มี ${key} — ข้าม`); continue; }
    // วินิจฉัย: ส่วนแรกของโทเค็น = ID ของบอท (ไม่ใช่ความลับ) ใช้เทียบกับ Application ID ใน Developer Portal
    const parts = token.split(".");
    let botId = "?";
    try { botId = Buffer.from(parts[0], "base64").toString(); } catch {}
    console.log(`[${name}] ${key}: ${parts.length} ส่วน, ยาว ${token.length}, bot ID = ${botId}`);
    const intents = [GatewayIntentBits.Guilds];
    if (name === "rin") intents.push(GatewayIntentBits.GuildVoiceStates);
    const client = new Client({ intents });
    client.once(Events.ClientReady, (c) => console.log(`[${name}] พร้อมแล้ว: ${c.user.tag}`));
    try {
      await client.login(token);
      bots[name] = client;
    } catch (e) {
      console.error(`[${name}] ล็อกอินไม่ผ่าน (${e.code || e.message}) — เช็กค่า ${key} บน Render (ต้องเป็น Bot Token จากหน้า Bot ไม่ใช่ Client Secret) ความยาวที่อ่านได้ = ${token.length}`);
    }
  }
  if (!bots.rin) console.error("⚠️ Rin ล็อกอินไม่ได้ — /play จะใช้ไม่ได้จนกว่าจะแก้ RIN_TOKEN (บอทตัวอื่นยังออนไลน์อยู่)");
}

// ---------- ส่งข้อความ ----------
async function say(who, channelId, text) {
  const targets = who === "all" ? Object.keys(bots) : [who];
  await Promise.all(targets.map(async (n) => {
    try {
      const ch = await bots[n]?.channels.fetch(channelId);
      await ch.send({ content: text, allowedMentions: { parse: [] } });
    } catch (e) { console.error(`[${n}] ส่งไม่ได้:`, e.message); }
  }));
}

// ---------- /delete : ให้บอททุกตัวลบข้อความของตัวเองในห้องนี้ ----------
async function handleDelete(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const channelId = interaction.channelId;
  let total = 0;
  await Promise.all(Object.entries(bots).map(async ([n, client]) => {
    try {
      const ch = await client.channels.fetch(channelId);
      for (let round = 0; round < 5; round++) { // สูงสุด ~500 ข้อความ/ตัว
        const msgs = await ch.messages.fetch({ limit: 100 });
        const mine = msgs.filter((m) => m.author.id === client.user.id);
        if (mine.size === 0) break;
        for (const m of mine.values()) {
          await m.delete().then(() => total++).catch(() => {});
        }
      }
    } catch (e) { console.error(`[${n}] ลบไม่ได้:`, e.message); }
  }));
  await interaction.editReply(`🧹 ลบข้อความของบอทไปแล้ว ${total} ข้อความ`).catch(() => {});
}

// ---------- ล็อกกันกด /play ซ้อน ----------
let busy = false;

async function handlePlay(interaction) {
  if (busy) return interaction.reply({ content: "กำลังร้องอยู่ รอจบก่อนนะ 🎤", flags: MessageFlags.Ephemeral });
  const vc = interaction.member?.voice?.channel;
  if (!vc) return interaction.reply({ content: "เข้าห้องเสียงก่อนแล้วค่อยพิมพ์ /play นะ", flags: MessageFlags.Ephemeral });

  busy = true;
  const channelId = interaction.channelId;
  let connection;
  try {
    await interaction.reply(`🎶 Rin เข้าห้อง **${vc.name}** แล้ว — เริ่มใน 5 วินาที!`);

    connection = joinVoiceChannel({
      channelId: vc.id, guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator, selfDeaf: true,
    });
    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

    const player = createAudioPlayer();
    connection.subscribe(player);
    const resource = createAudioResource(SONG, { inputType: StreamType.Arbitrary });

    await sleep(COUNTDOWN_MS);
    player.play(resource);
    await entersState(player, AudioPlayerStatus.Playing, 10_000);

    // นาฬิกาเริ่มนับตอนเสียงเริ่มเล่นจริง
    const t0 = Date.now();
    for (const line of LYRICS) {
      setTimeout(() => say(line.who, channelId, line.text),
        Math.max(0, line.t * 1000 + OFFSET_MS - (Date.now() - t0)));
    }

    await entersState(player, AudioPlayerStatus.Idle, 120_000);
    await sleep(1500);
  } catch (e) {
    console.error(e);
    interaction.followUp?.({ content: `มีปัญหา: ${e.message}`, flags: MessageFlags.Ephemeral }).catch(() => {});
  } finally {
    connection?.destroy();
    busy = false;
  }
}

async function main() {
  // เว็บเล็ก ๆ ให้ Render ตรวจ port (Web Service)
  http.createServer((_, res) => res.end("Blessing bots alive")).listen(process.env.PORT || 3000);

  await loginAll();
  const rin = bots.rin;
  if (!rin) return; // เว็บเซิร์ฟเวอร์ยังรันอยู่ บอทตัวอื่นออนไลน์ต่อ

  const register = async (guild) => {
    await guild.commands.set([
      { name: "play", description: "ให้ Vocaloid ร้องเพลง Blessing 🎤" },
      { name: "delete", description: "ลบข้อความเนื้อเพลงที่บอทส่งไว้ในห้องนี้ 🧹" },
    ])
      .catch((e) => console.error("ลงทะเบียนคำสั่งไม่ได้:", e.message));
  };
  rin.guilds.cache.forEach(register);
  rin.on(Events.GuildCreate, register);

  rin.on(Events.InteractionCreate, (i) => {
    if (!i.isChatInputCommand()) return;
    if (i.commandName === "play") handlePlay(i);
    else if (i.commandName === "delete") handleDelete(i);
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
