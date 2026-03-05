import api from "../api";
export const createLoanType = async (data)=> {
    const res = await api.post("/loan-types", data);
    return res.data.data;
}

export const getLoanTypes = async (params) => {
    const res = await api.get("/loan-types", { params });
    return res.data.data;
}

export const updateLoanType = async ({id,data})=>{
    const res = await api.put(`/loan-types/${id}`, data);
    return res.data.data;
}
export const deleteLoanType = async (id)=>{
    const res = await api.delete(`/loan-types/${id}`);
    return res.data;
}

