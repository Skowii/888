import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: false,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--window-position=40,40", "--window-size=1440,900"],
});
const page = await browser.newPage({ viewport: { width: 1360, height: 820 } });
const pause = (ms) => page.waitForTimeout(ms);

await page.goto("http://127.0.0.1:5173/#/command", { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("heading", { name: "One floor. Nothing executing." }).waitFor();
await pause(1600);
await page.mouse.wheel(0, 500);
await pause(1200);
await page.mouse.wheel(0, -500);
await pause(800);

await page.getByRole("button", { name: "Factory" }).click();
await page.getByRole("heading", { name: "The floor shows the same records as Operator mode." }).waitFor();
await pause(1800);
await page.mouse.wheel(0, 400);
await pause(1200);

await page.getByRole("button", { name: "Operator" }).click();
await pause(600);
await page.getByRole("link", { name: "Visual Studio", exact: true }).click();
await page.getByRole("link", { name: "TACO Next Generation" }).click();
await page.getByText("No image-capable model is connected").first().waitFor();
await pause(1600);
await page.mouse.wheel(0, 450);
await pause(1200);

await page.getByRole("link", { name: "Z3R0TH Chat" }).click();
await page.getByRole("button", { name: "New objective" }).click();
await pause(500);
await page.getByLabel("Objective").fill("Read the director file before integration.");
await pause(600);
await page.getByRole("button", { name: "Keep line" }).click();
await page.getByText("Read the director file before integration.").waitFor();
await pause(800);
await page.getByRole("button", { name: "File latest line as planning" }).click();
await page.getByText("Latest line filed as a planning note.").waitFor();
await pause(1200);

await page.getByRole("link", { name: "Jobs & Approvals" }).click();
await page.getByTestId("planning-lane").getByText("Read the director file before integration.").waitFor();
await page.getByTestId("execution-lane").getByText(/unavailable/i).waitFor();
await pause(2200);

await browser.close();
console.log("demo-ok");
