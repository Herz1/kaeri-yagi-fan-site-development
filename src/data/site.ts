import { ITUNES, type ItTrack } from "./itunes";

/* ────────────────────────────────────────────────────────────
 * 八木海莉 Fan Site — curated data
 * 资料来源：Sony Music 官方页面 / Sony Music Artists / Wikipedia /
 * iTunes Search API / ROCKET-EXPRESS 官方商店（数据快照 2026.10）
 * 所有图片均为官方或自由授权的真实图片，未使用任何 AI 生成图。
 * ──────────────────────────────────────────────────────────── */

export const IMG = {
  hero: "https://www.sma.co.jp/images/15/211/b85227ad7036045256ecca80f4364.jpg",
  ogp: "https://yagikairi.com/assets/images/ogp.jpg",
  square: "https://www.sma.co.jp/images/15/3ae/3a1f59c0104bb1985a403074a1217.jpg",
  taipei: "https://upload.wikimedia.org/wikipedia/commons/e/e2/YagiKairiTaipeiOneManCameraOK.jpg",
};

export const sonyJacket = (n: number) =>
  `https://www.sonymusic.co.jp/adm_image/common/artist_image/77204000/77204757/jacket_image/${n}.jpg`;
export const ytThumb = (id: string, hq?: boolean) =>
  `https://i.ytimg.com/vi/${id}/${hq ? "hqdefault" : "maxresdefault"}.jpg`;
export const sonyInfo = (id: number) => `https://www.sonymusic.co.jp/artist/yagikairi/info/${id}`;

/* ───────── player tracks ───────── */
export interface PTrack {
  key: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  preview: string;
  apple: string;
  sec: number;
}

export const cleanArtist = (a: string) =>
  a
    .replace(/八木海莉⚡️?電音遊戯 & 八木海莉/g, "八木海莉⚡電音遊戯")
    .replace("GROTESQQQUE & 八木海莉", "八木海莉")
    .replace("(Vo.八木海莉)", "（Vo.八木海莉）");

export function tracksOf(id: number, filter?: (t: ItTrack) => boolean): PTrack[] {
  const c = ITUNES[id];
  if (!c) return [];
  return c.tracks
    .filter((t) => t.preview && (!filter || filter(t)))
    .map((t) => ({
      key: `${id}-${t.disc}-${t.no}`,
      title: t.title,
      artist: cleanArtist(t.artist),
      album: c.title,
      cover: c.cover,
      preview: t.preview,
      apple: c.apple,
      sec: t.sec,
    }));
}

export function trackByTitle(id: number, title: string): PTrack | undefined {
  return tracksOf(id).find((t) => t.title === title);
}

/* ───────── discography ───────── */
export type Cat = "single" | "ep" | "digital" | "denon" | "anime" | "collab";
export const CAT_LABEL: Record<Cat | "all", string> = {
  all: "全部",
  single: "CD 单曲",
  ep: "EP",
  digital: "数字单曲",
  denon: "⚡电音遊戯",
  anime: "动画相关",
  collab: "合作 · 参与",
};

export interface Release {
  it: number;
  title: string;
  kind: string;
  cats: Cat[];
  date: string;
  note: string;
  credit?: string;
  tieup?: string;
  format?: string;
  oricon?: string;
  jackets?: string[];
  link?: string;
  mv?: string;
  tag?: string;
}

