# Trading Bot Client

一个基于TypeScript的Solana交易机器人客户端，支持实时数据订阅和自动化交易执行。通过Unix Socket接收protobuf格式的实时交易事件，并使用HTTP API执行PumpFun和PumpSwap DEX的买入/卖出操作。

## 📁 项目结构

```
src/
├── index.ts                 # 应用入口点，启动Unix Socket订阅和交易执行器
├── client.ts                # HTTP API客户端，处理买入/卖出请求
├── config.ts                # 配置管理，统一管理环境变量
├── logger.ts                # 日志系统，支持多级日志输出
├── subscriber.ts            # Unix Socket事件订阅器（protobuf）
├── task.ts                  # 定时任务调度器，管理区块哈希更新等任务
├── parser/                  # 消息解析器
│   ├── parser_messages.js   # protobuf解码器实现
│   └── parser_messages.d.ts # TypeScript类型定义
├── executor/                # 交易执行器
│   ├── pumpfun.ts          # PumpFun DEX交易执行器
│   ├── pumpswap.ts         # PumpSwap DEX交易执行器
│   ├── checkOrder.ts       # 订单检查和卖出定时器
│   └── common.ts           # 执行器通用工具函数
├── services/                # 服务层
│   ├── redisService.ts     # Redis服务，订单管理和缓存
│   ├── addressLookupTableService.ts # 地址查找表服务
│   ├── durableNonceService.ts # 持久化Nonce服务
│   └── index.ts            # 服务导出
└── types/                   # 类型定义
    ├── index.ts            # 基础类型定义
    └── order.ts            # 订单相关类型
```

## 🚀 功能特性

### 🔌 实时数据订阅
- **Unix Socket连接**: 使用protobuf协议，支持PumpSwap、PumpFun等DEX的实时交易事件
- **延迟监控**: 实时监控数据延迟，支持微秒级精度
- **事件过滤**: 智能识别买入/卖出事件，自动触发交易策略

### 💰 交易执行
- **多DEX支持**: 支持PumpFun和PumpSwap两个主要DEX
- **HTTP API交易**: 通过HTTP API执行买入/卖出操作
- **智能价格计算**: 自动计算Token价格和交易参数
- **滑点控制**: 可配置的滑点容忍度

### 🔒 高级功能
- **分布式锁**: 使用Redis实现买入操作的原子性，防止重复交易
- **订单管理**: 完整的订单生命周期管理（创建→买入→卖出→完成）
- **地址查找表**: 支持Solana地址查找表，优化交易大小
- **持久化Nonce**: 支持Durable Nonce，提高交易成功率
- **Gas费策略**: 支持全局和高低小费两种策略模式

### 🛠️ 系统服务
- **Redis服务**: 订单缓存、交易信息存储、分布式锁管理
- **定时任务**: 自动更新区块哈希、Nonce刷新等后台任务
- **多级日志**: 支持error、warn、info、debug四个日志级别
- **优雅关闭**: 支持Ctrl+C优雅关闭连接和清理资源
- **健康检查**: HTTP API健康状态监控

## 🚀 快速开始

### 前置要求
- Node.js 16+ 
- Redis服务器
- Solana RPC节点访问权限
- Trading Proxy Server运行中

### 快速启动
1. 克隆项目并安装依赖
2. 配置环境变量（参考下方详细配置）
3. 启动Redis服务
4. 运行 `npm run dev` 开始交易

## 🛠️ 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.sample` 文件并重命名为 `.env`，然后根据你的实际情况修改配置：

```bash
cp .env.sample .env
```

详细的配置说明请参考 `.env.sample` 文件中的注释。

### 3. 编译和运行

```bash
# 开发模式运行（推荐）
npm run dev

# 或者先编译再运行
npm run build
npm start
```

## 📊 支持的事件类型

- **PumpSwap事件**: `PumpSwapBuy`, `PumpSwapSell`, `PumpSwapCreatePool`, `PumpSwapLiquidityAdded`, `PumpSwapLiquidityRemoved`
- **PumpFun事件**: `PumpFunTrade`, `PumpFunCreate`, `PumpFunMigrate`
- **Meteora DAMM V2事件**: `MeteoraDammV2Swap`, `MeteoraDammV2AddLiquidity`, `MeteoraDammV2RemoveLiquidity`, `MeteoraDammV2CreatePosition`, `MeteoraDammV2ClosePosition`

## ⚙️ 交易执行器

