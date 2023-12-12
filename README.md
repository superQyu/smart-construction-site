# 智慧工地

## 启动工程
```bash
pnpm install
pnpm run tauri dev
```

## 目录结构

```
├──public
│  └──locales        # 国际化文件
├──src
│  ├──apis           # api目录
│  ├──assets         # 不对外暴露但代码里引用的图片等资源
│  ├──components     # 公共组件
│  ├──config         # 配置文件
│  ├──context        # 自定义上下文组件/定义
│  ├──hooks          # 自定义hook工具
│  ├──layouts        # 全局布局组件
│  ├──lib            # 基础应用库，http、i18n等功能
│  ├──pages          # 业务逻辑组件
│  ├──routers        # 路由申明管理
│  ├──stores         # 状态管理工具
│  ├──types          # 类型申明管理
│  └──utils          # 工具函数
└──src-tauri
   ├──icons
   ├──src
   └──target
```


## Frontend by React
- [React](https://react.dev/learn)
- [UnoCSS](https://unocss.dev/config)
- [clsx](https://github.com/lukeed/clsx)
- [lucide-react](https://lucide.dev/guide/)
- [material UI](https://mui.com/material-ui/getting-started/)
- [material-icons](https://mui.com/material-ui/material-icons/)
- [react-i18next](https://www.i18next.com/)




## Backend by Tauri
- [tauri](https://tauri.app/v1/guides/development/development-cycle)
- [rust](https://www.rust-lang.org/learn)


## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
