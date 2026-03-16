import React, { useState, useEffect } from "react";
import { Plus, Percent, Users, CheckCircle, IndianRupee } from "lucide-react";
import { dummyLoanProducts } from "../../../lib/dumyData";
import StatusCard from "../../../components/common/StatusCard";
import LoanProductTable from "../../../components/tables/LoanProductTable";
import Button from "../../../components/ui/Button";
import AddLoanTypesModal from "../../../components/modals/AddLoanTypesModal";

export default function LoanProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddLoanPopup, setShowAddLoanPopup] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const mappedProducts = (Array.isArray(products) ? products : []).map((p) => ({
    id: p.id,
    name: p.name || "Unnamed Product",
    category: p.category ? p.category.replace("_", " ") : "Unknown",
    interest: `${p.minInterestRate || 0}% - ${p.maxInterestRate || 0}%`,
    amount:
      p.minAmount && p.maxAmount
        ? `₹${(p.minAmount / 100000).toFixed(1)}L - ₹${(p.maxAmount / 10000000).toFixed(1)}Cr`
        : "Amount not set",
    tenure:
      p.minTenureMonths && p.maxTenureMonths
        ? `${p.minTenureMonths / 12}-${p.maxTenureMonths / 12} yrs`
        : "Tenure not set",
    fee: `${p.processingFee || 0}%`,
    status: p.status || "active",
    type: p.secured ? "Secured" : "Unsecured",
    applicants: 0,
    created: p.createdAt || new Date().toISOString(),
    original: p, // Store original data for view modal
  }));

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setProducts(dummyLoanProducts);
      setLoading(false);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Calculate stats
  const activeProductsCount = products.filter(
    (p) => p.status === "active",
  ).length;
  const totalProducts = products.length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Products</h1>
          <p className="text-gray-500 mt-1">
            Manage and configure loan products
          </p>
        </div>

        <Button
          onClick={() => setShowAddLoanPopup(true)}
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 
            px-4 py-2 rounded-lg transition-colors text-sm font-medium
            flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatusCard
          title="Total Products"
          value={totalProducts}
          icon={IndianRupee}
          variant="blue"
        />

        <StatusCard
          title="Active Products"
          value={activeProductsCount}
          icon={CheckCircle}
          variant="green"
        />

        <StatusCard
          title="Total Applicants"
          value={0}
          icon={Users}
          variant="purple"
        />

        <StatusCard
          title="Avg Interest Rate"
          value="9.8%"
          icon={Percent}
          variant="orange"
        />
      </div>

      <LoanProductTable
        products={mappedProducts}
        loading={loading}
        onEdit={(product) => {
          setEditProduct(product);
          setShowAddLoanPopup(true);
        }}
        onDelete={deleteProduct}
      />

      <AddLoanTypesModal
        isOpen={showAddLoanPopup}
        onClose={() => {
          setShowAddLoanPopup(false);
          setEditProduct(null);
        }}
        editData={editProduct}
      />
    </div>
  );
}
