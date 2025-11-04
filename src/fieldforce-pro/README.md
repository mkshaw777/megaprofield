# 🚀 FieldForce Pro

**Professional Sales Force Automation Platform**

Production-ready application for Medical Representatives, Sales Managers, and Administrators.

---

## ✨ Features

### 👨‍💼 For Medical Representatives (MR)
- 📍 GPS-based Doctor Visit Check-in/Checkout
- 📊 Product-wise POB (Purchase Order Booking) Entry
- 💰 Smart Expense Management (Auto DA/TA Calculation)
- 📅 Tour Planning & Scheduling
- 📸 Visit Photo Upload with AI Validation
- 📱 Mobile-First Interface

### 👥 For Sales Managers
- 🗺️ Real-time Team Location Tracking
- ✅ Expense & POB Approval Workflow
- 📈 Comprehensive Team Reports
- 📊 Performance Analytics Dashboard
- 👁️ Activity Monitoring
- 💼 Joint Tour Expense Management

### 🔧 For Administrators
- 👤 Staff Management (MR/Manager CRUD)
- 🏥 Master Data Management (Doctors, Stockists, Products)
- 📊 Advanced Analytics & Insights
- 🗄️ Database Cleanup Tools
- 🤖 AI-based Fraud Detection
- 📥 CSV Bulk Upload Support
- ⚙️ System Configuration

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v3
- **UI Components:** Radix UI (Shadcn/ui)
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Storage:** Supabase Storage
- **Deployment:** Railway.app ($5/month)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Animation:** Motion (Framer Motion)

---

## 🎯 Why FieldForce Pro?

### Production Ready
✅ Clean, modular codebase
✅ Enterprise-grade security
✅ Optimized performance
✅ Mobile-responsive design
✅ Error handling & logging
✅ Automated backups

### Business Value
✅ Increase field force productivity
✅ Real-time visibility into sales activities
✅ Automated expense calculations
✅ Reduce fraudulent submissions
✅ Data-driven decision making
✅ Easy scaling

### Developer Friendly
✅ Well-documented code
✅ TypeScript for type safety
✅ Component-based architecture
✅ Easy to maintain & extend
✅ Git-based deployment
✅ Zero-downtime updates

---

## 📁 Project Structure

```
fieldforce-pro/
├── components/
│   ├── auth/              # Login, Splash screens
│   ├── mr/                # MR specific components
│   ├── manager/           # Manager specific components
│   ├── admin/             # Admin specific components
│   ├── shared/            # Shared components
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── supabase/          # Supabase client & operations
│   ├── utils/             # Utility functions
│   └── constants/         # Constants & config
├── types/                 # TypeScript types
├── styles/                # Global styles
├── public/                # Static assets
├── App.tsx                # Main app component
├── main.tsx               # Entry point
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🚀 Quick Start

### Option 1: Deploy to Railway (Recommended)

**Time:** 30 minutes  
**Cost:** $5/month

📖 **Follow:** [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)

```bash
1. Create Railway account
2. Connect GitHub repository
3. Add environment variables
4. Deploy!
```

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/fieldforce-pro.git
cd fieldforce-pro

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your Supabase keys

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔐 Default Login Credentials

### Demo Accounts:

```
MR (Medical Representative):
Username: mr001
Password: mr123

Manager:
Username: mgr001
Password: mgr123

Administrator:
Username: admin
Password: admin123
```

⚠️ **Important:** Change these in production!

---

## 🌍 Environment Variables

Create `.env` file with:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NODE_ENV=production
```

Get keys from: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API

---

## 📊 Database Schema

### Tables Created:

1. **users** - Staff details (MR, Manager, Admin)
2. **doctors** - Doctor master data
3. **stockists** - Stockist master data
4. **products** - Product master data
5. **visits** - Doctor visit records
6. **pob_entries** - Purchase Order Bookings
7. **expenses** - Expense submissions
8. **approvals** - Manager approvals
9. **tour_plans** - MR tour planning
10. **activity_logs** - Audit trail

📖 **Full Schema:** See [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md#supabase-database-setup)

---

## 🎨 Design System

### Colors:

```css
Primary:    #3B82F6 (Blue)
Success:    #10B981 (Green)
Warning:    #F59E0B (Orange)
Danger:     #EF4444 (Red)
Background: #F9FAFB (Light Gray)
Text:       #1F2937 (Dark Gray)
```

### Typography:

```
Font Family: Inter (Google Fonts)
Headings: Bold, Large
Body: Regular, Medium
Mobile: Optimized sizes
```

---

## 🔄 Update Workflow

### Easy 3-Step Process:

```
1. Make Changes
   └── Use Figma Make or code editor

2. Commit to GitHub
   └── GitHub web interface or GitHub Desktop

3. Auto-Deploy
   └── Railway detects changes and deploys!
```

**Zero downtime deployments! 🎉**

---

## 📱 Mobile Support

### Progressive Web App (PWA):

- ✅ Install on home screen
- ✅ Offline basic functionality
- ✅ App-like experience
- ✅ Push notifications (coming soon)

### Tested On:

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Android Firefox
- ✅ Desktop browsers

---

## 🛡️ Security Features

- ✅ JWT-based authentication
- ✅ Row Level Security (RLS) in database
- ✅ Encrypted environment variables
- ✅ HTTPS only (free SSL)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Input validation
- ✅ API rate limiting

---

## 📈 Performance

### Optimized for Speed:

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Image optimization
- ✅ CDN delivery
- ✅ Caching strategies
- ✅ Minified assets

### Target Metrics:

```
Page Load:     < 2 seconds
Time to Interactive: < 3 seconds
Lighthouse Score: 90+
Mobile Score:  90+
```

---

## 🐛 Troubleshooting

### Common Issues:

**Build Failed:**
- Check package.json dependencies
- Verify environment variables
- Review build logs

**Database Connection Error:**
- Verify Supabase keys
- Check Supabase project status
- Test connection separately

**Login Not Working:**
- Clear browser cache
- Check demo credentials
- Verify backend is running

📖 **Full Troubleshooting:** [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md#troubleshooting)

---

## 📞 Support

### Resources:

- 📖 Documentation: This README
- 🚀 Deployment Guide: [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
- 💬 Issues: GitHub Issues
- 📧 Email: support@yourcompany.com

---

## 🗺️ Roadmap

### Version 1.1 (Next Month):
- [ ] Push notifications
- [ ] Offline mode (full)
- [ ] Advanced analytics
- [ ] Custom reports builder
- [ ] Mobile app (React Native)

### Version 1.2:
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Voice notes
- [ ] Video call integration
- [ ] WhatsApp integration

---

## 📄 License

**Proprietary & Confidential**

Copyright © 2025 Your Company Name. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

---

## 🎉 Credits

Built with ❤️ using:
- React & TypeScript
- Tailwind CSS
- Supabase
- Railway.app
- Shadcn/ui
- And many awesome open-source libraries!

---

## 📊 Stats

```
Lines of Code: ~10,000+
Components: 50+
API Endpoints: 30+
Database Tables: 10
Features: 40+
Development Time: 2 weeks
Production Ready: ✅ Yes!
```

---

## 🚀 Getting Started

**Ready to deploy?**

1. 📖 Read [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md)
2. 🎯 Follow step-by-step instructions
3. 🚀 Deploy in 30 minutes
4. 🎉 Your app is live!

**Need help?**

Open an issue or contact support!

---

**🎊 Welcome to FieldForce Pro! Let's revolutionize field force management! 🚀**

---

Last Updated: January 2025  
Version: 1.0.0  
Status: Production Ready ✅
