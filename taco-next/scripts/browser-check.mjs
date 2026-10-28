import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const base = process.env.TACO_URL ?? "http://127.0.0.1:5173";
const out = process.env.TACO_SHOTS ?? "/tmp/taco-next-shots";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => {
  if (message.type() !== "error") return;
  const text = message.text();
  if (/ERR_CONNECTION_REFUSED|Failed to load resource/i.test(text)) return;
  errors.push(text);
});

async function shot(name) {
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
}

await page.goto(`${base}/#/command`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });

await page.getByTestId("mount-banner").waitFor();
const banner = await page.getByTestId("core-banner").innerText();
if (!banner.includes("Canonical Core is not mounted")) throw new Error(`banner: ${banner}`);
if (!(await page.getByText("b2a49322").count())) throw new Error("director id missing");
if (await page.getByText(/success rate/i).count()) throw new Error("fabricated success rate");
await shot("01-command");

await page.getByRole("button", { name: "Factory" }).click();
await page.getByRole("heading", { name: "The floor shows the same records as Operator mode." }).waitFor();
if (!(await page.getByText("Not observing. Scope empty.").count())) throw new Error("scouts look active");
await shot("02-factory");
await page.getByRole("button", { name: "Operator" }).click();
await page.getByRole("heading", { name: "One floor. Nothing executing." }).waitFor();

await page.getByRole("link", { name: "Z3R0TH Chat" }).click();
await page.getByRole("button", { name: "New objective" }).click();
await page.getByLabel("Objective").fill("Read the director file before integration.");
await page.getByRole("button", { name: "Keep line" }).click();
await page.getByText("Read the director file before integration.").waitFor();
await page.getByRole("button", { name: "File latest line as planning" }).click();
await page.getByText("Latest line filed as a planning note.").waitFor();
await shot("03-chat");

await page.getByRole("link", { name: "Jobs & Approvals" }).click();
await page.getByTestId("planning-lane").getByText("Read the director file before integration.").waitFor();
const execution = await page.getByTestId("execution-lane").innerText();
if (!/unavailable/i.test(execution)) throw new Error(`execution lane looked available: ${execution}`);
if (execution.includes("job-")) throw new Error("unexpected job id");
await page.reload({ waitUntil: "networkidle" });
await page.getByTestId("planning-lane").getByText("Read the director file before integration.").waitFor();
await shot("04-jobs");

await page.getByRole("link", { name: "Watching Desk" }).click();
await page.getByLabel("Evidence").fill("Workspace README is the only tracked file.");
await page.getByLabel("Project").fill("888");
await page.getByLabel("Deduplication identity").fill("repo-readme");
await page.getByRole("button", { name: "Save operator note" }).click();
await page.getByText("Operator note saved.").waitFor();
await page.getByLabel("Evidence").fill("Same fact again");
await page.getByLabel("Deduplication identity").fill("REPO-README");
await page.getByRole("button", { name: "Save operator note" }).click();
await page.getByText("A note with this deduplication identity is already recorded.").waitFor();
await shot("05-desk");

await page.getByRole("link", { name: "Workforce" }).click();
await page.getByRole("link", { name: /Master Frontend/ }).click();
await page.getByLabel("Display name").fill("Master Frontend Prime");
await page.getByRole("button", { name: "Save draft" }).click();
await page.getByText("Draft saved in this browser.").waitFor();
await page.getByRole("button", { name: "Register with Core" }).isDisabled();
await shot("06-profile");

await page.getByRole("link", { name: "Factory & Academy" }).click();
await page.getByLabel("Describe the missing capability").fill("frontend");
await page.getByRole("button", { name: "Search existing drafts" }).click();
await page.getByRole("radio", { name: "Master Frontend Prime" }).waitFor();
await page.getByLabel("Describe the missing capability").fill("underwater basket weaving");
await page.getByRole("button", { name: "Search existing drafts" }).click();
await page.getByRole("button", { name: "Draft a new definition" }).click();
await page.getByText("New draft created.").waitFor();
await shot("07-factory");

await page.getByRole("link", { name: "Visual Studio" }).click();
await page.getByRole("link", { name: "TACO Next Generation" }).click();
await page.getByText("No image-capable model is connected").first().waitFor();
if (await page.getByText("visual similarity: assessed", { exact: false }).count()) {
  throw new Error("similarity was assessed");
}
await shot("08-visual");

await page.getByRole("link", { name: "Capabilities" }).click();
const row = page.getByRole("row", { name: /screenshot-to-code/ });
await row.waitFor();
if (!(await row.innerText()).includes("Not recorded")) throw new Error("capability looked installed");
await shot("09-capabilities");

await page.getByRole("link", { name: "Projects" }).click();
await page.getByLabel("Name").fill("Northwind Books");
await page.getByRole("combobox", { name: "Domain", exact: true }).selectOption("trading");
await page.getByRole("button", { name: "Create workspace" }).click();
await page.getByRole("link", { name: "Northwind Books" }).waitFor();
const navText = await page.getByRole("navigation").innerText();
if (navText.includes("Northwind")) throw new Error("project leaked into the sidebar");
await shot("10-projects");

await page.getByRole("link", { name: "Migration Map" }).click();
await page.getByLabel("Intent for Legacy route table").selectOption("hold");
await shot("11-migration");

await page.getByRole("link", { name: "Settings" }).click();
await page.getByRole("button", { name: "Check health" }).click();
await page.getByTestId("health-result").getByText("unavailable").waitFor();
await page.getByLabel("Core health URL").fill("http://127.0.0.1:9/no-core");
await page.getByRole("button", { name: "Check health" }).click();
await page.getByTestId("health-result").getByText(/did not return a readable response/i).waitFor();
await page.getByTestId("reconciliation").waitFor();
await page.getByLabel("Density").selectOption("compact");
await shot("12-settings");

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/#/command`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Menu" }).click();
await page.getByRole("link", { name: "Watching Desk" }).click();
await page.getByRole("heading", { name: /Scout, classify, route/ }).waitFor();
await shot("13-mobile");

if (errors.length) throw new Error(errors.join("\n"));
console.log(`browser-check ok ${out}`);
await browser.close();
