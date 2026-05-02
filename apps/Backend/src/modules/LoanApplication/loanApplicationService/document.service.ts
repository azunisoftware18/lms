export function sanitizeDocumentResponse(doc: any) {
  // Determine applicant type from which ID is set
  let applicantType = "applicant";
  if (doc.coApplicantId) {
    applicantType = "coApplicant";
  } else if (doc.guarantorId) {
    applicantType = "guarantor";
  }

  return {
    id: doc.id,
    documentType: doc.documentType,
    applicantType, // Include applicant type so frontend knows which applicant this is for
    verificationStatus: doc.verificationStatus,
    verified: doc.verified,
    verifiedAt: doc.verifiedAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    rejectionReason: doc.rejectionReason,
  };
}

export function sanitizeDocumentList(documents: any[]) {
  return documents.map((doc) => sanitizeDocumentResponse(doc));
}
