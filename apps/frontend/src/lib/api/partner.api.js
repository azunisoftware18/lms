import api from "../api";

export const createPartner = async (data) => {
  const res = await api.post("/partners", data);
  return res.data;
};

export const getAllPartners = async (params) => {
  const res = await api.get("/partners/all", { params:{
    page: params?.page || 1,
    limit: params?.limit || 10,
    q: params?.q || "",

  } });
  return res.data?.data ?? res.data;
};

export const getPartnerById = async (id) => {
  const res = await api.get(`/partners/${id}`);
  return res.data;
};

export const updatePartner = async ({ id, data }) => {
  const res = await api.patch(`/partners/${id}`, data);
  return res.data;
};

export const createPartnerLead = async (data) => {
  const res = await api.post("/partners/create-lead", data);
  return res.data;
};

export const createPartnerLoan = async (data) => {
  const res = await api.post("/partners/create-loan-application", data);
  return res.data;
};

export const createChildPartner = async (data) => {
  const res = await api.post("/partners/create-child-partner", data);
  return res.data;
};