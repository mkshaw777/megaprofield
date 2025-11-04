# 🚀 FieldForce Pro - Railway.app Deployment Guide

## 🎯 Overview

यह guide आपको **FieldForce Pro** को Railway.app पर deploy करने में help करेगा।

**Cost:** $5-10/month (Production-grade hosting)
**Time:** 30 minutes
**Difficulty:** आसान (Step-by-step)

---

## 💰 Why Railway.app?

### ✅ Advantages:

```
Production Ready:
├── 99.9% Uptime SLA
├── Auto-scaling
├── Zero downtime deployments
├── Built-in database (PostgreSQL)
├── Professional support
└── No "free tier" limitations

Developer Friendly:
├── GitHub auto-deploy
├── Environment variables
├── Easy rollback
├── Real-time logs
└── Custom domains (free SSL)

Cost Effective:
├── Hobby Plan: $5/month
├── Pro Plan: $20/month
└── Pay only for what you use
```

---

## 📋 Prerequisites

### Before Starting:

```
✅ GitHub Account
   └── Repository: fieldforce-pro

✅ Railway Account (create free)
   └── Sign up: https://railway.app

✅ Credit/Debit Card (for $5/month payment)
   └── International card accepted
   └── UPI/PayTM not supported (use card)

✅ Supabase Account (already have)
   └── Database + Storage ready

✅ 30 minutes free time
```

---

## 🚀 Step-by-Step Deployment

### STEP 1: Create Railway Account (5 minutes)

#### 1.1 - Sign Up

```
1. Visit: https://railway.app
2. Click "Start a New Project"
3. Choose "Sign up with GitHub"
4. Authorize Railway to access GitHub
5. Complete email verification
```

#### 1.2 - Add Payment Method

```
1. Go to Account Settings
2. Click "Billing"
3. Add Credit/Debit Card
4. Select "Hobby Plan" ($5/month)
5. Confirm payment
```

✅ **You get:** $5 free credit to start!

---

### STEP 2: Prepare GitHub Repository (10 minutes)

#### 2.1 - Create New Repository

```
1. Go to: https://github.com/new
2. Repository name: fieldforce-pro
3. Description: "Sales Force Automation - Production App"
4. Visibility: Private (recommended)
5. Click "Create repository"
```

#### 2.2 - Upload Code

**Option A: GitHub Web Interface**

```
1. In GitHub repo, click "uploading an existing file"
2. Select all files from fieldforce-pro/ folder
3. Drag & drop to upload
4. Commit message: "Initial commit - FieldForce Pro v1.0"
5. Click "Commit changes"
```

**Option B: GitHub Desktop (Easier)**

```
1. Download: https://desktop.github.com
2. Install and login with GitHub
3. File → Add Local Repository
4. Select fieldforce-pro folder
5. Publish repository
6. Push changes
```

---

### STEP 3: Deploy to Railway (10 minutes)

#### 3.1 - Create New Project

```
1. Railway Dashboard: https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose "fieldforce-pro" repository
5. Click "Deploy Now"
```

#### 3.2 - Configure Build Settings

Railway auto-detects settings, but verify:

```
Build Command: npm install && npm run build
Start Command: npm run preview
Root Directory: /
```

#### 3.3 - Add Environment Variables

**Important:** Add these BEFORE deployment

```
Click "Variables" tab in Railway project:

Variable 1:
Name: VITE_SUPABASE_URL
Value: https://YOUR-PROJECT.supabase.co

Variable 2:
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGc... (your anon key from Supabase)

Variable 3:
Name: VITE_SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGc... (your service role key)

Variable 4:
Name: NODE_ENV
Value: production
```

**Where to get Supabase keys:**

```
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy:
   - Project URL → VITE_SUPABASE_URL
   - anon/public key → VITE_SUPABASE_ANON_KEY
   - service_role key → VITE_SUPABASE_SERVICE_ROLE_KEY
```

#### 3.4 - Deploy

```
1. Click "Deploy" button
2. Wait 3-5 minutes
3. Watch build logs
4. Deployment complete! 🎉
```

---

### STEP 4: Setup Custom Domain (Optional - 5 minutes)

#### 4.1 - Railway Subdomain (Free)

```
1. In Railway project, go to "Settings"
2. Click "Generate Domain"
3. You get: fieldforce-pro.up.railway.app
4. Free SSL included!
```

