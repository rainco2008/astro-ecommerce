# storefront、storeplate、astro-ecommerce 深度对比报告

评估日期：2026-06-15  
评估对象：

- `/home/ubuntu/storefront`
- `/home/ubuntu/storeplate`
- `/home/ubuntu/astro-ecommerce`

本报告基于本地源码、配置、README、构建结果和依赖审计结果生成。三个项目均已被调整为可部署到 Cloudflare Workers，并且都保留了“无后端可运行”的前端路径。

## 执行摘要

如果目标是尽快做一个可上线、可扩展、后续能接 Payload CMS 的真实电商前端，优先推荐 `storefront`。它的业务边界最清晰，购物车、商品详情、集合页、订单页、Stripe checkout、Astro Actions、测试体系都更接近真实应用。

如果目标是做一个内容丰富、营销页面完整、接近 Shopify 主题风格的展示型商城，`storeplate` 更有优势。它页面多、内容体系强、视觉模块多，但 Shopify 语义和复杂 React 组件较多，后续迁移到 Payload CMS 的成本高于 `storefront`。

如果目标是保留一个轻量、易部署、适合二次拆组件的模板库，`astro-ecommerce` 最合适。它依赖少、理解成本低、部署风险小，但目前更像组件展示站，不是完整电商应用。

综合排序：

| 目标 | 推荐项目 | 原因 |
| --- | --- | --- |
| 真实商城 MVP | `storefront` | 电商业务闭环和测试基础最好 |
| 营销展示型商城 | `storeplate` | 页面、内容、筛选、主题模块最丰富 |
| 快速部署和组件演示 | `astro-ecommerce` | 最轻量、最容易维护 |
| 后续接 Payload CMS | `storefront` | 数据客户端边界最干净 |
| 最少工程风险 | `astro-ecommerce` | 依赖面和业务复杂度最低 |

## 核心对比表

| 维度 | storefront | storeplate | astro-ecommerce |
| --- | --- | --- | --- |
| 当前定位 | 应用型电商前端 | Shopify/内容站混合商城模板 | 电商 UI 组件展示模板 |
| 框架 | Astro 6.4.6 | Astro 6.4.6 | Astro 6.4.6 |
| UI 交互框架 | SolidJS | React | React |
| 样式 | Tailwind CSS 3 | Tailwind CSS 4 + 生成主题 CSS | Sass + Bootstrap/Creative Tim 风格 |
| Cloudflare Workers | 已配置 | 已配置 | 已配置 |
| 无后端运行 | mock client | demo store fallback | public/data.json |
| 商品列表/详情 | 完整 | 完整 | 示例页级别 |
| 购物车 | Cookie + Astro Actions + Solid Query | Nanostores + Shopify cart 兼容层 | 静态示例组件 |
| Checkout | Stripe checkout API，未配置时返回 503 | Shopify cart/checkout 语义，演示为主 | 静态 checkout UI |
| 订单页 | 有订单成功页和订单详情页 | 无完整真实订单闭环 | 静态订单组件 |
| Payload 接入难度 | 低到中 | 中到高 | 中 |
| 测试 | 有 unit + e2e 基础 | 未发现项目内测试 | 未发现项目内测试 |
| 依赖审计 | 0 漏洞 | 0 漏洞 | 0 漏洞 |
| 构建验证 | 通过 | 通过，有迁移和 chunk 警告 | 通过，有 Sass deprecation 警告 |
| 维护复杂度 | 中 | 高 | 低 |

## 客观指标

| 指标 | storefront | storeplate | astro-ecommerce |
| --- | ---: | ---: | ---: |
| `src` 下主要源码文件数 | 63 | 127 | 60 |
| 页面文件数 | 8 | 12 | 4 |
| 组件/业务组件文件数 | 36 | 65 | 54 |
| 项目内测试文件 | `e2e/cart.spec.ts`、`src/features/cart/cart.test.ts` | 未发现 | 未发现 |
| 包管理器 | pnpm | npm | npm |
| Node 要求 | `>=22.12.0` | 未显式 engines | 未显式 engines |

说明：文件数统计排除了 `node_modules`，但包含 `.astro` 以外的源代码、样式和内容文件。

## 项目一：storefront

### 优点

`storefront` 是三个项目里最接近真实电商应用的。它不是简单展示商品卡片，而是有产品、集合、购物车、订单、checkout API、地址/邮件/价格工具、服务端 cookie 购物车和 Astro Actions。

它的数据访问边界设计较好。当前 `tsconfig.json` 使用 `storefront:client` alias 指向 `src/lib/client.mock.ts`，这使后续接 Payload CMS 时可以替换数据客户端，而不是在页面和组件里到处改请求逻辑。

交互实现更现代。SolidJS 只用于购物车抽屉、商品轮播、加购表单等局部岛屿，整体仍保留 Astro 的低 JS 输出优势。

测试基础最好。项目包含 `src/features/cart/cart.test.ts` 和 `e2e/cart.spec.ts`，说明购物车核心逻辑已经有单元测试和端到端测试入口。后续接真实 CMS、支付、订单时更容易控制回归风险。