export const RELEASES: Release[] = [
  {
    it: 6816049728, title: "TINY LUCK", kind: "电影剧中曲 · 数字单曲", cats: ["collab", "anime", "digital"], date: "2026.10.07（先行配信）",
    tieup: "原创动画电影《GROTESQQQUE-グロテスク-》第3部『ノクターン〜このグロテスクな夜に〜』剧中曲",
    credit: "歌唱・作词：八木海莉 / 作曲・编曲：eba",
    note: "由锦织敦史担任监督、CloverWorks 制作的原创动画电影，2026.11.06 上映。作曲编曲的 eba，正是出道曲「Ripe Aster」的编曲者。",
    link: "https://kmu.lnk.to/TINYLUCK", tag: "NEW",
  },
  {
    it: 6801506162, title: "all = one", kind: "3rd EP · 数字发行", cats: ["ep"], date: "2026.08.26",
    credit: "全曲作词作曲：八木海莉",
    note: "收录先行单曲 color（编曲 ESME MORI）、sweet home（编曲 小川翔）、君がさ，以及新曲 PERFECT END 与终曲 シリウス。创作视角从过去常写的孤独与内心，转向外部世界与重要的人。",
    jackets: [sonyJacket(410231)], link: "https://kmu.lnk.to/all_one", mv: "dFJoPom_Rg8", tag: "LATEST",
  },
  { it: 6794310444, title: "君がさ", kind: "数字单曲", cats: ["digital"], date: "2026.08.05", note: "EP《all = one》先行第三弹，同步公开 Lyric Video（导演 秋山七星）。", mv: "FZVH-5I_y4Y" },
  { it: 6786673121, title: "sweet home", kind: "数字单曲", cats: ["digital"], date: "2026.07.15", credit: "编曲：小川翔", note: "过去的八木海莉作品里很少出现的、写给「君」的故事——从内省走向身边重要的人。", mv: "rUvSFs0xP7A" },
  { it: 6771680441, title: "color", kind: "数字单曲", cats: ["digital"], date: "2026.06.03", credit: "编曲：ESME MORI", note: "时隔约两年的个人名义新曲，拉开 2026 年连续发行的序幕。", mv: "GWRBaoy4m7c" },
  {
    it: 1828859842, title: "ACTION！EP", kind: "⚡电音遊戯 1st EP", cats: ["denon", "ep"], date: "2025.08.13（配信）/ 08.27（CD）",
    format: "CD+BD 初回仕様限定盘 KSCL-3610〜3611 ¥3,630", oricon: "144位",
    note: "电音遊戯首张 EP：ACTION！/（完）無理！/ 八木海莉⚡️電音遊戯のテーマ Vol.1 / フロアソング / ラブレター / B2B。Blu-ray 收录 MV、「ACTION！」幕后花絮与三人访谈；初回附《真・侍伝 YAIBA》动画绘柄宽版贴纸。",
    link: "https://kmu.lnk.to/YKACTION_EP", mv: "3yNNOiizLUM",
  },
  {
    it: 1818932014, title: "ACTION！", kind: "⚡电音遊戯 数字单曲", cats: ["denon", "anime", "digital"], date: "2025.06.27",
    tieup: "TV 动画《真・侍伝 YAIBA》第2クール 片尾曲", credit: "作词：八木海莉 / 作曲：藤田聖史・八木海莉⚡電音遊戯",
    note: "电音遊戯的首个动画 tie-up。「把刃们炽热耀眼的冒险与笔直的心，和我们自己的心情重叠在一起写成的歌。」希望能轻轻推听众一把，鼓起迈向未来的勇气。",
    link: "https://kmu.lnk.to/ACTION", mv: "3yNNOiizLUM",
  },
  { it: 1816188677, title: "REMIXES Vol.1", kind: "⚡电音遊戯 Remix", cats: ["denon"], date: "2025.06.04", note: "电音遊戯亲手重制个人名义名曲：お茶でも飲んで / メタモルフォーゼ / 刺激による彼ら。" },
  { it: 1798949952, title: "MEMOして", kind: "⚡电音遊戯 数字单曲", cats: ["denon", "digital"], date: "2025.03.12", note: "电音遊戯第三弹单曲，MV 同步公开。", mv: "jezSAKJnrNk" },
  { it: 1789295723, title: "猫ダッシュ", kind: "⚡电音遊戯 数字单曲", cats: ["denon", "digital"], date: "2025.01.22", note: "电音遊戯第二弹单曲，猫猫冲刺！附幕后花絮影像。", mv: "Dz_6Y7dW_Fc" },
  { it: 1780274109, title: "でゅーらら", kind: "⚡电音遊戯 1st 单曲", cats: ["denon", "digital"], date: "2024.12.04", credit: "作词：八木海莉 / 作曲：藤田聖史", note: "八木海莉⚡電音遊戯 的起点！塞满三位成员各种点子的 catchy 电子舞曲。", link: "https://kmu.lnk.to/Deulala", mv: "_4tzA5uqVyE" },
  { it: 1755364325, title: "戻らない feat. 八木海莉", kind: "MIMiNARI 合作单曲", cats: ["collab"], date: "2024.07.17", note: "参与创作组合 MIMiNARI 的 feat. 系列作品。", mv: "YD_tY5Gkvx0" },
  {
    it: 1738379644, title: "recall", kind: "3rd Single", cats: ["single", "anime"], date: "2024.05.08（数字先行 04.13）",
    format: "CD+BD 期间生产限定盘 KSCL-3508〜3509", oricon: "36位", tieup: "TV 动画《魔法科高校の劣等生》第3季 ダブルセブン編 片尾曲",
    credit: "作词作曲：八木海莉 / 编曲：TAAR",
    note: "继出道曲「Ripe Aster」之后再度为《魔法科》系列献唱。c/w「脳内シネマ」也推出了 MV。",
    jackets: [sonyJacket(308757)], mv: "RADvWaefL_U",
  },
  { it: 1735889487, title: "recall - Anime version -", kind: "动画版 数字单曲", cats: ["anime", "digital"], date: "2024.03.25", note: "配合 TV 动画放送推出的动画尺寸版本。" },
  {
    it: 1714589424, title: "know me...", kind: "2nd Single", cats: ["single", "anime"], date: "2023.11.15",
    format: "CD+BD KSCL-3467", oricon: "38位", tieup: "TV 动画《アンデッドアンラック》（不死不幸）片尾曲（第2–14话）",
    note: "读完原作后，以角色之间的爱、信赖与相互理解为主题创作。与 WurtS 提供曲「メタモルフォーゼ」组成双 A 面。",
    jackets: [sonyJacket(292262)], link: "https://yagikairi.lnk.to/knowme", mv: "h5SoI5l7oYs",
  },
  { it: 1699345146, title: "メタモルフォーゼ", kind: "数字单曲", cats: ["digital"], date: "2023.08.09", credit: "作词作曲：WurtS", tieup: "朝日电视台《あざとくて何が悪いの?》短剧企划第8弹主题曲", note: "首次演唱他人提供的作品，后作为「know me...」的双 A 面收录。", mv: "zl5pjW_yRIc" },
  { it: 1668042364, title: "セレナーデ", kind: "数字单曲", cats: ["digital"], date: "2023.02.15", credit: "编曲：久保田真悟（Jazzin'park）", note: "温柔的小夜曲。官方频道可看 One-Man Live「polydam」现场版。", mv: "7KXvPD13t-c" },
  {
    it: 1661746198, title: "健やかDE居たい", kind: "2nd EP · 数字发行", cats: ["ep"], date: "2023.02.01",
    note: "收录同名曲、のうのうた、ゾートロープ、さらば、私の星，以及 RADWIMPS「セプテンバーさん」翻唱。「さらば、私の星」写的是离开故乡、寻找适合自己的生活场所。",
    mv: "6aAQrffN-W8",
  },
  { it: 1638102233, title: "刺激による彼ら", kind: "数字单曲", cats: ["digital"], date: "2022.08.24", credit: "编曲：NAOTO（ORANGE RANGE）", note: "三个月连续发行企划第三弹。", mv: "4AsDN5DcGOI" },
  { it: 1634172454, title: "君への戦", kind: "数字单曲", cats: ["digital"], date: "2022.07.27", credit: "作曲・编曲参与：ポップしなないで", note: "三个月连续发行企划第二弹。", mv: "-4aQl88wcSc" },
  { it: 1629870019, title: "僕らの永夜", kind: "数字单曲", cats: ["digital"], date: "2022.06.29", credit: "作曲参与：ホリエアツシ（ストレイテナー）", note: "三个月连续发行企划第一弹。", mv: "BtfNSpsk8Qg" },
  {
    it: 1616993770, title: "水気を謳う", kind: "1st EP", cats: ["ep"], date: "2022.04.27",
    format: "CD+BD 初回生产限定盘 KSCL-3354〜5 / CD 通常盘 KSCL-3356", oricon: "73位", credit: "全曲作词作曲：八木海莉",
    note: "她第一支自制 MV 的「お茶でも飲んで」首次音源化。「SELF HELP」源于刚到东京时的不安，「海が乾く頃」以写给已故祖父的信为基础。通常盘追加 Bonus Track「ダダリラ」（作曲：ボカロP ふるーり）。",
    jackets: [sonyJacket(230449), sonyJacket(230450)], mv: "sCYPcVWkVHY",
  },
  {
    it: 1612444825, title: "Ripe Aster", kind: "1st Single · 出道曲", cats: ["single", "anime"], date: "2022.03.16（数字出道 2021.12.18）",
    format: "CD+BD 期间生产限定盘 KSCL-3258〜3259", oricon: "33位", tieup: "TV 动画《魔法科高校の劣等生 追憶編》主题曲",
    credit: "作词：八木海莉 / 作曲：八木海莉・おかもとえみ / 编曲：eba",
    note: "一切从这里开始的主流出道曲。CD 另收录 Piano Oriented ver.、DJ Licious Remix 与 TV size。",
    jackets: [sonyJacket(229854), sonyJacket(229672)], mv: "GHalblJtLDA",
  },
  { it: 1571465990, title: "Vivy Vocal Collection ～Sing for Your Smile～", kind: "动画歌曲集", cats: ["anime"], date: "2021.06.30", note: "收录 Vivy / Diva（Vo.八木海莉）演唱的 My Code、A Tender Moon Tempo、Galaxy Anthem、Harmony of One's Heart、Fluorite Eye's Song 等剧中歌曲。" },
  { it: 1570601514, title: "Fluorite Eye's Song", kind: "Vivy（Vo.八木海莉）", cats: ["anime"], date: "2021.06.20", note: "与作品同名的歌曲——Vivy 用百年旅程找到的「心」之歌。", mv: "GT2e8W3lqas" },
  {
    it: 1567197861, title: "Sing My Pleasure", kind: "Vivy（Vo.八木海莉）", cats: ["anime"], date: "2021.05.26（CD）",
    format: "CD SVWC-70534 · Aniplex", tieup: "TV 动画《Vivy -Fluorite Eye's Song-》片头曲",
    note: "让「八木海莉」这个名字被世界听见的作品，获 RecoChoku 2021 上半年新人下载榜第1位。收录 Sing My Pleasure、Happiness 及伴奏。",
    mv: "2p8ig-TrYPY",
  },
  { it: 1567165102, title: "Galaxy Anthem", kind: "Diva（Vo.八木海莉）", cats: ["anime"], date: "2021.05.26", note: "第7话剧中歌，以 Vivy 的另一人格 Diva 名义演唱。", mv: "bySay9gB7sQ" },
  { it: 1567387836, title: "Harmony of One's Heart", kind: "Diva（Vo.八木海莉）", cats: ["anime"], date: "2021.05.26", note: "Diva 名义演唱的剧中歌。" },
  { it: 1560925143, title: "My Code", kind: "Vivy（Vo.八木海莉）", cats: ["anime"], date: "2021.04.18", note: "Vivy 在 NiaLand 舞台上唱的歌。" },
  { it: 1560928215, title: "A Tender Moon Tempo", kind: "Vivy（Vo.八木海莉）", cats: ["anime"], date: "2021.04.18", note: "Vivy 名义的剧中歌。" },
];

