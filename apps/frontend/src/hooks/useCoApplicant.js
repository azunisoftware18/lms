import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";

import {
    uploadCoApplicantDocument,
    reuploadCoApplicantDocument,
    getCoApplicants
} from "../lib/api/coApplicant.api";

export const useCoApplicants = (loanApplicationId)=>{
    return useQuery({
        queryKey:['coApplicants',loanApplicationId],
        queryFn:()=>getCoApplicants(loanApplicationId),
        enabled:!!loanApplicationId,
    })
}

export const useUploadCoApplicantDocument = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:uploadCoApplicantDocument,
        onSuccess:()=>{
            queryClient.invalidateQueries(['coApplicants'])
        },
        onError:(error)=>{
            console.error('Error uploading co-applicant document:', error)
        }
    })
}

export const useReuploadCoApplicantDocument = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:reuploadCoApplicantDocument,
        onSuccess:()=>{
            queryClient.invalidateQueries(['coApplicants'])
        },
        onError:(error)=>{
            console.error('Error re-uploading co-applicant document:', error)
        }


    })
}