# 1. 概要
APIリクエストに必要な情報を入力すると、curlコマンドを自動生成するWebサイト。
生成されたcurlコマンドをコピーし、ターミナル等でそのまま利用できるようにする。

---

# 2. 技術構成

- フロントエンド：TypeScript / Next.js
- バックエンド：Python / FastAPI
- 開発環境：Docker
- Docker Composeでフロントエンド・バックエンド・DBをまとめて起動

---

# 3. 起動方法
Docker上でFrontendとBackendが起動する

```bash
docker compose up --build -d
```