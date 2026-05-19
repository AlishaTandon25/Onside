# Backend Implementation - Real Data Integration

## Overview

This document describes the complete backend implementation that replaces mock data with real database connections across all dashboards (Employee, Manager, Admin).

## What Was Changed

### ✅ API Endpoints Created

#### 1. Goals API (`/api/goals`)
- **GET** `/api/goals` - Fetch goals based on user role
  - Employee: Own goals + shared goals
  - Manager: Own goals + team goals + shared goals
  - Admin: All goals
  - Query params: `status`, `includeShared`
  
- **POST** `/api/goals` - Create new goal
  - Validates required fields
  - Creates audit log
  - Returns created goal with owner info

#### 2. Individual Goal API (`/api/goals/[id]`)
- **GET** `/api/goals/[id]` - Get specific goal with full details
  - Includes updates, approvals, participants
  - Role-based access control
  
- **PATCH** `/api/goals/[id]` - Update goal
  - Only owner or admin can update
  - Prevents updates to locked goals
  - Creates audit log

- **DELETE** `/api/goals/[id]` - Delete goal
  - Only owner or admin can delete
  - Prevents deletion of locked goals
  - Creates audit log

#### 3. Goal Updates API (`/api/goals/[id]/updates`)
- **GET** `/api/goals/[id]/updates` - Get all updates for a goal
- **POST** `/api/goals/[id]/updates` - Create progress update
  - Calculates progress percentage
  - Updates goal's current value
  - Creates notification for manager
  - Creates audit log

#### 4. Goal Approvals API (`/api/goals/[id]/approvals`)
- **POST** `/api/goals/[id]/approvals` - Approve/reject goal
  - Only manager or admin can approve
  - Validates manager relationship
  - Updates goal status
  - Locks goal on approval
  - Creates notification for owner

#### 5. Dashboard Stats API (`/api/dashboard/stats`)
- **GET** `/api/dashboard/stats` - Role-specific dashboard statistics
  
  **Employee Stats:**
  - Total goals, completed, approved, draft, at-risk
  - Average progress
  - Goals needing update (>7 days)
  - Goal list with details

  **Manager Stats:**
  - Team member count
  - Total goals (own + team)
  - Pending approvals
  - At-risk goals
  - Team average completion
  - Team performance by member
  - Goals awaiting approval

  **Admin Stats:**
  - Total users
  - Total goals
  - Submission rate
  - Approval rate
  - Average completion
  - Active escalations
  - Department performance
  - Recent audit logs

#### 6. Team API (`/api/users/team`)
- **GET** `/api/users/team` - Get team members
  - Manager: Returns direct reports
  - Admin: Returns all users
  - Includes department and goals info

#### 7. Notifications API (`/api/notifications`)
- **GET** `/api/notifications` - Get user notifications
  - Query param: `unreadOnly`
  - Returns notifications + unread count
  
- **PATCH** `/api/notifications` - Mark as read
  - Can mark specific IDs or all as read

### ✅ React Hooks Created

#### 1. `useGoals` Hook
```typescript
const { goals, loading, error, refetch } = useGoals({
  status: "APPROVED",
  includeShared: true
});
```

#### 2. `useDashboardStats` Hook
```typescript
const { stats, loading, error } = useDashboardStats();
```

#### 3. `useNotifications` Hook
```typescript
const { notifications, unreadCount, loading, error, markAsRead, refetch } = useNotifications();
```

### ✅ Dashboard Pages Updated

#### Employee Dashboard (`/employee/dashboard`)
- Real KPI cards (goals created, completion %, needs update)
- Live goal list from database
- Progress bars with actual data
- Status badges (DRAFT, SUBMITTED, APPROVED, COMPLETED, etc.)
- Loading and error states

#### Manager Dashboard (`/manager/dashboard`)
- Real pending approvals count
- Team completion percentage
- At-risk goals count
- Team performance heatmap with real data
- Approval queue with actual submitted goals
- Department average (placeholder for now)

#### Admin Dashboard (`/admin/dashboard`)
- Organization-wide metrics
- Real user count
- Submission and approval rates
- Average completion across all goals
- Active escalations count
- Department performance from database
- Recent audit activity logs

## Data Flow

### How Changes Propagate Across Roles

1. **Employee creates/updates a goal:**
   ```
   Employee Dashboard → POST /api/goals → Database
   ↓
   Manager Dashboard (sees in approval queue if submitted)
   ↓
   Admin Dashboard (sees in org-wide stats)
   ```

