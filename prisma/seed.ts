import "dotenv/config";
import { PrismaClient, Role, GoalStatus, Priority, Quarter, NotificationType, EscalationStatus, InsightType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing in environment variables.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Wipe existing data (Order matters to avoid foreign key constraints)
  console.log("🧹 Wiping existing data...");
  await prisma.auditLog.deleteMany();
  await prisma.escalation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.goalApproval.deleteMany();
  await prisma.sharedGoalParticipant.deleteMany();
  await prisma.goalUpdate.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // 2. Create Departments
  console.log("🏢 Creating departments...");
  const hrDept = await prisma.department.create({
    data: { name: "Human Resources", description: "HR and Admin functions" },
  });
  const salesDept = await prisma.department.create({
    data: { name: "Sales", description: "Direct sales and account management" },
  });
  const engDept = await prisma.department.create({
    data: { name: "Engineering", description: "Product development" },
  });

  // 3. Create Users
  console.log("👥 Creating users...");
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@onside.ai",
      passwordHash,
      role: Role.ADMIN,
      departmentId: hrDept.id,
      emailVerified: new Date(),
      settings: {
        create: {
          notificationPreferences: {
            email: true,
            inApp: true,
            goalUpdates: true,
            approvals: true,
            escalations: true,
            reports: true,
          },
          integrationPreferences: {
            microsoft: false,
            slack: false,
            googleCalendar: false,
            webhookUrl: null,
          },
          securityPreferences: {},
        },
      },
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "manager@onside.ai",
      passwordHash,
      role: Role.MANAGER,
      departmentId: salesDept.id,
      emailVerified: new Date(),
      settings: {
        create: {
          notificationPreferences: {
            email: true,
            inApp: true,
            goalUpdates: true,
            approvals: true,
            escalations: true,
            reports: false,
          },
          integrationPreferences: {
            microsoft: false,
            slack: false,
            googleCalendar: false,
            webhookUrl: null,
          },
          securityPreferences: {},
        },
      },
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "employee@onside.ai",
      passwordHash,
      role: Role.EMPLOYEE,
      departmentId: salesDept.id,
      managerId: manager.id,
      emailVerified: new Date(),
      settings: {
        create: {
          notificationPreferences: {
            email: true,
            inApp: true,
            goalUpdates: true,
            approvals: true,
            escalations: true,
            reports: false,
          },
          integrationPreferences: {
            microsoft: false,
            slack: false,
            googleCalendar: false,
            webhookUrl: null,
          },
          securityPreferences: {},
        },
      },
    },
  });

  // 4. Create Goals
  console.log("🎯 Creating goals...");
  const managerGoal = await prisma.goal.create({
    data: {
      title: "Increase Q3 Sales by 20%",
      description: "Drive new outbound strategies to hit $2M ARR.",
      target: 2000000,
      achievement: 500000,
      weightage: 50,
      status: GoalStatus.APPROVED,
      priority: Priority.HIGH,
      quarter: Quarter.Q3,
      ownerId: manager.id,
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-09-30"),
    },
  });

  const employeeGoal = await prisma.goal.create({
    data: {
      title: "Close 15 Enterprise Deals",
      description: "Focus on healthcare sector prospects.",
      target: 15,
      achievement: 3,
      weightage: 40,
      status: GoalStatus.SUBMITTED,
      priority: Priority.MEDIUM,
      quarter: Quarter.Q3,
      ownerId: employee.id,
    },
  });

  // 5. Create Shared Goals & Participants
  console.log("🤝 Creating shared goals...");
  const sharedGoal = await prisma.goal.create({
    data: {
      title: "Cross-Functional Pipeline Generation",
      description: "Collaborate with marketing to increase MQLs.",
      target: 1000,
      achievement: 150,
      weightage: 20,
      status: GoalStatus.DRAFT,
      priority: Priority.MEDIUM,
      quarter: Quarter.Q3,
      ownerId: manager.id,
      participants: {
        create: [
          { userId: employee.id, canEdit: true },
        ],
      },
    },
  });

  // 6. Create Goal Updates & Approvals
  console.log("📈 Creating updates and approvals...");
  await prisma.goalUpdate.create({
    data: {
      goalId: employeeGoal.id,
      userId: employee.id,
      previousValue: 0,
      newValue: 3,
      comment: "Closed 3 deals in week 1.",
    },
  });

  await prisma.goalApproval.create({
    data: {
      goalId: managerGoal.id,
      managerId: admin.id,
      status: GoalStatus.APPROVED,
      comment: "Looks solid. Proceed.",
    },
  });

  // 7. Create AI Insights
  console.log("🤖 Generating AI insights...");
  await prisma.aIInsight.create({
    data: {
      goalId: employeeGoal.id,
      type: InsightType.RISK,
      content: "Based on current velocity, you are tracking to miss the Q3 target by 15%. Consider increasing outreach volume.",
    },
  });

  // 8. Create Notifications
  console.log("🔔 Creating notifications...");
  await prisma.notification.create({
    data: {
      userId: manager.id,
      type: NotificationType.APPROVAL_REQUIRED,
      message: "Alex Morgan has submitted a new goal for approval.",
      read: false,
    },
  });
  
  await prisma.notification.create({
    data: {
      userId: employee.id,
      type: NotificationType.GOAL_ASSIGNED,
      message: "You have been added to the 'Cross-Functional Pipeline' shared goal.",
      read: true,
    },
  });

  // 9. Create Escalations
  console.log("⚠️ Creating escalations...");
  const escalation = await prisma.escalation.create({
    data: {
      title: "Blocked by Legal Review",
      description: "Two enterprise deals are stuck in redlining for >14 days.",
      status: EscalationStatus.OPEN,
      reporterId: employee.id,
      assignedToId: manager.id,
      goalId: employeeGoal.id,
    },
  });

  // 10. Create Audit Logs
  console.log("📜 Creating audit logs...");
  await prisma.auditLog.createMany({
    data: [
      {
        action: "CREATED",
        resource: "USER",
        resourceId: employee.id,
        userId: admin.id,
        details: "Created employee user account.",
      },
      {
        action: "UPDATED",
        resource: "GOAL",
        resourceId: employeeGoal.id,
        userId: employee.id,
        details: "Updated goal achievement from 0 to 3.",
      },
      {
        action: "CREATED",
        resource: "ESCALATION",
        resourceId: escalation.id,
        userId: employee.id,
        details: "Raised escalation for blocked deals.",
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log("-------------------------------------------");
  console.log("Admin: admin@onside.ai / password123");
  console.log("Manager: manager@onside.ai / password123");
  console.log("Employee: employee@onside.ai / password123");
  console.log("-------------------------------------------");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
