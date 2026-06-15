# Astro Ecommerce

一个基于 Astro 的电商前端模板，已升级为可部署到 Cloudflare Workers 的版本。当前前端使用 `public/data.json` 作为静态数据源，可以在没有 Payload CMS 后端的情况下直接构建、预览和部署。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/rainco2008/astro-ecommerce)

![Astro Ecommerce 首页预览](./public/images/product1.jpg)

## 技术栈

| 组件 | 版本 | 用途 |
| --- | --- | --- |
| Astro | 6.4.6 | 页面构建、路由和服务端渲染 |
| @astrojs/cloudflare | 13.7.0 | Cloudflare Workers 适配器 |
| @astrojs/react | 5.0.7 | 在 Astro 中使用 React 组件 |
| React | 19.2.7 | 交互组件 |
| React DOM | 19.2.7 | React 渲染运行时 |
| React Bootstrap | 2.10.10 | Bootstrap 风格组件 |
| Sass | 1.101.0 | SCSS 样式编译 |
| Wrangler | 4.100.0 | Cloudflare Workers 本地预览和部署工具，由 Cloudflare adapter 间接安装 |
| esbuild | 0.28.1 | 构建依赖，通过 npm overrides 固定到无审计漏洞版本 |

## 当前状态

- 已配置 `@astrojs/cloudflare`，构建目标为 Cloudflare Workers。
- 已加入 `wrangler.jsonc`，Worker 名称为 `astro-ecommerce`。
- 首页包含 Cloudflare 一键部署链接和官方部署按钮图片。
- 商品、分类、购物车、订单和评论示例数据均来自 `public/data.json`。
- 项目暂不依赖 Payload CMS，后端不可用时仍可独立部署前端。

## Payload CMS 接入预留

后续接入 Payload CMS 时，建议保留静态数据作为 fallback，并通过环境变量控制数据源：

```bash
PUBLIC_PAYLOAD_API_URL=https://your-payload.example.com
PAYLOAD_API_TOKEN=your-server-side-token
```

推荐实现方式：

1. 新增数据访问层，例如 `src/lib/catalog.ts`。
2. 优先从 Payload CMS 拉取商品和分类数据。
3. 当环境变量缺失或接口不可用时，回退到 `public/data.json`。
4. 不要把私密 token 暴露给 `PUBLIC_` 前缀变量。

## 本地开发

```bash
npm install
npm run dev
```

开发服务器默认运行在 Astro 输出的本地地址。

## 构建和预览

```bash
npm run build
npm run preview
```

`npm run build` 会生成 Cloudflare Workers 可用的 `dist/` 输出。

## 部署到 Cloudflare Workers

### 一键部署

点击上方按钮，或打开：

```text
https://deploy.workers.cloudflare.com/?url=https://github.com/rainco2008/astro-ecommerce
```

### 使用 Wrangler 部署

```bash
npm run build
npx wrangler deploy
```

首次部署需要登录 Cloudflare 账号：

```bash
npx wrangler login
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 启动本地开发服务 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 本地预览 Cloudflare Workers 输出 |
| `npm audit` | 检查依赖漏洞 |

## 项目结构

```text
/
├── public/
│   ├── data.json
│   └── images/
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── package.json
├── package-lock.json
├── wrangler.jsonc
└── README.md
```
