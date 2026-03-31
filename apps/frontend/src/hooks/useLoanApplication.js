import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost, apiPatch } from "../lib/api/apiClient";
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
// Accepts callbacks for onSuccess, onError, and onSettled for full control from the form
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
      const message = error?.message || "Failed to create loan application";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
      if (typeof onErrorCallback === "function") {
        onErrorCallback(error, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (typeof onSettledCallback === "function") {
        onSettledCallback(data, error, variables, context);
      }
    },
  });
};

export const useUpdateLoanStatus = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  // PUT update status: /loan-applications/:id/status
  return useMutation({
    mutationFn: ({ id, status }) =>
      apiPatch(`/loan-applications/${id}/status`, { status }),
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

export const useRejectLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, reason }) =>
      apiPost(`/loan-applications/${id}/reject`, { reason }),
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

export const useRejectDocument = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ applicationId, documentId, reason }) =>
      apiPost(
        `/loan-applications/${applicationId}/documents/${documentId}/reject`,
        {
          reason,
        },
      ),
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
