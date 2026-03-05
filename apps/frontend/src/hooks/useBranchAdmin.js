import { useMutation } from "@tanstack/react-query";
import { createBranchAdmin,updateBranchAdmins } from "../lib/api/branchAdmin.api";

export const useCreateBranchAdmin = ()=>{
    return  useMutation({
        mutationFn:createBranchAdmin,

    }) 
}

export const useUpdateBranchAdmin =()=>{
    return useMutation({
        mutationFn:updateBranchAdmins
    })
}
   