import { RouterProvider } from 'react-router-dom';
import router from './app/router';
import AppProviders from './app/AppProviders';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
