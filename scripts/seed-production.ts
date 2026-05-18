/**
 * Production Database Seeding Script
 * 
 * This script seeds the production database with demo users and data.
 * Run this ONCE after deploying to Vercel.
 * 
 * Usage:
 *   npm run db:seed:prod
 */

import "dotenv/config";
import { execSync } from "child_process";

console.log("🚀 Seeding production database...");
console.log("📍 Database URL:", process.env.DATABASE_URL?.substring(0, 30) + "...");

try {
  // Run the seed script
  execSync("npm run db:seed", { stdio: "inherit" });
  
  console.log("\n✅ Production database seeded successfully!");
  console.log("-------------------------------------------");
  console.log("You can now log in with:");
  console.log("Admin: admin@onside.ai / password123");
  console.log("Manager: manager@onside.ai / password123");
  console.log("Employee: employee@onside.ai / password123");
  console.log("-------------------------------------------");
} catch (error) {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
}
