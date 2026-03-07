import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getLoanApplications,
  getLoanApplicationById,
  createLoanApplication,
  updateLoanStatus,
  approveLoan,
  rejectLoan,
  uploadDocuments,
  verifyDocument,
  rejectDocument
} from "../lib/api/loanApplication.api";
import {
  setLoading,
  setError,
  clearError,
  setLoanApplications,
  setLoanApplication,
  addLoanApplication,
  updateLoanApplicationInList,
} from "../store/slices/loanApplicationSlice";

export const useLoanApplications = (params) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loanApplication?.loading);
  const error = useSelector(state => state.loanApplication?.error);

  return useQuery({
    queryKey: ["loanApplications", params],
    queryFn: () => getLoanApplications(params),
    onSuccess: (data) => {
      dispatch(setLoanApplications(data));
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch loan applications";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useLoanApplication = (id) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["loanApplication", id],
    queryFn: () => getLoanApplicationById(id),
    enabled: !!id,
    onSuccess: (data) => {
      dispatch(setLoanApplication(data));
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch loan application";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useCreateLoanApplication = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createLoanApplication,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addLoanApplication(data));
      qc.invalidateQueries(["loanApplications"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan application created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create loan application";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdateLoanStatus = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateLoanStatus,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries(["loanApplications"]);
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

export const useApproveLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: approveLoan,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries(["loanApplications"]);
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
    mutationFn: rejectLoan,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries(["loanApplications"]);
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
    mutationFn: uploadDocuments,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["loanApplication"]);
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
    mutationFn: verifyDocument,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["loanApplication"]);
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
    mutationFn: rejectDocument,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["loanApplication"]);
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