### PumpFun执行器 (`PumpFunExecutor`)
- **功能**: 处理PumpFun DEX的交易事件
- **特点**: 
  - 支持虚拟储备量价格计算
  - 自动识别买入/卖出事件
  - 集成Bonding Curve参数
- **交易流程**: 监听事件 → 价格计算 → 创建订单 → 执行买入 → 状态更新

### PumpSwap执行器 (`PumpSwapExecutor`)
- **功能**: 处理PumpSwap DEX的交易事件
- **特点**:
  - 支持WSOL/Token交易对识别
  - 基于池储备量计算价格
  - 支持流动性池参数
- **交易流程**: 监听事件 → 交易对识别 → 价格计算 → 创建订单 → 执行买入 → 状态更新

### 订单检查器 (`SellTimer`)
- **功能**: 定时检查订单状态并执行卖出操作
- **特点**:
  - 支持多执行器统一管理
  - 订单状态生命周期管理
  - 自动卖出触发机制

## 🔧 Protobuf消息格式

项目使用protobuf进行消息序列化，支持以下消息类型：

### 服务器消息 (ServerMessage)
- **ServerAck**: 服务器确认消息
- **DexEvent**: DEX事件，包含具体的事件类型（PumpFun、Pumpswap等）
- **ServerError**: 服务器错误消息
- **ServerHeartbeat**: 服务器心跳消息

### 消息传输格式
- 每个protobuf消息前4字节为消息长度（大端序）
- 消息体为protobuf序列化的二进制数据
- 支持消息分片和重组

## 🔧 服务层架构

### Redis服务 (`RedisService`)
- **订单管理**: 创建、更新、删除订单，支持订单状态跟踪
- **交易信息缓存**: 存储PumpFun和PumpSwap的交易数据
- **分布式锁**: 实现买入操作的原子性，防止重复交易
- **区块哈希缓存**: 缓存最新的区块哈希，提高交易效率
- **Nonce管理**: 缓存和刷新持久化Nonce信息

### 地址查找表服务 (`AddressLookupTableService`)
- **地址查找表管理**: 加载和管理Solana地址查找表
- **交易优化**: 减少交易大小，提高交易成功率
- **动态更新**: 支持运行时更新地址查找表

### 持久化Nonce服务 (`DurableNonceService`)
- **Nonce缓存**: 缓存当前Nonce值，避免频繁RPC调用
- **自动刷新**: 定时刷新Nonce信息，保持交易有效性
- **错误处理**: 处理Nonce过期和刷新失败的情况

### 定时任务调度器 (`TaskScheduler`)
- **区块哈希更新**: 每5秒自动更新最新区块哈希
- **Nonce刷新**: 定时刷新持久化Nonce信息
- **任务管理**: 统一管理所有后台定时任务

## ⚡ Gas费策略

### 全局策略 (`GlobalStrategy`)
- **适用场景**: 简单统一的Gas费配置
- **配置参数**:
  - `global_cu_limit`: 全局计算单元限制
  - `global_cu_price`: 全局计算单元价格
  - `global_buy_tip`: 全局买入小费
  - `global_sell_tip`: 全局卖出小费

### 高低小费策略 (`HighLowStrategy`)
- **适用场景**: 需要灵活调整Gas费策略的高级用户
- **策略模式**:
  - **低小费高优先费**: 使用较高的CU价格但较低的小费
  - **高小费低优先费**: 使用较低的CU价格但较高的小费
- **配置参数**:
  - `high_cu_price`: 高优先费时的CU价格
  - `low_cu_price`: 低优先费时的CU价格
  - `high_buy_tip`/`high_sell_tip`: 高小费策略
  - `low_buy_tip`/`low_sell_tip`: 低小费策略

### 策略选择
- 设置 `ENABLE_HIGH_LOW_FEE=true` 启用高低小费策略
- 设置 `ENABLE_HIGH_LOW_FEE=false` 使用全局策略（默认）

## 🔧 日志级别说明

- `error`: 只显示错误信息
- `warn`: 显示警告和错误信息
- `info`: 显示信息、警告和错误（推荐）
- `debug`: 显示所有信息，包括详细的调试信息

## 🔧 开发脚本

```bash
# 开发模式运行
npm run dev

# 编译TypeScript
npm run build

# 监听模式编译
npm run watch

# 代码检查
npm run lint

# 修复代码问题
npm run lint:fix

# 清理构建文件
npm run clean
```

## 📄 许可证

MIT License
