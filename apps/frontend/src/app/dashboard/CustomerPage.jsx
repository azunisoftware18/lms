import { useState } from "react";
import { Icons } from "../../components/common/Icon";
import { customersData } from "../../lib/dashboardDummyData";

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState("search");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const customers = customersData;

  const handleViewProfile = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab("profile");
  };    

  const handleBack = () => {
    setActiveTab("search");
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.pan.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ---------------- SEARCH LIST COMPONENT ---------------- */

  const RenderSearchList = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <Icons.Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by Name, Phone, PAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl"
            />
          </div>

          <button
            onClick={() => setActiveTab("add")}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl"
          >
            <Icons.Plus size={18} />
            Add Customer
          </button>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Customer ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">PAN</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewProfile(cust)}
                >
                  <td className="px-6 py-4 text-blue-600 font-medium">
                    {cust.id}
                  </td>

                  <td className="px-6 py-4">{cust.name}</td>

                  <td className="px-6 py-4">{cust.phone}</td>

                  <td className="px-6 py-4 font-mono">{cust.pan}</td>

                  <td className="px-6 py-4">{cust.city}</td>

                  <td className="px-6 py-4 text-right">
                    <Icons.ArrowRight size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ---------------- PROFILE COMPONENT ---------------- */

  const RenderProfile = () => {
    if (!selectedCustomer) return null;

    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-600"
        >
          <Icons.ChevronLeft size={18} />
          Back
        </button>

        <div className="bg-white p-6 border rounded-xl mb-6">
          <h2 className="text-2xl font-bold mb-2">{selectedCustomer.name}</h2>

          <p className="text-gray-500">Customer ID: {selectedCustomer.id}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Personal Info</h3>

            <p>
              <strong>Phone:</strong> {selectedCustomer.phone}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>
            <p>
              <strong>City:</strong> {selectedCustomer.city}
            </p>
            <p>
              <strong>PAN:</strong> {selectedCustomer.pan}
            </p>
            <p>
              <strong>Aadhaar:</strong> {selectedCustomer.aadhaar}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Loan History</h3>

            {selectedCustomer.loans.length > 0 ? (
              selectedCustomer.loans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex justify-between border-b py-2"
                >
                  <span>{loan.id}</span>
                  <span>{loan.amount}</span>
                  <span>{loan.status}</span>
                </div>
              ))
            ) : (
              <p>No loans found</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- MAIN PAGE ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Customer Management</h1>

      {activeTab === "search" && <RenderSearchList />}

      {activeTab === "profile" && <RenderProfile />}
    </div>
  );
}
