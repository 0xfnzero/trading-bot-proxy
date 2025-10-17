#!/bin/bash

# 创建必要的目录
mkdir -p ~/redis-run
mkdir -p ~/redis-data

# 停止可能正在运行的 Redis 进程（包括root用户启动的）
echo "Stopping existing Redis processes..."
pkill -f "redis-server.*unixsocket" || true
# 如果存在root用户启动的Redis，尝试停止
sudo pkill -f "redis-server.*unixsocket" 2>/dev/null || true

# 等待进程完全停止
sleep 2

# 清理可能存在的socket文件
rm -f ~/redis-run/redis.sock

# 启动本地 Redis 服务器
echo "Starting Redis server..."
redis-server \
  --port 0 \
  --protected-mode no \
  --unixsocket ~/redis-run/redis.sock \
  --unixsocketperm 770 \
  --appendonly yes \
  --dir ~/redis-data \
  --appendfilename "appendonly.aof" \
  --requirepass "" \
  --daemonize yes \
  --pidfile ~/redis-run/redis.pid \
  --logfile ~/redis-run/redis.log

# 等待Redis启动
sleep 3

# 验证Redis是否成功启动
if [ -S ~/redis-run/redis.sock ]; then
    if redis-cli -s ~/redis-run/redis.sock ping > /dev/null 2>&1; then
        echo "✅ Redis started successfully with Unix socket at ~/redis-run/redis.sock"
        echo "📊 Redis info:"
        redis-cli -s ~/redis-run/redis.sock info server | grep -E "(redis_version|redis_mode|os|arch_bits)"
    else
        echo "❌ Redis socket exists but connection failed"
        echo "📋 Check logs: tail -f ~/redis-run/redis.log"
        exit 1
    fi
else
    echo "❌ Redis failed to start - socket file not created"
    echo "📋 Check logs: tail -f ~/redis-run/redis.log"
    exit 1
fi
