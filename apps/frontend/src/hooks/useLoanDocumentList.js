import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api/apiClient";

export const useLoanDocumentList = (id) => {
  return useQuery({
    queryKey: ["loanDocumentList", id],
    queryFn: () => apiGet(`/loan-applications/${id}/documents/list`),
    enabled: !!id,
  });
};
