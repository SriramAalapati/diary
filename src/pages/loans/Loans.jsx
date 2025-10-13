import React, { useEffect, useState, useMemo } from "react";
import apiCaller from "/src/utils/apiCaller";
import Layout from "../../layout/Layout";

// Placeholder for the actual User ID (should come from context/auth)
const USER_ID = 1;

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loanToEdit, setLoanToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // --- Data Fetching ---
  const getLoans = async () => {
    setIsLoading(true);
    try {
      const response = await apiCaller(`/loans?userId=${USER_ID}`);
      if (response.status === "Success") {
        // The backend now returns calculated fields like remainingBalance
        setLoans(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching loans:", err);
      alert("Failed to load loan data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLoans();
  }, []);

  // --- Handlers ---

  const handleAdd = () => {
    setLoanToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (loan) => {
    setLoanToEdit(loan);
    setShowModal(true);
  };

  const handleDelete = async (loanId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this loan and all its payment history?"
      )
    ) {
      return;
    }

    try {
      // Backend expects ID in the body for DELETE /loans
      const response = await apiCaller("/loans", { id: loanId }, "DELETE");
      if (response.status === "Success") {
        alert("Loan Deleted Successfully!");
        getLoans(); // Refresh list
      } else {
        alert(response.message || "Failed to delete loan.");
      }
    } catch (err) {
      console.error("Error deleting loan:", err);
      alert("Error deleting loan. Check console.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setLoanToEdit(null);
    getLoans(); // Refresh data after add/edit/update
  };

  // --- Filtering and Metrics ---

  const filteredLoans = useMemo(() => {
    let current = loans;

    // 1. Filter by Type
    if (filterType) {
      current = current.filter((loan) => loan.lenderType === filterType);
    }

    // 2. Filter by Search Term (Lender Name)
    if (searchTerm) {
      current = current.filter((loan) =>
        loan.lenderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return current;
  }, [loans, searchTerm, filterType]);

  const { totalAmount, totalRemaining } = useMemo(() => {
    const totalAmount = loans.reduce(
      (sum, loan) => sum + parseFloat(loan.amount || 0),
      0
    );
    // The remainingBalance is calculated by the backend and included in the data
    const totalRemaining = loans.reduce(
      (sum, loan) => sum + parseFloat(loan.remainingBalance || 0),
      0
    );

    return {
      totalAmount: totalAmount.toFixed(2),
      totalRemaining: totalRemaining.toFixed(2),
    };
  }, [loans]);

  // --- Render ---
  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 sm:mb-0 border-b-2 border-indigo-500 pb-1 inline-block">
            Loan Tracker 💰
          </h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-medium px-5 py-2 rounded-full text-sm shadow-md flex items-center justify-center"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add New Loan
          </button>
        </div>
        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            name="Total Principal Borrowed"
            value={`₹${Number(totalAmount).toLocaleString('en-IN')}`}
            icon="vault"
            color="indigo"
          />
          <MetricCard
            name="Total Balance Remaining"
            value={`₹${Number(totalRemaining).toLocaleString('en-IN')}`}
            icon="clock"
            color="red"
          />
          <MetricCard
            name="Active Loans"
            value={loans.filter((l) => l.status === "Active").length}
            icon="list"
            color="yellow"
          />
          <MetricCard
            name="Paid Off Loans"
            value={loans.filter((l) => l.status === "Paid Off").length}
            icon="check"
            color="green"
          />
        </div>
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            placeholder="Search by Lender Name..."
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full sm:w-1/4 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Bank">Bank</option>
            <option value="Person">Person</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Loan Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          {/* ... (isLoading check) ... */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                {/* Updated columns to include Payment action */}
                {[
                  "Lender",
                  "Type",
                  "Original Amt",
                  "Remaining",
                  "Rate",
                  "Due Date",
                  "Status",
                  "Actions",
                ].map((col, i) => (
                  <th key={i} className="px-5 py-3 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* ... (No loans found check) ... */}
              {filteredLoans.map((loan) => (
                <tr
                  key={loan.id}
                  className="border-b border-gray-100 hover:bg-indigo-50/50 transition duration-150"
                >
                  <td className="px-5 py-3 text-gray-900 font-medium text-sm">
                    {loan.lenderName}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-xs">
                    {loan.lenderType}
                  </td>
                  <td className="px-5 py-3 text-sm">
                    ₹{Number(parseFloat(loan.amount).toFixed(2)).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3 font-bold text-red-600 text-sm">
                    ₹{Number(loan.remainingBalance).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3 text-sm">
                    {parseFloat(loan.interestRate).toFixed(2)}%
                  </td>
                  <td className="px-5 py-3 text-sm">
                    {loan.dueDate
                      ? new Date(loan.dueDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={loan.status} />
                  </td>
                  <td className="px-5 py-3 w-40">
                    <div className="flex space-x-2 items-center">
                      {/* NEW PAYMENT BUTTON */}
                      <button
                        onClick={() => {
                          setLoanToEdit(loan); // Use this state to pass loan data
                          setShowPaymentModal(true);
                        }}
                        title="Register Payment"
                        className="text-green-600 hover:text-green-800 p-1 transition-colors rounded-full hover:bg-green-100"
                      >
                        <i className="fa-solid fa-money-bill-transfer text-sm"></i>
                      </button>
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => handleEdit(loan)}
                        title="Edit Loan"
                        className="text-blue-500 hover:text-blue-700 p-1 transition-colors rounded-full hover:bg-blue-100"
                      >
                        <i className="fa-solid fa-pen text-sm"></i>
                      </button>
                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(loan.id)}
                        title="Delete Loan"
                        className="text-red-500 hover:text-red-700 p-1 transition-colors rounded-full hover:bg-red-100"
                      >
                        <i className="fa-solid fa-trash text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* ... (Modal declarations outside the table) ... */}
        </div>
        {/* New State for Payment Modal */}
        {/* Modal for Registering Payment */}
        {showPaymentModal && (
          <PaymentModal
            loan={loanToEdit} // Pass the selected loan details
            onClose={() => {
              setShowPaymentModal(false);
              setLoanToEdit(null);
              getLoans(); // Refresh data to show updated balance
            }}
          />
        )}
        {/* Modal for Add/Edit Loan */}
        {showModal && (
          <LoanModal
            onClose={handleModalClose}
            initialData={loanToEdit}
            userId={USER_ID}
          />
        )}
      </div>
    </Layout>
  );
};

// ===================================
// Helper Components (Defined below for completeness)
// ===================================

// --- STATUS BADGE ---
function StatusBadge({ status }) {
  let colorClass = "bg-gray-100 text-gray-700";
  if (status === "Active") colorClass = "bg-blue-100 text-blue-700";
  else if (status === "Paid Off") colorClass = "bg-green-100 text-green-700";
  else if (status === "Default") colorClass = "bg-red-100 text-red-700";

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
    >
      {status}
    </span>
  );
}

// --- METRIC CARD ---
function MetricCard({ name, icon, value, color = "indigo" }) {
  const iconClasses = {
    vault: "fa-solid fa-vault",
    clock: "fa-solid fa-hourglass-half",
    list: "fa-solid fa-list-ul",
    check: "fa-solid fa-circle-check",
  };

  const colorMap = {
    indigo: "bg-indigo-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  };

  return (
    <div className="bg-white p-5 flex items-start space-x-4 border border-gray-200 rounded-xl transition duration-300 hover:shadow-lg">
      <div
        className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${colorMap[color]}`}
      >
        <i className={`${iconClasses[icon]} text-white text-xl`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-0.5">
          {name}
        </p>
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
      </div>
    </div>
  );
}

// --- LOAN MODAL (ADD/EDIT) ---
function LoanModal({ onClose, initialData, userId }) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState(
    initialData
      ? {
          lenderName: initialData.lenderName,
          lenderType: initialData.lenderType,
          amount: parseFloat(initialData.amount),
          interestRate: parseFloat(initialData.interestRate),
          takenDate:
            initialData.takenDate || new Date().toISOString().substring(0, 10),
          dueDate: initialData.dueDate || "",
          repaymentTerms: initialData.repaymentTerms || "",
          notes: initialData.notes || "",
        }
      : {
          lenderName: "",
          lenderType: "Bank",
          amount: 0.0,
          interestRate: 0.0,
          takenDate: new Date().toISOString().substring(0, 10),
          dueDate: "",
          repaymentTerms: "",
          notes: "",
        }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "interestRate"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.lenderName || !formData.amount || formData.amount <= 0) {
      alert("Please provide a valid Lender Name and Loan Amount.");
      return;
    }

    setIsSubmitting(true);
    let url, method, successMessage;
    let payload = { ...formData, userId };

    if (isEditMode) {
      // Your backend expects the ID in the body for PUT /loans
      url = "/loans";
      method = "PUT";
      payload.id = initialData.id;
      successMessage = "Loan Updated Successfully!";
    } else {
      // Your backend expects full payload for POST /loans
      url = "/loans";
      method = "POST";
      successMessage = "Loan Added Successfully!";
    }

    try {
      const response = await apiCaller(url, payload, method);
      if (response.status === "Success") {
        alert(successMessage);
        onClose();
      } else {
        throw new Error(
          response.message || `Failed to ${isEditMode ? "update" : "add"} loan.`
        );
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} loan:`, err);
      alert(`Error ${isEditMode ? "updating" : "adding"} loan. Check console.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
          {isEditMode ? "Edit Loan Details" : "Add New Loan"}
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {/* Lender Name */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Lender Name
            </label>
            <input
              type="text"
              name="lenderName"
              value={formData.lenderName}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Bank of America"
            />
          </div>
          {/* Lender Type */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Lender Type
            </label>
            <select
              name="lenderType"
              value={formData.lenderType}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Bank">Bank</option>
              <option value="Person">Person</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Loan Amount */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Principal Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              step="0.01"
              min="0"
            />
          </div>
          {/* Interest Rate */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              step="0.01"
              min="0"
            />
          </div>
          {/* Taken Date */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Taken Date
            </label>
            <input
              type="date"
              name="takenDate"
              value={formData.takenDate}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Due Date */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Due Date (Optional)
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Repayment Terms */}
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Repayment Terms
            </label>
            <input
              type="text"
              name="repaymentTerms"
              value={formData.repaymentTerms}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Monthly Installments"
            />
          </div>
          {/* Notes */}
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fa-solid fa-check mr-2"></i>
          )}
          {isSubmitting
            ? "Processing..."
            : isEditMode
            ? "Confirm Update Loan"
            : "Confirm Add Loan"}
        </button>
      </div>
    </div>
  );
}



// --- LOAN PAYMENT MODAL ---
function PaymentModal({ loan, onClose }) {
    const [formData, setFormData] = useState({
        paymentAmount: loan.remainingBalance > 0 ? parseFloat(loan.remainingBalance) : 0, // Suggest remaining balance
        paymentDate: new Date().toISOString().substring(0, 10),
        notes: '',
        // The backend requires loanId and paymentAmount
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'paymentAmount' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.paymentAmount || formData.paymentAmount <= 0) {
            alert("Payment amount must be greater than zero.");
            return;
        }

        setIsSubmitting(true);
        const payload = {
            loanId: loan.id,
            paymentAmount: formData.paymentAmount,
            paymentDate: formData.paymentDate,
            notes: formData.notes,
            // principalPaid and interestPaid can be handled by backend or left null
        };

        try {
            // API endpoint: POST /api/v1/loans/payments
            const response = await apiCaller("/loans/payments", payload, "POST");
            
            if (response.status === "Success") {
                alert(`${formData.paymentAmount.toFixed(2)} payment registered successfully!`);
                onClose(); // Close modal and refresh parent data
            } else {
                throw new Error(response.message || "Failed to register payment.");
            }
        } catch (err) {
            console.error("Error registering payment:", err);
            alert(`Error registering payment: ${err.message || 'Check console.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                <button onClick={onClose} disabled={isSubmitting} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <i className="fa-solid fa-xmark text-xl"></i>
                </button>

                <h1 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Register Payment for {loan.lenderName}
                </h1>
                <p className="mb-4 text-sm text-gray-600">
                    Remaining Balance: <span className="font-bold text-red-600">₹{loan.remainingBalance.toLocaleString()}</span>
                </p>

                {/* Payment Amount */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Payment Amount (₹)</label>
                    <input type="number" name="paymentAmount" value={formData.paymentAmount} onChange={handleChange} disabled={isSubmitting}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" step="0.01" min="0"
                    />
                </div>
                
                {/* Payment Date */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Payment Date</label>
                    <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} disabled={isSubmitting}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                
                {/* Notes */}
                <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} disabled={isSubmitting} rows="2"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none"
                    />
                </div>

                <button onClick={handleSubmit} disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    ) : (
                        <i className="fa-solid fa-hand-holding-dollar mr-2"></i>
                    )}
                    {isSubmitting ? "Registering..." : "Confirm Payment"}
                </button>
            </div>
        </div>
    );
}

// NOTE: You must include the PaymentModal function in your Loans.jsx file 
// (or import it if you move it to a separate file)

export default Loans;
