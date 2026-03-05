import {useQuery,useMutation ,useQueryClient} from '@tanstack/react-query';


import {
  createLoanType,
  getLoanTypes,
  updateLoanType,
  deleteLoanType,
} from '../lib/api/loanType.api';

export const useLoanTypes = (param)=>{
  return useQuery({
    queryKey: ["loanTypes", param],
    queryFn: () => getLoanTypes(param),
  })
}


//TODO : hendle error and loading state in the component

export const useCreateLoanType = ()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLoanType,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey: ["loanTypes"]})
    },
    onError:(error)=>{
      console.log(error);
    }
  });
}


export const useUpdateLoanType = ()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLoanType,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey: ["loanTypes"]})
    },
    onError:(error)=>{
      console.log(error);
    }
  });
}


export const useDeleteLoanType = ()=>{
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLoanType,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey: ["loanTypes"]})
    },
    onError:(error)=>{
      console.log(error);
    }
  });
}