// apps/frontend/src/hooks/useAccount.js
import { useState, useCallback } from 'react';
import { accountService } from '../services/account.service';
import toast from 'react-hot-toast';

export const useAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountTree, setAccountTree] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [summary, setSummary] = useState(null);
  const [parentOptions, setParentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Fetch all accounts with filters
  const fetchAccounts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.getAccounts(filters);
      if (response.success) {
        setAccounts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch accounts');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching accounts';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single account by ID
  const fetchAccountById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.getAccountById(id);
      if (response.success) {
        setSelectedAccount(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Account not found');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching account';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch account tree (hierarchy)
  const fetchAccountTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.getAccountTree();
      if (response.success) {
        setAccountTree(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch account tree');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching account tree';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch account summary
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.getAccountSummary();
      if (response.success) {
        setSummary(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch summary');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching summary';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch parent options for dropdown
  const fetchParentOptions = useCallback(async () => {
    try {
      const response = await accountService.getParentOptions();
      if (response.success) {
        setParentOptions(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch parent options');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error fetching parent options';
      toast.error(errorMessage);
      return [];
    }
  }, []);

  // Create new account
  const createAccount = useCallback(async (accountData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.createAccount(accountData);
      if (response.success) {
        toast.success('Account created successfully');
        await fetchAccounts();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create account');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error creating account';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts]);

  // Update account
  const updateAccount = useCallback(async (id, accountData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.updateAccount(id, accountData);
      if (response.success) {
        toast.success('Account updated successfully');
        await fetchAccounts();
        if (selectedAccount?.id === id) {
          setSelectedAccount(response.data);
        }
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update account');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error updating account';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts, selectedAccount]);

  // Delete account
  const deleteAccount = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.deleteAccount(id);
      if (response.success) {
        toast.success('Account deleted successfully');
        await fetchAccounts();
        if (selectedAccount?.id === id) {
          setSelectedAccount(null);
        }
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete account');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error deleting account';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchAccounts, selectedAccount]);

  // Clear selected account
  const clearSelectedAccount = useCallback(() => {
    setSelectedAccount(null);
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setAccounts([]);
    setAccountTree([]);
    setSelectedAccount(null);
    setSummary(null);
    setParentOptions([]);
    setError(null);
    setPagination({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });
  }, []);

  return {
    // State
    accounts,
    accountTree,
    selectedAccount,
    summary,
    parentOptions,
    loading,
    error,
    pagination,
    
    // Methods
    fetchAccounts,
    fetchAccountById,
    fetchAccountTree,
    fetchSummary,
    fetchParentOptions,
    createAccount,
    updateAccount,
    deleteAccount,
    clearSelectedAccount,
    reset,
  };
};

export default useAccount;