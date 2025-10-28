import React, { useState } from "react";
import { motion } from "framer-motion";

const LoanModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    loanName: "",
    lender: "",
    amount: "",
    interestRate: "",
    startDate: "",
    dueDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-4 w-[90%] mt-28 max-w-md border border-gray-100"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Add New Loan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <label className="text-sm text-gray-600 font-medium">Loan Name</label>
            <input
              type="text"
              name="loanName"
              value={formData.loanName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="e.g., Car Loan"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Lender</label>
            <input
                list="lenderType"
              type="text"
              name="lender"
              value={formData.lender}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="e.g., Axis Bank"
            />
            <datalist id="lenderType">
              <option value="Personal" />
              <option value="Bank" />
            </datalist>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-600 font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="₹ Amount"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 font-medium">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="e.g., 10.5"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-600 font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition shadow-md font-medium"
            >
              Add Loan
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LoanModal;
