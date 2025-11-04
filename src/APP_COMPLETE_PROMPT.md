# Megapro Innovation - Complete SFA Application Prompt

## 📱 App Overview
**Name:** Megapro Innovation  
**Type:** Sales Force Automation (SFA) Application  
**Purpose:** Complete field force management system for pharmaceutical/medical sales teams

---

## 🎯 Core Objectives
1. Track Medical Representative (MR) field activities in real-time
2. Enable Managers to monitor team performance and approve expenses
3. Provide Admins with complete control over data, settings, and analytics
4. Automate expense calculations based on distance and visit types
5. Real-time GPS tracking and visit verification
6. Product-wise POB (Purchase Order Booking) tracking linked to stockists
7. Task assignment and tracking system

---

## 👥 User Roles & Access Levels

### 1. **MR (Medical Representative)** - Mobile-First Interface
**Primary Functions:**
- Doctor visit tracking with GPS check-in/check-out
- Product-wise POB entry during visits
- Daily expense submission (DA/TA/Hotel)
- Tour planning and calendar management
- Task management (view and update assigned tasks)
- Real-time location tracking during field work

### 2. **Manager** - Mobile-First Interface  
**Primary Functions:**
- Team dashboard with live MR locations
- Expense approval/rejection workflow
- Team performance monitoring
- MR activity reports (detailed visit analysis)
- Joint visit expense management (higher DA rates)
- Doctor visit capability (same as MR)
- Task management (view and update assigned tasks)

### 3. **Admin** - Desktop Web Interface
**Primary Functions:**
- Complete staff management (create/edit MR & Manager accounts)
- Doctor database management (assign doctors to MRs)
- Product catalog management
- Stockist/distributor management
- Task assignment to MRs and Managers
- Comprehensive reports and analytics
- App settings configuration (DA/TA rates, hotel limits)
- Database cleanup and data export
- Company logo customization

---

## 🎨 Design System

### Color Palette
```
Primary Blue: #2563EB (buttons, active states, CTAs)
Success Green: #10B981 (approvals, completed states)
Background: #F9FAFB (page backgrounds)
Text Primary: #1F2937 (headings, main text)
Text Secondary: #6B7280 (subtext, labels)
Error Red: #EF4444 (rejections, alerts)
Warning Yellow: #F59E0B (pending states)
Border Gray: #E5E7EB
White: #FFFFFF (cards, surfaces)
```

### Typography
- Headlines: Default browser H1-H6 (no custom Tailwind font sizes)
- Body: Default paragraph styling
- Use font-weight utilities only when explicitly needed
- Line-height: Default browser settings

### Design Principles
- **MR/Manager:** Mobile-first, thumb-friendly, bottom navigation
- **Admin:** Desktop-optimized, sidebar navigation, data tables
- Cards with rounded corners (rounded-xl)
- Consistent spacing using Tailwind's 4px scale
- Shadow-sm for cards, shadow-lg for important modals
- Gradient headers for mobile views

---

## 💼 Feature Specifications

### 🔵 MR Features (Medical Representative)

#### 1. Dashboard
- **Welcome Section:** Personalized greeting with MR name
- **Today's Stats Cards:**
  - Total visits completed today
  - Total POB amount (₹)
  - Total collection amount (₹)
  - Pending expenses count
- **Quick Actions:**
  - Start New Visit button
  - Add Expense button
  - View Tour Plan button
- **Recent Activities:** Last 5 visits with doctor names and POB amounts
- **Pending Tasks:** Show overdue and upcoming tasks with priority badges

#### 2. Doctor Visit Tracking
**Check-In Process:**
1. Select doctor from assigned list
2. GPS location capture (mandatory)
3. Check-in timestamp recorded
4. Visit card shows: Doctor name, specialty, check-in time, location

**During Visit:**
- Active visit banner at top of screen
- Product-wise POB entry form
  - Product dropdown (from admin-configured list)
  - Quantity input
  - Stockist selection (linked to selected product)
  - Rate per unit
  - Auto-calculated total amount
  - Add multiple products
- Collection amount input (payments received)
- Gift distributed checkbox
- Visit notes/remarks textarea

**Check-Out Process:**
1. GPS location capture (different from check-in)
2. Check-out timestamp
3. Auto-calculate distance traveled
4. Visit summary display
5. Data saved to local storage (localStorage)

**GPS Validation:**
- Minimum 10 meters distance between check-in and check-out
- Location accuracy must be < 50 meters
- Mock locations detected and flagged

#### 3. Expense Management
**Entry Rules:**
- Can only enter expenses after 8 PM (20:00 hours)
- Select expense date (cannot be future date)
- Expense type selection (mandatory)

**Expense Types & Calculations:**

**A. Daily Allowance (DA)**
- Local (< 30 KM): ₹100 (fixed)
- Outstation (≥ 30 KM): ₹100 (fixed)
- Auto-determined based on tour plan distance

**B. Travel Allowance (TA)**
- Local (< 30 KM): ₹0 (no TA)
- Outstation (≥ 30 KM): Distance × ₹2.5 per KM
- Maximum cap: ₹500 for outstation
- Formula: `TA = min(distance × 2.5, 500)`

**C. Hotel Expenses**
- Only for outstation (≥ 30 KM)
- Maximum limit: ₹500
- Requires bill upload (image)
- Validation: Amount ≤ ₹500

**D. Other Expenses**
- Description required
- Amount input
- Bill upload optional
- Manager approval needed

**Expense Submission:**
- Total auto-calculated: DA + TA + Hotel + Other
- Status: "Pending" on submission
- Manager gets notification
- Cannot edit after submission
- Can view approval history

#### 4. Tour Planning
**Features:**
- Monthly calendar view
- Add tour plan for specific dates
- Plan details:
  - Headquarters (HQ) selection
  - Area/beat selection
  - Planned doctors list
  - Expected distance
  - Tour type (Local/Outstation)
- Edit/delete only for future dates
- Visual indicators:
  - Planned tours (blue)
  - Completed tours (green)
  - Today (highlighted)

#### 5. Task Management (NEW)
**View Tasks:**
- List of all assigned tasks
- Filter by status (Pending/In Progress/Completed)
- Sort by priority and due date
- Overdue tasks highlighted in red

**Task Details:**
- Task title and description
- Assigned by (Admin name)
- Priority (Low/Medium/High/Urgent) with color badges
- Due date with countdown
- Target amount (if applicable)
- Current status

**Task Actions:**
- Start Working (Pending → In Progress)
- Mark as Completed (In Progress → Completed)
- Add notes/updates
- View completion timestamp

**Task Stats:**
- Total tasks
- Pending count
- In Progress count
- Overdue count (urgent red badge)

#### 6. Bottom Navigation (5 tabs)
```
[Home] [Doctors] [Tasks] [Expenses] [Profile]
```
- Home: Dashboard
- Doctors: Doctor list & visit tracking
- Tasks: My assigned tasks
- Expenses: Expense form & history
- Profile: Settings & logout

---

### 🟣 Manager Features

