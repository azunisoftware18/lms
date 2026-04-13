import { useEffect, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from "../lib/api/apiClient";

export default function useEmployeeRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet('/employee-roles?includeInactive=true');
      const payload = res?.data ?? res;
      const list = payload?.data ?? payload ?? [];
      setRoles(list);
      return list;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const createRole = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost('/employee-roles', payload);
      const created = res?.data?.data ?? res?.data ?? res;
      if (created) setRoles((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRole = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPatch(`/employee-roles/${id}`, payload);
      const updated = res?.data?.data ?? res?.data ?? res;
      if (updated) setRoles((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRole = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/employee-roles/${id}`);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}
