import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_USERS = [
  {
    email: "admin@onside.ai",
    password: "password123",
    name: "System Admin",
    role: Role.ADMIN,
  },
  {
    email: "manager@onside.ai",
    password: "password123",
    name: "Sarah Johnson",
    role: Role.MANAGER,
  },
  {
    email: "employee@onside.ai",
    password: "password123",
    name: "Alex Morgan",
    role: Role.EMPLOYEE,
  },
];

async function verifyConnection() {
  console.log("🔍 Verifying database connection...");
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");
    return true;
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

async function verifyTables() {
  console.log("🔍 Verifying database tables...");
  try {
    await prisma.user.findFirst();
    console.log("✅ Database tables exist");
    return true;
  } catch (error: any) {
    console.error("❌ Database tables not found:", error.message);
    console.log("💡 Run 'npx prisma db push' to create tables");
    return false;
  }
}

async function seedDemoUsers() {
  console.log("👥 Checking demo users...");
  
  let createdCount = 0;
  let existingCount = 0;

  // Get or create HR department
  let hrDept = await prisma.department.findFirst({
    where: { name: "Human Resources" },
  });

  if (!hrDept) {
    console.log("🏢 Creating HR department...");
    hrDept = await prisma.department.create({
      data: {
        name: "Human Resources",
        description: "HR and Admin functions",
      },
    });
  }

  // Get or create Sales department
  let salesDept = await prisma.department.findFirst({
    where: { name: "Sales" },
  });

  if (!salesDept) {
    console.log("🏢 Creating Sales department...");
    salesDept = await prisma.department.create({
      data: {
        name: "Sales",
        description: "Direct sales and account management",
      },
    });
  }

  for (const demoUser of DEMO_USERS) {
    const existingUser = await prisma.user.findUnique({
      where: { email: demoUser.email },
    });

    if (existingUser) {
      console.log(`   ℹ️  User ${demoUser.email} already exists`);
      existingCount++;
      continue;
    }

    const passwordHash = await bcrypt.hash(demoUser.password, 10);
    const departmentId = demoUser.role === Role.ADMIN ? hrDept.id : salesDept.id;

    await prisma.user.create({
      data: {
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        role: demoUser.role,
        departmentId,
        emailVerified: new Date(),
      },
    });

    console.log(`   ✅ Created user: ${demoUser.email}`);
    createdCount++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   - Created: ${createdCount} users`);
  console.log(`   - Existing: ${existingCount} users`);
  console.log(`   - Total: ${createdCount + existingCount} demo users`);

  return { createdCount, existingCount };
}

async function printCredentials() {
  console.log("\n🔐 Demo Credentials:");
  console.log("─────────────────────────────────────────");
  console.log("Admin:    admin@onside.ai / password123");
  console.log("Manager:  manager@onside.ai / password123");
  console.log("Employee: employee@onside.ai / password123");
  console.log("─────────────────────────────────────────");
}

async function main() {
  console.log("🚀 Starting production setup...\n");

  try {
    // Step 1: Verify connection
    const connected = await verifyConnection();
    if (!connected) {
      console.error("\n❌ Setup failed: Cannot connect to database");
      process.exit(1);
    }

    // Step 2: Verify tables
    const tablesExist = await verifyTables();
    if (!tablesExist) {
      console.error("\n❌ Setup failed: Database tables not found");
      process.exit(1);
    }

    // Step 3: Seed demo users
    const { createdCount, existingCount } = await seedDemoUsers();

    // Step 4: Print credentials
    await printCredentials();

    console.log("\n✅ Production setup completed successfully!");
    
    if (createdCount === 0 && existingCount === DEMO_USERS.length) {
      console.log("ℹ️  All demo users were already present");
    }

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Setup failed with error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
