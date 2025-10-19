#!/bin/bash

# 打包脚本 - 将trading-bot-proxy的Linux和Mac版本打包成tar.bz2

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}开始打包 trading-bot-proxy...${NC}"

# 打包Linux版本
if [ -d "trading-bot-proxy-linux" ]; then
    echo -e "${GREEN}正在打包 Linux 版本...${NC}"
    tar -cjf "trading-bot-proxy-linux.tar.bz2" trading-bot-proxy-linux/
    echo -e "${GREEN}✓ Linux 版本打包完成: trading-bot-proxy-linux.tar.bz2${NC}"
else
    echo -e "${RED}✗ 错误: trading-bot-proxy-linux 目录不存在${NC}"
fi

# 打包Mac版本
if [ -d "trading-bot-proxy-mac" ]; then
    echo -e "${GREEN}正在打包 Mac 版本...${NC}"
    tar -cjf "trading-bot-proxy-mac.tar.bz2" trading-bot-proxy-mac/
    echo -e "${GREEN}✓ Mac 版本打包完成: trading-bot-proxy-mac.tar.bz2${NC}"
else
    echo -e "${RED}✗ 错误: trading-bot-proxy-mac 目录不存在${NC}"
fi

# 显示打包文件信息
echo -e "\n${BLUE}打包文件列表:${NC}"
ls -lh trading-bot-proxy-*.tar.bz2 2>/dev/null || echo -e "${RED}没有找到打包文件${NC}"

echo -e "\n${GREEN}打包完成!${NC}"
