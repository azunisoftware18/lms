import cron from "node-cron";
import { checkAndMarkLoanDefault } from "../modules/loanDefault/loanDefault.service.js";
import { prisma } from "../db/prismaService.js";
import logger from "../common/logger.js";

const BATCH_SIZE = 20;

export const startLoanDefaultJob = () => {
  cron.schedule("10 * * * *", async () => {
    try {
      const activeLoans = await prisma.loanApplication.findMany({
        where: { status: { in: ["active", "delinquent"] } },
        select: { id: true },
      });

      // Process in parallel batches of BATCH_SIZE to avoid DB overload
      for (let i = 0; i < activeLoans.length; i += BATCH_SIZE) {
        const batch = activeLoans.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map((loan) =>
            checkAndMarkLoanDefault(loan.id).catch((err) =>
              logger.error(`LoanDefaultJob: failed for loan ${loan.id}: ${err.message}`),
            ),
          ),
        );
      }

      logger.info(`LoanDefaultJob: processed ${activeLoans.length} loans.`);
    } catch (error: any) {
      logger.error(`LoanDefaultJob: fatal error - ${error.message}`);
    }
  });
};