#### 4.2 - Custom Domain (If you have one)

```
1. Settings → Domains
2. Click "Add Custom Domain"
3. Enter: app.yourcompany.com
4. Add CNAME record in your domain registrar:
   
   Type: CNAME
   Name: app
   Value: fieldforce-pro.up.railway.app
   TTL: 3600

5. Wait 10-30 minutes for DNS propagation
6. Free SSL auto-configured!
```

---

## ✅ Verify Deployment

### Checklist:

```
□ Railway dashboard shows "Active"
□ Build logs show no errors
□ URL accessible (click "View Logs" → "Deployments" → URL)
□ Login page loads
□ Can login as MR/Manager/Admin
□ Database connection working
□ Images upload successfully
□ All features functional
□ Mobile responsive
```

---

## 🎨 Supabase Database Setup

### Create Tables:

```sql
-- Run this in Supabase SQL Editor

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('mr', 'manager', 'admin')),
  territory TEXT,
  manager_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Doctors Table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT,
  hospital TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  mr_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Visits Table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mr_id UUID REFERENCES users(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  check_in_lat DECIMAL(10, 8),
  check_in_lng DECIMAL(11, 8),
  check_out_lat DECIMAL(10, 8),
  check_out_lng DECIMAL(11, 8),
  visit_notes TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category TEXT,
  price DECIMAL(10, 2),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Stockists Table
CREATE TABLE stockists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POB Entries Table
CREATE TABLE pob_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  stockist_id UUID REFERENCES stockists(id) NOT NULL,
  quantity INTEGER NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Expenses Table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  expense_date DATE NOT NULL,
  expense_type TEXT NOT NULL CHECK (expense_type IN ('da', 'ta', 'hotel', 'other')),
  amount DECIMAL(10, 2) NOT NULL,
  distance_km DECIMAL(10, 2),
  description TEXT,
  receipt_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tour Plans Table
CREATE TABLE tour_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mr_id UUID REFERENCES users(id) NOT NULL,
  plan_date DATE NOT NULL,
  territory TEXT,
  doctors UUID[] NOT NULL,
  remarks TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX idx_visits_mr ON visits(mr_id);
CREATE INDEX idx_visits_doctor ON visits(doctor_id);
CREATE INDEX idx_visits_date ON visits(check_in_time);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_pob_visit ON pob_entries(visit_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pob_entries ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow all for now - refine later)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on doctors" ON doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on visits" ON visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on pob_entries" ON pob_entries FOR ALL USING (true) WITH CHECK (true);
```

### Create Storage Buckets:

```
1. Supabase Dashboard → Storage
2. Create New Bucket:
   Name: fieldforce-uploads
   Public: No (Private)
3. Create New Bucket:
   Name: fieldforce-documents
   Public: No (Private)
```

---

## 🔧 Configure Supabase Edge Functions

### Deploy Backend Server:

```bash
# In your local terminal

# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# 4. Deploy edge function
supabase functions deploy make-server-685d939a
```

---

## 🎯 Testing Checklist

### After Deployment, Test:

```
✅ Frontend:
□ App loads on Railway URL
□ Login screen displays
□ Can login with demo credentials
□ Dashboard loads for each role
□ Navigation works
□ Mobile responsive

✅ MR Features:
□ Doctor list loads
□ Check-in works
□ GPS captures location
□ Photo upload works
□ POB entry saves
□ Expense submission works
□ Tour plan displays

✅ Manager Features:
□ Team list shows
□ Live tracking works
□ Approval system functional
□ Reports generate
□ Dashboard stats correct

✅ Admin Features:
□ Staff management works
□ Master data CRUD works
□ Analytics display
□ CSV upload works
□ Database cleanup works
```

---

## 💳 Payment & Billing

### Railway Pricing:

```
Hobby Plan: $5/month
├── $5 free credit (first month)
├── Suitable for:
│   ├── 1-10 users
│   ├── Low-medium traffic
│   └── Standard performance
└── Includes:
    ├── Auto-deploy
    ├── Custom domains
    ├── SSL certificates
    └── Basic monitoring

Pro Plan: $20/month
├── Suitable for:
│   ├── 10-100 users
│   ├── High traffic
│   └── Enhanced performance
└── Includes:
    ├── Everything in Hobby
    ├── Priority support
    ├── Advanced metrics
    └── Team collaboration
```

### Recommendation:

```
Start: Hobby Plan ($5/month)
Scale: Pro Plan when users > 20
```

---

## 🔄 Future Updates Process

### Easy 3-Step Update:

```
Step 1: Make changes in Figma Make
   ↓
Step 2: Upload to GitHub
   ↓
Step 3: Railway auto-deploys! ✨
```

### Detailed Process:

```
1. Make Changes:
   - Use Figma Make to generate new code
   - Test locally (optional)

2. Commit to GitHub:
   - GitHub web interface: Upload files
   - OR GitHub Desktop: Commit & Push

3. Auto-Deploy:
   - Railway detects changes
   - Builds new version (2-3 min)
   - Deploys with zero downtime
   - Old version available for rollback

4. Verify:
   - Test on production URL
   - Check functionality
   - Monitor logs
```

---

## 🐛 Troubleshooting

### Problem 1: Build Failed

```
Symptom: Railway shows "Build Failed" status

Causes:
- Missing dependencies in package.json
- Wrong build command
- Environment variables missing

Fix:
1. Check Railway build logs
2. Verify package.json has all dependencies
3. Check build command: npm install && npm run build
4. Add missing environment variables
5. Redeploy
```

### Problem 2: App Not Loading

```
Symptom: White screen or 404 error

Causes:
- Wrong start command
- Port configuration issue
- Build output directory wrong

Fix:
1. Verify start command: npm run preview
2. Check vite.config.ts has correct settings
3. Ensure dist folder is generated
4. Check Railway logs for errors
```

### Problem 3: Database Connection Error

```
Symptom: "Failed to fetch" or database errors

Causes:
- Supabase keys wrong
- Environment variables not set
- CORS issues

Fix:
1. Verify Supabase URL and keys
2. Check all env variables in Railway
3. Test Supabase connection separately
4. Check Supabase project is active
```

### Problem 4: Payment Declined

```
Symptom: Can't add card to Railway

Causes:
- International payments blocked
- Insufficient funds
- Bank security

Fix:
1. Enable international transactions
2. Use different card
3. Contact bank to allow Railway payments
4. Try PayPal if available
```

---

## 📞 Support

### Railway Support:

```
Documentation: https://docs.railway.app
Community: https://discord.gg/railway
Email: team@railway.app
Response Time: 24-48 hours
```

### Supabase Support:

```
Documentation: https://supabase.com/docs
Community: https://github.com/supabase/supabase/discussions
Discord: https://discord.supabase.com
```

---

## 🎉 Success!

### Your App is Live! 🚀

```
Production URL: https://fieldforce-pro.up.railway.app
Custom Domain: https://app.yourcompany.com (if configured)

Next Steps:
✅ Share URL with team
✅ Start field testing
✅ Collect feedback
✅ Monitor usage
✅ Plan updates
```

---

## 📊 Monitoring & Analytics

### Railway Dashboard:

```
Metrics Available:
├── CPU Usage
├── Memory Usage
├── Network Traffic
├── Build Times
├── Deploy Frequency
└── Error Rates
```

### Setup Monitoring:

```
1. Railway Dashboard → Your Project
2. Click "Observability"
3. View:
   - Real-time logs
   - Resource usage
   - Deploy history
   - Error tracking
```

---

## 🔐 Security Best Practices

```
✅ Use environment variables (never hardcode keys)
✅ Enable Supabase Row Level Security
✅ Use HTTPS only (Railway provides free SSL)
✅ Regular password changes
✅ Monitor access logs
✅ Backup database weekly
✅ Keep dependencies updated
```

---

## 💡 Pro Tips

```
1. Enable Auto-Deploy:
   - Railway → Settings → GitHub Integration
   - Auto-deploy on push to main branch

2. Setup Staging Environment:
   - Create separate Railway project
   - Deploy from 'development' branch
   - Test before production

3. Database Backups:
   - Supabase auto-backups daily
   - Download manual backup weekly
   - Store in secure location

4. Performance Optimization:
   - Monitor Railway metrics
   - Optimize images before upload
   - Use CDN for static assets
   - Enable caching where possible

5. Cost Optimization:
   - Start with Hobby plan
   - Monitor usage in Railway dashboard
   - Upgrade only when needed
   - Use Supabase free tier efficiently
```

---

**🎊 Congratulations! Your FieldForce Pro app is now production-ready! 🚀**

**Field deployment ready in 2 days as promised! 💪**
