import React, { useState } from 'react';

export default function IMDAuthorizationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    authorizationKey: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    console.log('Submitting Authorization Request:', formData);
    
    setTimeout(() => {
      setIsLoading(false);
      alert('Authorization requested successfully!');
      // Add your actual authentication/routing logic here
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header Section */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            IMD Portal Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your credentials to authorize access.
          </p>
        </div>

        {/* Authorization Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Authorization Key Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="authorizationKey">
                IMD Authorization Key
              </label>
              <input
                id="authorizationKey"
                name="authorizationKey"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="IMD-XXXX-XXXX"
                value={formData.authorizationKey}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Authorizing...' : 'Authorize Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}