#### 1. Manager Dashboard
- **Team Overview Cards:**
  - Total MRs under management
  - Active MRs today (who checked in)
  - Total team POB today
  - Pending expense approvals count

- **Live Team Location Map:**
  - Real-time MR locations on map
  - Active visits marked with doctor icons
  - MR name and last updated time
  - Click to view MR details

- **Recent Team Activities:**
  - Last 10 team visits
  - MR name, doctor visited, POB amount
  - Timestamp and location

- **Quick Actions:**
  - View All MRs button
  - Pending Approvals button
  - Team Reports button

#### 2. Team Management
**MR List View:**
- MR name and username
- Linked manager name
- Today's status (Active/Offline)
- Today's stats (visits, POB, collection)
- Last visit timestamp and location
- Contact information

**MR Details Popup:**
- Complete profile
- Visit history (last 30 days)
- Expense history
- Performance metrics
- Location history
- Assigned doctors list

**Live Tracking:**
- Real-time location updates
- Active visit indicator
- Check-in/check-out times
- Distance traveled
- Route map view

#### 3. Expense Approvals
**Approval Queue:**
- Pending expenses list
- MR name and date
- Expense breakdown (DA/TA/Hotel/Other)
- Total amount
- Submitted timestamp

**Review Process:**
1. Click expense to view details
2. See complete breakdown
3. View uploaded bills (if any)
4. Verify calculations
5. Check tour plan alignment
6. Approve or Reject with remarks

**Manager Expense Rates (Different from MR):**
- **DA Solo:** ₹200 (manager touring alone)
- **DA Joint:** ₹500 (manager with MR on joint visit)
- **Hotel Limit:** ₹700 (higher than MR)
- Same TA calculation: Distance × ₹2.5, max ₹500

**Approval Actions:**
- ✅ Approve: Status changes to "Approved"
- ❌ Reject: Requires rejection remarks
- 💬 Request Changes: Ask MR to modify

#### 4. Team Reports
**MR Activity Report:**
- Select MR from dropdown
- Date range filter (from-to dates)
- Detailed visit breakdown:
  - Date, time, doctor, specialty
  - Check-in/check-out locations
  - Distance traveled
  - POB amount per visit
  - Products sold
  - Collection amount
- Export to Excel/PDF
- Summary statistics at bottom

**Team Performance:**
- Comparative table of all MRs
- Columns: Name, Visits, POB, Collection, Outstanding, Expenses
- Sortable columns
- Visual charts (bar/line graphs)

#### 5. Manager Tasks (NEW)
- Same interface as MR tasks
- View tasks assigned to manager
- Update task status
- Add progress notes
- Complete tasks with timestamps

#### 6. Manager can also visit doctors
- Same doctor visit flow as MR
- POB entry capability
- Expense submission with higher rates
- Useful for joint visits with MRs

#### 7. Bottom Navigation (5 tabs)
```
[Dashboard] [Doctors] [Tasks] [Team] [Profile]
```

---

### 🔴 Admin Features (Desktop Interface)

#### 1. Admin Dashboard
**Overview Stats (Large Cards):**
- Total MRs (with active/inactive split)
- Total Managers
- Total Doctors in database
- Total Products in catalog

**Financial Summary:**
- Total POB (all-time)
- Total Collection
- Outstanding amount (POB - Collection)
- Pending expenses value
- Approved expenses (this month)

**Recent Activities Table:**
- Last 20 visits across all MRs
- MR name, doctor, POB, timestamp
- Real-time updates

**Charts & Analytics:**
- POB trend (last 30 days) - Line chart
- Top 5 performing MRs - Bar chart
- Expense breakdown - Pie chart
- Visit frequency by day - Area chart

#### 2. Staff Management
**Create New Users:**
- Role selection (MR/Manager)
- Full name
- Username (unique, lowercase)
- Password (auto-generated or custom)
- Manager linking (for MRs only)
- Activation status toggle

**User Management Table:**
- Search by name/username
- Filter by role and status
- Columns: Name, Username, Role, Manager (for MRs), Status, Actions
- Actions:
  - ✏️ Edit (change name, password, manager)
  - 🔄 Toggle Active/Inactive
  - 🗑️ Delete (with confirmation)
  - 📊 View Performance

**User Details Modal:**
- Complete profile information
- Visit statistics
- Expense history
- Performance graph
- Reset password option
- Change manager assignment

#### 3. Task Management (NEW FEATURE)
**Task Assignment:**
- Click "Assign New Task" button
- Form fields:
  - Task title (required)
  - Detailed description (required)
  - Assign to: Dropdown with all MRs and Managers
  - Priority: Low/Medium/High/Urgent
  - Due date (calendar picker)
  - Target amount (optional, for sales targets)
  - Related doctor (optional link)

**Task List View:**
- Search tasks by title or assignee
- Filter by:
  - Status (All/Pending/In Progress/Completed/Cancelled)
  - Priority (All/Low/Medium/High/Urgent)
  - Assignee type (All/MR/Manager)
- Table columns:
  - Task title & description
  - Assigned to (name & role)
  - Priority (colored badge)
  - Due date (with overdue indicator)
  - Status (colored badge)
  - Actions (Edit/Delete)

**Task Details:**
- Full task information
- Assignment history
- Status change log
- Notes from assignee
- Completion timestamp
- Progress tracking

**Task Statistics Cards:**
- Total tasks created
- Pending tasks
- In Progress tasks
- Completed tasks
- Overdue tasks (red alert)

**Edit Task:**
- Modify title, description, priority
- Change due date
- Reassign to different user
- Update target amount

**Task Notifications:**
- MR/Manager sees new task immediately
- Overdue tasks highlighted in red
- Auto-sort by: Overdue → Priority → Due Date

#### 4. Data Management
**Doctor Management:**
- Add New Doctor form:
  - Doctor name
  - Specialty (dropdown)
  - Clinic/Hospital name
  - Phone number
  - Address
  - Assign to MR (dropdown)
  - GPS location (optional)
- Doctor list table:
  - Search by name/specialty
  - Filter by assigned MR
  - Edit doctor details
  - Reassign to different MR
  - Delete doctor (with confirmation)
  - Bulk import from Excel
  - Export to Excel

**Product Management:**
- Add Product form:
  - Product name
  - Product code/SKU
  - Category
  - Price per unit
  - Description
  - Active/Inactive status
- Product list with search
- Edit/delete products
- Link products to stockists

**Stockist Management:**
- Add Stockist form:
  - Stockist/Distributor name
  - Contact person
  - Phone and email
  - Address
  - Products handled (multi-select)
  - Credit limit
  - Outstanding balance
- Stockist list table
- Search and filter
- Outstanding payment tracking

#### 5. Reports & Analytics
**Comprehensive Reports:**
1. **MR Performance Report:**
   - Select MR or "All MRs"
   - Date range filter
   - Metrics: Visits, POB, Collection, Expenses
   - Export to Excel/PDF

2. **Expense Report:**
   - All expenses with filters
   - Approval status breakdown
   - Manager-wise approval rate
   - Expense type analysis

