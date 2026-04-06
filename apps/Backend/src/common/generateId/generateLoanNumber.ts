import { Prisma } from "../../../generated/prisma-client/client.js";
export const generateLoanNumber = async (tx: Prisma.TransactionClient) => {
  const year = new Date().getFullYear();
  // Use upsert to atomically create-or-increment the yearly counter.
  // Compute a safe initial sequence based on the last existing loan for the year.
  const lastLoan = await tx.loanApplication.findFirst({
    where: { loanNumber: { startsWith: `LN-${year}-` } },
    orderBy: { loanNumber: "desc" },
    select: { loanNumber: true },
  });

  const lastSeq = lastLoan ? Number(lastLoan.loanNumber.split("-").pop()) : 0;

  const upserted = await tx.loanNumberCounter.upsert({
    where: { year },
    update: { sequence: { increment: 1 } },
    create: { year, sequence: lastSeq + 1 },
  });

  return `LN-${year}-${String(upserted.sequence).padStart(6, "0")}`;
};
