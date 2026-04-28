import React, { useState, useEffect } from 'react';
import { 
  Plus, DollarSign, TrendingUp, TrendingDown, CreditCard,
  Wallet, Calendar, Tag, Users, FileText, X, Edit2, Trash2,
  AlertCircle, CheckCircle, Clock, Filter, Download, Search,
  ArrowUpDown, ChevronLeft, ChevronRight, PieChart, BarChart3,
  Printer, Mail, Eye, MoreVertical, Upload, FileSpreadsheet,
  Home, Receipt, BookOpen, BarChart, Settings, RefreshCw
} from 'lucide-react';

const AccountingDashboard = () => {
  // ==================== STATE MANAGEMENT ====================
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Expense States
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseCategory, setExpenseCategory] = useState('Other');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePaymentMode, setExpensePaymentMode] = useState('Cash');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseSort, setExpenseSort] = useState('date_desc');

  // Receivable States
  const [receivables, setReceivables] = useState([]);
  const [showReceivableModal, setShowReceivableModal] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState(null);
  const [newReceivable, setNewReceivable] = useState({
    customer: '',
    amount: '',
    dueDate: '',
    invoiceNo: '',
    notes: ''
  });
  const [receivableFilter, setReceivableFilter] = useState('all');
  const [receivableSearch, setReceivableSearch] = useState('');

  // Report States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('expense');
  const [reportPeriod, setReportPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);
  
  // Additional States
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ==================== DUMMY DATA GENERATORS ====================
  
  const generateDummyExpenses = () => {
    const categories = ['Office Supplies', 'Travel', 'Utilities', 'Rent', 'Salary', 'Marketing', 'Software', 'Training', 'Maintenance', 'Other'];
    const vendors = ['Amazon Business', 'MakeMyTrip', 'Tata Power', 'Google Ads', 'Microsoft', 'Staples', 'Uber', 'Zomato', 'Swiggy', 'Flipkart', 'Apple', 'Dell', 'IBM', 'Infosys', 'TCS'];
    const paymentModes = ['Cash', 'Bank Transfer', 'Credit Card', 'Debit Card', 'UPI', 'Cheque'];
    const descriptions = [
      'Monthly subscription', 'Team lunch', 'Office equipment', 'Software license',
      'Travel reimbursement', 'Client meeting', 'Training session', 'Maintenance work',
      'Utility bill payment', 'Marketing campaign', 'Hardware purchase', 'Cloud services',
      'Annual renewal', 'Consulting fees', 'Legal services', 'Insurance premium'
    ];
    
    const dummyExpenses = [];
    const startDate = new Date(2024, 0, 1); // Jan 1, 2024
    const endDate = new Date(2026, 3, 30); // April 30, 2026
    
    for (let i = 1; i <= 65; i++) {
      const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const dateStr = randomDate.toISOString().split('T')[0];
      const monthYear = randomDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      // Different amount ranges based on category
      let amount;
      if (category === 'Rent') amount = 35000 + Math.random() * 25000;
      else if (category === 'Salary') amount = 80000 + Math.random() * 120000;
      else if (category === 'Marketing') amount = 10000 + Math.random() * 40000;
      else if (category === 'Travel') amount = 5000 + Math.random() * 25000;
      else if (category === 'Software') amount = 5000 + Math.random() * 20000;
      else amount = 1000 + Math.random() * 12000;
      
      dummyExpenses.push({
        id: i,
        date: dateStr,
        category: category,
        amount: Math.round(amount / 100) * 100,
        paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
        vendor: vendors[Math.floor(Math.random() * vendors.length)] + (Math.random() > 0.7 ? ' Inc.' : ''),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        month: monthYear
      });
    }
    
    // Sort by date descending (newest first)
    dummyExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    return dummyExpenses;
  };
  
  const generateDummyReceivables = () => {
    const customers = [
      'ABC Corp', 'XYZ Ltd', 'PQR Industries', 'Tech Solutions Inc', 'Global Trading Co',
      'Innovative Systems', 'Digital Dynamics', 'Creative Minds Agency', 'Future Technologies',
      'Metro Enterprises', 'Summit Partners', 'Horizon Ventures', 'Pinnacle Group',
      'Stellar Solutions', 'NexGen Technologies', 'Prime Consulting', 'Elite Services'
    ];
    const notes = [
      'Project payment - Q1 deliverable', 'Consulting fees - March', 'Product supply - Batch #001',
      'Software development services', 'Equipment supply', 'Annual maintenance contract',
      'Website development', 'SEO services', 'Cloud hosting fees', 'Training workshop',
      'License renewal', 'Support contract', 'Implementation fees', 'Custom development'
    ];
    
    const dummyReceivables = [];
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2026, 5, 30);
    
    for (let i = 1; i <= 35; i++) {
      const randomDueDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const randomCreatedDate = new Date(randomDueDate.getTime() - Math.random() * 45 * 24 * 60 * 60 * 1000);
      const dueDateStr = randomDueDate.toISOString().split('T')[0];
      const createdStr = randomCreatedDate.toISOString().split('T')[0];
      
      // Determine status based on due date
      let status;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (randomDueDate < today && Math.random() > 0.35) {
        status = 'Overdue';
      } else if (Math.random() > 0.65) {
        status = 'Paid';
      } else {
        status = 'Pending';
      }
      
      const amount = 5000 + Math.random() * 65000;
      
      dummyReceivables.push({
        id: i,
        customer: customers[Math.floor(Math.random() * customers.length)],
        amount: Math.round(amount / 100) * 100,
        dueDate: dueDateStr,
        status: status,
        invoiceNo: `INV-${String(100 + i).padStart(3, '0')}`,
        notes: notes[Math.floor(Math.random() * notes.length)],
        createdAt: createdStr
      });
    }
    
    return dummyReceivables;
  };

  // ==================== INITIAL DATA ====================
  
  useEffect(() => {
    // Load saved data from localStorage or use dummy data
    const savedExpenses = localStorage.getItem('accounting_expenses');
    const savedReceivables = localStorage.getItem('accounting_receivables');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      setExpenses(generateDummyExpenses());
    }
    
    if (savedReceivables) {
      setReceivables(JSON.parse(savedReceivables));
    } else {
      setReceivables(generateDummyReceivables());
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('accounting_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);
  
  useEffect(() => {
    if (receivables.length > 0) {
      localStorage.setItem('accounting_receivables', JSON.stringify(receivables));
    }
  }, [receivables]);

  // Set default selected month to current month
  useEffect(() => {
    const currentDate = new Date();
    const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    setSelectedMonth(currentMonthYear);
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Update receivable statuses based on due date
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const updatedReceivables = receivables.map(rec => {
      if (rec.status === 'Paid') return rec;
      const dueDate = new Date(rec.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        return { ...rec, status: 'Overdue' };
      }
      return rec;
    });
    
    if (JSON.stringify(updatedReceivables) !== JSON.stringify(receivables)) {
      setReceivables(updatedReceivables);
    }
  }, [receivables]);

  // ==================== CONSTANTS ====================
  
  const categories = ['Office Supplies', 'Travel', 'Utilities', 'Rent', 'Salary', 'Marketing', 'Software', 'Training', 'Maintenance', 'Other'];
  const paymentModes = ['Cash', 'Bank Transfer', 'Credit Card', 'Debit Card', 'UPI', 'Cheque'];

  // ==================== HELPER FUNCTIONS ====================
  
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  // Get month options for dropdown (last 12 months)
  const getMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
    return months;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Filter expenses for selected month
  const getFilteredExpenses = () => {
    let filtered = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const expMonthYear = expDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      return expMonthYear === selectedMonth;
    });
    
    // Apply additional filters
    if (expenseFilter !== 'all') {
      filtered = filtered.filter(exp => exp.category === expenseFilter);
    }
    
    if (expenseSearch) {
      filtered = filtered.filter(exp => 
        exp.vendor.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        exp.description.toLowerCase().includes(expenseSearch.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (expenseSort) {
      case 'date_asc':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date_desc':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'amount_asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'amount_desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return filtered;
  };

  // Get filtered receivables
  const getFilteredReceivables = () => {
    let filtered = [...receivables];
    
    if (receivableFilter !== 'all') {
      filtered = filtered.filter(rec => rec.status === receivableFilter);
    }
    
    if (receivableSearch) {
      filtered = filtered.filter(rec => 
        rec.customer.toLowerCase().includes(receivableSearch.toLowerCase()) ||
        rec.invoiceNo.toLowerCase().includes(receivableSearch.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Get paginated expenses
  const getPaginatedExpenses = () => {
    const filtered = getFilteredExpenses();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  // Calculate totals
  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const expMonthYear = expDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    return expMonthYear === selectedMonth;
  });

  const totalCurrentMonthExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Category totals for current month
  const categoryTotals = currentMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  
  // Get top categories
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Previous month expenses for comparison
  const getPreviousMonthExpenses = () => {
    const currentDate = new Date();
    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const prevMonthYear = prevDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const expMonthYear = expDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      return expMonthYear === prevMonthYear;
    }).reduce((sum, exp) => sum + exp.amount, 0);
  };
  
  const previousMonthTotal = getPreviousMonthExpenses();
  const monthOverMonthChange = previousMonthTotal ? ((totalCurrentMonthExpenses - previousMonthTotal) / previousMonthTotal * 100) : 0;
  
  // Receivables calculations
  const totalReceivables = receivables.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueReceivables = receivables.filter(r => r.status === 'Overdue').reduce((sum, r) => sum + r.amount, 0);
  const pendingReceivables = receivables.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);
  const paidReceivables = receivables.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
  
  // All time totals
  const allTimeExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageMonthlyExpense = allTimeExpenses / 12;

  // ==================== EXPENSE HANDLERS ====================
  
  const handleAddExpense = () => {
    if (!expenseAmount || parseFloat(expenseAmount) === 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    
    if (parseFloat(expenseAmount) < 0) {
      showNotification('Amount cannot be negative', 'error');
      return;
    }

    const expenseMonth = new Date(expenseDate).toLocaleString('default', { month: 'long', year: 'numeric' });

    if (editingExpense) {
      setExpenses(expenses.map(exp => 
        exp.id === editingExpense.id 
          ? {
              ...exp,
              date: expenseDate,
              category: expenseCategory,
              amount: parseFloat(expenseAmount),
              paymentMode: expensePaymentMode,
              vendor: expenseVendor.trim() || 'Unknown',
              description: expenseDescription.trim() || '-',
              month: expenseMonth
            }
          : exp
      ));
      setEditingExpense(null);
      showNotification('Expense updated successfully!', 'success');
    } else {
      const newExpense = {
        id: Date.now(),
        date: expenseDate,
        category: expenseCategory,
        amount: parseFloat(expenseAmount),
        paymentMode: expensePaymentMode,
        vendor: expenseVendor.trim() || 'Unknown',
        description: expenseDescription.trim() || '-',
        month: expenseMonth
      };
      setExpenses([newExpense, ...expenses]);
      showNotification('Expense added successfully!', 'success');
    }
    
    resetExpenseForm();
  };
  
  const resetExpenseForm = () => {
    setExpenseAmount('');
    setExpenseVendor('');
    setExpenseDescription('');
    setExpenseCategory('Other');
    setExpensePaymentMode('Cash');
    setExpenseDate(new Date().toISOString().split('T')[0]);
  };
  
  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
      showNotification('Expense deleted successfully!', 'success');
    }
  };
  
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseDate(expense.date);
    setExpenseCategory(expense.category);
    setExpenseAmount(expense.amount.toString());
    setExpensePaymentMode(expense.paymentMode);
    setExpenseVendor(expense.vendor);
    setExpenseDescription(expense.description);
    setActiveTab('expenses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingExpense(null);
    resetExpenseForm();
  };

  // ==================== RECEIVABLE HANDLERS ====================
  
  const handleAddReceivable = () => {
    if (!newReceivable.customer.trim() || !newReceivable.amount || !newReceivable.dueDate) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    
    if (parseFloat(newReceivable.amount) <= 0) {
      showNotification('Amount must be greater than 0', 'error');
      return;
    }

    const dueDateObj = new Date(newReceivable.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const status = dueDateObj < today ? 'Overdue' : 'Pending';

    if (editingReceivable) {
      setReceivables(receivables.map(rec => 
        rec.id === editingReceivable.id 
          ? {
              ...rec,
              customer: newReceivable.customer.trim(),
              amount: parseFloat(newReceivable.amount),
              dueDate: newReceivable.dueDate,
              status: status,
              invoiceNo: newReceivable.invoiceNo.trim() || rec.invoiceNo,
              notes: newReceivable.notes.trim()
            }
          : rec
      ));
      setEditingReceivable(null);
      showNotification('Receivable updated successfully!', 'success');
    } else {
      const receivable = {
        id: Date.now(),
        customer: newReceivable.customer.trim(),
        amount: parseFloat(newReceivable.amount),
        dueDate: newReceivable.dueDate,
        status: status,
        invoiceNo: newReceivable.invoiceNo.trim() || `INV-${Date.now()}`,
        notes: newReceivable.notes.trim(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setReceivables([...receivables, receivable]);
      showNotification('Receivable added successfully!', 'success');
    }
    
    setNewReceivable({ customer: '', amount: '', dueDate: '', invoiceNo: '', notes: '' });
    setShowReceivableModal(false);
  };
  
  const handleEditReceivable = (receivable) => {
    setEditingReceivable(receivable);
    setNewReceivable({
      customer: receivable.customer,
      amount: receivable.amount.toString(),
      dueDate: receivable.dueDate,
      invoiceNo: receivable.invoiceNo,
      notes: receivable.notes || ''
    });
    setShowReceivableModal(true);
  };
  
  const handleDeleteReceivable = (id) => {
    if (window.confirm('Are you sure you want to delete this receivable? This action cannot be undone.')) {
      setReceivables(receivables.filter(rec => rec.id !== id));
      showNotification('Receivable deleted successfully!', 'success');
    }
  };
  
  const handleMarkAsPaid = (id) => {
    setReceivables(receivables.map(rec => 
      rec.id === id ? { ...rec, status: 'Paid' } : rec
    ));
    showNotification('Receivable marked as paid!', 'success');
  };
  
  const cancelReceivableEdit = () => {
    setEditingReceivable(null);
    setNewReceivable({ customer: '', amount: '', dueDate: '', invoiceNo: '', notes: '' });
    setShowReceivableModal(false);
  };

  // Reset to dummy data
  const resetToDummyData = () => {
    if (window.confirm('This will replace all your current data with fresh dummy data. Any unsaved changes will be lost. Continue?')) {
      setExpenses(generateDummyExpenses());
      setReceivables(generateDummyReceivables());
      showNotification('Reset to dummy data successfully!', 'success');
    }
  };

  // ==================== EXPORT FUNCTIONS ====================
  
  const exportExpensesToCSV = () => {
    const filteredExpenses = getFilteredExpenses();
    const headers = ['Date', 'Vendor', 'Category', 'Amount', 'Payment Mode', 'Description'];
    const csvData = filteredExpenses.map(exp => [
      exp.date,
      exp.vendor,
      exp.category,
      exp.amount,
      exp.paymentMode,
      exp.description
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${selectedMonth.replace(/ /g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Expenses exported successfully!', 'success');
  };
  
  const exportReceivablesToCSV = () => {
    const headers = ['Invoice No', 'Customer', 'Amount', 'Due Date', 'Status', 'Notes'];
    const csvData = receivables.map(rec => [
      rec.invoiceNo,
      rec.customer,
      rec.amount,
      rec.dueDate,
      rec.status,
      rec.notes || ''
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receivables_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Receivables exported successfully!', 'success');
  };

  // ==================== REPORT FUNCTIONS ====================
  
  const generateReport = () => {
    let data = {};
    
    if (reportType === 'expense') {
      let filteredExpenses = [...expenses];
      const now = new Date();
      
      if (reportPeriod === 'month') {
        filteredExpenses = filteredExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
        });
      } else if (reportPeriod === 'quarter') {
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= threeMonthsAgo);
      } else if (reportPeriod === 'year') {
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= oneYearAgo);
      }
      
      const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const byCategory = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});
      
      data = { total, byCategory, count: filteredExpenses.length };
    } else if (reportType === 'receivable') {
      const totalOutstanding = receivables.filter(r => r.status !== 'Paid').reduce((sum, r) => sum + r.amount, 0);
      const overdue = receivables.filter(r => r.status === 'Overdue').reduce((sum, r) => sum + r.amount, 0);
      data = { totalOutstanding, overdue, pending: pendingReceivables, totalReceivables };
    }
    
    setReportData(data);
    showNotification('Report generated successfully!', 'success');
    setShowReportModal(false);
    setActiveTab('reports');
  };

  // ==================== RENDER FUNCTIONS ====================
  
  const filteredExpensesList = getFilteredExpenses();
  const paginatedExpenses = getPaginatedExpenses();
  const totalPages = Math.ceil(filteredExpensesList.length / itemsPerPage);
  const uniqueCategories = ['all', ...new Set(expenses.map(exp => exp.category))];
  const filteredReceivables = getFilteredReceivables();

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="px-6 border-t border-gray-200">
      <nav className="flex space-x-8">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
          { id: 'expenses', label: 'Expenses', icon: <Receipt className="w-4 h-4" /> },
          { id: 'receivables', label: 'Receivables', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'reports', label: 'Reports', icon: <BarChart className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  // Dashboard View
  const DashboardView = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentMonthExpenses)}</p>
              <p className="text-xs text-gray-400 mt-1">{selectedMonth}</p>
              {monthOverMonthChange !== 0 && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${monthOverMonthChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {monthOverMonthChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(monthOverMonthChange).toFixed(1)}% from last month
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Receivables</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalReceivables)}</p>
              <p className="text-xs text-gray-400 mt-1">Across {receivables.length} invoices</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(overdueReceivables)}</p>
              <p className="text-xs text-gray-400 mt-1">Payment pending</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{currentMonthExpenses.length}</p>
              <p className="text-xs text-gray-400 mt-1">This month</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Quick Expense Entry */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">
                {editingExpense ? '✏️ Edit Expense' : '➕ Quick Expense Entry'}
              </h2>
              <button
                onClick={resetToDummyData}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 flex items-center gap-1 transition-colors"
                title="Reset to dummy data"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={expensePaymentMode}
                    onChange={(e) => setExpensePaymentMode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    {paymentModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor / Payee</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter vendor name"
                    value={expenseVendor}
                    onChange={(e) => setExpenseVendor(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    placeholder="Brief note (optional)"
                    rows="2"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddExpense}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" /> 
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                {editingExpense && (
                  <button onClick={cancelEdit} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Dashboard Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Breakdown */}
          {topCategories.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="font-semibold text-gray-900">🎯 Top Spending Categories - {selectedMonth}</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {topCategories.map(([category, total]) => (
                    <div key={category} className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 truncate">{category}</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(total)}</p>
                      <p className="text-xs text-gray-400">
                        {((total / totalCurrentMonthExpenses) * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">📝 Recent Expenses</h2>
              <button 
                onClick={() => setActiveTab('expenses')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {currentMonthExpenses.slice(0, 5).map(expense => (
                <div key={expense.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{expense.vendor}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{expense.category}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(expense.date)}</p>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              ))}
              {currentMonthExpenses.length === 0 && (
                <div className="px-5 py-8 text-center text-gray-500">No expenses this month</div>
              )}
            </div>
          </div>

          {/* Recent Receivables */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">📋 Recent Receivables</h2>
              <button 
                onClick={() => setActiveTab('receivables')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {receivables.filter(r => r.status !== 'Paid').slice(0, 5).map(inv => (
                <div key={inv.id} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{inv.customer}</p>
                      <p className="text-xs text-gray-500">Due: {formatDate(inv.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(inv.amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {receivables.filter(r => r.status !== 'Paid').length === 0 && (
                <div className="px-5 py-8 text-center text-gray-500">No outstanding receivables</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Expenses View
  const ExpensesView = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">📊 Expenses - {selectedMonth}</h2>
          <p className="text-sm text-gray-500">
            Total: <span className="font-bold text-gray-900">{formatCurrency(totalCurrentMonthExpenses)}</span>
            <span className="text-gray-400 ml-2">({currentMonthExpenses.length} transactions)</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={expenseSearch}
              onChange={(e) => setExpenseSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={expenseFilter}
            onChange={(e) => setExpenseFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={expenseSort}
            onChange={(e) => setExpenseSort(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="date_desc">📅 Newest First</option>
            <option value="date_asc">📅 Oldest First</option>
            <option value="amount_desc">💰 Highest First</option>
            <option value="amount_asc">💰 Lowest First</option>
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {getMonthOptions().map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <button
            onClick={exportExpensesToCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={resetToDummyData}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset Data
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">📝 Expense Transactions</h2>
          <span className="text-xs text-gray-500">{filteredExpensesList.length} entries</span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {paginatedExpenses.length === 0 ? (
            <div className="px-5 py-12 text-center text-gray-500">
              {expenseSearch || expenseFilter !== 'all' ? (
                <>
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No matching expenses found</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                  </div>
                  <p>No expenses recorded for {selectedMonth}</p>
                </>
              )}
            </div>
          ) : (
            paginatedExpenses.map(expense => (
              <div key={expense.id} className="px-5 py-3 hover:bg-gray-50 transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-gray-900">{expense.vendor}</span>
                      <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{expense.category}</span>
                    </div>
                    {expense.description !== '-' && expense.description !== '' && (
                      <p className="text-sm text-gray-500 mt-1">{expense.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <CreditCard className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{expense.paymentMode}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditExpense(expense)} className="p-1 hover:bg-blue-50 rounded">
                        <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                      </button>
                      <button onClick={() => handleDeleteExpense(expense.id)} className="p-1 hover:bg-red-50 rounded">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-200 flex justify-between items-center">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {currentMonthExpenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">💰 Highest Expense</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(Math.max(...currentMonthExpenses.map(e => e.amount)))}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {currentMonthExpenses.find(e => e.amount === Math.max(...currentMonthExpenses.map(e => e.amount)))?.category}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-400 opacity-75" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">📊 Average Expense</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(totalCurrentMonthExpenses / currentMonthExpenses.length)}
                </p>
                <p className="text-xs text-green-600 mt-1">per transaction</p>
              </div>
              <TrendingDown className="w-10 h-10 text-green-400 opacity-75" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Receivables View
  const ReceivablesView = () => (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">📋 Receivables Management</h2>
          <p className="text-sm text-gray-500">
            Total Outstanding: <span className="font-bold text-gray-900">{formatCurrency(totalReceivables)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingReceivable(null);
              setNewReceivable({ customer: '', amount: '', dueDate: '', invoiceNo: '', notes: '' });
              setShowReceivableModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Receivable
          </button>
          <button onClick={exportReceivablesToCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={resetToDummyData} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> Reset Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Receivables</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalReceivables)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(pendingReceivables)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(overdueReceivables)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(paidReceivables)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by customer or invoice..."
            value={receivableSearch}
            onChange={(e) => setReceivableSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <select
          value={receivableFilter}
          onChange={(e) => setReceivableFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      {/* Receivables Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReceivables.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{inv.invoiceNo}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{inv.customer}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">{formatCurrency(inv.amount)}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {inv.status !== 'Paid' && (
                        <button onClick={() => handleMarkAsPaid(inv.id)} className="p-1 hover:bg-green-50 rounded" title="Mark as Paid">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                      <button onClick={() => handleEditReceivable(inv)} className="p-1 hover:bg-blue-50 rounded" title="Edit">
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </button>
                      <button onClick={() => handleDeleteReceivable(inv.id)} className="p-1 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReceivables.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-gray-500">
                    No receivables found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Reports View
  const ReportsView = () => (
    <div className="space-y-6">
      {/* Report Generation Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-semibold text-gray-900">📈 Generate Custom Report</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">Expense Summary</option>
                <option value="receivable">Receivables Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="month">Current Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last 12 Months</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={generateReport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Generate Report
            </button>
            <button
              onClick={resetToDummyData}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* Report Display */}
      {reportData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-semibold text-gray-900">📊 Report Results</h2>
          </div>
          <div className="p-6">
            {reportType === 'expense' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(reportData.total)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-600">Number of Transactions</p>
                    <p className="text-2xl font-bold text-green-700">{reportData.count}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-purple-600">Average Transaction</p>
                    <p className="text-2xl font-bold text-purple-700">{formatCurrency(reportData.total / reportData.count)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Category Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(reportData.byCategory).map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category}</span>
                          <span>{formatCurrency(amount)} ({((amount / reportData.total) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(amount / reportData.total) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {reportType === 'receivable' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-yellow-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-yellow-700">{formatCurrency(reportData.totalOutstanding)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-red-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-700">{formatCurrency(reportData.overdue)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600">Pending</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(reportData.pending)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Yearly Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-semibold text-gray-900">📅 Yearly Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Expenses (YTD)</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(allTimeExpenses)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Monthly Average</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(averageMonthlyExpense)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Receivables</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalReceivables)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Collection Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {totalReceivables + paidReceivables > 0 
                  ? Math.round((paidReceivables / (totalReceivables + paidReceivables)) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Accounting Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage expenses, track receivables & generate reports</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (activeTab === 'expenses') exportExpensesToCSV();
                else if (activeTab === 'receivables') exportReceivablesToCSV();
                else showNotification('Please go to Expenses or Receivables tab to export', 'error');
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Reports
            </button>
            <button
              onClick={resetToDummyData}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Reset to dummy data"
            >
              <RefreshCw className="w-4 h-4" /> Reset Data
            </button>
          </div>
        </div>
        <TabNavigation />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'expenses' && <ExpensesView />}
        {activeTab === 'receivables' && <ReceivablesView />}
        {activeTab === 'reports' && <ReportsView />}
      </div>

      {/* Add/Edit Receivable Modal */}
      {showReceivableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">
                {editingReceivable ? '✏️ Edit Receivable' : '➕ Add Receivable'}
              </h3>
              <button onClick={cancelReceivableEdit} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={newReceivable.customer}
                  onChange={(e) => setNewReceivable({...newReceivable, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newReceivable.amount}
                  onChange={(e) => setNewReceivable({...newReceivable, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={newReceivable.dueDate}
                  onChange={(e) => setNewReceivable({...newReceivable, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                <input
                  type="text"
                  value={newReceivable.invoiceNo}
                  onChange={(e) => setNewReceivable({...newReceivable, invoiceNo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="INV-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={newReceivable.notes}
                  onChange={(e) => setNewReceivable({...newReceivable, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={cancelReceivableEdit} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAddReceivable} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingReceivable ? 'Update' : 'Add'} Receivable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">📈 Generate Report</h3>
              <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense Summary</option>
                  <option value="receivable">Receivables Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="month">Current Month</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="year">Last 12 Months</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={generateReport} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;