export const releaseByIt = (it: number) => RELEASES.find((r) => r.it === it);

/* ───────── videos ───────── */
export type VCat = "mv" | "live" | "making" | "anime" | "denon" | "other";
export const VCAT_LABEL: Record<VCat | "all", string> = {
  all: "全部",
  mv: "MV · Lyric",
  live: "现场",
  making: "幕后",
  anime: "动画联动",
  denon: "⚡电音遊戯",
  other: "电台 · 合作",
};

export interface Video {
  id: string;
  title: string;
  sub: string;
  cat: VCat;
  date?: string;
  hq?: boolean;
}

export const VIDEOS: Video[] = [
  { id: "dFJoPom_Rg8", title: "シリウス", sub: "Music Video · 导演 秋山七星", date: "2026.08.26", cat: "mv" },
  { id: "FZVH-5I_y4Y", title: "君がさ", sub: "Lyric Video", date: "2026.08.05", cat: "mv" },
  { id: "rUvSFs0xP7A", title: "sweet home", sub: "Lyric Video", date: "2026.07.15", cat: "mv" },
  { id: "GWRBaoy4m7c", title: "color", sub: "Lyric Video", date: "2026.06.03", cat: "mv" },
  { id: "v5rcs2XuFcw", title: "脳内シネマ", sub: "Music Video", date: "2024.05.08", cat: "mv" },
  { id: "RADvWaefL_U", title: "recall", sub: "Music Video", date: "2024.04.19", cat: "mv" },
  { id: "h5SoI5l7oYs", title: "know me...", sub: "Music Video · 导演 増田彩来", date: "2023.10.14", cat: "mv" },
  { id: "zl5pjW_yRIc", title: "メタモルフォーゼ", sub: "Music Video · 导演 miura ento", date: "2023.08.11", cat: "mv" },
  { id: "zHZk5WMz530", title: "さらば、私の星", sub: "Music Video", date: "2023.02.01", cat: "mv" },
  { id: "6aAQrffN-W8", title: "健やかDE居たい", sub: "Music Video · 导演 鳥畑恵美莉", date: "2023.01.18", cat: "mv" },
  { id: "4AsDN5DcGOI", title: "刺激による彼ら", sub: "Photo Shoot Footage", date: "2022.08", cat: "mv" },
  { id: "-4aQl88wcSc", title: "君への戦", sub: "Music Video · 导演 大久保拓朗", date: "2022.07.27", cat: "mv" },
  { id: "BtfNSpsk8Qg", title: "僕らの永夜", sub: "Visualizer · 河澄大吉", date: "2022.07.15", cat: "mv", hq: true },
  { id: "sCYPcVWkVHY", title: "SELF HELP", sub: "Music Video · 导演 松永侑", date: "2022.04.20", cat: "mv" },
  { id: "GHalblJtLDA", title: "Ripe Aster", sub: "Music Video · 导演 倉本雷大", date: "2021.12.25", cat: "mv", hq: true },
  { id: "jiQQsIySD9c", title: "お茶でも飲んで", sub: "Music Video · 导演 中澤太", date: "2021.09.30", cat: "mv" },

  { id: "nxu870lBKMg", title: "Kairi Yagi Live Collections", sub: "现场合集 XFD", cat: "live" },
  { id: "-OOeJBi16ow", title: "know me...", sub: "One-Man Live Tour 2023 - know me... -", cat: "live" },
  { id: "QKv-W8geQJ0", title: "Sugar morning - Live Arrange 2023 -", sub: "One-Man Live Tour 2023 - know me... -", cat: "live" },
  { id: "G2Ls8-a5VGs", title: "さらば、私の星", sub: "One-Man Live -polydam-", cat: "live", hq: true },
  { id: "7KXvPD13t-c", title: "セレナーデ", sub: "One-Man Live「polydam」", cat: "live" },
  { id: "ctDXw7Sq49Y", title: "メタモルフォーゼ", sub: "Birthday Live -21-", cat: "live" },
  { id: "AQruiOpeL_w", title: "健やかDE居たい", sub: "First One-Man Live -20-", cat: "live" },

  { id: "FCxVyh72yZs", title: "recall", sub: "Making 幕后花絮", cat: "making", hq: true },
  { id: "na14SiixW64", title: "know me...", sub: "Making 幕后花絮", cat: "making" },
  { id: "T1kRpRugHYo", title: "メタモルフォーゼ", sub: "Making 幕后花絮", cat: "making" },
  { id: "0vx2dXN3oEU", title: "Ripe Aster", sub: "Making 幕后花絮", cat: "making" },

  { id: "2p8ig-TrYPY", title: "Sing My Pleasure", sub: "《Vivy》无字幕 OP · Aniplex 官方", cat: "anime" },
  { id: "bySay9gB7sQ", title: "Galaxy Anthem", sub: "《Vivy》第7话剧中歌 · Diva", cat: "anime" },
  { id: "GT2e8W3lqas", title: "Fluorite Eye's Song", sub: "本人弹唱 ver.", cat: "anime", hq: true },
  { id: "aps_A8LwEAM", title: "Ripe Aster × 魔法科 追憶編", sub: "Collaboration Movie", cat: "anime", hq: true },
  { id: "canptz0g5_k", title: "know me...", sub: "《アンデッドアンラック》无字幕 ED · TMS 官方", cat: "anime" },
  { id: "tYSWC03T_TY", title: "JUMP MV × know me...", sub: "ジャンプチャンネル 官方", cat: "anime" },
  { id: "V6XRkxO-OPY", title: "recall", sub: "《魔法科》第3季 无字幕 ED · Aniplex 官方", cat: "anime" },
  { id: "Lg6mEPifiYk", title: "recall × ダブルセブン編", sub: "Collaboration Movie", cat: "anime" },
  { id: "XLplKqU1M7c", title: "ACTION！", sub: "《真・侍伝 YAIBA》无字幕 ED · ShoPro 官方", cat: "anime" },
  { id: "TSv-i26-0qY", title: "ACTION！最终话特别 ED", sub: "《真・侍伝 YAIBA》第1期最终话", cat: "anime" },

  { id: "3yNNOiizLUM", title: "ACTION！", sub: "Music Video · 导演 秋山七星", date: "2025.06.28", cat: "denon" },
  { id: "jezSAKJnrNk", title: "MEMOして", sub: "Music Video", date: "2025.03", cat: "denon" },
  { id: "Dz_6Y7dW_Fc", title: "猫ダッシュ", sub: "Music Video", date: "2025.01", cat: "denon" },
  { id: "_4tzA5uqVyE", title: "でゅーらら", sub: "Music Video", date: "2024.12.04", cat: "denon" },
  { id: "wvVM-5zTQ1c", title: "（完）無理！", sub: "Visualizer", cat: "denon" },
  { id: "AE0CCI1MXCk", title: "フロアソング", sub: "Visualizer", cat: "denon" },
  { id: "OXDiEhmIlww", title: "ラブレター", sub: "Visualizer", cat: "denon" },
  { id: "KSoZaICeZrI", title: "B2B", sub: "Visualizer", cat: "denon" },
  { id: "0HBdbw1447A", title: "ACTION！", sub: "Making 幕后花絮", cat: "denon" },
  { id: "lSvDr-MQiAc", title: "猫ダッシュ", sub: "Making 幕后花絮", cat: "denon", hq: true },

  { id: "YD_tY5Gkvx0", title: "戻らない feat. 八木海莉", sub: "MIMiNARI 官方 MV", cat: "other" },
  { id: "Hh3AGT7tUFo", title: "ぐうたらじお 第18回", sub: "YouTube 电台「24歳になったよ」", cat: "other" },
  { id: "_jwZPOwRLyg", title: "ぐうたらじお 第17回", sub: "YouTube 电台「しゃべりたりないEPのこと」", cat: "other" },
  { id: "pBXpoWeF_50", title: "ぐうたらじお 第16回", sub: "YouTube 电台「EPでたよ」", cat: "other" },
];

