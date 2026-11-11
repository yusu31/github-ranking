// デモ動画の撮影台本（Playwright）。本物のページを動かして webm に録画する。
// 使い方: npm i -D playwright && npx playwright install chromium
//         DEMO_URL=http://localhost:8000 node scripts/demo/capture.mjs
// 出力: docs/demo/demo.webm（MP4・GIF への変換は ffmpeg。入れる前に本人へ確認する）
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync } from "node:fs";

const URL = process.env.DEMO_URL || "http://localhost:8000";
const OUT = "docs/demo";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: OUT, size: { width: 1280, height: 720 } },
});
const page = await context.newPage();

// ---- 台本（docs/delivery.md §4「本人が触る手順」と同じ順にする）----
await page.goto(URL);
await page.waitForTimeout(1500);
// 例: await page.getByRole("button", { name: "開始" }).click();
//     await page.waitForTimeout(1000);
// ---------------------------------------------------------------

await context.close(); // 閉じると動画が書き出される
await browser.close();
const webm = readdirSync(OUT).filter((f) => f.endsWith(".webm") && f !== "demo.webm").pop();
if (webm) renameSync(`${OUT}/${webm}`, `${OUT}/demo.webm`);
console.log(`録画: ${OUT}/demo.webm`);
