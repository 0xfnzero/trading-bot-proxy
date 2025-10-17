<div align="center">
    <h1>🚀 Solana DEX Trading Bot Proxy</h1>
    <h3><em>High-Performance Solana DEX Automated Trading Proxy System</em></h3>
</div>

<p align="center">
    <strong>Professional trading system built with Rust and TypeScript, supporting real-time data subscription and automated trading execution for major DEXs like PumpFun, PumpSwap, and Meteora DAMM V2</strong>
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

## 📋 Overview

Solana DEX automated trading system consisting of a Rust server and TypeScript client, supporting DEXs like PumpFun, PumpSwap, and Meteora DAMM V2.

## 📁 Project Structure

### Trading Server (Rust)
- `trading-bot-server-linux/` - Linux version
- `trading-bot-server-mac/` - macOS version
- Configuration file: `config/app.toml`

### Trading Client (TypeScript)
- `trading-bot-client/` - Automated trading client
- Detailed documentation: [trading-bot-client/README.md](trading-bot-client/README.md)

## 🚀 Quick Start

### 1. Start the Server

**Linux:**
```bash
cd trading-bot-server-linux
vim config/app.toml  # Configure private key and RPC address
chmod +x trading-bot-server
nohup ./trading-bot-server > output.log 2>&1 &
```

**macOS:**
```bash
cd trading-bot-server-mac
vim config/app.toml  # Configure private key and RPC address
chmod +x trading-bot-server
nohup ./trading-bot-server > output.log 2>&1 &
```

Server default port: `http://localhost:8080`

### 2. Start the Client

```bash
cd trading-bot-client
npm install
cp .env.sample .env
vim .env  # Configure environment variables
npm run dev
```

For detailed instructions, please refer to: [trading-bot-client/README.md](trading-bot-client/README.md)

## ⚙️ Important: Enable Protocol and Event Subscription

The server needs to set the corresponding protocols and events to `true` in `config/app.toml` to subscribe to data:

```toml
[protocols]
pumpfun = true  # Enable protocol as needed

[events]
pumpfun_trade = true  # Enable events as needed
```

**Note:** Only protocols and events set to `true` will be subscribed to and pushed to the client.

## 🔧 Common Commands

```bash
# View logs
tail -f output.log

# Stop service
ps aux | grep trading-bot-server | grep -v grep | awk '{print $2}' | xargs kill

# Health check
curl http://localhost:8080/health
```

## ⚠️ Important Notes

- Private Key Security: Keep your private keys in the configuration file secure
- Recommended to use professional RPC nodes for better performance
- Regularly check log files

---

Detailed documentation: [trading-bot-client/README.md](trading-bot-client/README.md)