export const videoById = (id: string) => VIDEOS.find((v) => v.id === id);

/* ───────── anime tie-ups ───────── */
export interface AnimeWork {
  key: string;
  title: string;
  zh: string;
  year: string;
  role: string;
  songs: string[];
  desc: string;
  videos: string[];
  covers: number[];
  goods?: string;
  tone: string;
}

export const ANIME: AnimeWork[] = [
  {
    key: "vivy", title: "Vivy -Fluorite Eye's Song-", zh: "薇薇 -萤石眼之歌-", year: "2021 · TV 动画（WIT STUDIO 原创）",
    role: "主角 AI 歌姬「Vivy（ヴィヴィ）」与另一人格「Diva（ディーヴァ）」的歌唱担当（台词配音：種崎敦美）",
    songs: ["Sing My Pleasure（OP）", "My Code", "A Tender Moon Tempo", "Galaxy Anthem", "Harmony of One's Heart", "Fluorite Eye's Song"],
    desc: "以「用歌声让大家幸福」为使命的 AI 歌姬，跨越百年去阻止 AI 与人类之战。18 岁的八木海莉凭这道歌声一举成名——这也是许多粉丝认识她的起点。",
    videos: ["2p8ig-TrYPY", "bySay9gB7sQ", "GT2e8W3lqas"],
    covers: [1567197861, 1571465990, 1570601514, 1567165102, 1567387836, 1560925143],
    goods: "动画绘柄 CD：「Sing My Pleasure」（SVWC-70534）、Vocal Collection ～Sing for Your Smile～",
    tone: "from-[#1d3b6e] via-[#2a2d6b] to-[#0a1422]",
  },
  {
    key: "mahouka1", title: "魔法科高校の劣等生 追憶編", zh: "魔法科高中的劣等生 追忆篇", year: "2021.12.31 · 跨年特别篇",
    role: "主题曲「Ripe Aster」——八木海莉的主流出道曲",
    songs: ["Ripe Aster（主题曲）"],
    desc: "描绘司波兄妹过去的「追忆篇」。作为新人以本作主题曲出道，CD 推出动画联动的期间生产限定盘（CD+BD）。",
    videos: ["aps_A8LwEAM", "GHalblJtLDA"],
    covers: [1612444825],
    goods: "「Ripe Aster」期间生产限定盘 KSCL-3258〜3259",
    tone: "from-[#3b2a6e] via-[#1f2b55] to-[#0a1422]",
  },
  {
    key: "undead", title: "アンデッドアンラック", zh: "不死不幸 / Undead Unluck", year: "2023 · TV 动画",
    role: "片尾曲「know me...」（第2–14话）",
    songs: ["know me...（ED）"],
    desc: "她在读完原作后，以风子与安迪之间的爱、信赖与相互理解为主题写下这首歌。《周刊少年 JUMP》官方频道还推出了「JUMP MV」。",
    videos: ["canptz0g5_k", "tYSWC03T_TY", "h5SoI5l7oYs"],
    covers: [1714589424],
    goods: "2nd Single「know me...」CD+BD（KSCL-3467）",
    tone: "from-[#5a1f2e] via-[#2b1a3a] to-[#0a1422]",
  },
  {
    key: "mahouka3", title: "魔法科高校の劣等生 第3シーズン", zh: "魔法科高中的劣等生 第3季", year: "2024 · TV 动画",
    role: "ダブルセブン編 片尾曲「recall」",
    songs: ["recall（ED）"],
    desc: "继出道曲之后，再次为《魔法科》系列献唱。官方还公开了「recall × ダブルセブン編」联动影像。",
    videos: ["V6XRkxO-OPY", "Lg6mEPifiYk", "RADvWaefL_U"],
    covers: [1735889487, 1738379644],
    goods: "3rd Single「recall」期间生产限定盘 KSCL-3508〜3509",
    tone: "from-[#1f4a6e] via-[#1a2c4d] to-[#0a1422]",
  },
  {
    key: "yaiba", title: "真・侍伝 YAIBA", zh: "真·侍传 YAIBA", year: "2025 · TV 动画（原作 青山剛昌）",
    role: "八木海莉⚡電音遊戯 · 第2クール 片尾曲「ACTION！」",
    songs: ["ACTION！（ED）"],
    desc: "电音遊戯首个动画 tie-up：把主角刃炽热耀眼的冒险与笔直的心，和自己的心情重叠。第1期最终话还有特别版片尾影像。",
    videos: ["XLplKqU1M7c", "TSv-i26-0qY", "3yNNOiizLUM"],
    covers: [1818932014, 1828859842],
    goods: "ACTION！EP 初回仕様：原创设计动画绘柄宽版贴纸",
    tone: "from-[#6e5a1f] via-[#3a1f4d] to-[#0a1422]",
  },
  {
    key: "grotesque", title: "GROTESQQQUE-グロテスク-", zh: "原创动画电影", year: "2026.11.06 上映 · CloverWorks",
    role: "第3部『ノクターン〜このグロテスクな夜に〜』剧中曲「TINY LUCK」（歌唱・作词）",
    songs: ["TINY LUCK（剧中曲）"],
    desc: "监督・脚本・角色原案：锦织敦史。由三部世界观各异的作品组成，共 35 组音乐人参与。作曲编曲为老搭档 eba。",
    videos: [],
    covers: [6816049728],
    tone: "from-[#2b1f4d] via-[#14223d] to-[#0a1422]",
  },
];

