import api from "./axios";

export const assignLoan = async ({ loanApplicationId, employeeId, role }) => {
  const res = await api.post(
    `/loan-assignment/loans/${loanApplicationId}/assign`,
    { employeeId, role }
  );
  return res.data;
};

export const unassignLoan = async (assignmentId) => {
  const res = await api.post(
    `/loan-assignment/loans/unassign/${assignmentId}`
  );
  return res.data;
};

export const getMyAssignedLoans = async () => {
  const res = await api.get("/loan-assignment/my-assigned-loans");
  return res.data;
};