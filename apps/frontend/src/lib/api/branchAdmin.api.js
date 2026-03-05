import api from "../api"

export const createBranchAdmin = async (data)=>{
    const res = await api.post('/branch-admin',data)
    return res.data
}


export const updateBranchAdmins = async (id, data)=>{
    const res = await api.put(`/branch-admin/${id}`, data)
    return res.data
}