/* ───────── ⚡ 電音遊戯 ───────── */
export const DENON_RELEASES = [1780274109, 1789295723, 1798949952, 1816188677, 1818932014, 1828859842];

export const DENON_MEMBERS = [
  { role: "Vocal", name: "八木海莉", en: "Kairi Yagi", from: "", desc: "企划核心。负责作词与歌声，把从小喜欢的 VOCALOID 与电子音乐带进来。", color: "text-volt", ring: "ring-volt/60", glyph: "Vo" },
  { role: "Keyboard / Synth", name: "藤田聖史", en: "Kiyoshi Fujita", from: "鋭児", desc: "鋭児键盘手，负责作曲与合成器编程（「でゅーらら」作曲）。", color: "text-neon-cyan", ring: "ring-neon-cyan/60", glyph: "Key" },
  { role: "Drums / E-Perc.", name: "市原太郎", en: "Taro Ichihara", from: "鋭児", desc: "鋭児鼓手，负责鼓与电子打击乐。看过她的个人现场后，第一句就夸「歌词超有趣」。", color: "text-neon-pink", ring: "ring-neon-pink/60", glyph: "Dr" },
];

export const DENON_LIVES = [
  { date: "2025.02.15", title: "1st LIVE -放電式-", place: "东京 SHINJUKU ReNY", note: "全新曲构成的首次公演" },
  { date: "2025.09.05", title: "Birthday Live -23-", place: "东京 duo MUSIC EXCHANGE", note: "与 SOLO 名义同台共演" },
  { date: "2025.10.25", title: "SPOOKY PUMPKIN 2025", place: "活动出演", note: "万圣节主题 Live 活动" },
];

/* ───────── goods (ROCKET-EXPRESS 官方商店) ───────── */
export type GCat = "wear" | "towel" | "small" | "home" | "fc";
export const GCAT_LABEL: Record<GCat | "all", string> = { all: "全部", wear: "服饰", towel: "毛巾", small: "小物 · 文具", home: "生活杂货", fc: "会员限定" };

export interface Goods {
  id: string;
  name: string;
  zh: string;
  price: number;
  was?: number;
  soldout?: boolean;
  img: string;
  cat: GCat;
}

const rx = (p: string) => `https://www.rocket-exp.com/images/15/${p}/600_600_102400.jpg`;
export const goodsUrl = (id: string) => `https://www.rocket-exp.com/s/R/item/detail/${id}`;
export const SHOP_URL = "https://www.rocket-exp.com/yagikairi/";

