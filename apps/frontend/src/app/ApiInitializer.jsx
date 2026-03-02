import { useInitializeApi } from '../hooks/useInitializeApi';

export const ApiInitializer = ({ children }) => {
  useInitializeApi();
  return children;
};

export default ApiInitializer;