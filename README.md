# Vocabulary Learning App

Ứng dụng học từ vựng desktop được xây dựng với **Electron**, **React**, **TypeScript**, và **Vite**.

## Tính năng chính

- 📚 **Quản lý từ vựng** - Xem và quản lý danh sách từ vựng
- 🎯 **Chế độ luyện tập** - Luyện tập từ vựng tương tác
- ⚙️ **Cài đặt tùy chỉnh** - Điều chỉnh cài đặt học tập
- 🔔 **Thông báo nhắc nhở** - Nhắc nhở luyện tập định kỳ (mỗi 10 phút)
- 💾 **Lưu trữ local** - Sử dụng IndexedDB để lưu trữ dữ liệu
- 🖥️ **Desktop App** - Ứng dụng desktop độc lập

## Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Desktop**: Electron
- **Build Tool**: Vite
- **Database**: IndexedDB (với thư viện idb)
- **Development**: Hot Module Replacement (HMR)

## Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

## Cách chạy dự án

### 🚀 Chạy ứng dụng Desktop (Electron)

#### Phương pháp 1: Sử dụng script tự động (Khuyến nghị)
```bash
npm run electron:dev
```

#### Phương pháp 2: VS Code Tasks
1. Mở Command Palette: `Ctrl+Shift+P`
2. Chọn "Tasks: Run Task"
3. Chọn "shell: electron-dev"

#### Phương pháp 3: Chạy manual (để debug)
```bash
# Terminal 1: Khởi động Vite dev server
npm run dev

# Terminal 2: Build Electron và chạy (đợi Vite khởi động xong)
npm run build:electron
npx electron .
```

### 🌐 Chạy web app (chỉ React)
```bash
npm run dev
```
Sau đó mở trình duyệt tại `http://localhost:5173`

### 🏗️ Build production
```bash
npm run electron:build
```

## Scripts có sẵn

| Script | Mô tả |
|--------|--------|
| `npm run dev` | Chạy Vite dev server (web mode) |
| `npm run electron:dev` | Chạy ứng dụng Electron với hot reload |
| `npm run build:electron` | Build TypeScript files cho Electron |
| `npm run electron:build` | Build ứng dụng production |
| `npm run clean` | Xóa thư mục build |
| `npm run lint` | Kiểm tra lỗi ESLint |

## Cấu trúc dự án

```
├── electron/              # Electron main process
│   ├── main.ts            # Electron main process
│   └── preload.ts         # Preload script
├── src/                   # React source code
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main App component
├── data/                  # Dữ liệu từ vựng
│   └── vocabulary.json    # File dữ liệu từ vựng
├── dist-electron/         # Compiled Electron files
└── .vscode/               # VS Code tasks và settings
```

## Troubleshooting

### ❌ Lỗi: "Cannot find module 'dist-electron/main.js'"

**Nguyên nhân**: Electron files chưa được compile từ TypeScript.

**Giải pháp**:
```bash
npm run build:electron
```

### ❌ Electron mở nhưng màn hình trắng

**Nguyên nhân**: Vite dev server chưa khởi động hoặc Electron không kết nối được.

**Cách kiểm tra**:
1. Mở `http://localhost:5173` trong browser để kiểm tra Vite
2. Mở DevTools trong Electron (`F12`) để xem lỗi console
3. Kiểm tra terminal có lỗi gì không

**Giải pháp**:
```bash
# Dừng tất cả process
taskkill /f /im electron.exe
taskkill /f /im node.exe

# Chạy lại từng bước
npm run dev          # Terminal 1
npm run build:electron && npx electron .  # Terminal 2
```

### ❌ Lỗi: "window.api is not defined"

**Nguyên nhân**: Ứng dụng chạy trong web mode thay vì Electron.

**Giải pháp**: Đảm bảo chạy bằng `npm run electron:dev` thay vì `npm run dev`

### ❌ Port 5173 đã được sử dụng

**Giải pháp**:
```bash
# Tìm và kill process đang sử dụng port
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Hoặc thay đổi port trong vite.config.ts
```

### ❌ Lỗi TypeScript compile

**Giải pháp**:
```bash
# Kiểm tra lỗi TypeScript
npx tsc --noEmit

# Fix lỗi trong code và chạy lại
npm run build:electron
```

## Debug Mode

### Kiểm tra trạng thái ứng dụng
Ứng dụng có trang Debug built-in để kiểm tra:
1. Mở ứng dụng Electron
2. Click tab "Debug" 
3. Xem thông tin về API availability và errors

### Mở DevTools
- Trong Electron: `F12` hoặc `Ctrl+Shift+I`
- Hoặc trong code đã tự động mở DevTools khi development

## Các lỗi thường gặp và cách fix

### 1. **App không hiển thị dữ liệu từ vựng**
- Kiểm tra file `data/vocabulary.json` có tồn tại
- Xem console có lỗi load file không
- Kiểm tra IndexedDB trong DevTools

### 2. **Thông báo không hoạt động**
- Đảm bảo chạy trong Electron (không phải web)
- Kiểm tra quyền notification của hệ thống

### 3. **Hot reload không hoạt động** 
- Đảm bảo Vite dev server đang chạy
- Kiểm tra network connection giữa Electron và Vite

## Development

### Thêm từ vựng mới
Chỉnh sửa file `data/vocabulary.json`:
```json
{
  "id": "unique-id",
  "english": "English word",
  "vietnamese": "Từ tiếng Việt", 
  "pronunciation": "/pronunciation/",
  "image": "path/to/image.png",
  "audio": "path/to/audio.mp3"
}
```

### Tùy chỉnh giao diện
- Chỉnh sửa styles trong `src/components/`
- Sử dụng Tailwind CSS classes
- Custom CSS trong `src/index.css`

## Production Build

### Build desktop app
```bash
npm run electron:build
```

### File output
- Windows: `dist-electron/win-unpacked/`
- macOS: `dist-electron/mac/`
- Linux: `dist-electron/linux-unpacked/`

---

## React + TypeScript + Vite Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