export const GOODS: Goods[] = [
  { id: "2093270062", name: "24 tee", zh: "Birthday Live -24- T 恤", price: 3500, img: rx("6a9/27d0af0c149afbf33d0369f4785d6"), cat: "wear" },
  { id: "2093270065", name: "24 towel", zh: "Birthday Live -24- 毛巾", price: 2000, img: rx("ce0/38d268344c1bbd0f80faacaf914ff"), cat: "towel" },
  { id: "2093270066", name: "Kairi Yagi Sticker Sheet", zh: "贴纸套组", price: 1000, img: rx("c45/5893febc4c58496ec270f355455c7"), cat: "small" },
  { id: "2093270067", name: "Kairi Yagi Badge Collection（4種ランダム）", zh: "徽章收藏 · 4 款随机", price: 500, img: rx("ab8/cb037cf565f339a30ec060e511001"), cat: "small" },
  { id: "2093270061", name: "記憶カレンダー", zh: "「记忆」月历", price: 2000, img: rx("92f/9f308cd17f185942cfdbfc5c86fc1"), cat: "home" },
  { id: "2093270058", name: "【STUDIO KAIRI限定】4th Anniversary ピンバッジ", zh: "出道 4 周年纪念徽章 · 会员限定", price: 1500, img: rx("2cb/0a56868906ff677ca04133f6ba5a7"), cat: "fc" },
  { id: "2093270051", name: "23 tee", zh: "Birthday Live -23- T 恤", price: 2600, was: 3500, img: rx("e5d/30f2ff5a62c380d6f2020d2d8d2a3"), cat: "wear" },
  { id: "2093270054", name: "23 towel", zh: "Birthday Live -23- 毛巾", price: 1500, was: 2000, soldout: true, img: rx("1b7/e8195fcfbf41a1700f29a62daa8d4"), cat: "towel" },
  { id: "2093270055", name: "夏生まれグラス", zh: "「夏天出生」玻璃杯", price: 1200, was: 1500, img: rx("9af/5a39b550db78f57956b787cdffef0"), cat: "home" },
  { id: "2093270056", name: "カイリ 3D coaster", zh: "海莉 3D 杯垫", price: 700, was: 900, img: rx("81f/6334c30f72d27e77139ff1487a1c5"), cat: "home" },
  { id: "2093270046", name: "YAGI KAIRI tour long tee", zh: "巡演长袖 T 恤", price: 3500, was: 4500, img: rx("f49/3293507dd979be3b6819aa3a7b410"), cat: "wear" },
  { id: "2093270045", name: "【STUDIO KAIRI限定】3rd Anniversary ピンバッジ", zh: "出道 3 周年纪念徽章 · 会员限定", price: 1500, img: rx("ef3/68a78391a1748d57ea8fb0fb20adc"), cat: "fc" },
  { id: "2093270040", name: "recall tee", zh: "One-Man Live 2024 - recall - T 恤", price: 2600, was: 3500, img: rx("518/eb79563ffc4e62e6f4e6cd03fd582"), cat: "wear" },
  { id: "2093270036", name: "recall towel", zh: "One-Man Live 2024 - recall - 毛巾", price: 1500, was: 2000, img: rx("57e/4e30e6fcedc0d743d040e797a3193"), cat: "towel" },
  { id: "2093270039", name: "静観する八木海莉アクリルスタンド", zh: "「静观的八木海莉」亚克力立牌（90×125mm）", price: 1000, was: 1500, soldout: true, img: rx("9b5/283e6cddad78d83ab8742477fa91a"), cat: "small" },
  { id: "2093270032", name: "【STUDIO KAIRI限定】2nd Anniversary ピンバッジ", zh: "出道 2 周年纪念徽章 · 会员限定", price: 1500, img: rx("239/76a08b7eb3fbaf7361475866e6e52"), cat: "fc" },
];

export const BONUS = [
  { title: "动画绘柄宽版贴纸", jp: "オリジナルデザインアニメ絵柄ワイドキャップステッカー", from: "ACTION！EP 初回仕様", tag: "动漫联动", icon: "🗡️" },
  { title: "未发表 Demo 试听 QR 明信片", jp: "未発表デモ音源試聴QRコード付きポストカード（ランダムサイン入り）", from: "ACTION！EP 早期预约特典", tag: "随机签名", icon: "💌" },
  { title: "Mega Jacket 大尺寸封面卡", jp: "メガジャケ", from: "Amazon.co.jp 特典", tag: "店铺特典", icon: "🖼️" },
  { title: "原创橡胶手环", jp: "オリジナルラバーバンド", from: "セブンネット 特典", tag: "店铺特典", icon: "⭕" },
  { title: "原创亚克力钥匙扣", jp: "オリジナルアクリルキーホルダー", from: "楽天ブックス 特典", tag: "店铺特典", icon: "🔑" },
  { title: "艺人照明信片", jp: "ポストカード（アーティスト写真絵柄）", from: "应援店特典", tag: "店铺特典", icon: "📮" },
];

export const TAIPEI_GOODS = [
  { name: "23 tee（M / L / XL）", price: "NT$900" },
  { name: "23 towel", price: "NT$500" },
  { name: "静観する八木海莉アクリルスタンド", price: "NT$400" },
  { name: "Kairi Yagi Sticker Sheet", price: "NT$260" },
];

/* ───────── news (官方资讯中译摘要) ───────── */
export type NewsCat = "RELEASE" | "LIVE" | "GOODS" | "MEDIA" | "VIDEO" | "INFO";
export const NEWS: { date: string; cat: NewsCat; title: string; id: number }[] = [
  { date: "2026.10.21", cat: "LIVE", title: "Acoustic Live 2027「inner space」官网先行抽选开始（至 11/1 23:59）", id: 587837 },
  { date: "2026.10.07", cat: "LIVE", title: "Acoustic Live 2027「inner space」举办决定！STUDIO KAIRI 会员最速先行同步开启", id: 587415 },
  { date: "2026.10.07", cat: "RELEASE", title: "「TINY LUCK」（电影《GROTESQQQUE-グロテスク-》剧中曲）先行配信开始", id: 587413 },
  { date: "2026.09.20", cat: "MEDIA", title: "NACK5「FAV FOUR」生放送出演", id: 587041 },
  { date: "2026.09.16", cat: "MEDIA", title: "TOKYO FM & JFN「Memories & Discoveries」出演", id: 586878 },
  { date: "2026.09.11", cat: "GOODS", title: "Birthday Live -24- 周边于 ROCKET-EXPRESS 开始通贩", id: 586761 },
  { date: "2026.09.01", cat: "GOODS", title: "Birthday Live -24- NEW GOODS 公开 & 会场贩售说明", id: 586439 },
  { date: "2026.08.26", cat: "VIDEO", title: "「シリウス」Music Video 首播公开", id: 586254 },
  { date: "2026.08.26", cat: "RELEASE", title: "New EP『all = one』今日配信开始！", id: 586210 },
  { date: "2026.08.25", cat: "GOODS", title: "ONE-MAN LIVE 2026 in TAIPEI 现场周边贩售决定", id: 586222 },
  { date: "2026.08.05", cat: "RELEASE", title: "『君がさ』配信开始 & 歌曲分享活动", id: 585666 },
  { date: "2026.07.15", cat: "RELEASE", title: "『sweet home』配信开始 & 歌曲分享活动", id: 585086 },
  { date: "2026.06.17", cat: "MEDIA", title: "参加动画电影『GROTESQQQUE-グロテスク-』决定", id: 584288 },
  { date: "2026.06.03", cat: "RELEASE", title: "『color』配信开始 & 歌曲分享活动", id: 583889 },
  { date: "2026.05.07", cat: "INFO", title: "剧场版《魔法科高校の劣等生 四葉継承編》上映纪念：历代主题曲合集首播（含 Ripe Aster / recall）", id: 583226 },
  { date: "2026.04.22", cat: "LIVE", title: "ONE-MAN LIVE 2026 in TAIPEI 举办决定——首次海外公演", id: 582873 },
];

