# 🚀 セットアップガイド / Project Setup Guide / Hướng dẫn cài đặt

---

## 🇯🇵 日本語

### 1. 依存関係のインストール

以下を実行します：

```bash
npm install
```

プロジェクトに必要なパッケージをインストールします。

---

### 2. `.env` ファイルの設定

`.env` ファイルを編集します：

```env
THEME_NAME=テーマフォルダ名
URL_SITE=http://localhost/hiep/
```

**説明：**

- `THEME_NAME` → WordPress テーマフォルダ名  
- `URL_SITE` → ローカル WordPress のURL

---

### 3. プロジェクトの起動

```bash
npm start
```

このコマンドは以下を実行します：

- ファイル監視  
- アセットのビルド  
- ブラウザ同期  

---

### PostCSSでCSSをビルド（@media）

```bash
gulp post_css
```

---

---

## 🇺🇸 English

### 1. Install dependencies

Run:

```bash
npm install
```

This installs all required packages for the project.

---

### 2. Configure `.env` file

Edit the `.env` file:

```env
THEME_NAME=theme-folder-name
URL_SITE=http://localhost/hiep/
```

**Explanation:**

- `THEME_NAME` → WordPress theme folder name  
- `URL_SITE` → Local WordPress URL

---

### 3. Start the project

```bash
npm start
```

This command will:

- Watch files automatically  
- Build assets  
- Sync browser

---

### Build CSS with PostCSS (@media)

```bash
gulp post_css
```

---

---

## 🇻🇳 Tiếng Việt

### 1. Cài đặt dependencies

Chạy lệnh:

```bash
npm install
```

Lệnh này sẽ cài toàn bộ package cần thiết cho project.

---

### 2. Cấu hình file `.env`

Mở file `.env` và chỉnh:

```env
THEME_NAME=ten-theme
URL_SITE=http://localhost/hiep/
```

**Giải thích:**

- `THEME_NAME` → Tên thư mục theme WordPress  
- `URL_SITE` → Đường dẫn WordPress local

---

### 3. Khởi động project

```bash
npm start
```

Lệnh này sẽ:

- Watch file tự động  
- Build assets  
- Đồng bộ trình duyệt

---

### Build CSS với PostCSS (@media)

```bash
gulp post_css
```

---

---

## ✅ Notes

- Make sure Node.js and npm are installed  
- Ensure WordPress is running locally before starting  
- `.env` values must match your project setup  

---

✨ Happy coding!
