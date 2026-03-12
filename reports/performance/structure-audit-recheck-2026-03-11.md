# Structure Recheck Audit

- Generated At: 2026-03-11T11:24:48.607Z
- Base: https://aiimagesplitter.com
- Result: 17/17 passed

| 项目 | 结果 | 证据 | 修复建议 |
| --- | --- | --- | --- |
| 主域首页可访问 | 通过 | final=200, chain=200:https://aiimagesplitter.com/ | 确保主域首页始终返回 200。 |
| www 回收至主域 | 通过 | final=https://aiimagesplitter.com/, chain=301:https://www.aiimagesplitter.com/ -> https://aiimagesplitter.com/ / 200:https://aiimagesplitter.com/ | 在 DNS/平台配置中保持 www -> apex 的 301。 |
| HTTP 强制跳转 HTTPS | 通过 | apex=308:http://aiimagesplitter.com/ -> https://aiimagesplitter.com/ / 200:https://aiimagesplitter.com/ // www=308:http://www.aiimagesplitter.com/ -> https://www.aiimagesplitter.com/ / 301:https://www.aiimagesplitter.com/ -> https://aiimagesplitter.com/ / 200:https://aiimagesplit | 开启全站 HTTPS 强制跳转，避免协议重复索引。 |
| 核心页面状态码 | 通过 | 抽检 9 个页面均为 200 | 修复核心页面返回码，避免 4xx/5xx。 |
| 遗留 lng 参数清理 | 通过 | 301:https://aiimagesplitter.com/?lng=zh-CN -> / / 200:https://aiimagesplitter.com/ | 入口层继续清理 lng 查询参数并 301 到规范 URL。 |
| 遗留语言路径重定向 | 通过 | 308:https://aiimagesplitter.com/cn/privacy -> /zh-CN/privacy / 200:https://aiimagesplitter.com/zh-CN/privacy | 保留 cn/zh 到 zh-CN 的永久重定向。 |
| 退役语言返回 410 | 通过 | 410:https://aiimagesplitter.com/hi | 退役语言继续返回 410，加速去索引。 |
| 尾斜杠规范化 | 通过 | 308:https://aiimagesplitter.com/privacy/ -> /privacy / 200:https://aiimagesplitter.com/privacy | 维持无尾斜杠规范并重定向到 canonical。 |
| 不存在路径返回 404 | 通过 | final=404 | 确保未知路径稳定返回 404。 |
| 隐私/条款为可抓取锚链接 | 通过 | privacy=true, terms=true | 保持 <a href="/privacy"> 与 <a href="/terms">，不要改为 JS 按钮跳转。 |
| canonical 规范性 | 通过 | 抽检 9 页均正常 | 保持绝对 canonical，主机统一为主域，且无 query/hash。 |
| hreflang 完整性 | 通过 | 抽检 9 页均含 6 语言 + x-default | 每页输出全量语言 hreflang 与 x-default。 |
| 安全响应头基线 | 通过 | 首页/隐私/条款安全头均存在且值正确 | 全站保持 X-Frame-Options=DENY、X-Content-Type-Options=nosniff、Referrer-Policy。 |
| robots.txt 可访问且规则完整 | 通过 | status=200, hasSitemap=true, hasLngBlock=true | 保持 robots 可访问，并保留 sitemap 声明与 lng 规则。 |
| sitemap.xml 可访问且有有效 URL 列表 | 通过 | status=200, urlCount=36 | 保持 sitemap 200，且包含完整可索引页面 URL。 |
| sitemap 页面可达性 | 通过 | 共检查 36 个 sitemap URL，全部可达 | 移除 sitemap 中不可达 URL，确保 loc 全部可抓取。 |
| 核心页面内链健康度 | 通过 | 抽取 6 条内链，全部可达 | 修复核心页面中的失效内链或异常重定向。 |