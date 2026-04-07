import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost,  apiPut } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setLoanApplications,
  setLoanApplication,
  addLoanApplication,
  updateLoanApplicationInList,
} from "../store/slices/loanApplicationSlice";
import toast from "react-hot-toast";

// GET all loans with optional filters: /loan-applications/?page=1&q=LN-2026-000001
export const useLoanApplications = (params = {}) => {
  const dispatch = useDispatch();

  const normalizedParams = normalizeParams(params);

  // GET all loans: /loan-applications/?page=1&q=LN-2026-000001
  return useQuery({
    queryKey: ["loanApplications", normalizedParams],
    queryFn: () => apiGet(`/loan-applications`, { params: normalizedParams }),
    keepPreviousData: true,
    onSuccess: (data) => {
      dispatch(setLoanApplications(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch loan applications";
      dispatch(setError(message));
      showError(message);
    },
  });
};

// GET loan types for dropdowns
export const useLoanTypes = () => {
  // Fetch loan types from API
  const { data } = useQuery({
    queryKey: ["loanTypes"],
    queryFn: async () => {
      // Try with isActive=true first
      let res = await apiGet("/loantypes?isActive=true");
      let items = Array.isArray(res) ? res : res?.data?.data || res?.data || [];
      if (!items.length) {
        // Fallback: fetch all if none returned
        res = await apiGet("/loantypes");
        items = Array.isArray(res) ? res : res?.data?.data || res?.data || [];
      }
      return items
        .filter((lt) => lt?.id)
        .map((lt) => ({
          value: lt.id,
          label: lt.name || lt.code || lt.id,
        }));
    },
    staleTime: 5 * 60 * 1000,
  });
  return data || [];
};
// GET loan by id: /loan-applications/:id
export const useLoanApplication = (id) => {
  const dispatch = useDispatch();

  // GET loan by id: /loan-applications/:id
  return useQuery({
    queryKey: ["loanApplication", id],
    queryFn: () => apiGet(`/loan-applications/${id}`),
    enabled: !!id,
    select: (data) => {
      // Extract the application object from possible response shapes
      return data?.data?.data || data?.data || data?.application || data;
    },
    onSuccess: (application) => {
      dispatch(setLoanApplication(application));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch loan application";
      dispatch(setError(message));
      showError(message);
    },
  });
};

// POST create loan: /loan-applications/loan/create
export const useCreateLoanApplication = ({
  onSuccess: onSuccessCallback,
  onError: onErrorCallback,
  onSettled: onSettledCallback,
} = {}) => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/loan-applications/loan/create", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data, variables, context) => {
      dispatch(addLoanApplication(data));
      qc.invalidateQueries({ queryKey: ["loanApplications"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan application created successfully!");
      if (typeof onSuccessCallback === "function") {
        onSuccessCallback(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Try to extract a useful message from the server response (which
      // apiClient rethrows as response.data). Fall back to generic message.
      let serverMsg = "Failed to create loan application";
      try {
        if (!error) {
          serverMsg = "Unknown server error";
        } else if (typeof error === "string") {
          serverMsg = error;
        } else if (error?.message) {
          serverMsg = error.message;
        } else if (error?.error) {
          serverMsg = error.error;
        } else if (error?.errors) {
          // If validation errors array, format as "path: message"
          if (Array.isArray(error.errors)) {
            const list = error.errors
              .map((e) => {
                try {
                  if (e?.path && e?.message) return `${e.path}: ${e.message}`;
                  if (typeof e === "string") return e;
                  return JSON.stringify(e);
                } catch {
                  return String(e);
                }
              })
              .filter(Boolean);
            serverMsg = list.length
              ? list.slice(0, 6).join(" • ")
              : JSON.stringify(error.errors);
          } else {
            serverMsg = JSON.stringify(error.errors);
          }
        } else {
          serverMsg = JSON.stringify(error);
        }
      } catch (e) {
        serverMsg = "Failed to parse server error";
        toast.error(e instanceof Error ? e.message : String(e));
      }

      dispatch(setError(serverMsg));
      dispatch(setLoading(false));
      if (typeof onErrorCallback === "function") {
        onErrorCallback(error, variables, context);
      } else {
        showError(serverMsg);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (typeof onSettledCallback === "function") {
        onSettledCallback(data, error, variables, context);
      }
    },
  });
};

// PUT update loan status: /loan-applications/:id/status
export const useUpdateLoanStatus = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  // PUT update status: /loan-applications/:id/status
  return useMutation({
    mutationFn: ({ id, status }) =>
      apiPut(`/loan-applications/${id}/status`, { status }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries({ queryKey: ["loanApplications"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan status updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update loan status";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
// GET all documents for a loan application: /loan-applications/:id/documents
export const useLoanDocuments = (id) => {
  return useQuery({
    queryKey: ["loanDocuments", id],
    queryFn: () => apiGet(`/loan-applications/${id}/documents`),
    enabled: !!id,
  });
};

export const useApproveLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiPost(`/loan-applications/${id}/approve`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries({ queryKey: ["loanApplications"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan approved successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to approve loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

// DELETE reject loan: /loan-applications/:id/reject
export const useRejectLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, reason }) =>
      apiPut(`/loan-applications/${id}/reject`, { reason }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries({ queryKey: ["loanApplications"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan rejected successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to reject loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

// Additional hooks for document upload, verification, and rejection can be added here following similar patterns
export const useUploadDocuments = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    // Accepts: { id, files: [{ file, documentType }], party }
    mutationFn: ({ id, files, party }) => {
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach(({ file, documentType }) => {
          if (file && documentType) {
            formData.append(documentType, file);
          }
        });
      } else if (files?.file && files?.documentType) {
        // fallback for single file
        formData.append(files.documentType, files.file);
      }
      if (party) formData.append("party", party);
      return apiPost(`/loan-applications/${id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loanApplication"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Documents uploaded successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to upload documents";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

// POST verify document: /loan-applications/documents/:documentId/verify
export const useVerifyDocument = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (documentId) =>
      apiPost(`/loan-applications/documents/${documentId}/verify`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loanApplication"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Document verified successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to verify document";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

// POST reject document: /loan-applications/documents/:documentId/reject
export const useRejectDocument = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ documentId, reason }) =>
      apiPost(`/loan-applications/documents/${documentId}/reject`, {
        reason,
      }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loanApplication"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Document rejected successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to reject document";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

// POST re-upload document: /loan-applications/documents/:documentId/reject
export const useReUploadDocument = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    // Expects: { loanApplicationId, documentType, file }
    mutationFn: ({ loanApplicationId, documentType, file }) => {
      const formData = new FormData();
      if (file) formData.append("document", file);
      // Do NOT set Content-Type header explicitly; let the browser/axios set the boundary
      return apiPost(
        `/loan-applications/documents/${loanApplicationId}/${documentType}/reupload`,
        formData,
      );
    },
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loanApplication"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Document re-uploaded successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to re-upload document";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