3. **Doctor Coverage Report:**
   - Doctors visited vs not visited
   - Visit frequency per doctor
   - Dormant doctors (not visited in 30 days)

4. **Product Performance:**
   - Product-wise POB
   - Top selling products
   - Product category analysis

5. **Outstanding Report:**
   - Doctor-wise outstanding
   - Stockist-wise outstanding
   - Aging analysis

**Chart Visualizations:**
- Recharts library integration
- Interactive tooltips
- Downloadable as images
- Responsive design

#### 6. Settings Page
**App Configuration:**
- **MR Expense Rates:**
  - DA Local (< 30 KM): ₹100 (editable)
  - DA Outstation (≥ 30 KM): ₹100 (editable)
  - TA per KM: ₹2.5 (editable)
  - Hotel limit: ₹500 (editable)
  - Outstation TA cap: ₹500 (editable)

- **Manager Expense Rates:**
  - DA Solo: ₹200 (editable)
  - DA Joint (with MR): ₹500 (editable)
  - Hotel limit: ₹700 (editable)

- **General Settings:**
  - Outstation distance threshold: 30 KM (editable)
  - Expense entry start time: 20:00 (8 PM) (editable)
  - Minimum GPS accuracy: 50 meters (editable)
  - Company name: "Megapro Innovation" (editable)

- **Branding:**
  - Upload company logo
  - Logo appears on login screen and headers
  - Recommended size: 200x80 px

**Save Settings:**
- Validation before save
- Confirmation dialog
- Real-time updates across all user types

#### 7. Database Management
**Cleanup Tools:**
- Clear old visits (older than X days)
- Remove inactive doctors
- Archive old expenses
- Reset demo data
- Backup current data (download JSON)

**Data Export:**
- Export all data to Excel
- Separate sheets for: Users, Doctors, Visits, Expenses, Products, Stockists
- Date range filters
- Scheduled exports (daily/weekly)

**Import Tools:**
- Bulk upload doctors from Excel
- Product catalog import
- Stockist list import
- Template downloads for each entity

#### 8. Sidebar Navigation
```
📊 Dashboard
✅ Task Management
👥 Staff Management
📁 Data Management
🗑️ Database Cleanup
📈 Reports
⚙️ Settings
🚪 Logout
```

---

## 🔧 Technical Architecture

### Frontend Stack
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4.0
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **State:** React useState & useEffect hooks
- **Storage:** localStorage (client-side persistence)

### Data Storage Structure

**localStorage Keys:**
```javascript
megapro_users          // User accounts (MR, Manager, Admin)
megapro_doctors        // Doctor database
megapro_visits         // All visit records
megapro_expenses       // Expense submissions
megapro_tour_plans     // Tour planning data
megapro_products       // Product catalog
megapro_outstanding    // Outstanding payments
megapro_settings       // App configuration
megapro_active_visits  // Currently active visits
megapro_tasks          // Task assignments (NEW)
```

### Data Models (TypeScript Interfaces)

```typescript
// User
interface User {
  userId: string;           // Unique ID
  name: string;            // Full name
  username: string;        // Login username
  passwordHash: string;    // Hashed password
  role: 'mr' | 'manager' | 'admin';
  linkedManagerId?: string; // For MRs only
  isActive: boolean;
  createdAt: number;
}

// Doctor
interface Doctor {
  doctorId: string;
  name: string;
  specialty: string;
  clinic?: string;
  location?: GeoLocation;
  assignedMrId: string;
  assignedMRName?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

// Visit
interface Visit {
  visitId: string;
  mrId: string;
  mrName: string;
  doctorId: string;
  doctorName: string;
  checkInTimestamp: number;
  checkInLocation: GeoLocation;
  checkOutTimestamp?: number;
  checkOutLocation?: GeoLocation;
  pobAmount: number;
  collectionAmount: number;
  giftDistributed: boolean;
  visitNotes?: string;
  productDetails: ProductEntry[];
  distanceTraveled?: number;
}

// ProductEntry (during visit)
interface ProductEntry {
  productId: string;
  productName: string;
  quantity: number;
  ratePerUnit: number;
  stockistId: string;
  stockistName: string;
  totalAmount: number;
}

// Expense
interface Expense {
  expenseId: string;
  userId: string;
  userName: string;
  userRole: 'mr' | 'manager';
  date: number;
  daAmount: number;
  taAmount: number;
  hotelAmount: number;
  otherAmount: number;
  totalExpense: number;
  distance: number;
  isOutstation: boolean;
  billImages?: string[];
  remarks?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  reviewedBy?: string;
  reviewedAt?: number;
  reviewRemarks?: string;
}

// Tour Plan
interface TourPlan {
  planId: string;
  mrId: string;
  mrName: string;
  date: number;
  headquarters: string;
  area: string;
  plannedDoctors: string[];
  expectedDistance: number;
  tourType: 'local' | 'outstation';
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: number;
}

// Product
interface Product {
  productId: string;
  productName: string;
  productCode: string;
  category: string;
  pricePerUnit: number;
  description?: string;
  isActive: boolean;
}

// Stockist
interface Stockist {
  stockistId: string;
  stockistName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  productsHandled: string[];
  creditLimit: number;
  outstandingBalance: number;
  isActive: boolean;
}

// Task (NEW)
interface Task {
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;        // userId
  assignedToName: string;
  assignedToRole: 'mr' | 'manager';
  assignedBy: string;        // userId (admin)
  assignedByName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: number;           // timestamp
  createdAt: number;
  completedAt?: number;
  notes?: string;
  relatedDoctorId?: string;
  targetAmount?: number;
}

// GeoLocation
interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: number;
  accuracy?: number;
}
```

### Business Logic Calculations

#### Expense Calculation Algorithm
```javascript
function calculateExpense(distance, userRole, isJointVisit) {
  const settings = getSettings();
  let da = 0;
  let ta = 0;
  
  // Determine if outstation
  const isOutstation = distance >= settings.outstation_distance_threshold;
  
  if (userRole === 'mr') {
    // MR DA Calculation
    da = isOutstation ? settings.mr_da_outstation : settings.mr_da_local;
    
    // MR TA Calculation
    if (isOutstation) {
      ta = Math.min(distance * settings.ta_per_km, settings.outstation_ta_cap);
    } else {
      ta = 0; // No TA for local
    }
  } else if (userRole === 'manager') {
    // Manager DA Calculation
    if (isJointVisit) {
      da = settings.manager_da_joint; // ₹500 for joint visit
    } else {
      da = settings.manager_da_solo;  // ₹200 for solo
    }
    
    // Manager TA Calculation (same as MR)
    if (isOutstation) {
      ta = Math.min(distance * settings.ta_per_km, settings.outstation_ta_cap);
    } else {
      ta = 0;
    }
  }
  
  return { da, ta, isOutstation };
}

// Example:
// MR, 45 KM travel
// DA = ₹100 (outstation)
// TA = min(45 × 2.5, 500) = min(112.5, 500) = ₹112.5
// Total (without hotel) = ₹212.5

// Manager Joint Visit, 45 KM
// DA = ₹500 (joint)
// TA = ₹112.5
// Total = ₹612.5
```

