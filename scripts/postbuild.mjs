// صفحهٔ ۴۰۴ اختصاصی سایت را به 404.html (مورد استفادهٔ GitHub Pages) تبدیل می‌کند
import { copyFileSync, existsSync, rmSync } from "node:fs";
if (existsSync("out/404/index.html")) {
  copyFileSync("out/404/index.html", "out/404.html");
  rmSync("out/404", { recursive: true, force: true });
  console.log("404.html ← صفحهٔ ۴۰۴ سایت");
}
