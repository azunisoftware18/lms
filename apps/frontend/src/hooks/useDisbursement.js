import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const disburseLoanAPI = async ({ loanId, payload }) => {
  const token = localStorage.getItem("token"); // ✅ token safely get

  const response = await axios.post(
    `http://localhost:4000/api/disbursement/${loanId}/disburse`,
    payload,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "", // ✅ safe check
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const useDisbursement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disburseLoanAPI,

    onSuccess: (data) => {
      console.log("✅ Loan Disbursed:", data);

      // 🔄 refresh data
      queryClient.invalidateQueries(["loanApplications"]);
      queryClient.invalidateQueries(["disbursements"]);
    },

    onError: (error) => {
      console.error(
        "❌ Disbursement Failed:",
        error?.response?.data || error.message
      );
    },
  });
};