Stripe checkout 已经有服务端 API 路由。未配置环境变量时 checkout 会返回 503，不会阻塞构建和部署。这是合理的渐进式集成方式。

### 缺点和风险

依赖和工程体系更复杂。项目使用 pnpm、SolidJS、TanStack Solid Query、Kobalte、Astro Actions、Stripe、Sentry、OpenAPI 生成工具、Biome、Prettier、Vitest、Playwright。团队如果不熟悉 SolidJS 和 Astro Actions，上手成本会高于 `astro-ecommerce`。

Cloudflare adapter 默认启用 sessions KV。构建输出提示会使用 `SESSION` KV binding。虽然 Cloudflare 可自动配置，但在严格的 Workers 环境治理中需要确认 KV 命名、权限和生产环境配置。

当前真实支付和邮件仍依赖外部环境变量。Stripe、Loops、Google Maps 等能力都已预留，但没有配置时只能跑前端和基础购物车。

### 适合场景

- 想做真实电商 MVP。
- 想保留 mock 数据，同时逐步接 Payload CMS。
- 想要购物车、结账、订单页这些真实业务边界。
- 愿意接受中等工程复杂度换取长期可维护性。

### Payload CMS 接入建议

优先新增 `src/lib/client.payload.ts`，实现与 `src/lib/client.mock.ts` 相同的接口。建议 Payload 侧建模：

- `products`
- `productVariants`
- `collections`
- `media`
- `orders`
- `customers`

第一阶段只替换商品和集合读取；第二阶段再决定订单是否落 Payload，支付仍建议由 Stripe 保持独立。

## 项目二：storeplate

### 优点

`storeplate` 是三个项目里内容和页面体系最丰富的。它有首页、产品列表、产品详情、登录、注册、关于、联系、隐私条款、terms、动态 regular page 等页面，还包含 MD/MDX 内容集合、短代码、主题配置、菜单配置、社交配置、sitemap。

它的视觉模块最多。Hero slider、collections slider、featured products、product filters、gallery、variant selector、range slider、search bar、cart modal、testimonials、CTA、payment slider 等模块都已经存在，适合快速搭一个看起来完整的商城门面。

它保留了 Shopify 数据访问层和本地 demo fallback。对于从 Shopify 主题迁移或希望兼容 Shopify GraphQL 结构的项目，这是优势。

它已经升级到 Astro 6、Cloudflare adapter 13，并通过 `wrangler.jsonc` 配置 Workers 部署。

### 缺点和风险

它的 Shopify 语义很重。`src/lib/shopify/` 下有大量 fragment、query、mutation 和 Shopify 类型，购物车状态也围绕 Shopify cart 模型设计。后续接 Payload CMS 时，不只是换数据源，还要决定是否保留 Shopify 风格的数据结构。

React 组件多且复杂，部分组件使用 `client:only="react"`。这会增加浏览器端 JS 和调试成本。构建时也出现了 chunk 大于 500KB 的警告，说明后续需要代码分割或组件瘦身。

构建警告较多。当前构建通过，但出现 Astro markdown 配置弃用、Vite/Rolldown 迁移警告、alias customResolver 弃用、`transformWithEsbuild` 弃用、大 chunk 警告。它短期可用，但中期维护压力最大。

构建脚本会生成 `src/styles/generated-theme.css`。这对主题定制有利，但也意味着 CI/CD 需要允许写入源码目录，且要明确生成文件是否应提交。

### 适合场景

- 需要营销页面和内容页丰富的商城。
- 需要接近 Shopify Storefront 体验。
- 想快速得到完整视觉和主题系统。
- 团队能接受较高前端复杂度和后续迁移成本。

### Payload CMS 接入建议

不要直接把 Payload 请求塞进页面。建议新增 `src/lib/payload/`，然后在 `src/lib/shopify/index.ts` 上层建立统一 commerce facade。迁移路径可以是：

1. 保留现有 Shopify 类型作为前端视图模型。
2. Payload API 返回后转换成现有 `Product`、`Collection`、`Cart` 兼容结构。
3. 先替换商品列表、详情、集合。
4. 再决定 cart/checkout 是接 Shopify、Stripe，还是另建 Payload order + Stripe payment intent。

## 项目三：astro-ecommerce

### 优点

`astro-ecommerce` 是三个项目里最轻量、最容易理解和维护的。依赖只有 Astro、Cloudflare adapter、React、React Bootstrap、Sass 等少数组件。

它目前完全依赖 `public/data.json`，没有外部 API、支付、邮件或 CMS 的强依赖。因此部署风险最低，最适合做静态演示、组件库、样式参考或后续重构起点。

组件数量不少，覆盖商品卡片、分类卡片、商品详情、购物车 UI、checkout UI、订单摘要、订单历史、评论、促销区等模块。对于“借组件搭页面”的需求，它比 `storefront` 更直接。

Cloudflare 配置最简单，并且已将 adapter 图片服务设为 `passthrough`，避免默认依赖 Cloudflare Images 绑定。

