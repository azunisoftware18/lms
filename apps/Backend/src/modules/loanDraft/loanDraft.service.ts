import { prisma } from "../../db/prismaService.js";
import { createFullLoanApplicationService } from "../LoanApplication/loanApplication.service.js";
import * as Enums from "../../../generated/prisma-client/enums.js";
import {
    createLoanApplicationSchema,
} from "../LoanApplication/loanApplication.schema.js";

const loanDraftDelegate = (prisma as any).loanApplicationDraft;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const deepMergeDraft = (
    base: Record<string, unknown>,
    incoming: Record<string, unknown>,
): Record<string, unknown> => {
    const merged: Record<string, unknown> = { ...base };

    for (const [key, incomingValue] of Object.entries(incoming)) {
        const currentValue = merged[key];
        if (isPlainObject(currentValue) && isPlainObject(incomingValue)) {
            merged[key] = deepMergeDraft(currentValue, incomingValue);
            continue;
        }
        merged[key] = incomingValue;
    }

    return merged;
};

export const createLoanDraftService = async ( userId: string,
    branchId: string,
) => {
    return loanDraftDelegate.create({
        data:{
            userId,
            branchId,
            draftData:{}
        }
    })
}


export const updateLoanDraftService = async (draftId:string,
    draftData:any
)=>{
    const draft = await loanDraftDelegate.findUnique({
        where:{id:draftId}
    })
    if(!draft){
        throw new Error("Draft not found")
    }
    const existingDraftData = isPlainObject(draft.draftData)
        ? (draft.draftData as Record<string, unknown>)
        : {};

    const incomingDraftData = isPlainObject(draftData)
        ? (draftData as Record<string, unknown>)
        : {};

    const merged = deepMergeDraft(existingDraftData, incomingDraftData);

    return loanDraftDelegate.update({
        where:{id:draftId},
        data:{
            draftData: merged
        }
    })
}

export const getLoanDraftByIdService = async (
    draftId:string,
) =>{
    return loanDraftDelegate.findUnique({
        where:{id:draftId}
    })
}


export const submitLoanDraftService =  async (
    draftId :string,
    user:{id:string,role:Enums.Role}

)=>{
    const draft =await loanDraftDelegate.findUnique({
        where:{id:draftId}
    })
    if(!draft)
    {
        throw new Error("Draft not found")
    }

    if (draft.status === "SUBMITTED") {
        throw new Error("Draft already submitted")
    }

    if (draft.userId !== user.id) {
        throw new Error("You can only submit your own draft")
    }

    const validatedPayload = createLoanApplicationSchema.parse(
        draft.draftData,
    );

    const createdLoanApplication = await createFullLoanApplicationService(
        validatedPayload as any,
        user.id,
    )

    const submittedDraft = await loanDraftDelegate.update({
        where:{id:draftId},
        data:{status:"SUBMITTED"}
    })

    return {
        draft: submittedDraft,
        loanApplication: createdLoanApplication,
    }
}