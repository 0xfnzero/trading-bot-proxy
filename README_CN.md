<div align="center">
    <h1>🚀 Solana DEX Trading Bot Proxy</h1>
    <h3><em>高性能 Solana DEX 自动化交易代理系统</em></h3>
</div>

<p align="center">
    <strong>高性能 Rust 代理服务，将 Solana DEX 复杂性抽象为简单 API，让开发者无需区块链专业知识即可使用任意语言构建交易机器人。为 PumpFun、PumpSwap、Meteora DAMM V2 提供亚毫秒级事件流和交易执行能力</strong>
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

**Trading Bot Proxy** 是一个高性能中间件，它在 Solana 区块链的复杂性和交易策略开发之间架起了桥梁。使用 Rust 构建以获得最大性能和最小延迟，让开发者可以专注于交易策略逻辑，而无需处理 Solana 交易构建和数据流解析的复杂细节。

### 🎯 为什么需要 Trading Bot Proxy？

**降低开发门槛**
- ✅ **无需区块链专业知识**：专注于交易策略，而非 Solana 交易机制
- ✅ **语言无关**：使用任何编程语言开发你的交易机器人（Python、JavaScript、Go 等）
- ✅ **预构建 DEX 集成**：PumpFun、PumpSwap、Meteora DAMM V2 协议已集成
- ✅ **简化 API**：Unix Socket（事件）+ HTTP API（命令）便于集成

**Rust 性能优势**
- ⚡ **超低延迟**：Rust 的零成本抽象确保最小开销
- ⚡ **高吞吐量**：轻松处理每秒数千个事件
- ⚡ **内存高效**：Rust 的内存安全机制无需垃圾回收暂停
- ⚡ **实时数据流**：通过 Unix Socket + Protobuf 实现亚毫秒级事件处理

**你无需担心的事情**
- ❌ Solana 交易构建和签名
- ❌ 程序指令编码/解码
- ❌ 账户数据解析和反序列化
- ❌ DEX 特定协议实现
- ❌ 与 RPC 节点的 WebSocket 连接管理
- ❌ 事件流解析和过滤

**你可以专注的事情**
- ✅ 交易策略和信号生成
- ✅ 风险管理和仓位控制
- ✅ 投资组合优化
- ✅ 市场分析和模式识别

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                      你的交易策略                                  │
│              (Python/JavaScript/Go/任意语言)                      │
│                                                                   │
│  • 市场分析          • 信号生成                                    │
│  • 风险管理          • 仓位控制                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ Unix Socket (事件) + HTTP API (命令)
                             │ Protobuf 二进制协议
┌────────────────────────────▼────────────────────────────────────┐
│              Trading Bot Proxy (Rust 服务端)                     │
│                                                                   │
│  ⚡ 高性能层:                                                     │
│    • 交易构建和签名                                               │
│    • 指令编码/解码                                                │
│    • 实时事件流处理 (Unix Socket)                                 │
│    • DEX 协议实现                                                 │
│    • Protobuf 序列化 (亚毫秒延迟)                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ WebSocket (gRPC)
                             │ Solana RPC 连接
┌────────────────────────────▼────────────────────────────────────┐
│                    Solana 区块链                                  │
│                                                                   │
│  • PumpFun DEX          • PumpSwap DEX                          │
│  • Meteora DAMM V2      • RPC 节点                              │
└─────────────────────────────────────────────────────────────────┘
```

### 核心组件

**Rust 服务端（核心引擎）**
- 处理所有 Solana 特定的复杂性
- 通过 **Unix Socket + Protobuf** 实时事件流传输
- 通过 HTTP API 执行交易构建和执行
- 多 DEX 协议支持

**你的策略机器人（任意语言）**
- 通过 **Unix Socket** 订阅事件（超低延迟）
- 接收 Protobuf 格式的解析后结构化交易事件
- 通过 **HTTP API** 发送高级买入/卖出命令
- 纯粹专注于交易逻辑

**为什么使用 Unix Socket 传输事件？**
- **比 WebSocket 快 10 倍** 的本地进程间通信
- **零网络开销** - 直接内核通信
- **亚毫秒级延迟** - 对竞争性交易至关重要
- **二进制协议**（Protobuf）- 更小的负载，更快的解析

## 📁 项目结构

### 交易服务端（Rust）
- `trading-bot-proxy-linux/` - Linux 生产服务器
- `trading-bot-proxy-mac/` - macOS 开发服务器
- 配置文件：`config/app.toml`

### 交易客户端（TypeScript 参考实现）
- `trading-bot-ts/` - 全功能 TypeScript 客户端示例
- 展示最佳实践和集成模式
- 详细说明：[trading-bot-ts/README.md](trading-bot-ts/README.md)

## 🚀 快速开始

### 1. 启动服务端

**Linux：**
```bash
cd trading-bot-proxy-linux
vim config/app.toml  # 配置私钥和 RPC 地址
chmod +x trading-bot-proxy
nohup ./trading-bot-proxy > output.log 2>&1 &
```

**macOS：**
```bash
cd trading-bot-proxy-mac
vim config/app.toml  # 配置私钥和 RPC 地址
chmod +x trading-bot-proxy
nohup ./trading-bot-proxy > output.log 2>&1 &
```

服务端默认端口：`http://localhost:8080`