/* ───────── live ───────── */
export const UPCOMING = {
  title: "Acoustic Live 2027「inner space」",
  price: "全自由席 ¥5,000（含税）· 学龄前儿童不可入场",
  shows: [
    { at: "2027-02-27T17:30:00+09:00", label: "02.27 SAT", city: "大阪", venue: "島之内教会", time: "开场 17:00 / 开演 17:30", note: "无饮料费" },
    { at: "2027-02-28T15:30:00+09:00", label: "02.28 SUN", city: "爱知", venue: "名古屋陶磁器会館", time: "开场 15:00 / 开演 15:30", note: "另付饮料费 ¥600（仅现金）" },
    { at: "2027-03-07T13:00:00+09:00", label: "03.07 SUN", city: "神奈川", venue: "BLUE Enoshima［OCEAN VIEW］", time: "开场 12:15 / 开演 13:00", note: "另付饮料费 ¥800（仅现金）" },
    { at: "2027-03-07T17:00:00+09:00", label: "03.07 SUN", city: "神奈川", venue: "BLUE Enoshima［SUNSET VIEW］", time: "开场 16:15 / 开演 17:00", note: "另付饮料费 ¥800（仅现金）" },
  ],
  tickets: [
    { label: "官网先行（e+）", url: "https://eplus.jp/yagikairi2027/", period: "2026.10.21 12:00 – 11.01 23:59" },
    { label: "STUDIO KAIRI 会员最速先行", url: "https://smam.jp/studiokairi/", period: "已于 10.18 截止" },
  ],
};

export type LiveTag = "SOLO" | "TOUR" | "⚡" | "ACOUSTIC" | "OVERSEAS" | "BIRTHDAY";
export const PAST_LIVES: { date: string; title: string; place: string; tag: LiveTag; note?: string }[] = [
  { date: "2026.09.05", title: "Birthday Live -24-", place: "东京 duo MUSIC EXCHANGE", tag: "BIRTHDAY" },
  { date: "2026.08.30", title: "ONE-MAN LIVE 2026 in TAIPEI", place: "台北 CLAPPER STUDIO", tag: "OVERSEAS", note: "首次海外个人公演，也是人生第一次出国" },
  { date: "2026.03.08", title: "Acoustic Live -水滴記憶-", place: "京都 冬青庵能舞台", tag: "ACOUSTIC", note: "钢琴：西野恵未" },
  { date: "2026.03.07", title: "Acoustic Live -水滴記憶-", place: "广岛 Live Juke", tag: "ACOUSTIC", note: "家乡广岛公演" },
  { date: "2026.02.14", title: "Acoustic Live -水滴記憶-", place: "东京 7th FLOOR", tag: "ACOUSTIC" },
  { date: "2025.09.05", title: "Birthday Live -23-", place: "东京 duo MUSIC EXCHANGE", tag: "BIRTHDAY", note: "SOLO × ⚡電音遊戯 共演" },
  { date: "2025.02.15", title: "⚡電音遊戯 1st LIVE -放電式-", place: "东京 SHINJUKU ReNY", tag: "⚡" },
  { date: "2025.02.08 – 02.15", title: "One-Man Live Tour 2025", place: "名古屋 ell.FITS ALL / 大阪 OSAKA MUSE / 东京 SHINJUKU ReNY", tag: "TOUR" },
  { date: "2024.09.05", title: "Birthday Live -22-", place: "东京 duo MUSIC EXCHANGE", tag: "BIRTHDAY" },
  { date: "2024.07.07", title: "One-Man Live 2024 - recall -", place: "东京 原宿 RUIDO", tag: "SOLO", note: "晚场售罄后加开日场，首次单日两场" },
  { date: "2023.12.09 – 12.23", title: "One-Man Live Tour 2023 - know me... -", place: "大阪 OSAKA MUSE / 名古屋 ell.FITS ALL / 东京 Shibuya WWW X", tag: "TOUR", note: "首次东名阪巡演" },
  { date: "2023.09.05", title: "Birthday Live -21-", place: "东京 duo MUSIC EXCHANGE", tag: "BIRTHDAY" },
  { date: "2023.02.11 – 12", title: "One-Man Live「polydam」", place: "东京 日本橋三井ホール", tag: "SOLO" },
  { date: "2022.09.04 – 05", title: "First One-Man Live -19- / -20-", place: "东京 duo MUSIC EXCHANGE", tag: "SOLO", note: "首次有观众个人公演，第二天正是 20 岁生日" },
];

/* ───────── profile ───────── */
export const PROFILE: [string, string][] = [
  ["姓名", "八木 海莉（やぎ かいり / Yagi Kairi）"],
  ["生日", "2002 年 9 月 5 日 · 处女座"],
  ["出身", "日本 · 广岛县"],
  ["职业", "创作歌手（Vocal / Guitar）"],
  ["事务所", "Sony Music Artists"],
  ["唱片公司", "Ki/oon Music（Sony Music Labels）"],
  ["出道", "2021.12.18「Ripe Aster」"],
  ["爱用乐器", "Martin（父亲推荐）/ Rickenbacker"],
  ["音乐影响", "西野カナ、VOCALOID、嵐、RADWIMPS、欧美流行"],
  ["会员站", "STUDIO KAIRI（月额 550 日元）"],
];

export const TRIVIA = [
  { icon: "🗝️", title: "名字的由来", text: "「海莉」取自《王国之心》系列中读音相同的角色 Kairi（凯莉）。" },
  { icon: "🐟", title: "热带鱼爱好者", text: "老家有大鱼缸，最爱泰国斗鱼；养过名叫「ガリ（寿司姜）」和「しそ（紫苏）」的鱼。" },
  { icon: "🍵", title: "喝杯茶吧", text: "「お茶でも飲んで」想象的是一杯温热的乌龙茶——意思是“先停下来喘口气”。" },
  { icon: "🧶", title: "黏土手作", text: "喜欢树脂黏土手工，曾以「SELF HELP」MV 角色、「のうのうた」等为题材创作。" },
  { icon: "🍙", title: "食欲おばけ", text: "食量其实不大，却总是充满食欲，于是自称「食欲怪」。" },
  { icon: "📓", title: "日记与备忘录", text: "小学起坚持写日记；旧日记和手机备忘录里的词句都是歌词灵感。" },
  { icon: "💻", title: "Logic Pro", text: "高二左右开始用 Logic Pro 作曲——先列出想表达的词，再配上旋律。" },
  { icon: "📺", title: "动画迷", text: "异世界、少年漫改编、设定沉重的作品都爱看，为动画写歌时会与自身经历对照。" },
];

