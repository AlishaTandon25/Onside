import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Seeding goals...");

  // Get demo users
  const admin = await prisma.user.findUnique({
    where: { email: "admin@onside.ai" },
  });

  const manager = await prisma.user.findUnique({
    where: { email: "manager@onside.ai" },
  });

  const employee = await prisma.user.findUnique({
    where: { email: "employee@onside.ai" },
  });

  if (!admin || !manager || !employee) {
    console.error("❌ Demo users not found. Run setup:production first.");
    process.exit(1);
  }

  // Create goals for employee
  const employeeGoals = [
    {
      title: "Expand Enterprise Client Base",
      description: "Increase enterprise client acquisition by 25%",
      thrustArea: "Market Growth",
      targetValue: 100,
      currentValue: 85,
      weightage: 30,
      priority: "HIGH" as const,
      quarter: "Q3" as const,
      status: "APPROVED" as const,
      ownerId: employee.id,
    },
    {
      title: "Increase Sales Q3 Pipeline",
      description: "Build a robust sales pipeline for Q3",
      thrustArea: "Revenue",
      targetValue: 100,
      currentValue: 45,
      weightage: 40,
      priority: "CRITICAL" as const,
      quarter: "Q3" as const,
      status: "APPROVED" as const,
      ownerId: employee.id,
    },
    {
      title: "Launch Internal Knowledge Base",
      description: "Create comprehensive internal documentation",
      thrustArea: "Operational Excellence",
      targetValue: 100,
      currentValue: 100,
      weightage: 15,
      priority: "MEDIUM" as const,
      quarter: "Q3" as const,
      status: "COMPLETED" as const,
      ownerId: employee.id,
    },
    {
      title: "Improve Team eNPS Score",
      description: "Enhance employee satisfaction metrics",
      thrustArea: "Culture",
      targetValue: 100,
      currentValue: 60,
      weightage: 15,
      priority: "MEDIUM" as const,
      quarter: "Q3" as const,
      status: "APPROVED" as const,
      ownerId: employee.id,
    },
  ];

  for (const goalData of employeeGoals) {
    const existing = await prisma.goal.findFirst({
      where: {
        title: goalData.title,
        ownerId: goalData.ownerId,
      },
    });

    if (!existing) {
      const goal = await prisma.goal.create({
        data: {
          ...goalData,
          progress: (goalData.currentValue / goalData.targetValue) * 100,
        },
      });
      console.log(`✅ Created goal: ${goal.title}`);
    } else {
      console.log(`⏭️  Goal already exists: ${goalData.title}`);
    }
  }

  // Create goals for manager (submitted, pending approval)
  const managerGoals = [
    {
      title: "Build High-Performance Team",
      description: "Recruit and onboard 5 senior engineers",
      thrustArea: "Team Development",
      targetValue: 5,
      currentValue: 3,
      weightage: 35,
      priority: "HIGH" as const,
      quarter: "Q3" as const,
      status: "SUBMITTED" as const,
      ownerId: employee.id, // Employee submitting for manager approval
    },
  ];

  for (const goalData of managerGoals) {
    const existing = await prisma.goal.findFirst({
      where: {
        title: goalData.title,
        ownerId: goalData.ownerId,
      },
    });

    if (!existing) {
      const goal = await prisma.goal.create({
        data: {
          ...goalData,
          progress: (goalData.currentValue / goalData.targetValue) * 100,
        },
      });
      console.log(`✅ Created goal: ${goal.title}`);
    }
  }

  console.log("✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding goals:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
