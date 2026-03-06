import api from '../api';
export const createLead = async (data)=>{
    try {
    const res = await api.post('/leads', data);
    return res.data;
}
catch (error) {
    throw new Error(getErrorMessage(error));
}   
};

export const getLeads = async (params) => {
    try {
        const res = await api.get('/leads', { params });
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));

    }
};

export const getLeadById = async (id) => {
    try {
        const res = await api.get(`/leads/${id}`);
        return res.data;
    }
    catch (error) {
        throw new Error(getErrorMessage(error));
    }
};


export const updateLeadStatus = async (id, status) => {
    try {
        const res = await api.patch(`/leads/${id}/status`, { status });
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const assignLead = async (id,assignedTo)=>{
    try {
        const res = await api.patch(`/leads/${id}/assign`, { assignedTo });
        return res.data;
    }
    catch (error) {
        throw new Error(getErrorMessage(error));
    }
}



export const convertLeadToLoan = async (id) =>{
    try {
        const res = await api.post(`/leads/${id}/convert`);
        return res.data;

    } 
    catch (error) {
        throw new Error(getErrorMessage(error));
    }

}