### 2. 启动客户端

```bash
cd trading-bot-ts
npm install
cp .env.sample .env
vim .env  # 配置环境变量
npm run dev
```

详细说明请参考：[trading-bot-ts/README.md](trading-bot-ts/README.md)

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
ps aux | grep trading-bot-proxy | grep -v grep | awk '{print $2}' | xargs kill

# 健康检查
curl http://localhost:8080/health
```

## ⚡ 性能优势

### Rust vs 其他语言在区块链操作上的对比

| 指标 | Rust 代理 | 纯 Python | 纯 JavaScript |
|------|----------|-----------|---------------|
| **事件处理延迟** | < 1ms | 5-15ms | 3-10ms |
| **内存使用** | 50-100MB | 200-500MB | 150-400MB |
| **交易构建** | < 0.5ms | 2-5ms | 1-3ms |
| **并发事件处理** | 10,000+ 事件/秒 | 500-1,000 事件/秒 | 1,000-2,000 事件/秒 |
| **CPU 效率** | 最小 (5-10%) | 高 (30-60%) | 中等 (20-40%) |

### 为什么 Rust 在交易中很重要

**延迟就是一切**
- 在竞争性交易中，毫秒级延迟决定盈亏
- Rust 的零成本抽象意味着没有运行时开销
- 直接系统调用，无需解释器/虚拟机层

**高负载下的可靠性**
- 关键操作期间没有垃圾回收暂停
- 即使在高吞吐量下也能保持可预测的性能
- 内存安全机制防止交易高峰期崩溃

**使用任意语言开发策略**
- 无需编写 Rust 即可获得 Rust 的性能
- 使用 Python 快速原型开发
- 切换到 Go 进行生产部署而无需更改代理
- 使用 JavaScript 便于 Web 集成

## 🎯 使用场景

### 适用于
- **算法交易者**：专注于策略，而非基础设施
- **量化团队**：快速策略迭代，无需区块链开销
- **交易公司**：共享基础设施的多策略部署
- **研究人员**：回测和部署之间只需最少的代码更改

### 集成示例

**JavaScript 策略机器人**
```javascript
const net = require('net');
const axios = require('axios');
const protobuf = require('protobufjs');

// 连接到 Unix Socket 接收实时事件
const client = net.createConnection('/tmp/trading-bot.sock');

client.on('data', (data) => {
    // 解码 Protobuf 消息
    const event = decodeProtobuf(data);

    if (shouldTrade(event)) {
        // 通过 HTTP API 执行交易
        axios.post('http://localhost:8080/api/pumpswap/buy', {
            mint: event.mint,
            sol_amount: 0.05
        });
    }
});
```

## ⚠️ 注意事项

**安全性**
- 私钥安全：妥善保管配置文件中的私钥
- 切勿将 `config/app.toml` 提交到版本控制
- 生产环境使用环境变量

**性能**
- 建议使用专业 RPC 节点以获得最佳性能
- 考虑使用多个 RPC 端点以实现冗余
- 监控延迟指标以优化交易

**监控**
- 定期检查日志文件中的错误和警告
- 为连接问题设置警报
- 监控 Redis 内存使用情况以进行订单管理

---

**需要帮助？**
- 详细客户端文档：[trading-bot-ts/README.md](trading-bot-ts/README.md)
- Telegram 社区：[加入讨论](https://t.me/fnzero_group)
- Discord 服务器：[获取支持](https://discord.gg/vuazbGkqQE)
