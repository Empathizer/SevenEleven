# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (for frontend)
- Railway/Render account (for backend)
- MongoDB Atlas account

## Step 1: MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/seveneleven
   ```

## Step 2: Backend Deployment (Railway)

1. Push code to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-secure-random-string>
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=<your-vercel-url>
   ```
6. Set root directory to `/server`
7. Deploy

## Step 3: Frontend Deployment (Vercel)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>
   ```
5. Deploy

## Step 4: Seed Database

After backend is deployed, run seed script:

```bash
cd server
npm run seed
```

Or use Railway CLI:
```bash
railway run npm run seed
```

## Step 5: Test Deployment

1. Visit your Vercel URL
2. Login with default credentials:
   - Admin: admin@seveneleven.com / admin123
   - Seller: seller@seveneleven.com / seller123
   - Customer: customer@seveneleven.com / customer123

## Alternative: Render Deployment

### Backend on Render:
1. Create new Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: server
   - Build Command: npm install
   - Start Command: npm start
4. Add environment variables
5. Deploy

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## Post-Deployment Checklist

- [ ] Database seeded successfully
- [ ] Admin login works
- [ ] Seller registration works
- [ ] Product creation works
- [ ] Order placement works
- [ ] API endpoints responding
- [ ] CORS configured correctly
- [ ] SSL certificates active

## Troubleshooting

### CORS Issues
- Ensure FRONTEND_URL in backend matches your Vercel domain
- Check CORS configuration in server.js

### Database Connection
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

### Authentication Issues
- Verify JWT_SECRET is set
- Check cookie settings (secure flag in production)
- Ensure credentials are correct

## Monitoring

- Railway: Built-in logs and metrics
- Vercel: Analytics dashboard
- MongoDB Atlas: Performance monitoring

## Scaling

### Backend
- Railway: Upgrade plan for more resources
- Add Redis for session management
- Implement rate limiting

### Frontend
- Vercel: Automatic scaling
- Add CDN for images (Cloudinary)
- Implement caching strategies

## Security Checklist

- [ ] Environment variables secured
- [ ] JWT secret is strong and random
- [ ] Database credentials rotated
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation active
- [ ] SQL injection prevention
- [ ] XSS protection enabled

## Backup Strategy

1. MongoDB Atlas: Enable automatic backups
2. Code: GitHub repository
3. Environment variables: Secure storage
4. Regular database exports

## Support

For deployment issues:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- MongoDB: https://www.mongodb.com/support
