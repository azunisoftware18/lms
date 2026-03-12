import { useState } from "react";

 export const [applications, setApplications] = useState([
    { id: 1, customer: "Rahul Sharma", loanAmount: "₹50,000", status: "Pending", applicationDate: "2025-01-15", type: "Personal",loanNumber: "LN-2025-001", },
    { id: 2, customer: "Priya Patel", loanAmount: "₹75,000", status: "Under Review", applicationDate: "2025-01-14", type: "Business" },
    { id: 3, customer: "Amit Kumar", loanAmount: "₹1,00,000", status: "Approved", applicationDate: "2025-01-10", type: "Home" },
    { id: 4, customer: "Sneha Gupta", loanAmount: "₹2,50,000", status: "Rejected", applicationDate: "2025-01-08", type: "Education" },
    { id: 5, customer: "Ravi Verma", loanAmount: "₹1,50,000", status: "Pending", applicationDate: "2025-01-05", type: "Personal" },
    { id: 6, customer: "Meera Singh", loanAmount: "₹3,00,000", status: "Approved", applicationDate: "2025-01-03", type: "Business" },
    { id: 7, customer: "Karan Malhotra", loanAmount: "₹80,000", status: "Under Review", applicationDate: "2025-01-02", type: "Education" },
    { id: 8, customer: "Pooja Reddy", loanAmount: "₹2,00,000", status: "Pending", applicationDate: "2024-12-30", type: "Home" },
    { id: 9, customer: "Vikram Joshi", loanAmount: "₹1,20,000", status: "Approved", applicationDate: "2024-12-28", type: "Personal" },
    { id: 10, customer: "Anjali Desai", loanAmount: "₹4,00,000", status: "Rejected", applicationDate: "2024-12-25", type: "Business" },
    { id: 11, customer: "Rajesh Nair", loanAmount: "₹90,000", status: "Pending", applicationDate: "2024-12-20", type: "Education" },
    { id: 12, customer: "Suman Tiwari", loanAmount: "₹1,80,000", status: "Under Review", applicationDate: "2024-12-18", type: "Home" }
  ]);

  export const handleExport = () => {
      const headers = ["Customer", "Loan Type", "Amount", "Status", "Application Date"];
      const rows = applications.map(app => [
        app.customer,
        app.type,
        app.loanAmount,
        app.status,
        app.applicationDate,
      ]);
  
      const csvContent = [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "loan-applications.csv";
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };