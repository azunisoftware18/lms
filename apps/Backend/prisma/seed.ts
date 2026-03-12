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

  // Create sample Zonal branches
  const zonalNorth = await prisma.branch.upsert({
    where: { code: "ZONAL-NORTH" },
    update: {},
    create: {
      name: "Northern Zone",
      code: "ZONAL-NORTH",
      type: "ZONAL",
      parentBranchId: superBranch.id,
      isActive: true,
    },
  });

  const zonalSouth = await prisma.branch.upsert({
    where: { code: "ZONAL-SOUTH" },
    update: {},
    create: {
      name: "Southern Zone",
      code: "ZONAL-SOUTH",
      type: "ZONAL",
      parentBranchId: superBranch.id,
      isActive: true,
    },
  });

  // Create sample Regional branches
  const regionalNorthEast = await prisma.branch.upsert({
    where: { code: "REGIONAL-NE" },
    update: {},
    create: {
      name: "North East Region",
      code: "REGIONAL-NE",
      type: "REGIONAL",
      parentBranchId: zonalNorth.id,
      isActive: true,
    },
  });

  const regionalNorthWest = await prisma.branch.upsert({
    where: { code: "REGIONAL-NW" },
    update: {},
    create: {
      name: "North West Region",
      code: "REGIONAL-NW",
      type: "REGIONAL",
      parentBranchId: zonalNorth.id,
      isActive: true,
    },
  });

  const regionalSouthEast = await prisma.branch.upsert({
    where: { code: "REGIONAL-SE" },
    update: {},
    create: {
      name: "South East Region",
      code: "REGIONAL-SE",
      type: "REGIONAL",
      parentBranchId: zonalSouth.id,
      isActive: true,
    },
  });

  // Create sample Main branches
  const mainBranchDelhi = await prisma.branch.upsert({
    where: { code: "BRANCH-DELHI" },
    update: {},
    create: {
      name: "Delhi Main Branch",
      code: "BRANCH-DELHI",
      type: "BRANCH",
      parentBranchId: regionalNorthEast.id,
      isActive: true,
    },
  });

  const mainBranchGurgaon = await prisma.branch.upsert({
    where: { code: "BRANCH-GURGAON" },
    update: {},
    create: {
      name: "Gurgaon Main Branch",
      code: "BRANCH-GURGAON",
      type: "BRANCH",
      parentBranchId: regionalNorthWest.id,
      isActive: true,
    },
  });

  const mainBranchBangalore = await prisma.branch.upsert({
    where: { code: "BRANCH-BANGALORE" },
    update: {},
    create: {
      name: "Bangalore Main Branch",
      code: "BRANCH-BANGALORE",
      type: "BRANCH",
      parentBranchId: regionalSouthEast.id,
      isActive: true,
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

  console.log(" Seed completed successfully:", user);
  console.log(" Head Office Branch created:", superBranch);
  console.log(" Zonal Branches: North -", zonalNorth.name, ", South -", zonalSouth.name);
  console.log(" Regional Branches: NE -", regionalNorthEast.name, ", NW -", regionalNorthWest.name, ", SE -", regionalSouthEast.name);
  console.log(" Main Branches: Delhi -", mainBranchDelhi.name, ", Gurgaon -", mainBranchGurgaon.name, ", Bangalore -", mainBranchBangalore.name);
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
