import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost, apiPatch, apiDelete } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setSanctions,
  addSanction,
  updateSanctionInList,
} from "../store/slices/sanctionSlice";

export const useSanctions = (params = {}) => {
  const dispatch = useDispatch();
  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["sanctions", normalizedParams],
    queryFn: () => apiGet(`/sanctions`, { params: normalizedParams }),
    onSuccess: (data) => {
      dispatch(setSanctions(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch sanctions";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useCreateSanction = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => apiPost(`/sanctions`, data),
    onMutate: () => dispatch(setLoading(true)),
    onSuccess: (data) => {
      // backend returns { sanction, updatedLoan } in create response
      if (data?.sanction) dispatch(addSanction(data.sanction));
      queryClient.invalidateQueries(["sanctions"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Sanction created successfully");
    },
    onError: (error) => {
      const serverData = error?.response?.data || error?.data || null;
      const message = serverData?.message || error?.message || "Failed to create sanction";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
      throw error;
    },
  });
};

export const useUpdateSanction = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, data }) => apiPatch(`/sanctions/${id}`, data),
    onMutate: () => dispatch(setLoading(true)),
    onSuccess: (data) => {
      dispatch(updateSanctionInList(data));
      queryClient.invalidateQueries(["sanctions"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Sanction updated successfully");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update sanction";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
      throw error;
    },
  });
};

export const useDeleteSanction = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiDelete(`/sanctions/${id}`),
    onMutate: () => dispatch(setLoading(true)),
    onSuccess: () => {
      queryClient.invalidateQueries(["sanctions"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Sanction deleted");
    },
    onError: (error) => {
      const message = error?.message || "Failed to delete sanction";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
      throw error;
    },
  });
};

export default null;