### 缺点和风险

它当前不是完整电商应用。购物车、checkout、订单都是静态示例组件，没有真实状态、服务端 action、库存校验、支付流程、订单落库或用户体系。

数据访问没有抽象层。页面和组件直接 import `public/data.json`，后续接 Payload CMS 需要先创建 `src/lib/catalog.ts` 之类的数据层，再逐步替换页面调用。

样式体系来自较旧的 Bootstrap/Sass 模板。构建可通过，但 Sass 输出大量 deprecation warnings。长期看需要迁移 Sass `@import`、颜色函数和旧 Bootstrap helper。

测试缺失。当前没有发现项目内 unit/e2e 测试，后续任何业务化改造都应先补基础测试。

### 适合场景

- 需要最快部署一个前端商城模板。
- 主要目标是展示 UI，而不是马上卖货。
- 想从较少依赖开始，逐步重构。
- 想把它作为组件素材库迁移到另一个应用。

### Payload CMS 接入建议

建议先做数据层，不要直接在 `.astro` 页面里写 Payload fetch：

```ts
// src/lib/catalog.ts
// getProducts()
// getProductBySlug()
// getCategories()
```

第一阶段让 `catalog.ts` 仍读取 `public/data.json`；第二阶段根据环境变量切换到 Payload CMS；第三阶段再重做购物车和 checkout 真实逻辑。

## Cloudflare Workers 部署对比

三个项目都已配置 Cloudflare Workers，但部署成熟度不同：

| 项目 | 配置文件 | 观察 |
| --- | --- | --- |
| storefront | `wrangler.toml` | 使用 Astro 生成的 `dist/server/wrangler.json` 部署，配置较接近真实 Workers 项目 |
| storeplate | `wrangler.jsonc` | 明确 main、assets、nodejs_compat 和 observability，但 adapter 默认还启用 Images/KV |
| astro-ecommerce | `wrangler.jsonc` | 最小 Workers 配置，assets 指向 `dist/client`，图片 passthrough，部署路径简单 |

注意：Astro Cloudflare adapter 当前会提示启用 sessions KV。`storeplate` 还提示启用 Cloudflare Images。生产部署前应确认 Cloudflare 控制台中自动绑定是否符合预期。

## 构建和审计验证

验证命令和结果：

| 项目 | 审计命令 | 审计结果 | 构建命令 | 构建结果 |
| --- | --- | --- | --- | --- |
| storefront | `pnpm audit --audit-level low` | No known vulnerabilities found | `pnpm build` | 通过 |
| storeplate | `npm audit --audit-level low` | found 0 vulnerabilities | `npm run build` | 通过，有迁移/大 chunk 警告 |
| astro-ecommerce | `npm audit --audit-level low` | found 0 vulnerabilities | `npm run build` | 通过，有 Sass deprecation warnings |

普通沙箱下 `storefront` 和 `astro-ecommerce` 构建会因为 Cloudflare Vite 插件读取网络接口报 `uv_interface_addresses`，提权运行后构建通过。`storeplate` 普通沙箱下因为构建脚本写入 `src/styles/generated-theme.css` 失败，提权运行后构建通过。

## 维护风险排序

从低到高：

1. `astro-ecommerce`
2. `storefront`
3. `storeplate`

原因：

- `astro-ecommerce` 依赖少、业务逻辑少，但未来业务化需要补抽象。
- `storefront` 业务逻辑较完整，复杂度可控，有测试支撑。
- `storeplate` 功能最多、依赖最多、React 客户端组件多、Shopify 语义深，迁移和升级风险最大。

## 商业化成熟度排序

从高到低：

1. `storefront`
2. `storeplate`
3. `astro-ecommerce`

原因：

- `storefront` 已有真实购物车、checkout API 和订单页边界。
- `storeplate` 展示和商品浏览强，但真实交易闭环更依赖 Shopify 语义。
- `astro-ecommerce` 是静态 UI 模板，缺少业务闭环。

## 最终建议

推荐采用“双轨策略”：

1. 以 `storefront` 作为主项目路线，负责真实商城、Payload CMS 接入、购物车、支付和订单。
2. 从 `storeplate` 借鉴营销页面、内容页、筛选和主题配置思路，但不要直接继承全部 Shopify 结构。
3. 保留 `astro-ecommerce` 作为轻量 UI 组件参考和快速演示站，不建议把它直接扩成完整商城，除非愿意重写数据层、购物车和 checkout。

短期最优执行路径：

1. 在 `storefront` 中实现 `client.payload.ts`。
2. Payload CMS 先只管理商品、分类、媒体。
3. Stripe 继续负责支付。
4. 订单先落 Payload 或一个独立订单服务，避免把支付状态只存在前端 cookie/mock 中。
5. 用 `storefront` 现有 cart unit test 和 e2e test 扩展回归测试。

如果只想快速上线一个展示站，选择 `astro-ecommerce`；如果想做内容营销型商城，选择 `storeplate`；如果想做长期可维护的真实电商应用，选择 `storefront`。
