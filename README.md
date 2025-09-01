# 🛒 Voice Command Shopping Assistant

A full-stack web application that lets users **create and manage shopping lists using voice commands**.  
The project combines **React + Vite (frontend)**, **Node.js + Express (backend)**, and **MongoDB Atlas (database)**.  
Frontend is deployed on **Firebase Hosting** and backend is deployed on **Render**.

---

## 🚀 Live Demo

- **Frontend (Firebase Hosting):** [https://voice-command-assistant.web.app](https://voice-command-assistant.web.app)  
- **Backend API (Render):** [https://voice-shopping-backend-nsxu.onrender.com](https://voice-shopping-backend-nsxu.onrender.com)

---

## 📂 GitHub Repository

🔗 [GitHub Source Code](https://github.com/AN-06/voice-command-shopping-assisstant)

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- TypeScript
- TailwindCSS
- SpeechRecognition API
- Firebase Hosting

### Backend
- Node.js + Express
- MongoDB Atlas (cloud database)
- JWT Authentication
- Render Deployment

---

## ⚙️ Features

✅ User authentication (signup/login with JWT)  
✅ Voice commands to **add/remove/clear items**  
✅ Items grouped by category (produce, dairy, snacks, etc.)  
✅ Smart suggestions (frequent, seasonal, and substitutes)  
✅ Progress tracker (completed vs pending items)  
✅ Persistent storage using MongoDB Atlas  
✅ Responsive and modern UI with TailwindCSS  

---

## 📦 Installation & Setup (Local)

### 1. Clone the repository
```bash
git clone https://github.com/AN-06/voice-command-shopping-assistant.git
cd voice-command-shopping-assistant
```
### 2. Backend Setup
```bash
 cd backend
 npm install
 ```
* Create a .env file in the backend folder:

```bash
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```
* Run backend:

```bash
  npm run dev
  ```
Backend runs at: http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

## 🚀 Deployment

### 🔹 Frontend (Firebase Hosting)

1. **Build the project**  
 ``` bash
    npm run build
   ```
2. **Deploy**
  ``` bash
     firebase deploy 
  ```
### 🔹 Backend (Render)

1. Push code to **GitHub**  
2. Create a **Web Service** on Render  
3. Add Environment Variables:  
   - `MONGO_URI` → MongoDB Atlas connection string  
   - `JWT_SECRET` → secret key  
4. **Deploy 🚀**
 
  
