import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds for seeding

export async function POST(request: Request) {
  try {
    // Security check - only allow in non-production or with secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    if (secret !== process.env.AUTH_SECRET) {
      return NextResponse.json({
        error: "Unauthorized - invalid secret",
      }, { status: 401 });
    }

    console.log("🌱 Starting database seeding via API...");

    const passwordHash = await bcrypt.hash("password123", 10);

    // Check if users already exist
    const existingUsers = await prisma.user.count();
    
    if (existingUsers > 0) {
      console.log(`⚠️  Database already has ${existingUsers} users. Clearing...`);
      
      // Clear existing data
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
    }

    // Create Departments
    console.log("🏢 Creating departments...");
    const hrDept = await prisma.department.create({
      data: { name: "Human Resources", description: "HR and Admin functions" },
    });
    const salesDept = await prisma.department.create({
      data: { name: "Sales", description: "Direct sales and account management" },
    });

    // Create Users
    console.log("👥 Creating users...");
    const admin = await prisma.user.create({
      data: {
        name: "System Admin",
        email: "admin@onside.ai",
        passwordHash,
        role: Role.ADMIN,
        departmentId: hrDept.id,
        emailVerified: new Date(),
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
      },
    });

    console.log("✅ Database seeded successfully via API!");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      users: [
        { email: admin.email, role: admin.role },
        { email: manager.email, role: manager.role },
        { email: employee.email, role: employee.role },
      ],
      credentials: {
        admin: "admin@onside.ai / password123",
        manager: "manager@onside.ai / password123",
        employee: "employee@onside.ai / password123",
      },
    });
  } catch (error: any) {
    console.error("❌ Seeding failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
