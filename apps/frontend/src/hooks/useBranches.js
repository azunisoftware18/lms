import  {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';

import {
    getBranches,
    createbranch,
    getBranchById,
    updateBranch,
    deleteBranch,
    getMainBranches
} from '../lib/api/branch.api';


export const useCreateBranch = ()=>{
    const queryClient = useQueryClient()
    return useMutation(createbranch,{
        onSuccess:()=>{
            queryClient.invalidateQueries(['branches'])
        },
        onError:(error)=>{
            console.error('Error creating branch:', error)
        },
    })
}  
   
export const useUpdateBranch = ()=>{
    const queryClient = useQueryClient()
    return useMutation(({id,branchData})=>updateBranch(id,branchData),{
        onSuccess:()=>{
            queryClient.invalidateQueries(['branches'])
        },
        onError:(error)=>{
            console.error('Error updating branch:', error)
        },
    })
}

export const useDeleteBranch = ()=>{
    const queryClient = useQueryClient()
    return useMutation(deleteBranch,{
        onSuccess:()=>{
            queryClient.invalidateQueries(['branches'])
        }
    })
}


export const useBranches = ()=>{
    return useQuery(['branches'],getBranches,{
        onError:(error)=>{
            console.error('Error fetching branches:', error)
        },
    })
}

export const useBranchById = (id)=>{
    return useQuery(['branch',id],()=>getBranchById(id),{
        enabled:!!id,
        onError:(error)=>{
            console.error(`Error fetching branch with id ${id}:`, error)
        }
    })
}

export const useMainBranches = ()=>{
    return useQuery(['mainBranches'],getMainBranches,{
        onError:(error)=>{
            console.error('Error fetching main branches:', error)
        }
    })
}
