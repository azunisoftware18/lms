import { prisma } from "../../db/prismaService.js";
import { LoanTypeDTO } from "./loanTypes.types.js";
import { createLoanTypeSchema } from "./loanTypes.schema.js";
import { getPagination } from "../../common/utils/pagination.js";
import { buildLoanTypeSearch } from "../../common/utils/search.js";
import { AppError } from "../../common/utils/apiError.js";

//type CreateLoanTypeInput = z.infer<typeof createLoanTypeSchema>;
export const createLoanTypeService = async (loanTypeData: LoanTypeDTO) => {
  try {
    const data = createLoanTypeSchema.parse(loanTypeData);

    const existingLoanType = await prisma.loanType.findUnique({
      where: { code: data.code },
      select: { id: true },
    });

    if (existingLoanType) {
      throw AppError.conflict(`LoanType with code "${data.code}" already exists`);
    }

    if (data.minAmount > data.maxAmount) {
      throw AppError.badRequest(`Minimum amount cannot be greater than maximum amount`);
    }

    if (data.minTenureMonths > data.maxTenureMonths) {
      throw AppError.badRequest("minTenureMonths cannot be greater than maxTenureMonths");
    }

    if (data.minInterestRate > data.maxInterestRate) {
      throw AppError.badRequest("minInterestRate cannot be greater than maxInterestRate");
    }

    if (
      data.defaultInterestRate < data.minInterestRate ||
      data.defaultInterestRate > data.maxInterestRate
    ) {
      throw AppError.badRequest(
        "defaultInterestRate must be within min & max interest rate"
      );
    }

    if (data.minAge > data.maxAge) {
      throw AppError.badRequest("minAge cannot be greater than maxAge");
    }

    if (
      data.minCibilScore &&
      data.maxCibilScore &&
      data.minCibilScore > data.maxCibilScore
    ) {
      throw AppError.badRequest("minCibilScore cannot be greater than maxCibilScore");
    }

    if (data.gstApplicable && !data.gstPercentage) {
      throw AppError.badRequest("gstPercentage is required when gstApplicable is true");
    }

    const loanType = await prisma.loanType.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,

        category: data.category,
        secured: data.secured,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        minTenureMonths: data.minTenureMonths,
        maxTenureMonths: data.maxTenureMonths,

        interestType: data.interestType,
        minInterestRate: data.minInterestRate,
        maxInterestRate: data.maxInterestRate,
        defaultInterestRate: data.defaultInterestRate,

        processingFeeType: data.processingFeeType,
        processingFee: data.processingFee,
        gstApplicable: data.gstApplicable,
        gstPercentage: data.gstApplicable ? data.gstPercentage : null,

        minAge: data.minAge,
        maxAge: data.maxAge,
        minIncome: data.minIncome,
        employmentType: data.employmentType,

        minCibilScore: data.minCibilScore,
        maxCibilScore: data.maxCibilScore,
        maxLoanToValueRatio: data.maxLoanToValueRatio,
        prepaymentAllowed: data.prepaymentAllowed,
        foreclosureAllowed: data.foreclosureAllowed,
        foreclosureCharges: data.foreclosureAllowed
          ? data.foreclosureCharges
          : null,
        prepaymentCharges: data.prepaymentAllowed
          ? data.prepaymentCharges
          : null,

        isActive: data.isActive,
        isPublic: data.isPublic,

        estimatedProcessingTimeDays: data.estimatedProcessingTimeDays,
        applicantDocumentsRequired: data.applicantDocumentsRequired,
        applicantDocumentsOptional: data.applicantDocumentsOptional,
        coApplicantDocumentsRequired: data.coApplicantDocumentsRequired,
        coApplicantDocumentsOptional: data.coApplicantDocumentsOptional,
        guarantorDocumentsRequired: data.guarantorDocumentsRequired,
        guarantorDocumentsOptional: data.guarantorDocumentsOptional,
      },
    });

    return loanType;
  } catch (error: any) {
    // Preserve and rethrow the original error so the controller can
    // return informative messages to the client.
    if (error instanceof Error) throw error;
    throw AppError.internal(String(error));
  }
};

export const getAllLoanTypeService = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
  isPublic?: boolean;
}) => {
  const { page, limit, skip } = getPagination(params.page, params.limit);

  const where = {
    ...(params.isActive !== undefined && { isActive: params.isActive }),
    ...(params.isPublic !== undefined && { isPublic: params.isPublic }),
    ...buildLoanTypeSearch(params.q),
  }
  
  const [data, total] = await Promise.all([
    prisma.loanType.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.loanType.count({ where }),
  ]);

  
  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
}

export const getLoanTypeByIdService = async (loanTypeId: string) => {
  const loanType = await prisma.loanType.findFirst({
    where: {
      id: loanTypeId,
//      deletedAt: null
    },
  });

  if (!loanType) {
    throw AppError.notFound("LoanType not found");
  }
  return loanType;
}
export const updateLoanTypeService = async(
  loanTypeId: string,
  updateData: Partial<LoanTypeDTO>
) => {
  const existingLoanType = await prisma.loanType.findFirst({
    where: {
      id: loanTypeId,
//      deletedAt: null
    },
  });
  if (!existingLoanType) {
    throw AppError.notFound("LoanType not found");
  }
  const updatedLoanType = await prisma.loanType.update({
    where: { id: loanTypeId },
    data: updateData,
  });
  return updatedLoanType;
}



export const softDeleteLoanTypeService = async (
  loanTypeId: string,
  _deletedByUserId: string
) => {
  const loanType = await prisma.loanType.findFirst({
    where: {
      id: loanTypeId,
      isActive: true,
    },
  });

  if (!loanType) {
    throw AppError.notFound("LoanType not found or already deleted");
  }

  return prisma.loanType.update({
    where: { id: loanTypeId },
    data: {
      isActive: false,
    },
  });
};
