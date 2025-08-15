# Deployment Checklist for IMPing

## ✅ Pre-deployment (Completed)
- [x] Environment variables configured
- [x] Cloudinary integration set up
- [x] MongoDB Atlas connected
- [x] API endpoints centralized
- [x] CORS configured for production
- [x] Build scripts configured

## 🚀 Deployment Steps

### Backend (Render)
1. **Sign up**: render.com
2. **New Web Service** → Connect GitHub repo
3. **Configure**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://toto:hbpMvkBhYDhkgx7l@cluster0.xmzon.mongodb.net/IMP
   JWT_SECRET=IMP@SSW0RD
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=dxwqkl2iq
   CLOUDINARY_API_KEY=385492643111399
   CLOUDINARY_API_SECRET=KjNAriaF2pNsncb6dwABq43NTHI
   FRONTEND_URL=* (update after frontend deployment)
   ```
5. **Deploy** → Note backend URL

### Frontend (Vercel)
1. **Sign up**: vercel.com
2. **New Project** → Import GitHub repo
3. **Configure**:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. **Deploy** → Note frontend URL

### Final Steps
1. **Update CORS**: Set FRONTEND_URL in Render to your Vercel URL
2. **Redeploy backend**
3. **Test application**

## 📱 Your URLs (fill after deployment)
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.onrender.com
- Database: MongoDB Atlas (existing)
- Files: Cloudinary (existing)

## 🐛 Troubleshooting
- Check browser console for errors
- Check Render logs for backend issues
- Verify environment variables are set correctly
- Ensure CORS is configured properly
