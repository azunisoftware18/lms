import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";
import { buildPaginationMeta, getPagination } from "../../common/utils/pagination.js";
import { logAction } from "../../audit/audit.helper.js";
import type { RequesterContext, SanctionListQuery, SanctionCreateInput, SanctionUpdateInput } from "./sanction.types.js";

export const createSanctionService = async (
	input: SanctionCreateInput,
	requester: RequesterContext,
) => {
	return prisma.$transaction(async (tx) => {
		const loan = await (tx as any).loanApplication.findUnique({ where: { id: input.loanApplicationId }, select: { id: true, branchId: true, loanNumber: true } });

		if (!loan) throw AppError.notFound("Loan application not found");

		const accessible = await getAccessibleBranchIds({ id: requester.id, role: requester.role, branchId: requester.branchId ?? undefined });
		if (accessible && !accessible.includes(loan.branchId)) throw AppError.forbidden("Access denied for branch resources");

		const sanction = await (tx as any).sanction.create({
			data: {
				loanApplicationId: input.loanApplicationId,
				sanctionedAmount: input.sanctionedAmount,
				currency: input.currency ?? "INR",
				remarks: input.remarks ?? null,
				documents: input.documents ?? null,
				branchId: loan.branchId,
			},
		});

		await logAction({
			entityType: "LOAN_APPLICATION",
			entityId: sanction.id,
			action: "UPDATE_LOAN_STATUS",
			performedBy: requester.id,
			branchId: loan.branchId,
			oldValue: null,
			newValue: sanction,
			remarks: `Sanction created for loan ${loan.loanNumber}`,
		});

		return sanction;
	});
};

export const getSanctionByIdService = async (id: string, requester: RequesterContext) => {
	const sanction = await (prisma as any).sanction.findUnique({ where: { id }, include: { loanApplication: true } });
	if (!sanction) throw AppError.notFound("Sanction not found");

	const accessible = await getAccessibleBranchIds({ id: requester.id, role: requester.role, branchId: requester.branchId ?? undefined });
	if (accessible && !accessible.includes(sanction.branchId)) throw AppError.forbidden("Access denied for branch resources");

	return sanction;
};

export const listSanctionsService = async (requester: RequesterContext, params: SanctionListQuery) => {
	const { page = 1, limit = 20 } = params as any;
	const { page: p, limit: l, skip } = getPagination(page, limit);

	const accessible = await getAccessibleBranchIds({ id: requester.id, role: requester.role, branchId: requester.branchId ?? undefined });

	const where: any = {};
	if (params.status) where.status = params.status;
	if (params.loanApplicationId) where.loanApplicationId = params.loanApplicationId;
	if (accessible) where.branchId = { in: accessible };

	const [total, data] = await (prisma as any).$transaction([
		(prisma as any).sanction.count({ where }),
		(prisma as any).sanction.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: l }),
	]);

	return { data, meta: buildPaginationMeta(total, p, l) };
};

export const updateSanctionService = async (id: string, input: SanctionUpdateInput, requester: RequesterContext) => {
	return (prisma as any).$transaction(async (tx: any) => {
		const existing = await tx.sanction.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Sanction not found");

		const accessible = await getAccessibleBranchIds({ id: requester.id, role: requester.role, branchId: requester.branchId ?? undefined });
		if (accessible && !accessible.includes(existing.branchId)) throw AppError.forbidden("Access denied for branch resources");

		const updated = await tx.sanction.update({ where: { id }, data: { ...(input as any) } });

		await logAction({
			entityType: "LOAN_APPLICATION",
			entityId: id,
			action: "UPDATE_LOAN_STATUS",
			performedBy: requester.id,
			branchId: existing.branchId,
			oldValue: existing,
			newValue: updated,
			remarks: `Sanction ${id} updated`,
		});

		return updated;
	});
};

export const deleteSanctionService = async (id: string, requester: RequesterContext) => {
	return (prisma as any).$transaction(async (tx: any) => {
		const existing = await tx.sanction.findUnique({ where: { id } });
		if (!existing) throw AppError.notFound("Sanction not found");

		const accessible = await getAccessibleBranchIds({ id: requester.id, role: requester.role, branchId: requester.branchId ?? undefined });
		if (accessible && !accessible.includes(existing.branchId)) throw AppError.forbidden("Access denied for branch resources");

		const deleted = await tx.sanction.delete({ where: { id } });

		await logAction({
			entityType: "LOAN_APPLICATION",
			entityId: id,
			action: "UPDATE_LOAN_STATUS",
			performedBy: requester.id,
			branchId: existing.branchId,
			oldValue: existing,
			newValue: null,
			remarks: `Sanction ${id} deleted`,
		});

		return deleted;
	});
};
