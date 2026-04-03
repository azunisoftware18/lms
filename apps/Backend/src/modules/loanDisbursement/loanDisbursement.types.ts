import { DisbursementMode } from "../../../generated/prisma-client/enums.js";

export type CreateloanDisbursementInput = {
    disbursementMode: DisbursementMode;
    transactionReference: string;
    remarks?: string;
    bankName?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    valueDate?: string;
    externalTxnId?: string;
    utrNumber?: string;
};

export type ReverseDisbursementInput = {
    reason?: string;
};