#### GPS Validation Logic
```javascript
function validateVisitLocation(checkIn, checkOut) {
  // Calculate distance between check-in and check-out
  const distance = calculateGPSDistance(checkIn, checkOut);
  
  // Minimum 10 meters movement required
  if (distance < 10) {
    return {
      valid: false,
      error: "Check-out location too close to check-in. Please move at least 10 meters."
    };
  }
  
  // Check GPS accuracy
  if (checkIn.accuracy > 50 || checkOut.accuracy > 50) {
    return {
      valid: false,
      error: "GPS accuracy too low. Please ensure good GPS signal."
    };
  }
  
  // Check for mock locations (spoofing detection)
  if (checkIn.isMock || checkOut.isMock) {
    return {
      valid: false,
      error: "Mock location detected. Please disable mock location in developer settings."
    };
  }
  
  return { valid: true };
}
```

#### POB Calculation with Products
```javascript
function calculateVisitPOB(productEntries) {
  let totalPOB = 0;
  
  productEntries.forEach(entry => {
    const itemTotal = entry.quantity * entry.ratePerUnit;
    entry.totalAmount = itemTotal;
    totalPOB += itemTotal;
  });
  
  return totalPOB;
}

// Example:
// Product A: 10 units × ₹500 = ₹5,000
// Product B: 5 units × ₹800 = ₹4,000
// Total POB = ₹9,000
```

---

## 🔐 Authentication & Security

### Login Flow
1. User enters username and password
2. System checks against `megapro_users` in localStorage
3. Password validation (simple hash check)
4. On success:
   - Store current user in `megapro_current_user`
   - Redirect to role-specific app (MRApp/ManagerApp/AdminApp)
5. On failure: Show error message

### Default Accounts
```
Admin:
Username: admin
Password: admin123

Manager:
Username: manager1
Password: manager123

MR:
Username: mr1
Password: mr123
```

### Session Management
- Current user stored in localStorage
- Auto-logout on browser close (optional)
- Manual logout clears current user
- No session timeout (persistent)

---

## 📱 User Flow Diagrams

### MR Daily Workflow
```
1. Login → Dashboard
2. View assigned tasks → Update task status
3. Check tour plan for today
4. Navigate to Doctors tab
5. Select first doctor → Check-In
6. GPS captured → Visit starts
7. Enter product-wise POB
   - Select Product A
   - Enter quantity
   - Select stockist
   - Add Product B, C...
8. Enter collection amount
9. Add visit notes
10. Check-Out → GPS captured
11. Visit saved
12. Repeat steps 5-11 for other doctors
13. After 8 PM: Navigate to Expenses
14. Submit daily expenses (DA/TA auto-calculated)
15. Upload hotel bill if outstation
16. Submit for manager approval
17. Check task progress and update
18. Logout
```

### Manager Daily Workflow
```
1. Login → Dashboard
2. View team live locations on map
3. Check pending tasks → Update status
4. Monitor active MR visits in real-time
5. Navigate to Team tab
6. Review team performance
7. Navigate to Approvals
8. Review pending expense:
   - Check DA/TA calculations
   - Verify hotel bill
   - Check tour plan alignment
9. Approve or reject with remarks
10. Navigate to Reports
11. Generate MR activity report
12. Export to Excel
13. Update own tasks if any assigned
14. If joint visit: Use Doctors tab to track visit
15. Submit manager expenses (higher rates)
16. Logout
```

### Admin Daily Workflow
```
1. Login → Admin Dashboard
2. View overall statistics and charts
3. Navigate to Task Management
4. Create new tasks:
   - Assign to specific MR: "Complete 10 doctor visits this week"
   - Set priority: High
   - Set due date: End of week
   - Set target: ₹50,000 POB
5. Monitor existing tasks (overdue, completed)
6. Navigate to Staff Management
7. Create new MR account:
   - Name: Rajesh Kumar
   - Username: rajesh.k
   - Link to Manager: manager1
8. Navigate to Data Management
9. Add new doctor:
   - Dr. Sharma
   - Specialty: Cardiologist
   - Assign to: mr1
10. Add new product to catalog
11. Navigate to Reports
12. Generate comprehensive MR performance report
13. Check outstanding payments
14. Navigate to Settings
15. Update DA rate for MRs (if needed)
16. Upload new company logo
17. Navigate to Database Management
18. Export all data to Excel (backup)
19. Logout
```

---

## 🎯 Key Features Deep Dive

### 1. Task Management System (Complete Flow)

#### Admin Side:
**Creating a Task:**
```
Admin clicks "Assign New Task"
↓
Form opens with fields:
  - Title: "Achieve ₹1,00,000 POB this month"
  - Description: "Focus on cardiologists and diabetologists. Target 20 doctors."
  - Assign to: [Dropdown] → Select "Rajesh Kumar (MR)"
  - Priority: [Dropdown] → Select "High"
  - Due Date: [Calendar] → Select "31-Oct-2024"
  - Target Amount: 100000
↓
Admin clicks "Assign Task"
↓
Task saved to database with:
  - taskId: "task_1698745623_abc123"
  - assignedBy: admin userId
  - assignedByName: "Admin"
  - status: "pending"
  - createdAt: current timestamp
↓
Task appears in admin's task list
Task automatically visible to MR Rajesh Kumar
```

**Admin Task List View:**
- Search bar: Search by title or assignee name
- Filters:
  - Status: All/Pending/In Progress/Completed/Cancelled
  - Priority: All/Low/Medium/High/Urgent
- Table with columns:
  - Task (title + description preview)
  - Assigned To (name + role badge)
  - Priority (colored badge with flag icon)
  - Due Date (calendar icon + date + overdue indicator)
  - Status (colored badge with icon)
  - Actions (Edit pencil + Delete trash icons)
- Click Edit to modify task
- Click Delete to remove (with confirmation)

**Task Statistics (Top Cards):**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Total     │  Pending    │ In Progress │  Completed  │
│     45      │     12      │      8      │     25      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### MR/Manager Side:
**Viewing Tasks:**
```
MR logs in → Navigates to Tasks tab
↓
Sees list of assigned tasks sorted by:
  1. Overdue (red border, shown first)
  2. Priority (urgent → high → medium → low)
  3. Due date (earliest first)
↓
Task card shows:
  ┌──────────────────────────────────┐
  │ 🚩 High Priority                 │
  │ Achieve ₹1,00,000 POB this month│
  │                                  │
  │ Focus on cardiologists and       │
  │ diabetologists. Target 20 doctors│
  │                                  │
  │ 📅 Due: 31 Oct 2024              │
  │ 💰 Target: ₹1,00,000             │
  │ ⏱️  5 days remaining             │
  │                                  │
  │ Status: [Pending]                │
  └──────────────────────────────────┘
↓
MR taps on task card
↓
Task details dialog opens
```

**Task Details Dialog:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Achieve ₹1,00,000 POB this month
  Assigned by Admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Description:
Focus on cardiologists and diabetologists.
Target 20 doctors in metro area.

Priority: [🚨 High]
Due Date: 📅 31 Oct 2024 (5 days remaining)
Target: ₹1,00,000

Current Status: [⏱️ Pending]

Notes (Optional):
┌────────────────────────────────┐
│ Started working on this task.  │
│ Visited 5 doctors so far.      │
│ POB achieved: ₹25,000          │
└────────────────────────────────┘

[Start Working Button]  [Cancel]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Task Status Workflow:**
```
Pending (Yellow)
    ↓ [Click "Start Working"]
In Progress (Blue)
    ↓ [Click "Mark as Completed"]
Completed (Green) ✓
```

**Task Stats Bar (Top of MR Tasks screen):**
```
┌──────┬─────────┬────────┬─────────┐
│Total │ Pending │ Active │ Overdue │
│  12  │    3    │   4    │    2    │
└──────┴─────────┴────────┴─────────┘
```

**Overdue Task Indicator:**
- Red left border on task card
- Red clock icon
- Text: "2 days overdue" (in red)
- Auto-sorted to top of list

#### Task Priority Colors:
```
Urgent:  🔴 Red background (bg-red-100, text-red-800)
High:    🟠 Orange (bg-orange-100, text-orange-800)
Medium:  🟡 Yellow (bg-yellow-100, text-yellow-800)
Low:     🟢 Green (bg-green-100, text-green-800)
```

#### Task Status Colors:
```
Pending:     🟡 Yellow (bg-yellow-100, text-yellow-800)
In Progress: 🔵 Blue (bg-blue-100, text-blue-800)
Completed:   🟢 Green (bg-green-100, text-green-800)
Cancelled:   ⚪ Gray (bg-gray-100, text-gray-800)
```

### 2. Real-Time GPS Tracking

**How it works:**
1. MR enables location services on phone
2. On check-in: Browser requests GPS coordinates
3. System captures:
   - Latitude
   - Longitude
   - Accuracy (in meters)
   - Timestamp
   - Address (reverse geocoding)
4. During visit: Location periodically updated
5. On check-out: New GPS coordinates captured
6. System calculates:
   - Distance between check-in and check-out
   - Visit duration
   - Route validation

**Manager Live View:**
- Map component (using Leaflet or Google Maps)
- MR markers with names
- Active visit shown with pulsing marker
- Click marker to see:
  - MR name
  - Current doctor (if in visit)
  - Last update time
  - Today's stats

### 3. Product-Wise POB Entry

**Process:**
```
During Visit:
MR selects "Add Product"
↓
Product dropdown appears (from admin catalog)
↓
MR selects: "Medicine A"
↓
Enter quantity: 50 (units/boxes)
↓
Stockist dropdown appears (only stockists handling Medicine A)
↓
MR selects: "ABC Distributors"
↓
Enter rate: ₹250 per unit
↓
System calculates: 50 × ₹250 = ₹12,500
↓
Display total in card
↓
MR can add more products
↓
Final POB = Sum of all products
```

**POB Summary Display:**
```
┌────────────────────────────────────┐
│ Product-wise POB Details           │
├────────────────────────────────────┤
│ Medicine A                         │
│ Qty: 50 | Rate: ₹250 | ABC Distr. │
│ Total: ₹12,500                     │
├────────────────────────────────────┤
│ Medicine B                         │
│ Qty: 30 | Rate: ₹400 | XYZ Distr. │
│ Total: ₹12,000                     │
├────────────────────────────────────┤
│ Grand Total POB: ₹24,500           │
└────────────────────────────────────┘
```

### 4. Expense Auto-Calculation

**Step-by-step:**
```
MR opens Expense Form (after 8 PM)
↓
Selects date: 23-Oct-2024
↓
System checks tour plan for that date
↓
Tour plan shows: "Outstation - 45 KM planned"
↓
System auto-fills:
  - Distance: 45 KM
  - Tour Type: Outstation
  - DA: ₹100 (MR outstation rate)
  - TA: min(45 × 2.5, 500) = ₹112.5
↓
MR enters:
  - Hotel amount: ₹450 (uploads bill image)
  - Other expenses: ₹200 (lunch, parking)
↓
System calculates:
  Total = ₹100 + ₹112.5 + ₹450 + ₹200 = ₹862.5
↓
MR reviews and clicks "Submit"
↓
Status: Pending
↓
Notification sent to manager
```

---

## 📊 Reports & Analytics Details

### MR Performance Report
**Columns:**
- MR Name
- Total Visits
- Total POB (₹)
- Total Collection (₹)
- Outstanding (POB - Collection)
- Total Expenses (₹)
- Pending Expenses
- Active Days (days with visits)
- Average POB per visit

**Filters:**
- Date range (from-to)
- Select specific MR or "All MRs"
- Visit status (completed/active)

**Export Options:**
- Excel (.xlsx)
- PDF report
- Print preview

### Visit Analysis Report
**Detailed breakdown:**
- Date and time of each visit
- Doctor name and specialty
- Check-in and check-out times
- Visit duration
- GPS locations (lat/lng)
- Distance traveled per visit
- POB amount per visit
- Products sold (itemized)
- Collection amount
- Visit notes

**Visualization:**
- Line chart: POB trend over time
- Bar chart: Visits per day
- Pie chart: POB by product category
- Heatmap: Visit density by area

### Expense Analysis
**Manager Approval Analysis:**
- Approval rate per manager
- Average approval time
- Rejection reasons (categorized)
- Most common expense types

**Expense Trends:**
- DA vs TA vs Hotel breakdown
- Monthly expense comparison
- Outstation vs local expense ratio
- Expense per MR per day average

---

## 🔔 Notifications & Alerts

### Admin Notifications:
- New user registration (if self-signup enabled)
- High-value POB (> threshold)
- Expense anomalies
- Overdue tasks report

### Manager Notifications:
- Pending expense approvals (count badge)
- MR offline for > 2 days
- Unusual expense patterns
- Tasks nearing deadline

### MR Notifications:
- Expense approved/rejected
- New doctor assigned
- New task assigned
- Task deadline approaching (2 days before)
- Expense entry reminder (8 PM)

---

## 🎨 Mobile UI Components

### Bottom Navigation (Mobile)
```
┌────────────────────────────────────┐
│                                    │
│         [Screen Content]           │
│                                    │
└────────────────────────────────────┘
┌────┬────┬────┬────┬────┐
│ 🏠 │ 👥 │ ✅ │ 💰 │ 👤 │
│Home│Docs│Task│Exp.│Prof│
└────┴────┴────┴────┴────┘
```

### Card Layouts
```
┌──────────────────────────────────┐
│ 📊 Visits Today                  │
│ ───────────────────────────────  │
│              15                  │
│ +3 from yesterday               │
└──────────────────────────────────┘
```

### Gradient Headers
```
╔════════════════════════════════╗
║ 🌅 Gradient Background         ║
║                                ║
║ Welcome, Rajesh Kumar          ║
║ Medical Representative         ║
╚════════════════════════════════╝
```

