# Quick Start - Backend Integration

## 🚀 What's New

Your Onside app now has a **fully functional backend** with real database integration! No more mock data.

## ✅ What Works Now

### Employee Dashboard
- ✅ Real goals from database
- ✅ Live progress tracking
- ✅ Actual completion percentages
- ✅ Goals needing updates

### Manager Dashboard
- ✅ Real team member data
- ✅ Pending approvals from database
- ✅ Team performance metrics
- ✅ Approval queue with actual goals

### Admin Dashboard
- ✅ Organization-wide statistics
- ✅ Real user counts
- ✅ Department performance
- ✅ Audit activity logs

### Cross-Role Integration
- ✅ Employee creates goal → Manager sees it
- ✅ Manager approves goal → Employee sees status change
- ✅ Employee updates progress → Admin sees in org stats
- ✅ All changes reflect in real-time across dashboards

## 🎯 Quick Test (Local)

### 1. Seed Sample Data
```bash
npm run db:seed:goals
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Test Each Role

**Employee** (http://localhost:3000/employee/dashboard)
- Login: `employee@onside.ai` / `password123`
- See 4 sample goals with real progress
- Try creating a new goal

**Manager** (http://localhost:3000/manager/dashboard)
- Login: `manager@onside.ai` / `password123`
- See team performance
- Check approval queue

**Admin** (http://localhost:3000/admin/dashboard)
- Login: `admin@onside.ai` / `password123`
- See org-wide metrics
- Check audit logs

## 🚀 Deploy to Vercel

### 1. Commit Changes
```bash
git add .
git commit -m "feat: implement real backend with database integration"
git push origin main
```

### 2. After Deployment
Run these commands in Vercel terminal or via CLI:

```bash
# Seed sample goals
npm run db:seed:goals
```

## 📊 API Endpoints Available

- `GET /api/goals` - Fetch goals (role-based)
- `POST /api/goals` - Create goal
- `GET /api/goals/[id]` - Get specific goal
- `PATCH /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal
- `POST /api/goals/[id]/updates` - Add progress update
- `POST /api/goals/[id]/approvals` - Approve/reject goal
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/users/team` - Team members
- `GET /api/notifications` - User notifications

## 🎬 Demo Flow for Hackathon

### Scenario: Complete Goal Lifecycle

1. **Login as Employee**
   - Show dashboard with existing goals
   - Create a new goal "Launch Product Feature"
   - Submit for approval

2. **Switch to Manager**
   - Show approval queue with new goal
   - Review and approve the goal
   - Show team performance metrics

3. **Back to Employee**
   - Goal status changed to "APPROVED"
   - Add progress update (50% complete)
   - Show progress reflected

4. **Switch to Admin**
   - Show org-wide stats updated
   - New goal appears in total count
   - Audit log shows all actions

5. **Highlight Key Points**
   - "All data is real-time from database"
   - "Changes propagate across all roles"
   - "Full audit trail for compliance"
   - "Role-based access control"

## 🔧 Troubleshooting

### No goals showing?
```bash
npm run db:seed:goals
```

### Database connection error?
Check `.env` file has correct `DATABASE_URL`

### Build errors?
```bash
npm install
npx prisma generate
```

## 📝 Key Features for Judges

1. **Real Database Integration** - Not mock data
2. **Role-Based Access** - Employee, Manager, Admin
3. **Cross-Role Updates** - Changes propagate instantly
4. **Audit Logging** - Full compliance trail
5. **Secure APIs** - Authentication + authorization
6. **Type-Safe** - Full TypeScript coverage
7. **Production-Ready** - Deployed on Vercel

## 🏆 Winning Points

- ✅ **Functional over features** - Everything works!
- ✅ **Real data flow** - Not just UI mockups
- ✅ **Enterprise-ready** - Audit logs, RBAC, security
- ✅ **Scalable architecture** - Clean API design
- ✅ **Demo-ready** - Seeded with realistic data

---

**You're ready to win! 🚀**