export const TIMELINE = [
  { y: "2002", t: "9 月 5 日出生于广岛县。" },
  { y: "2013", t: "小学五年级考入 ACTOR'S SCHOOL 广岛（ASH），成为第 28 期生。" },
  { y: "2016", t: "与同校的吉村风香组成「Breeze sea」，出演 TOKYO IDOL FESTIVAL 2016。" },
  { y: "2017", t: "初三开始自学吉他；毕业后，15 岁独自从广岛上京。" },
  { y: "2018", t: "12 月 3 日开设 YouTube 频道，上传吉他弹唱翻唱。" },
  { y: "2021", t: "担任《Vivy》主角 Vivy / Diva 的歌唱；7 月频道订阅破 10 万；12 月 18 日以「Ripe Aster」主流出道。" },
  { y: "2022", t: "1st EP《水気を謳う》；三个月连续发行；9 月首次有观众个人公演，开设会员站 STUDIO KAIRI。" },
  { y: "2023", t: "数字 EP《健やかDE居たい》；11 月「know me...」成为《不死不幸》ED；12 月首次东名阪巡演。" },
  { y: "2024", t: "「recall」成为《魔法科》第3季 ED；7 月首次单日两场；12 月电子音乐企划「八木海莉⚡電音遊戯」始动。" },
  { y: "2025", t: "One-Man Live Tour 2025；电音遊戯「ACTION！」成为《真・侍伝 YAIBA》ED，8 月发行《ACTION！EP》。" },
  { y: "2026", t: "Acoustic Live -水滴記憶-；连续发行 color / sweet home / 君がさ 与 EP《all = one》；8 月台北首次海外公演；参加电影《GROTESQQQUE》。" },
];

/* ───────── fan zone ───────── */
export const GUIDE = [
  { it: 1616993770, track: "お茶でも飲んで", why: "一切的原点——她第一支自制 MV 的歌。累了，就先停下来喝杯茶。" },
  { it: 1612444825, track: "Ripe Aster", why: "主流出道曲，《魔法科 追忆篇》主题曲。" },
  { it: 1567197861, track: "Sing My Pleasure", why: "《Vivy》OP，让世界认识这道歌声的作品。" },
  { it: 1714589424, track: "know me...", why: "《不死不幸》ED，关于爱、信赖与相互理解。" },
  { it: 1661746198, track: "さらば、私の星", why: "离开故乡，去寻找真正适合自己的地方。" },
  { it: 6801506162, track: "シリウス", why: "最新 EP 的终曲，也是台北公演唱响的那颗星。" },
  { it: 1828859842, track: "ACTION!", why: "想跳舞的时候，切换到 ⚡电音遊戯！" },
];

export function starterQueue(): PTrack[] {
  return GUIDE.map((g) => trackByTitle(g.it, g.track)).filter((t): t is PTrack => !!t);
}

export function soloPool(): PTrack[] {
  const ids = RELEASES.filter((r) => !r.cats.includes("denon") && r.it !== 1571465990).map((r) => r.it);
  const seen = new Set<string>();
  return ids
    .flatMap((id) => tracksOf(id, (t) => !/instrumental|TV size|anime|Remix/i.test(t.title)))
    .filter((t) => (seen.has(t.title) ? false : (seen.add(t.title), true)));
}

export interface EventItem {
  at: number;
  title: string;
  sub: string;
  tag: string;
}

export function upcomingEvents(now = Date.now()): EventItem[] {
  const t = (s: string) => new Date(s).getTime();
  const list: EventItem[] = [
    { at: t("2026-11-06T00:00:00+09:00"), title: "电影《GROTESQQQUE》上映", sub: "剧中曲「TINY LUCK」", tag: "MOVIE" },
    ...UPCOMING.shows.map((s) => ({ at: t(s.at), title: "inner space · " + s.city, sub: s.venue, tag: "LIVE" })),
  ];
  const y = new Date(now).getFullYear();
  for (const yy of [y, y + 1]) {
    list.push({ at: t(`${yy}-09-05T00:00:00+09:00`), title: `八木海莉 ${yy - 2002} 岁生日`, sub: "Happy Birthday, Kairi!", tag: "BIRTHDAY" });
    list.push({ at: t(`${yy}-12-18T00:00:00+09:00`), title: `出道 ${yy - 2021} 周年`, sub: "2021.12.18「Ripe Aster」", tag: "ANNIV." });
  }
  return list.filter((e) => e.at > now).sort((a, b) => a.at - b.at);
}

/* ───────── links ───────── */
export const LINKS = [
  { label: "Official Site", sub: "yagikairi.com", url: "https://yagikairi.com/" },
  { label: "Sony Music", sub: "官方艺人页", url: "https://www.sonymusic.co.jp/artist/yagikairi/" },
  { label: "Sony Music Artists", sub: "事务所", url: "https://www.sma.co.jp/s/sma/artist/590" },
  { label: "STUDIO KAIRI", sub: "官方会员站", url: "https://smam.jp/studiokairi/" },
  { label: "YouTube", sub: "八木海莉", url: "https://www.youtube.com/channel/UCpuMbQe3VhIpg22sbNbHQKQ" },
  { label: "YouTube", sub: "八木海莉 ch.", url: "https://www.youtube.com/channel/UCUHCFcDL6svzT8JAsgLYLWQ" },
  { label: "X", sub: "@kairiyagi_", url: "https://x.com/kairiyagi_" },
  { label: "X", sub: "@yagikairi_staff", url: "https://x.com/yagikairi_staff" },
  { label: "Instagram", sub: "@reu__loon", url: "https://www.instagram.com/reu__loon/" },
  { label: "ROCKET-EXPRESS", sub: "官方周边商店", url: SHOP_URL },
  { label: "Apple Music", sub: "⚡電音遊戯", url: "https://music.apple.com/jp/artist/1780274110" },
];
