import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getAllKycs,
  getMyKyc,
  uploadKycDocuments,
  verifyKycDocument,
} from "../lib/api/kyc.api";
import {
  setLoading,
  setError,
  clearError,
  setKycs,
  setMyKyc,
  updateKycInList,
} from "../store/slices/kycSlice";

export const useAllKycs = (params) => {
  const dispatch = useDispatch();
  const kycs = useSelector((state) => state.kyc.kycs);
  const meta = useSelector((state) => state.kyc.meta);
  const loading = useSelector((state) => state.kyc.loading);
  const error = useSelector((state) => state.kyc.error);

  const { isFetching, refetch } = useQuery({
    queryKey: ["kycs", params],
    queryFn: () => getAllKycs(params),
    keepPreviousData: true,
    onSuccess: (data) => {
      dispatch(setKycs(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch KYC records";
      dispatch(setError(message));
      showError(message);
    },
  });

  return { kycs, meta, loading, error, isFetching, refetch };
};

export const useMyKyc = () => {
  const dispatch = useDispatch();
  const myKyc = useSelector((state) => state.kyc.myKyc);
  const loading = useSelector((state) => state.kyc.loading);
  const error = useSelector((state) => state.kyc.error);

  const query = useQuery({
    queryKey: ["myKyc"],
    queryFn: getMyKyc,
    onSuccess: (data) => {
      dispatch(setMyKyc(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch KYC data";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    myKyc,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useUploadKycDocuments = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: uploadKycDocuments,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["kycs"]);
      queryClient.invalidateQueries(["myKyc"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("KYC documents uploaded successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to upload KYC documents";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useVerifyKycDocument = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: verifyKycDocument,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateKycInList(data));
      queryClient.invalidateQueries(["kycs"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("KYC document verified successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to verify KYC document";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
