# 🚀 Solana DEX 交易代理系统使用说明

## 📋 概述
本文档介绍如何配置和使用 Solana DEX 交易代理系统。

---

## 📁 项目结构

### 1. 🦀 交易代理服务端
**部署包：** `deploy_package_server.tar.gz`

- 高性能 Rust 服务端，提供 HTTP API 交易接口
- 支持 PumpFun、PumpSwap 等主流 DEX
- 通过 Unix Socket 推送实时交易事件
- 配置文件：`deploy_package_server/config/app.toml`

### 2. 📱 交易机器人客户端
**项目位置：** `trading-bot-client/`

详细的客户端功能说明、配置方法和使用示例，请参考：[trading-bot-client/README.md](trading-bot-client/README.md)

---

## 🚀 启动步骤

### 前置条件
1. ✅ **解压部署包**：解压 `deploy_package_server.tar.gz`
2. ✅ **配置服务端**：编辑 `deploy_package_server/config/app.toml`
3. ✅ **启动 Redis**：确保 Redis 服务正常运行
4. ✅ **配置客户端**：参考 trading-bot-client/README.md

### 1. 解压并配置服务端

```bash
# 解压部署包
tar -xzf deploy_package_server.tar.gz

# 进入部署目录
cd deploy_package_server

# 编辑配置文件
vim config/app.toml
```

### 2. 启动服务端

```bash
# 启动服务端
sudo nohup ./trading-bot-server > output.log 2>&1 &
```

**服务端启动后：**
- HTTP API: `http://localhost:8080`
- Unix Socket: `/tmp/parser_proxy.sock`
- 健康检查: `GET http://localhost:8080/health`

### 3. 启动客户端

客户端详细启动方法请参考：[trading-bot-client/README.md](trading-bot-client/README.md)

---

## ⚙️ 服务端配置

编辑 `deploy_package_server/config/app.toml` 文件，配置钱包私钥和 RPC 地址等必要参数。

---

## 🔧 API 使用

服务端提供以下 API 接口：
- `GET /health` - 健康检查
- `POST /api/buy` - 买入交易
- `POST /api/sell` - 卖出交易

详细的 API 使用说明请参考：[trading-bot-client/README.md](trading-bot-client/README.md)

---

## ⚠️ 重要提醒

- 启动前务必确保配置文件已正确设置
- 建议定期检查 `deploy_package_server/output.log` 日志文件
- 如需停止服务，请使用 `ps` 命令查找进程ID后使用 `kill` 命令
- 详细的故障排除和日志查看方法请参考：[trading-bot-client/README.md](trading-bot-client/README.md)