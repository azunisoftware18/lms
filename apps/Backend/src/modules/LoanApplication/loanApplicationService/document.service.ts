export function sanitizeDocumentResponse(doc: any) {
  return {
    id: doc.id,
    documentType: doc.documentType,
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
