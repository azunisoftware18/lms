import { hashPassword } from "../src/common/utils/utils.ts";
import { prisma } from "../src/db/prismaService.ts";
import { PERMISSIONS } from "../src/common/constants/permission.ts";


async function main(): Promise<void> {
  const now: Date = new Date();

  // Update BranchType enum in database
  try {
    await prisma.$executeRaw`ALTER TABLE Branch MODIFY type ENUM('HEAD_OFFICE', 'ZONAL', 'REGIONAL', 'BRANCH') NOT NULL`;
    console.log("✓ BranchType enum updated successfully");
  } catch (error) {
    console.log("ℹ BranchType enum already updated or error:", (error as Error).message);
  }

  const permissions = await Promise.all(
    PERMISSIONS.map(async (code) => {
      return prisma.permission.upsert({
        where: { code },
        update: {},
        create: {
          code,
          name: code.replace(/_/g, " "),
        },
      });
    }),
  );

  // Create Head Office Branch for admin users
  const superBranch = await prisma.branch.upsert({
    where: { code: "HQ-SUPER" },
    update: {
      name: "Headquarters - Head Office",
      type: "HEAD_OFFICE",
      isActive: true,
      parentBranchId: null,
    },
    create: {
      name: "Headquarters - Head Office",
      code: "HQ-SUPER",
      type: "HEAD_OFFICE",
      isActive: true,
      parentBranchId: null,
    },
  });

  let password: string = "Admin@123";
  password = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { userName: "admin123" },
    update: {
      fullName: "Samir Akhtar",
      email: "admin@gmail.com",
      password,
      role: "SUPER_ADMIN",
      contactNumber: "9999999999",
      branchId: superBranch.id,
      isActive: true,
    },
    create: {
      fullName: "Samir Akhtar",
      email: "admin@gmail.com",
      userName: "admin123",
      password,
      role: "SUPER_ADMIN",
      contactNumber: "9999999999",
      branchId: superBranch.id,
      isActive: true,
      // kycStatus: "VERIFIED",
      createdAt: now,
    },
  });

  // Create SLA Policies
  const slaPolicies = await Promise.all([
    prisma.sLAPolicy.upsert({
      where: { id: "kyc-pending-policy" },
      update: {},
      create: {
        id: "kyc-pending-policy",
        module: "KYC",
        stage: "kyc_Pending",
        thresholdHours: 72,
        action: "ESCALATE",
      },
    }),
    prisma.sLAPolicy.upsert({
      where: { id: "loan-assignment-policy" },
      update: {},
      create: {
        id: "loan-assignment-policy",
        module: "LOAN",
        stage: "ASSIGNED",
        thresholdHours: 72,
        action: "REASSIGN",
      },
    }),
  ]);

  console.log(" Seed completed successfully. Admin user:", user.userName);  console.log(" Permissions created/updated:", permissions.length);
  console.log(" Head Office Branch created:", superBranch);
  console.log(" SLA Policies created:", slaPolicies.length);
}

// Run the script
main()
  .catch((e: unknown) => {
    console.error("Seeding error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