2. **Manager approves a goal:**
   ```
   Manager Dashboard → POST /api/goals/[id]/approvals → Database
   ↓
   Employee Dashboard (status changes to APPROVED)
   ↓
   Admin Dashboard (approval rate updates)
   ```

3. **Employee adds progress update:**
   ```
   Employee Dashboard → POST /api/goals/[id]/updates → Database
   ↓
   Updates goal.currentValue and goal.progress
   ↓
   Manager Dashboard (sees updated progress in team view)
   ↓
   Admin Dashboard (affects avg completion)
   ```

## Database Schema Used

### Key Models
- `User` - Employees, managers, admins
- `Goal` - Individual goals with progress tracking
- `GoalUpdate` - Progress updates/check-ins
- `GoalApproval` - Manager approval records
- `Notification` - User notifications
- `AuditLog` - System audit trail
- `Department` - Organizational departments

### Relationships
- User → Goals (one-to-many)
- User → Manager (self-referential)
- Goal → Updates (one-to-many)
- Goal → Approvals (one-to-many)
- Goal → Participants (many-to-many via SharedGoalParticipant)

## Setup Instructions

### 1. Seed Demo Data

```bash
# Seed demo users (if not already done)
npm run setup:production

# Seed sample goals
npm run db:seed:goals
```

### 2. Test Locally

```bash
npm run dev
```

Visit:
- Employee: http://localhost:3000/employee/dashboard
- Manager: http://localhost:3000/manager/dashboard
- Admin: http://localhost:3000/admin/dashboard

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Implement real backend with database integration"
git push origin main
```

After deployment, run on Vercel:
```bash
# Via Vercel CLI or dashboard terminal
npm run setup:production
npm run db:seed:goals
```

## Testing the Integration

### Test Employee Flow
1. Login as `employee@onside.ai` / `password123`
2. Dashboard shows real goals from database
3. Create a new goal → appears immediately
4. Update progress → reflects in stats

### Test Manager Flow
1. Login as `manager@onside.ai` / `password123`
2. Dashboard shows team performance
3. Pending approvals section shows submitted goals
4. Approve a goal → employee sees status change

### Test Admin Flow
1. Login as `admin@onside.ai` / `password123`
2. Dashboard shows org-wide metrics
3. All users' goals visible
4. Audit logs show recent activity

## API Security

All endpoints:
- ✅ Require authentication (`auth()` check)
- ✅ Role-based access control
- ✅ Owner verification for updates/deletes
- ✅ Audit logging for important actions
- ✅ Proper error handling

## Performance Considerations

- Queries include only necessary relations
- Indexes on foreign keys (userId, goalId, etc.)
- Pagination ready (take/skip params)
- Efficient role-based filtering

## Next Steps (Future Enhancements)

1. **Real-time Updates**: Add WebSocket/SSE for live dashboard updates
2. **Caching**: Implement Redis for frequently accessed stats
3. **Pagination**: Add pagination to goal lists
4. **Filtering**: Add advanced filters (date range, department, etc.)
5. **Bulk Operations**: Add bulk approve/reject for managers
6. **Export**: Add CSV/Excel export for reports
7. **Charts**: Add trend charts using Recharts
8. **Search**: Add full-text search for goals

## Troubleshooting

### Dashboard shows "No goals found"
- Run `npm run db:seed:goals` to add sample data
- Check database connection in `.env`

### "Unauthorized" errors
- Ensure you're logged in
- Check demo session cookie is set
- Verify `AUTH_SECRET` is configured

### Stats not updating
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for API errors
- Verify database connection

## Files Modified/Created

### Created:
- `app/api/goals/[id]/route.ts`
- `app/api/goals/[id]/updates/route.ts`
- `app/api/goals/[id]/approvals/route.ts`
- `app/api/dashboard/stats/route.ts`
- `app/api/users/team/route.ts`
- `app/api/notifications/route.ts`
- `hooks/useGoals.ts`
- `hooks/useDashboardStats.ts`
- `hooks/useNotifications.ts`
- `scripts/seed-goals.ts`

### Modified:
- `app/(dashboard)/employee/dashboard/page.tsx`
- `app/(dashboard)/manager/dashboard/page.tsx`
- `app/(dashboard)/admin/dashboard/page.tsx`
- `package.json`

## Success Criteria ✅

- [x] Mock data removed from all dashboards
- [x] Real database queries implemented
- [x] Role-based access control working
- [x] Changes in employee reflect in manager/admin
- [x] Audit logging for all important actions
- [x] Loading and error states handled
- [x] TypeScript strict mode maintained
- [x] No build errors
- [x] Ready for hackathon demo

---

**Status**: ✅ Complete and ready for deployment
**Last Updated**: May 19, 2026
