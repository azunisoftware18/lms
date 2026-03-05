import api from "../api"
export const uploadCoApplicantDocument = async ({coApplicantId,files}) => {
    const fromData = new FormData();
    files.forEach((file) => {
        fromData.append('files', file);
    });

    const res = await api.post(`/co-applicant/documents/${coApplicantId}/upload`, fromData );
    return res.data
}



export const reuploadCoApplicantDocument = async({
    coApplicantId,
    documentType,
    file
})=>{
    const formdate = new fromData();
    FormData.append('file', file);

    const res = await api.post(`/co-applicant/documents/${coApplicantId}/${documentType}/reupload`, formdate);
    return res.data
}

export const getCoApplicants = async (loanApplicationId)=>{
    const res = await api.get(`/co-applicant/${loanApplicationId}`)
    return res.data
}