---

## 🖥️ Desktop Admin UI

### Sidebar Navigation
```
╔════════════════════════╗
║  MEGAPRO INNOVATION    ║
╠════════════════════════╣
║ 📊 Dashboard           ║
║ ✅ Task Management ⭐  ║
║ 👥 Staff Management    ║
║ 📁 Data Management     ║
║ 🗑️  Database Cleanup   ║
║ 📈 Reports             ║
║ ⚙️  Settings           ║
║                        ║
║ ─────────────────────  ║
║ 🚪 Logout              ║
╚════════════════════════╝
```

### Data Tables
```
┌────────────────────────────────────────────────────┐
│ Search: [________] [Filter ▼] [Export ▼] [+New]   │
├────────────────────────────────────────────────────┤
│ Name          │ Role    │ Status  │ Actions       │
├───────────────┼─────────┼─────────┼───────────────┤
│ Rajesh Kumar  │ MR      │ Active  │ ✏️ 🗑️ 📊     │
│ Priya Sharma  │ Manager │ Active  │ ✏️ 🗑️ 📊     │
│ Amit Patel    │ MR      │ Inactive│ ✏️ 🗑️ 📊     │
└───────────────┴─────────┴─────────┴───────────────┘
```

---

## 🚀 Future Enhancements (Roadmap)

1. **Backend Integration:**
   - Migrate from localStorage to Supabase
   - Real-time sync across devices
   - Offline mode with sync

2. **Advanced Features:**
   - Push notifications (FCM)
   - Voice notes during visits
   - Signature capture (doctor acknowledgment)
   - QR code scanning for products
   - Invoice generation

3. **AI/ML Features:**
   - Route optimization for MRs
   - Best time to visit prediction
   - Expense anomaly detection
   - POB forecasting

4. **Mobile App:**
   - Native Android app (React Native)
   - iOS app
   - Offline functionality
   - Camera integration

5. **Integrations:**
   - WhatsApp notifications
   - Email reports
   - SMS alerts
   - ERP system integration

---

## 📝 Complete Prompt for AI App Designer

**Use this exact prompt to recreate the entire app:**

```
Create a complete Sales Force Automation (SFA) web application called "Megapro Innovation" with three user roles:

1. MR (Medical Representative) - Mobile-first interface
2. Manager - Mobile-first interface
3. Admin - Desktop web interface

COLOR PALETTE:
- Primary: #2563EB (blue)
- Success: #10B981 (green)
- Background: #F9FAFB
- Text: #1F2937
- Use Shadcn/ui components and Lucide icons

MR FEATURES:
- Dashboard with today's stats (visits, POB, collection)
- Doctor visit tracking with GPS check-in/check-out
- Product-wise POB entry linked to stockists
- Expense management (DA/TA/Hotel auto-calculation)
- Tour planning calendar
- Task management (view and update assigned tasks)
- Bottom navigation: Home, Doctors, Tasks, Expenses, Profile

MR EXPENSE RULES:
- DA Local (< 30 KM): ₹100
- DA Outstation (≥ 30 KM): ₹100
- TA Local: ₹0
- TA Outstation: Distance × ₹2.5, max ₹500
- Hotel limit: ₹500 (outstation only)
- Entry allowed only after 8 PM

MANAGER FEATURES:
- Team dashboard with live MR locations
- Expense approval workflow
- Team performance monitoring
- MR activity reports with export
- Can also visit doctors (same as MR)
- Task management (view and update assigned tasks)
- Bottom navigation: Dashboard, Doctors, Tasks, Team, Profile

MANAGER EXPENSE RATES:
- DA Solo: ₹200
- DA Joint (with MR): ₹500
- Hotel limit: ₹700
- Same TA calculation as MR

ADMIN FEATURES:
- Desktop interface with sidebar navigation
- Dashboard with overall statistics and charts
- Task Management:
  * Assign tasks to MRs and Managers
  * Task fields: Title, Description, Assignee, Priority (Low/Medium/High/Urgent), Due Date, Target Amount
  * Track task status: Pending → In Progress → Completed
  * View overdue tasks with red alerts
  * Edit/delete tasks
  * Statistics: Total, Pending, In Progress, Completed tasks
- Staff management (create MR/Manager accounts)
- Doctor database management (assign to MRs)
- Product catalog management
- Stockist management
- Comprehensive reports (MR performance, expenses, visits)
- Settings page (configure DA/TA rates, hotel limits, company logo)
- Database cleanup tools
- Navigation: Dashboard, Task Management, Staff, Data, Database, Reports, Settings

TASK SYSTEM:
- Admin creates and assigns tasks to specific MR or Manager
- Task has: Title, Description, Priority (with colored badges), Due Date, Target Amount (optional)
- MR/Manager sees tasks in dedicated Tasks tab
- Can update status: Pending → In Progress → Completed
- Add notes to tasks
- Overdue tasks highlighted in red with border
- Task stats: Total, Pending, In Progress, Overdue
- Sort by: Overdue first, then priority, then due date

DATA STORAGE:
- Use localStorage with keys: megapro_users, megapro_doctors, megapro_visits, megapro_expenses, megapro_tour_plans, megapro_products, megapro_tasks
- TypeScript interfaces for all data models

GPS TRACKING:
- Capture GPS on check-in and check-out
- Validate minimum 10 meters distance
- Check GPS accuracy < 50 meters
- Mock location detection

PRODUCT-WISE POB:
- During visit, add multiple products
- Each product: Name, Quantity, Stockist, Rate
- Auto-calculate total per product
- Grand total POB = sum of all products

DEFAULT USERS:
- admin/admin123 (Admin)
- manager1/manager123 (Manager)
- mr1/mr123 (MR)

TECHNICAL STACK:
- React + TypeScript
- Tailwind CSS v4.0
- Shadcn/ui components
- Lucide icons for all icons
- Recharts for charts and graphs
- Mobile-first responsive design (MR/Manager)
- Desktop-optimized (Admin)

Build a production-ready application with complete functionality, proper validation, beautiful UI, and smooth user experience. Include task management system where admin can assign tasks to MRs and Managers with priority levels, due dates, and target amounts. MRs and Managers should be able to view their tasks, update status, and add notes. Use 5-tab bottom navigation for MR and Manager (including Tasks tab).
```

---

## 📱 Screen-by-Screen Breakdown

### MR SCREENS:

**1. MR Dashboard** (`/components/mr/MRDashboard.tsx`)
- Gradient header with greeting
- 4 stat cards: Visits, POB, Collection, Pending Expenses
- Quick action buttons grid
- Recent activities list
- Pending tasks preview (top 3)

**2. Doctor List** (`/components/mr/DoctorList.tsx`)
- Search bar
- Filter by specialty
- Doctor cards with:
  - Name, specialty, clinic
  - Last visit date
  - "Start Visit" button
- Pull to refresh

**3. Active Visit** (`/components/mr/ActiveVisit.tsx`)
- Active visit banner (sticky top)
- Doctor details
- Timer (visit duration)
- Product entry section:
  - Add product button
  - Product list with remove option
