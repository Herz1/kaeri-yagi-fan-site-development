# 八木海莉应援站

原站：https://01a17105-6cf9-70f6-8564-10a66ebb9a5e.arena.site/

从 `kaeri-yagi-fan-site-development.zip` 迁移，保留原有 React、TypeScript、Tailwind CSS 与 Vite 源码、页面内容、样式、动效和交互。

## 本地运行

使用 Node.js 24：

```bash
npm ci
npm run dev
```

## 构建

```bash
npm run build -- --base=./
```

构建产物为 `dist/index.html`，原项目的 singlefile 插件将应用 JavaScript 和 CSS 内联。图片、Google Fonts、Apple Music 试听及 YouTube 播放沿用原站的外部服务。

## GitHub Pages

在仓库 Settings → Pages → Build and deployment 中将 Source 设为 **GitHub Actions**。推送到 `main` 会自动构建并发布；也可从 Actions 手动运行 `Deploy to GitHub Pages`。

应援打卡、留言和周边收藏保存在访问者的浏览器本地存储中。更换域名后，原域名的本地记录不会自动转移。

## 素材与版权

原站的素材来源、署名、授权说明和非官方声明均保留在页脚。各作品版权归各权利人所有。
