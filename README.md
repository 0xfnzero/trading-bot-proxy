<div align="center">
    <h1>🚀 Solana DEX Trading Bot Proxy</h1>
    <h3><em>High-Performance Solana DEX Automated Trading Proxy System</em></h3>
</div>

<p align="center">
    <strong>High-performance Rust proxy that abstracts Solana DEX complexities into simple APIs, enabling developers to build trading bots in any language without blockchain expertise. Provides sub-millisecond event streaming and transaction execution for PumpFun, PumpSwap, and Meteora DAMM V2</strong>
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

**Trading Bot Proxy** is a high-performance middleware that bridges the gap between Solana blockchain complexity and bot strategy development. Built with Rust for maximum performance and minimal latency, it allows developers to focus purely on trading strategy logic without dealing with the intricacies of Solana transaction construction and data stream parsing.

### 🎯 Why Trading Bot Proxy?

**Lower Development Barrier**
- ✅ **No Blockchain Expertise Required**: Focus on trading strategy, not Solana transaction mechanics
- ✅ **Language Agnostic**: Develop your bot in any programming language (Python, JavaScript, Go, etc.)
- ✅ **Pre-built DEX Integration**: PumpFun, PumpSwap, Meteora DAMM V2 protocols already integrated
- ✅ **Simplified API**: Unix Socket (events) + HTTP API (commands) for easy integration

**Rust Performance Benefits**
- ⚡ **Ultra-Low Latency**: Rust's zero-cost abstractions ensure minimal overhead
- ⚡ **High Throughput**: Handle thousands of events per second without breaking a sweat
- ⚡ **Memory Efficient**: Rust's memory safety without garbage collection pauses
- ⚡ **Real-time Data Streaming**: Sub-millisecond event processing via Unix Socket + Protobuf

**What You Don't Need to Worry About**
- ❌ Solana transaction construction and signing
- ❌ Program instruction encoding/decoding
- ❌ Account data parsing and deserialization
- ❌ DEX-specific protocol implementations
- ❌ WebSocket connection management with RPC nodes
- ❌ Event stream parsing and filtering

**What You Can Focus On**
- ✅ Trading strategy and signal generation
- ✅ Risk management and position sizing
- ✅ Portfolio optimization
- ✅ Market analysis and pattern recognition

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Your Trading Strategy                       │
│              (Python/JavaScript/Go/Any Language)                 │
│                                                                   │
│  • Market Analysis      • Signal Generation                      │
│  • Risk Management      • Position Sizing                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ Unix Socket (Events) + HTTP API (Commands)
                             │ Protobuf Binary Protocol
┌────────────────────────────▼────────────────────────────────────┐
│              Trading Bot Proxy (Rust Server)                     │
│                                                                   │
│  ⚡ High Performance Layer:                                      │
│    • Transaction Construction & Signing                          │
│    • Instruction Encoding/Decoding                               │
│    • Real-time Event Stream Processing (Unix Socket)            │
│    • DEX Protocol Implementation                                 │
│    • Protobuf Serialization (Sub-ms Latency)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ WebSocket (gRPC)
                             │ Solana RPC Connection
┌────────────────────────────▼────────────────────────────────────┐
│                    Solana Blockchain                             │
│                                                                   │
│  • PumpFun DEX          • PumpSwap DEX                          │
│  • Meteora DAMM V2      • RPC Nodes                             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

**Rust Server (Core Engine)**
- Handles all Solana-specific complexities
- Real-time event streaming via **Unix Socket + Protobuf**
- Transaction construction and execution via HTTP API
- Multi-DEX protocol support

**Your Strategy Bot (Any Language)**
- Subscribes to events via **Unix Socket** (ultra-low latency)
- Receives parsed, structured trading events in Protobuf format
- Sends high-level buy/sell commands via **HTTP API**
- Focuses purely on trading logic

**Why Unix Socket for Events?**
- **10x faster** than WebSocket for local IPC
- **Zero network overhead** - direct kernel communication
- **Sub-millisecond latency** - critical for competitive trading
- **Binary protocol** (Protobuf) - smaller payloads, faster parsing

## 📁 Project Structure

### Trading Server (Rust)
- `trading-bot-proxy-linux/` - Linux production server
- `trading-bot-proxy-mac/` - macOS development server
- Configuration: `config/app.toml`

### Trading Client (TypeScript Reference Implementation)
- `trading-bot-ts/` - Full-featured TypeScript client example
- Demonstrates best practices and integration patterns
- Detailed documentation: [trading-bot-ts/README.md](trading-bot-ts/README.md)

