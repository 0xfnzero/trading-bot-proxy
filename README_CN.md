<div align="center">
    <h1>🚀 Solana DEX Trading Bot Proxy</h1>
    <h3><em>高性能 Solana DEX 自动化交易代理系统</em></h3>
</div>

<p align="center">
    <strong>基于 Rust 和 TypeScript 构建的专业交易系统，支持 PumpFun、PumpSwap、Meteora DAMM V2 等主流 DEX 的实时数据订阅和自动化交易执行</strong>
</p>

<p align="center">
    <a href="https://github.com/0xfnzero/trading-bot-proxy">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
    </a>
    <a href="https://github.com/0xfnzero/trading-bot-proxy">
        <img src="https://img.shields.io/github/stars/0xfnzero/trading-bot-proxy?style=social" alt="GitHub stars">
    </a>
    <a href="https://github.com/0xfnzero/trading-bot-proxy/network">
        <img src="https://img.shields.io/github/forks/0xfnzero/trading-bot-proxy?style=social" alt="GitHub forks">
    </a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana">
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
</p>

<p align="center">
    <a href="https://github.com/0xfnzero/trading-bot-proxy/blob/main/README_CN.md">中文</a> |
    <a href="https://github.com/0xfnzero/trading-bot-proxy/blob/main/README.md">English</a> |
    <a href="https://fnzero.dev/">Website</a> |
    <a href="https://t.me/fnzero_group">Telegram</a> |
    <a href="https://discord.gg/vuazbGkqQE">Discord</a>
</p>

---

## 📋 项目概述

Solana DEX 自动化交易系统，由 Rust 服务端和 TypeScript 客户端组成，支持 PumpFun、PumpSwap、Meteora DAMM V2 等 DEX。

## 📁 项目结构

### 交易服务端（Rust）
- `trading-bot-server-linux/` - Linux 版本
- `trading-bot-server-mac/` - macOS 版本
- 配置文件：`config/app.toml`

### 交易客户端（TypeScript）
- `trading-bot-client/` - 自动化交易客户端
- 详细说明：[trading-bot-client/README.md](trading-bot-client/README.md)

## 🚀 快速开始

### 1. 启动服务端

**Linux：**
```bash
cd trading-bot-server-linux
vim config/app.toml  # 配置私钥和 RPC 地址
chmod +x trading-bot-server
nohup ./trading-bot-server > output.log 2>&1 &
```

**macOS：**
```bash
cd trading-bot-server-mac
vim config/app.toml  # 配置私钥和 RPC 地址
chmod +x trading-bot-server
nohup ./trading-bot-server > output.log 2>&1 &
```

服务端默认端口：`http://localhost:8080`

### 2. 启动客户端

```bash
cd trading-bot-client
npm install
cp .env.sample .env
vim .env  # 配置环境变量
npm run dev
```

详细说明请参考：[trading-bot-client/README.md](trading-bot-client/README.md)

## ⚙️ 重要：启用协议和事件订阅

服务端需要在 `config/app.toml` 中设置对应的协议和事件为 `true` 才能订阅到数据：

```toml
[protocols]
pumpfun = true  # 根据需要启用协议

[events]
pumpfun_trade = true  # 根据需要启用事件
```

**注意：** 只有设置为 `true` 的协议和事件才会被订阅和推送到客户端。

## 🔧 常用命令

```bash
# 查看日志
tail -f output.log

# 停止服务
ps aux | grep trading-bot-server | grep -v grep | awk '{print $2}' | xargs kill

# 健康检查
curl http://localhost:8080/health
```

## ⚠️ 注意事项

- 私钥安全：妥善保管配置文件中的私钥
- 建议使用专业 RPC 节点获得更好性能
- 定期检查日志文件

---

详细文档：[trading-bot-client/README.md](trading-bot-client/README.md)