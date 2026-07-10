// SSCA思路编辑器 - 局域网共享版（零依赖，仅用 Node 内置模块）
// 启动后，同一内网的同学用浏览器访问 http://你的IP:8765 即可打开编辑器
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 9527;                 // 访问端口，可改
const HOST = "0.0.0.0";            // 0.0.0.0 = 监听所有网卡（局域网可访问）；改成 "127.0.0.1" 则只能本机访问
const ROOT = __dirname;            // 托管本目录下的静态文件

// 按扩展名返回 MIME 类型，保证浏览器正确解析
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
};

// 只允许访问本目录内的文件，防止路径穿越（../ 攻击）
function safeJoin(root, rel) {
  const resolved = path.resolve(root, rel);
  if (!resolved.startsWith(path.resolve(root))) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  // 解析 URL，去掉查询参数；根路径默认给 index.html
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  // 去掉前导斜杠，避免 path.resolve 把它当成绝对路径导致 safeJoin 判定越界
  urlPath = urlPath.replace(/^\/+/, "");

  const filePath = safeJoin(ROOT, urlPath);
  if (!filePath) {
    res.writeHead(403); res.end("403 禁止访问"); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 找不到文件: " + urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  // 启动后打印所有可访问地址，方便复制给同学
  const nets = require("os").networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const ni of nets[name] || []) {
      if (ni.family === "IPv4" && !ni.internal) ips.push(ni.address);
    }
  }
  console.log("========================================");
  console.log("  SSCA思路编辑器 - 局域网共享版已启动");
  console.log("========================================");
  console.log("本机访问:     http://127.0.0.1:" + PORT);
  console.log("局域网访问（把下面地址发给同学）:");
  ips.forEach(ip => console.log("  http://" + ip + ":" + PORT));
  console.log("----------------------------------------");
  console.log("按 Ctrl+C 停止服务");
  console.log("提示: 若同学打不开，请检查 Windows 防火墙是否放行端口 " + PORT);
  console.log("");
});
