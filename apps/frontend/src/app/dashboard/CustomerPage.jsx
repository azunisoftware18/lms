import  { useState } from 'react';
import { 
  Search, Plus, User, FileText, CheckCircle, AlertTriangle, 
  ChevronLeft, Phone, MapPin, CreditCard, Users, 
  ArrowRight,  Edit,  
} from 'lucide-react';

export default function CustomerPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'add', 'profile', 'dedupe'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK DATA ---
  const [customers, setCustomers] = useState([
    { 
      id: "CUST001", name: "Rahul Sharma", phone: "9876543210", email: "rahul@example.com", 
      pan: "ABCDE1234F", aadhaar: "123456789012", city: "Jaipur", status: "Active", risk: "Low",
      dob: "1990-05-15", gender: "Male", address: "123, Vaishali Nagar, Jaipur",
      loans: [{ id: "LN-2023", amount: "₹50,000", status: "Active" }]
    },
    { 
      id: "CUST002", name: "Priya Verma", phone: "9988776655", email: "priya@example.com", 
      pan: "XYZAB5678C", aadhaar: "987654321098", city: "Delhi", status: "Active", risk: "Medium",
      dob: "1995-08-20", gender: "Female", address: "45, Rohini, Delhi",
      loans: []
    },
    { 
      id: "CUST003", name: "Amit Kumar", phone: "7766554433", email: "amit@example.com", 
      pan: "PQRST1234L", aadhaar: "112233445566", city: "Mumbai", status: "Blacklisted", risk: "High",
      dob: "1988-12-10", gender: "Male", address: "12, Andheri West, Mumbai",
      loans: [{ id: "LN-2021", amount: "₹2,00,000", status: "Defaulted" }]
    },
  ]);

  // --- ACTIONS ---
  
  const handleViewProfile = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab('profile');
  };

  const handleBack = () => {
    setActiveTab('search');
    setSelectedCustomer(null);
  };

  // --- RENDER COMPONENT: SEARCH & LIST ---
  const RenderSearchList = () => {
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.phone.includes(searchQuery) ||
      c.pan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="animate-in fade-in zoom-in duration-300">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name, Phone, PAN..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setActiveTab('dedupe')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 transition">
              <Users size={18} /> De-Dupe Check
            </button>
            <button onClick={() => setActiveTab('add')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <Plus size={18} /> Add Customer
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Cust ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">KYC (PAN)</th>
                  <th className="px-6 py-4">Risk Profile</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => handleViewProfile(cust)}>
                    <td className="px-6 py-4 text-blue-600 font-medium text-sm">{cust.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {cust.name.charAt(0)}
                        </div>
                        {cust.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{cust.phone}</div>
                      <div className="text-xs text-gray-400">{cust.city}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{cust.pan}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${cust.risk === 'Low' ? 'bg-green-50 text-green-700 border-green-100' : 
                          cust.risk === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 
                          'bg-orange-50 text-orange-700 border-orange-100'}`}>
                        {cust.risk} Risk
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No customers found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER COMPONENT: ADD CUSTOMER ---
  const RenderAddCustomer = () => {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft size={24} /></button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Customer</h2>
            <p className="text-gray-500 text-sm">Enter details to create a new profile.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form className="space-y-8">
            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><User size={20} className="text-blue-600"/> Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label><input type="text" className="w-full p-2.5 border rounded-lg" placeholder="Enter Name" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date of Birth</label><input type="date" className="w-full p-2.5 border rounded-lg" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Gender</label><select className="w-full p-2.5 border rounded-lg"><option>Male</option><option>Female</option></select></div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Phone size={20} className="text-blue-600"/> Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mobile Number</label><input type="tel" className="w-full p-2.5 border rounded-lg" placeholder="98765XXXXX" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email ID</label><input type="email" className="w-full p-2.5 border rounded-lg" placeholder="user@mail.com" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City</label><input type="text" className="w-full p-2.5 border rounded-lg" placeholder="Jaipur" /></div>
                <div className="md:col-span-3"><label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Address</label><textarea rows="2" className="w-full p-2.5 border rounded-lg" placeholder="Enter full address details..."></textarea></div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><CreditCard size={20} className="text-blue-600"/> KYC Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-center">
                  <span className="block font-semibold text-gray-700">PAN Card</span>
                  <input type="text" className="mt-2 w-full p-2 border rounded text-center uppercase" placeholder="Enter PAN Number" />
                  <p className="text-xs text-blue-500 mt-2">Click to Upload Image</p>
                </div>
                <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer text-center">
                  <span className="block font-semibold text-gray-700">Aadhaar Card</span>
                  <input type="text" className="mt-2 w-full p-2 border rounded text-center" placeholder="Enter Aadhaar Number" />
                  <p className="text-xs text-blue-500 mt-2">Click to Upload Front & Back</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button type="button" onClick={handleBack} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg mr-4">Cancel</button>
              <button type="button" className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg">Save Customer</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // --- RENDER COMPONENT: PROFILE ---
  const RenderProfile = () => {
    if (!selectedCustomer) return null;
    return (
      <div className="animate-in slide-in-from-right-8 duration-300">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full mr-2"><ChevronLeft /></button>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>ID: {selectedCustomer.id}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="flex items-center gap-1"><MapPin size={12}/> {selectedCustomer.city}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-600"><Edit size={16}/> Edit</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><FileText size={16}/> New Loan Application</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Phone</span> <span className="font-medium">{selectedCustomer.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span> <span className="font-medium">{selectedCustomer.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Gender</span> <span className="font-medium">{selectedCustomer.gender}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">DOB</span> <span className="font-medium">{selectedCustomer.dob}</span></div>
                <div className="mt-4 pt-4 border-t">
                  <span className="text-gray-500 block mb-1">Address</span>
                  <span className="font-medium">{selectedCustomer.address}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">KYC Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs uppercase">PAN Card</span>
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-medium text-lg">{selectedCustomer.pan}</span>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs uppercase">Aadhaar Card</span>
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-medium text-lg">{selectedCustomer.aadhaar}</span>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Loan History & Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                <span className="text-green-600 text-xs font-bold uppercase">Active Loans</span>
                <h4 className="text-2xl font-bold text-green-800 mt-1">{selectedCustomer.loans.length}</h4>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                <span className="text-blue-600 text-xs font-bold uppercase">Total Disbursed</span>
                <h4 className="text-2xl font-bold text-blue-800 mt-1">₹50K</h4>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                <span className="text-red-600 text-xs font-bold uppercase">Overdue Amount</span>
                <h4 className="text-2xl font-bold text-red-800 mt-1">₹0</h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Loan History</h3>
              {selectedCustomer.loans.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                      <th className="pb-2">Loan ID</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.loans.map((loan, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 text-blue-600 font-medium">{loan.id}</td>
                        <td className="py-3 font-medium">{loan.amount}</td>
                        <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{loan.status}</span></td>
                        <td className="py-3 text-right"><button className="text-sm text-gray-500 hover:text-blue-600">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-400">No active loans found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER COMPONENT: DE-DUPE CHECK ---
  const RenderDedupe = () => {
    const [checkVal, setCheckVal] = useState('');
    const [result, setResult] = useState(null); // null, 'loading', 'found', 'not-found'

    const runCheck = () => {
      setResult('loading');
      setTimeout(() => {
        // Mock logic: If value length > 5, assume found for demo
        if (checkVal.length > 5) {
          const found = customers.find(c => c.phone === checkVal || c.pan === checkVal);
          setResult(found ? 'found' : 'not-found');
        } else {
          setResult('not-found');
        }
      }, 1000);
    };

    return (
      <div className="max-w-2xl mx-auto mt-10 animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">De-Dupe Check</h2>
          <p className="text-gray-500 mt-2 mb-8">Enter PAN, Aadhaar, or Mobile Number to check if customer already exists.</p>

          <div className="relative max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Enter Number..." 
              value={checkVal}
              onChange={(e) => setCheckVal(e.target.value)}
              className="w-full pl-6 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
              onClick={runCheck}
              className="absolute right-2 top-2 bottom-2 bg-purple-600 text-white px-6 rounded-xl hover:bg-purple-700 transition font-medium"
            >
              Check
            </button>
          </div>

          {/* RESULT AREA */}
          <div className="mt-8 min-h-[100px]">
            {result === 'loading' && <div className="text-purple-600 font-medium animate-pulse">Scanning Database...</div>}
            
            {result === 'found' && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-center gap-4 text-red-700 animate-in slide-in-from-bottom-2">
                <AlertTriangle size={24} />
                <div className="text-left">
                  <h4 className="font-bold">Customer Exists!</h4>
                  <p className="text-sm">A profile with this detail already exists in the system.</p>
                </div>
                <button className="px-3 py-1 bg-white border border-red-200 rounded text-sm font-medium hover:bg-red-50 ml-auto">View Profile</button>
              </div>
            )}

            {result === 'not-found' && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-center gap-4 text-green-700 animate-in slide-in-from-bottom-2">
                <CheckCircle size={24} />
                <div className="text-left">
                  <h4 className="font-bold">No Match Found</h4>
                  <p className="text-sm">You can proceed to add this customer.</p>
                </div>
                <button onClick={() => setActiveTab('add')} className="px-3 py-1 bg-white border border-green-200 rounded text-sm font-medium hover:bg-green-50 ml-auto">Add Now</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      
      {/* Dynamic Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-500 mt-1">
            {activeTab === 'search' && "Search and manage customer database."}
            {activeTab === 'add' && "Onboarding new customer."}
            {activeTab === 'profile' && "Customer Profile View."}
            {activeTab === 'dedupe' && "Check for duplicate records."}
          </p>
        </div>
        
        {/* Navigation Tabs (Only visible when not in Add/Profile mode for cleaner UI, or always visible if preferred) */}
        {activeTab !== 'profile' && activeTab !== 'add' && (
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <button onClick={() => setActiveTab('search')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'search' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>Search List</button>
            <button onClick={() => setActiveTab('dedupe')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'dedupe' ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}>De-Dupe</button>
          </div>
        )}
      </div>

      {/* CONTENT AREA SWITCHER */}
      <div className="mt-4">
        {activeTab === 'search' && <RenderSearchList />}
        {activeTab === 'add' && <RenderAddCustomer />}
        {activeTab === 'profile' && <RenderProfile />}
        {activeTab === 'dedupe' && <RenderDedupe />}
      </div>

    </div>
  );
}