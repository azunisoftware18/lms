import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getAllPartners,
  createPartner,
  updatePartner,
  createPartnerLead,
  createPartnerLoan,
} from "../lib/api/partner.api";
import {
  setLoading,
  setError,
  clearError,
  setPartners,
  addPartner,
  updatePartnerInList,
  setSelectedPartner,
} from "../store/slices/partnerSlice";

export const usePartners = (params) => {
  const dispatch = useDispatch();
  const partners = useSelector((state) => state.partner.partners);
  const meta = useSelector((state) => state.partner.meta);
  const loading = useSelector((state) => state.partner.loading);
  const error = useSelector((state) => state.partner.error);

  const { isFetching, refetch } = useQuery({
    queryKey: ["partners", params],
    queryFn: () => getAllPartners(params),
    keepPreviousData: true,
    onSuccess: (data) => {
      dispatch(setPartners(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch partners";
      dispatch(setError(message));
      showError(message);
    },
  });

  return { partners, meta, loading, error, isFetching, refetch };
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createPartner,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addPartner(data));
      queryClient.invalidateQueries(["partners"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create partner";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updatePartner,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updatePartnerInList(data));
      queryClient.invalidateQueries(["partners"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update partner";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCreatePartnerLead = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createPartnerLead,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner lead created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create partner lead";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCreatePartnerLoan = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createPartnerLoan,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner loan created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create partner loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};