## 🚀 Quick Start

### 1. Download and Extract

**Linux:**
```bash
# Download the Linux version
wget https://github.com/0xfnzero/trading-bot-proxy/releases/download/v1.0/trading-bot-proxy-linux.tar.bz2

# Extract the archive
tar -xjf trading-bot-proxy-linux.tar.bz2

# Navigate to the directory
cd trading-bot-proxy-linux
```

**macOS:**
```bash
# Download the macOS version
wget https://github.com/0xfnzero/trading-bot-proxy/releases/download/v1.0/trading-bot-proxy-mac.tar.bz2

# Extract the archive
tar -xjf trading-bot-proxy-mac.tar.bz2

# Navigate to the directory
cd trading-bot-proxy-mac
```

### 2. Configure and Start the Server

**Configure:**
```bash
vim config/app.toml  # Configure private key and RPC address
```

**Linux:**
```bash
chmod +x trading-bot-proxy
nohup ./trading-bot-proxy > output.log 2>&1 &
```

**macOS:**
```bash
chmod +x trading-bot-proxy
nohup ./trading-bot-proxy > output.log 2>&1 &
```

Server default port: `http://localhost:8080`

### 3. Start the Client

```bash
cd trading-bot-ts
npm install
cp .env.sample .env
vim .env  # Configure environment variables
npm run dev
```

For detailed instructions, please refer to: [trading-bot-ts/README.md](trading-bot-ts/README.md)

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
ps aux | grep trading-bot-proxy | grep -v grep | awk '{print $2}' | xargs kill

# Health check
curl http://localhost:8080/health
```

## ⚡ Performance Advantages

### Rust vs Other Languages for Blockchain Operations

| Metric | Rust Proxy | Pure Python | Pure JavaScript |
|--------|-----------|-------------|-----------------|
| **Event Processing Latency** | < 1ms | 5-15ms | 3-10ms |
| **Memory Usage** | 50-100MB | 200-500MB | 150-400MB |
| **Transaction Construction** | < 0.5ms | 2-5ms | 1-3ms |
| **Concurrent Event Handling** | 10,000+ events/s | 500-1,000 events/s | 1,000-2,000 events/s |
| **CPU Efficiency** | Minimal (5-10%) | High (30-60%) | Medium (20-40%) |

### Why Rust Matters in Trading

**Latency is Everything**
- In competitive trading, milliseconds determine profit or loss
- Rust's zero-cost abstractions mean no runtime overhead
- Direct system calls without interpreter/VM layers

**Reliability Under Load**
- No garbage collection pauses during critical operations
- Predictable performance even under high throughput
- Memory safety prevents crashes during peak trading hours

**Strategy Development in Any Language**
- You get Rust's performance without writing Rust
- Develop in Python for rapid prototyping
- Switch to Go for production without changing the proxy
- Use JavaScript for easy web integration

## 🎯 Use Cases

### Perfect For
- **Algorithm Traders**: Focus on strategy, not infrastructure
- **Quant Teams**: Rapid strategy iteration without blockchain overhead
- **Trading Firms**: Multi-strategy deployment with shared infrastructure
- **Researchers**: Backtest and deploy with minimal code changes

### Integration Example

**JavaScript Strategy Bot**
```javascript
const net = require('net');
const axios = require('axios');
const protobuf = require('protobufjs');

// Connect to Unix Socket for real-time events
const client = net.createConnection('/tmp/trading-bot.sock');

client.on('data', (data) => {
    // Decode Protobuf message
    const event = decodeProtobuf(data);

    if (shouldTrade(event)) {
        // Execute trade via HTTP API
        axios.post('http://localhost:8080/api/pumpswap/buy', {
            mint: event.mint,
            sol_amount: 0.05
        });
    }
});
```

## ⚠️ Important Notes

**Security**
- Private Key Security: Keep your private keys in the configuration file secure
- Never commit `config/app.toml` to version control
- Use environment variables for production deployments

**Performance**
- Recommended to use professional RPC nodes for best performance
- Consider using multiple RPC endpoints for redundancy
- Monitor latency metrics for optimal trading

**Monitoring**
- Regularly check log files for errors and warnings
- Set up alerts for connection issues
- Monitor Redis memory usage for order management

---

**Need Help?**
- Detailed client documentation: [trading-bot-ts/README.md](trading-bot-ts/README.md)
- Telegram Community: [Join Discussion](https://t.me/fnzero_group)
- Discord Server: [Get Support](https://discord.gg/vuazbGkqQE)
