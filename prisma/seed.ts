import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const manager = await prisma.user.upsert({
    where: { email: "manager@onside.ai" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "manager@onside.ai",
      passwordHash,
      role: Role.MANAGER,
      department: "Sales",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@onside.ai" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@onside.ai",
      passwordHash,
      role: Role.ADMIN,
      department: "HR",
    },
  });

  await prisma.user.upsert({
    where: { email: "employee@onside.ai" },
    update: {},
    create: {
      name: "Alex Morgan",
      email: "employee@onside.ai",
      passwordHash,
      role: Role.EMPLOYEE,
      department: "Sales",
      managerId: manager.id,
    },
  });

  console.log("✅ Seed data created successfully.");
  console.log("Admin: admin@onside.ai / password123");
  console.log("Manager: manager@onside.ai / password123");
  console.log("Employee: employee@onside.ai / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });