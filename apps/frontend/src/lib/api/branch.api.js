import api from "../api"



//TODO : add error handling and loading states
//TODO:  more branch related api calls like get branches by company id, get branches by location etc

export const createbranch = async (branchData) => {
    const response = await api.post('/branch', branchData)
    return response.data
}

export const getBranches = async ()=>{
    const res = await api.get('/branch')
    return res.data
}

export const getBranchById = async (id) => {
    const res = await api.get(`/branch/${id}`)
    return res.data
}

export const updateBranch = async (id, branchData) => {
    const res = await api.put(`/branch/${id}`, branchData)
    return res.data
}

export const deleteBranch = async (id) => {
    const res = await api.delete(`/branch/${id}`)
    return res.data
}

export const getMainBranches = async () => {
    const res = await api.get('/branch/main')
    return res.data
}
