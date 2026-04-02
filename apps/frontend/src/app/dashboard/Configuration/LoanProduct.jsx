import { useMemo, useState } from "react";
import { Plus, Percent, Users, CheckCircle, IndianRupee } from "lucide-react";
import StatusCard from "../../../components/common/StatusCard";
import LoanProductTable from "../../../components/tables/LoanProductTable";
import Button from "../../../components/ui/Button";
import AddLoanTypesModal from "../../../components/modals/AddLoanTypesModal";
import { useDeleteLoanType, useLoanTypes } from "../../../hooks/useLoanType";

export default function LoanProduct() {
  const { loanTypes, loading } = useLoanTypes();
  const deleteLoanTypeMutation = useDeleteLoanType();
  const [showAddLoanPopup, setShowAddLoanPopup] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const products = useMemo(
    () => (Array.isArray(loanTypes) ? loanTypes : []),
    [loanTypes],
  );

  const formatAmountUnit = (amount) => {
    const numericAmount = Number(amount || 0);
    if (!numericAmount) return "0 Lac";
    if (numericAmount >= 10000000) {
      return `${(numericAmount / 10000000).toFixed(1)} Cr`;
    }
    return `${(numericAmount / 100000).toFixed(1)} L`;
  };

  const formatTenureYears = (months) => {
    const numericMonths = Number(months || 0);
    if (!numericMonths) return "0 yrs";

    const years = numericMonths / 12;
    return `${Number(years.toFixed(2))}`;
  };

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.name || "Unnamed Product",
    category: p.category ? p.category.replace("_", " ") : "Unknown",
    interest: `${p.minInterestRate || 0} - ${p.maxInterestRate || 0}`,
    amount:
      p.minAmount && p.maxAmount
        ? `${formatAmountUnit(p.minAmount)} - ${formatAmountUnit(p.maxAmount)}`
        : "Amount not set",
    tenure:
      p.minTenureMonths && p.maxTenureMonths
        ? `${formatTenureYears(p.minTenureMonths)}-${formatTenureYears(p.maxTenureMonths)} yrs`
        : "Tenure not set",
    fee:
      p.processingFeeType === "FIXED"
        ? `₹${p.processingFee || 0}`
        : `${p.processingFee || 0}%`,
    status: p.isActive ? "active" : "inactive",
    type: p.secured ? "Secured" : "Unsecured",
    applicants: 0,
    created: p.createdAt || new Date().toISOString(),
    original: p, // Store original data for view modal
  }));

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await deleteLoanTypeMutation.mutateAsync(id);
  };

  // Calculate stats
  const activeProductsCount = products.filter((p) => p.isActive).length;
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

        {/* <StatusCard
          title="Avg Interest Rate"
          value={averageInterestRate}
          icon={Percent}
          variant="orange"
        /> */}
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
