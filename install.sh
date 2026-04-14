#!/bin/sh
set -e

REPO="BosenY/pokecn-cli"
BIN_NAME="pokecn"
INSTALL_DIR="/usr/local/bin"

# 检测操作系统
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$OS" in
  darwin) OS="darwin" ;;
  linux)  OS="linux" ;;
  *)
    echo "❌ 不支持的操作系统：$OS"
    echo "   请前往 https://github.com/${REPO}/releases 手动下载"
    exit 1
    ;;
esac

# 检测架构
ARCH=$(uname -m)
case "$ARCH" in
  x86_64)       ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *)
    echo "❌ 不支持的架构：$ARCH"
    echo "   请前往 https://github.com/${REPO}/releases 手动下载"
    exit 1
    ;;
esac

TARGET="bun-${OS}-${ARCH}"

# 获取最新版本号
echo "🔍 获取最新版本..."
VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
  | grep '"tag_name"' \
  | head -1 \
  | sed 's/.*"tag_name": *"\([^"]*\)".*/\1/')

if [ -z "$VERSION" ]; then
  echo "❌ 无法获取最新版本，请检查网络或前往 https://github.com/${REPO}/releases 手动下载"
  exit 1
fi

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BIN_NAME}-${TARGET}"
TMP_FILE="/tmp/${BIN_NAME}-install"

echo "📦 下载 pokecn ${VERSION} (${TARGET})..."
curl -fsSL "$DOWNLOAD_URL" -o "$TMP_FILE"
chmod +x "$TMP_FILE"

# 安装到系统目录（可能需要 sudo）
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMP_FILE" "${INSTALL_DIR}/${BIN_NAME}"
else
  echo "🔐 需要管理员权限安装到 ${INSTALL_DIR}..."
  sudo mv "$TMP_FILE" "${INSTALL_DIR}/${BIN_NAME}"
fi

echo "✅ pokecn ${VERSION} 已安装到 ${INSTALL_DIR}/${BIN_NAME}"
echo ""
echo "🚀 快速开始："
echo "   pokecn get pikachu     # 查看皮卡丘"
echo "   pokecn search 火        # 搜索火属性宝可梦"
