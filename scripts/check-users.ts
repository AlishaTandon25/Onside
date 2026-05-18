import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkUsers() {
  try {
    console.log("🔍 Checking database users...");
    console.log("📍 Database:", connectionString.substring(0, 50) + "...");
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    console.log(`\n✅ Found ${users.length} users in database:\n`);
    
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
      console.log(`  Has password: ${user.passwordHash ? 'YES' : 'NO'}`);
      console.log(`  Password hash length: ${user.passwordHash?.length || 0}`);
    });

    if (users.length === 0) {
      console.log("\n⚠️  No users found! Database needs to be seeded.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkUsers();
