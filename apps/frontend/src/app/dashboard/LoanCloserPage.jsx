import  { useState } from "react";
import {
  FileText,
  Printer,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Clipboard,
  Users,
  Download,
  IndianRupee,
} from "lucide-react";
import ActionMenu from "../../../components/admin/common/ActionMenu";
import Pagination from "../../../components/admin/common/Pagination";

export default function LoanCloserPage() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("foreclosure");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  // --- MOCK DATA ---
  const FORECLOSURE_DATA = [
    {
      id: "LN0012345",
      customer: "Arun Sharma",
      requestedDate: "2025-10-20",
      loanAmount: 500000,
      outstanding: 125000,
      foreclosureAmount: 120000,
      status: "Pending Approval",
      daysPending: 4,
      loanType: "Home Loan",
      tenure: "36 months",
      paidEMIs: 24
    },
    {
      id: "LN0012346",
      customer: "Priya Singh",
      requestedDate: "2025-10-18",
      loanAmount: 120000,
      outstanding: 25000,
      foreclosureAmount: 23000,
      status: "Approved",
      daysPending: 0,
      loanType: "Personal Loan",
      tenure: "24 months",
      paidEMIs: 18
    },
    {
      id: "LN0012347",
      customer: "Vijay Kumar",
      requestedDate: "2025-10-23",
      loanAmount: 800000,
      outstanding: 320000,
      foreclosureAmount: 300000,
      status: "Rejected",
      daysPending: 0,
      loanType: "Business Loan",
      tenure: "60 months",
      paidEMIs: 12
    },
    {
      id: "LN0012348",
      customer: "Sita Devi",
      requestedDate: "2025-10-15",
      loanAmount: 35000,
      outstanding: 8000,
      foreclosureAmount: 7500,
      status: "Pending Approval",
      daysPending: 9,
      loanType: "Education Loan",
      tenure: "12 months",
      paidEMIs: 8
    },
    {
      id: "LN0012349",
      customer: "Ravi Menon",
      requestedDate: "2025-10-24",
      loanAmount: 250000,
      outstanding: 45000,
      foreclosureAmount: 42000,
      status: "Approved",
      daysPending: 0,
      loanType: "Vehicle Loan",
      tenure: "36 months",
      paidEMIs: 30
    },
    {
      id: "LN0012350",
      customer: "Anil Kapoor",
      requestedDate: "2025-10-22",
      loanAmount: 150000,
      outstanding: 35000,
      foreclosureAmount: 32000,
      status: "Pending Approval",
      daysPending: 2,
      loanType: "Personal Loan",
      tenure: "18 months",
      paidEMIs: 15
    },
  ];

  const NOC_DATA = [
    {
      loanId: "LN0030101",
      customer: "Hema Chandra",
      customerId: "CUST001",
      mobile: "+91 9876543210",
      closeDate: "2025-10-01",
      closureType: "Normal Closure",
      printStatus: "Ready to Print",
      deliveryMode: "Email",
      nocNumber: "NOC2025001",
      generatedDate: "2025-10-02"
    },
    {
      loanId: "LN0030102",
      customer: "Iqbal Khan",
      customerId: "CUST002",
      mobile: "+91 9876543211",
      closeDate: "2025-09-25",
      closureType: "Foreclosure",
      printStatus: "Printed",
      deliveryMode: "Physical",
      nocNumber: "NOC2025002",
      generatedDate: "2025-09-26"
    },
    {
      loanId: "LN0030103",
      customer: "Jaya Varma",
      customerId: "CUST003",
      mobile: "+91 9876543212",
      closeDate: "2025-10-20",
      closureType: "Normal Closure",
      printStatus: "Pending Sign-off",
      deliveryMode: "Email",
      nocNumber: "NOC2025003",
      generatedDate: "2025-10-21"
    },
    {
      loanId: "LN0030104",
      customer: "Kiran Reddy",
      customerId: "CUST004",
      mobile: "+91 9876543213",
      closeDate: "2025-10-18",
      closureType: "Foreclosure",
      printStatus: "Ready to Print",
      deliveryMode: "Physical",
      nocNumber: "NOC2025004",
      generatedDate: "2025-10-19"
    },
    {
      loanId: "LN0030105",
      customer: "Lalit Mittal",
      customerId: "CUST005",
      mobile: "+91 9876543214",
      closeDate: "2025-10-15",
      closureType: "Normal Closure",
      printStatus: "Printed",
      deliveryMode: "Email",
      nocNumber: "NOC2025005",
      generatedDate: "2025-10-16"
    },
    {
      loanId: "LN0030106",
      customer: "Manoj Tiwari",
      customerId: "CUST006",
      mobile: "+91 9876543215",
      closeDate: "2025-10-12",
      closureType: "Foreclosure",
      printStatus: "Pending Sign-off",
      deliveryMode: "Physical",
      nocNumber: "NOC2025006",
      generatedDate: "2025-10-13"
    },
  ];

  // --- STATUS BADGE COMPONENT ---
  const StatusBadge = ({ status, days = 0 }) => {
    let styles = "";
    let icon = null;

    if (status === "Approved" || status === "Printed") {
      styles = "bg-green-50 text-green-700 border-green-200";
      icon = <CheckCircle className="w-3 h-3 mr-1" />;
    } else if (status === "Pending Approval" || status === "Pending Sign-off") {
      styles = days > 7 
        ? "bg-red-50 text-red-700 border-red-200" 
        : "bg-amber-50 text-amber-700 border-amber-200";
      icon = <Clock className="w-3 h-3 mr-1" />;
    } else if (status === "Rejected") {
      styles = "bg-red-50 text-red-700 border-red-200";
      icon = <XCircle className="w-3 h-3 mr-1" />;
    } else if (status === "Ready to Print") {
      styles = "bg-blue-50 text-blue-700 border-blue-200";
      icon = <Clipboard className="w-3 h-3 mr-1" />;
    } else {
      styles = "bg-gray-50 text-gray-700 border-gray-200";
      icon = <Clipboard className="w-3 h-3 mr-1" />;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${styles}`}
      >
        {icon} {status} {days > 0 && `(${days}d)`}
      </span>
    );
  };

  // --- PAGINATION FUNCTIONS ---
  const getCurrentTabData = () => {
    let data = [];
    
    if (activeTab === "foreclosure") {
      data = FORECLOSURE_DATA.filter(
        (l) =>
          l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "noc") {
      data = NOC_DATA.filter(
        (l) =>
          l.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data;
  };

  const getCurrentPageData = () => {
    const allData = getCurrentTabData();
    const totalPages = Math.ceil(allData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allData.length);
    
    return {
      data: allData.slice(startIndex, endIndex),
      totalPages,
      startIndex,
      endIndex,
      totalItems: allData.length
    };
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // --- TABLE CONTAINER COMPONENT ---
  const TableContainer = ({ title, children, showSearch = false, showTotal = true }) => {
    const { totalItems, startIndex, endIndex, totalPages } = getCurrentPageData();
    
    return (
      <div className="h-[520px] relative">
        <div className="p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              {showTotal && (
                <p className="text-sm text-gray-500 mt-1">
                  Showing {startIndex + 1}-{endIndex} of {totalItems} items
                </p>
              )}
            </div>
            
            {showSearch && (
              <div className="relative flex-1 sm:flex-initial">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by Loan ID or Customer..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </div>

          {/* Scrollable Table Area */}
          <div className="h-[340px] overflow-y-auto overflow-x-auto rounded-xl border border-gray-100">
            {children}
          </div>
        </div>

        {/* PAGINATION COMPONENT - Fixed at bottom */}
        {totalPages > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-white border-t border-gray-200 px-6">
            <div className="flex items-center justify-between h-full">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                containerClassName="flex gap-1"
                buttonClassName="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                activeButtonClassName="bg-blue-600 text-white border-blue-600"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- FORECLOSURE TABLE ---
  const ForeclosureTable = () => {
    const { data } = getCurrentPageData();
    
    const handleExportForeclosure = () => {
      const headers = ["Loan ID", "Customer", "Requested Date", "Loan Amount", "Outstanding", "Foreclosure Amount", "Status", "Loan Type"];
      const rows = FORECLOSURE_DATA.map(item => [
        item.id,
        item.customer,
        item.requestedDate,
        `₹${item.loanAmount.toLocaleString()}`,
        `₹${item.outstanding.toLocaleString()}`,
        `₹${item.foreclosureAmount.toLocaleString()}`,
        item.status,
        item.loanType
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "foreclosure-requests.csv";
      link.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div>
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleExportForeclosure}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download size={16} />
            Export Foreclosure List
          </button>
        </div>
        
        <TableContainer title="Foreclosure Requests" showSearch={true}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b text-left">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loan ID</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loan Details</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Details</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    No foreclosure requests found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-medium text-blue-600">
                      {item.id}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.customer}</p>
                        <p className="text-xs text-gray-500">Type: {item.loanType}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-gray-600">Tenure: {item.tenure}</p>
                        <p className="text-gray-600">Paid EMIs: {item.paidEMIs}</p>
                        <p className="text-gray-500 text-xs">{item.requestedDate}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Loan:</span> 
                          <span className="font-semibold ml-1">₹{item.loanAmount.toLocaleString()}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Outstanding:</span> 
                          <span className="font-semibold ml-1">₹{item.outstanding.toLocaleString()}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Foreclosure:</span> 
                          <span className="font-bold text-green-600 ml-1">₹{item.foreclosureAmount.toLocaleString()}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status} days={item.daysPending} />
                    </td>
                    <td className="p-4 text-right">
                      <ActionMenu
                        items={[
                          { 
                            label: "View Details", 
                            onClick: () => console.log("View", item.id),
                            icon: FileText
                          },
                          { 
                            label: "Approve Foreclosure", 
                            onClick: () => console.log("Approve", item.id),
                            icon: CheckCircle
                          },
                          { 
                            label: "Calculate Charges", 
                            onClick: () => console.log("Charges", item.id),
                            icon: IndianRupee
                          },
                          { 
                            label: "Generate NOC", 
                            onClick: () => console.log("Generate NOC", item.id),
                            icon: Printer
                          }
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableContainer>
      </div>
    );
  };

  // --- NOC TABLE ---
  const NocTable = () => {
    const { data } = getCurrentPageData();
    
    const handleExportNOC = () => {
      const headers = ["Loan ID", "Customer", "Customer ID", "Close Date", "Closure Type", "NOC Number", "Print Status", "Delivery Mode"];
      const rows = NOC_DATA.map(item => [
        item.loanId,
        item.customer,
        item.customerId,
        item.closeDate,
        item.closureType,
        item.nocNumber,
        item.printStatus,
        item.deliveryMode
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "noc-print-queue.csv";
      link.click();
      URL.revokeObjectURL(url);
    };

    const handlePrintNOC = (loanId) => {
      console.log("Print NOC for:", loanId);
      // Add your print logic here
    };

    const handleEmailNOC = (loanId) => {
      console.log("Email NOC for:", loanId);
      // Add your email logic here
    };

    return (
      <div>
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleExportNOC}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download size={16} />
            Export NOC List
          </button>
        </div>
        
        <TableContainer title="NOC Print Queue" showSearch={true}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b text-left">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">NOC Details</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Details</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Closure Info</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    No NOC records found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.loanId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-blue-600">{item.loanId}</p>
                        <p className="text-xs text-gray-500 mt-1">NOC: {item.nocNumber}</p>
                        <p className="text-xs text-gray-400">Generated: {item.generatedDate}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.customer}</p>
                        <p className="text-xs text-gray-500">ID: {item.customerId}</p>
                        <p className="text-xs text-gray-500">{item.mobile}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Close Date:</span> 
                          <span className="font-medium ml-1">{item.closeDate}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Type:</span> 
                          <span className={`font-medium ml-1 ${
                            item.closureType === "Foreclosure" 
                              ? "text-purple-600" 
                              : "text-green-600"
                          }`}>
                            {item.closureType}
                          </span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.deliveryMode === "Email" 
                          ? "bg-blue-50 text-blue-700 border border-blue-100" 
                          : "bg-gray-50 text-gray-700 border border-gray-100"
                      }`}>
                        {item.deliveryMode === "Email" ? "📧 Email" : "📦 Physical"}
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.printStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handlePrintNOC(item.loanId)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium border border-blue-100"
                        >
                          <Printer size={14} />
                          Print
                        </button>
                        <button
                          onClick={() => handleEmailNOC(item.loanId)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium border border-green-100"
                        >
                          📧 Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableContainer>
      </div>
    );
  };

  // --- TAB CONFIGURATION ---
  const tabs = [
    { id: "foreclosure", label: "Loan Foreclosure", icon: FileText },
    { id: "noc", label: "NOC Print", icon: Printer },
  ];

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> Loan Closure & NOC Management
          </h1>
          <p className="text-gray-500 mt-1 ml-11">
            Manage loan foreclosures and No Objection Certificates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-400 uppercase">Today</p>
            <p className="text-lg font-bold text-gray-700">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-gray-200 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium transition-all relative top-[1px] whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 border border-gray-200 border-b-white z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
          >
            <tab.icon
              size={18}
              className={
                activeTab === tab.id ? "text-blue-600" : "text-gray-400"
              }
            />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-200">
        <div className="animate-in fade-in duration-300">
          {activeTab === "foreclosure" && <ForeclosureTable />}
          {activeTab === "noc" && <NocTable />}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Foreclosure Requests</p>
              <p className="text-2xl font-bold text-gray-800">{FORECLOSURE_DATA.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-green-600">● {FORECLOSURE_DATA.filter(f => f.status === "Approved").length} Approved</span>
            <span className="text-amber-600">● {FORECLOSURE_DATA.filter(f => f.status === "Pending Approval").length} Pending</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending NOC Prints</p>
              <p className="text-2xl font-bold text-gray-800">{NOC_DATA.filter(n => n.printStatus !== "Printed").length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Printer className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-blue-600">● {NOC_DATA.filter(n => n.printStatus === "Ready to Print").length} Ready</span>
            <span className="text-amber-600">● {NOC_DATA.filter(n => n.printStatus === "Pending Sign-off").length} Pending</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Closure Amount</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{FORECLOSURE_DATA.reduce((sum, item) => sum + item.foreclosureAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <IndianRupee className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Foreclosure settlements</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">NOC Delivery</p>
              <p className="text-2xl font-bold text-gray-800">{NOC_DATA.filter(n => n.deliveryMode === "Email").length}</p>
              <p className="text-sm text-gray-500 mt-1">Emails / {NOC_DATA.length} Total</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}