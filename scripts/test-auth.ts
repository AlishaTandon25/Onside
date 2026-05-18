import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testAuth() {
  try {
    console.log("🔐 Testing authentication...\n");

    const testEmail = "admin@onside.ai";
    const testPassword = "password123";

    console.log(`Testing login for: ${testEmail}`);
    console.log(`Password: ${testPassword}\n`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: testEmail.toLowerCase() },
    });

    if (!user) {
      console.log("❌ User not found in database");
      return;
    }

    console.log("✅ User found:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has password hash: ${!!user.passwordHash}`);
    console.log(`   Password hash: ${user.passwordHash?.substring(0, 20)}...`);

    if (!user.passwordHash) {
      console.log("\n❌ User has no password hash!");
      return;
    }

    // Test password
    console.log("\n🔍 Testing password comparison...");
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);

    if (isValid) {
      console.log("✅ Password is VALID - Authentication should work!");
    } else {
      console.log("❌ Password is INVALID - This is the problem!");
      
      // Try to generate a new hash and compare
      console.log("\n🔧 Generating new hash for comparison...");
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log(`New hash: ${newHash.substring(0, 20)}...`);
      
      const testNew = await bcrypt.compare(testPassword, newHash);
      console.log(`New hash works: ${testNew ? 'YES' : 'NO'}`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testAuth();