- Collection amount input
- Gift checkbox
- Visit notes
- Check-out button

**4. Expense Form** (`/components/mr/ExpenseForm.tsx`)
- Date picker
- Auto-filled DA/TA based on tour plan
- Hotel amount input (if outstation)
- Image upload for bill
- Other expenses section
- Total calculation display
- Submit button
- Expense history list below

**5. Tour Plan** (`/components/mr/TourPlan.tsx`)
- Monthly calendar view
- Add tour plan button
- Tour plan form:
  - Date selection
  - HQ selection
  - Area input
  - Planned doctors multi-select
  - Expected distance
- Plan list with edit/delete

**6. My Tasks** (`/components/mr/MyTasks.tsx`)
- Gradient header with "My Tasks"
- Task stats cards (Total, Pending, Active, Overdue)
- Task list sorted by overdue → priority → due date
- Task cards with:
  - Title and description
  - Priority badge (colored)
  - Due date with countdown
  - Status badge
  - Target amount (if applicable)
  - Overdue indicator (red border + text)
- Click task to open details dialog
- Task details dialog:
  - Full description
  - Assigned by name
  - Priority and due date
  - Current status
  - Notes textarea
  - Action buttons:
    * "Start Working" (if pending)
    * "Mark as Completed" (if in progress)

**7. Profile** (`/components/common/Profile.tsx`)
- User avatar
- Name and role
- Username display
- Change password option
- App version
- Logout button

### MANAGER SCREENS:

**1. Manager Dashboard** (`/components/manager/ManagerDashboard.tsx`)
- Gradient header
- Team stats cards
- Live location map
- Recent team activities
- Pending approvals count
- Quick actions

**2. Team Management** (`/components/manager/TeamManagement.tsx`)
- MR list with search
- MR cards showing:
  - Name, status (active/offline)
  - Today's stats
  - Last visit time
  - Location
- Click to view detailed MR report

**3. Approvals** (`/components/manager/Approvals.tsx`)
- Pending expense list
- Expense detail view:
  - MR name, date
  - DA/TA/Hotel/Other breakdown
  - Uploaded bills
  - Total amount
- Approve/Reject buttons
- Remarks textarea

**4. Reports** (`/components/manager/Reports.tsx`)
- MR selection dropdown
- Date range picker
- Generate report button
- Report table with all visit details
- Export to Excel button

**5. Manager Tasks** (`/components/manager/ManagerTasks.tsx`)
- Same as MR Tasks but with purple gradient header
- Task list with all assigned tasks
- Task detail dialog with update options
- Task stats

**6. DoctorList & ExpenseForm**
- Same as MR (managers can also visit doctors)

### ADMIN SCREENS:

**1. Admin Dashboard** (`/components/admin/AdminDashboard.tsx`)
- Sidebar navigation
- Large stat cards grid
- Financial summary cards
- POB trend chart (Recharts line chart)
- Top performers bar chart
- Expense breakdown pie chart
- Recent activities table

**2. Task Management** (`/components/admin/TaskManagement.tsx`)
- Header with "Task Management" title
- "Assign New Task" button (opens dialog)
- Search and filter bar:
  - Search by title/assignee
  - Filter by status dropdown
  - Filter by priority dropdown
- Task statistics cards:
  - Total Tasks
  - Pending (yellow)
  - In Progress (blue)
  - Completed (green)
- Tasks table with columns:
  - Task (title + description preview + target amount)
  - Assigned To (name + role badge)
  - Priority (colored badge with flag icon)
  - Due Date (with overdue indicator)
  - Status (colored badge)
  - Actions (Edit + Delete buttons)
- Assign Task Dialog:
  - Title input (required)
  - Description textarea (required)
  - Assign To dropdown with optgroups:
    * Medical Representatives (all MRs)
    * Managers (all managers)
  - Priority select (Low/Medium/High/Urgent)
  - Due Date picker (min: today)
  - Target Amount input (optional, for POB targets)
  - Assign/Cancel buttons
- Edit Task: Same dialog with pre-filled values
- Delete with confirmation dialog

**3. Staff Management** (`/components/admin/StaffManagement.tsx`)
- Create user button
- User table:
  - Name, Username, Role, Manager, Status
  - Search and filter
  - Edit/Delete/View actions
- Create user dialog:
  - Role radio buttons
  - Name, username, password inputs
  - Manager selection (for MRs)
  - Active toggle

**4. Data Management** (`/components/admin/DataManagement.tsx`)
- Tabs: Doctors, Products, Stockists
- Each tab has:
  - Add new button
  - Search bar
  - Data table
  - Edit/Delete actions
- Doctor form: Name, Specialty, Clinic, Phone, Address, Assign to MR
- Product form: Name, Code, Category, Price, Description
- Stockist form: Name, Contact, Phone, Address, Products, Credit Limit

**5. Database Management** (`/components/admin/DatabaseManagement.tsx`)
- Data cleanup section
- Export all data button
- Backup database button
- Clear old data with date filter
- Import data from Excel

**6. Reports** (`/components/admin/AdminReports.tsx`)
- Report type selector
- Date range picker
- MR selector (for MR-specific reports)
- Generate button
- Report display area with tables and charts
- Export to Excel/PDF buttons

**7. Settings** (`/components/admin/SettingsPage.tsx`)
- MR Rates section:
  - DA Local input
  - DA Outstation input
  - TA per KM input
  - Hotel limit input
- Manager Rates section:
  - DA Solo input
  - DA Joint input
  - Hotel limit input
- General Settings:
  - Outstation threshold (KM)
  - Expense entry time
- Branding:
  - Company name input
  - Logo upload
- Save Settings button

---

## 🎯 Business Rules Summary

1. **Expenses can only be entered after 8 PM**
2. **Outstation is determined by distance ≥ 30 KM**
3. **Local visits (< 30 KM) get DA only, no TA**
4. **Outstation visits get DA + TA (distance × ₹2.5, max ₹500)**
5. **Hotel allowed only for outstation, max ₹500 for MR, ₹700 for Manager**
6. **Manager gets ₹500 DA for joint visits with MR**
7. **GPS check-in and check-out must be at least 10 meters apart**
8. **Tasks are sorted by: Overdue → Priority → Due Date**
9. **Overdue tasks have red left border and shown first**
10. **Tasks can be assigned with optional target amounts for POB goals**
11. **MRs can only see doctors assigned to them**
12. **Managers can see all MRs linked to them**
13. **Admin has full access to all data**
14. **Visit POB is sum of all product entries**
15. **Collection cannot exceed POB**
16. **Outstanding = POB - Collection**

---

## 🔑 Key localStorage Data Structure

```javascript
// Current User Session
megapro_current_user: {
  userId: "user_123",
  role: "mr"
}

// Users Array
megapro_users: [
  {
    userId: "user_admin_001",
    name: "Admin",
    username: "admin",
    passwordHash: "hashed_password",
    role: "admin",
    isActive: true,
    createdAt: 1698745623000
  },
  // ... more users
]

// Tasks Array
megapro_tasks: [
  {
    taskId: "task_1698745623_abc123",
    title: "Achieve ₹1,00,000 POB this month",
    description: "Focus on cardiologists. Target 20 doctors.",
    assignedTo: "user_mr_001",
    assignedToName: "Rajesh Kumar",
    assignedToRole: "mr",
    assignedBy: "user_admin_001",
    assignedByName: "Admin",
    priority: "high",
    status: "in-progress",
    dueDate: 1698796800000,
    createdAt: 1698745623000,
    targetAmount: 100000,
    notes: "Visited 5 doctors. POB: ₹25,000"
  },
  // ... more tasks
]

// Settings Object
megapro_settings: {
  mr_da_local: 100,
  mr_da_outstation: 100,
  manager_da_solo: 200,
  manager_da_joint: 500,
  ta_per_km: 2.5,
  mr_hotel_limit: 500,
  manager_hotel_limit: 700,
  outstation_ta_cap: 500,
  outstation_distance_threshold: 30,
  expense_entry_start_hour: 20,
  companyLogo: "data:image/png;base64,..."
}
```

---

## ✅ Testing Checklist

Before deployment, test:

**MR Functionality:**
- [ ] Login with MR credentials
- [ ] View dashboard stats
- [ ] View assigned tasks
- [ ] Update task status (Pending → In Progress → Completed)
- [ ] See overdue task with red indicator
- [ ] Check-in at doctor location
- [ ] Add multiple products during visit
- [ ] Check-out and verify distance calculation
- [ ] Add expense after 8 PM
- [ ] Verify DA/TA auto-calculation
- [ ] Upload hotel bill
- [ ] Submit expense
- [ ] Create tour plan
- [ ] View tour plan on calendar

**Manager Functionality:**
- [ ] Login with Manager credentials
- [ ] View team on map
- [ ] View assigned tasks
- [ ] Update task status with notes
- [ ] See MR activity in real-time
- [ ] Review pending expense
- [ ] Approve expense
- [ ] Reject expense with remarks
- [ ] Generate MR activity report
- [ ] Export report to Excel
- [ ] Perform doctor visit (as manager)
- [ ] Submit manager expense (higher rates)

**Admin Functionality:**
- [ ] Login with Admin credentials
- [ ] View overall dashboard
- [ ] Create new task with all fields
- [ ] Assign task to MR
- [ ] Assign task to Manager
- [ ] Edit existing task
- [ ] Delete task (with confirmation)
- [ ] View task statistics
- [ ] Filter tasks by status and priority
- [ ] Create MR account
- [ ] Create Manager account
- [ ] Link MR to Manager
- [ ] Add doctor to database
- [ ] Assign doctor to MR
- [ ] Add product to catalog
- [ ] Add stockist
- [ ] Link product to stockist
- [ ] Change DA/TA rates in settings
- [ ] Upload company logo
- [ ] Generate comprehensive report
- [ ] Export all data
- [ ] Database cleanup

**Cross-Role Testing:**
- [ ] Admin assigns task → MR receives → MR updates → Admin sees update
- [ ] Admin assigns task → Manager receives → Manager completes
- [ ] MR submits expense → Manager approves
- [ ] Manager creates doctor → Assigns to MR → MR sees doctor
- [ ] Admin changes rates → MR expense calculation updates

---

## 📞 Support & Maintenance

**For Future Updates:**
1. Use this document as complete specification
2. All features are modular and in separate components
3. Edit individual components without affecting others
4. Data storage is centralized in `utils/dataStorage.ts`
5. Add new features by creating new components
6. Update existing features by modifying specific component files

**Common Modifications:**
- **Add new expense type:** Update `utils/types.ts` and `utils/expenseCalculator.ts`
- **Change rates:** Admin can do via Settings page, or edit `utils/dataStorage.ts` DEFAULT_SETTINGS
- **Add new user role:** Update `UserRole` type in `utils/types.ts`, create new App component
- **Add new report:** Create new component in `components/admin/` folder
- **Modify task fields:** Update `Task` interface in `utils/types.ts` and TaskManagement component

---

## 🎨 Component File Structure

```
components/
├── AdminApp.tsx (Main admin container)
├── ManagerApp.tsx (Main manager container)
├── MRApp.tsx (Main MR container)
├── LoginScreen.tsx
├── SplashScreen.tsx
├── admin/
│   ├── AdminDashboard.tsx
│   ├── TaskManagement.tsx ⭐ NEW
│   ├── StaffManagement.tsx
│   ├── DataManagement.tsx
│   ├── DatabaseManagement.tsx
│   ├── AdminReports.tsx
│   └── SettingsPage.tsx
├── manager/
│   ├── ManagerDashboard.tsx
│   ├── ManagerTasks.tsx ⭐ NEW
│   ├── TeamManagement.tsx
│   ├── Approvals.tsx
│   ├── Reports.tsx
│   └── TeamLiveView.tsx
├── mr/
│   ├── MRDashboard.tsx
│   ├── MyTasks.tsx ⭐ NEW
│   ├── DoctorList.tsx
│   ├── ActiveVisit.tsx
│   ├── ExpenseForm.tsx
│   └── TourPlan.tsx
├── common/
│   ├── BottomNav.tsx (5 tabs for MR/Manager)
│   ├── Profile.tsx
│   └── StatsCard.tsx
└── ui/ (Shadcn components)

utils/
├── types.ts (All TypeScript interfaces including Task)
├── dataStorage.ts (localStorage CRUD + Task management)
├── authStorage.ts (Login/logout)
├── expenseCalculator.ts (DA/TA calculations)
└── gpsUtils.ts (GPS validation)
```

---

## 🚀 Deployment Instructions

See `DEPLOYMENT_GUIDE.md` for complete deployment steps.

**Quick Deploy:**
```bash
npm install
npm run build
npm run preview
```

**Production Deploy (Vercel):**
```bash
vercel --prod
```

---

## 📄 License & Credits

**Megapro Innovation SFA**
Version: 2.0.0 (with Task Management)
Created: October 2024
Last Updated: October 2024

Built with:
- React + TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide Icons
- Recharts

---

## 🎯 COMPLETE SUMMARY

This is a **production-ready Sales Force Automation application** with:
- ✅ 3 user roles with distinct interfaces
- ✅ Real-time GPS tracking
- ✅ Automated expense calculations
- ✅ Product-wise POB management
- ✅ Task assignment and tracking system ⭐
- ✅ Manager approval workflow
- ✅ Comprehensive admin controls
- ✅ Beautiful, professional UI
- ✅ Mobile-first design for field staff
- ✅ Desktop-optimized admin panel
- ✅ Complete data management
- ✅ Export and reporting features
- ✅ Fully functional with localStorage
- ✅ Ready for Supabase migration
- ✅ Deployable in 2 days

**Total Features:** 50+
**Total Screens:** 20+
**Total Components:** 30+
**Lines of Code:** 5,000+

**This document contains everything needed to recreate or modify this application using any AI app designer tool.**

---

END OF COMPLETE PROMPT DOCUMENT
