import api from "../api";

export const checkEligibility = async (loanApplicationId) => {
  const res = await api.get(
    `/rule-engine/eligibility-check/${loanApplicationId}`
  );
  return res.data;
};