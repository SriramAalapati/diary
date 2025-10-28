// =============================
// PaymentModal (Register Payment)
// =============================
export default function PaymentModal({ loan, onClose }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    const payValue = parseFloat(amount);
    if (!payValue || payValue <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }
    if (payValue > loan.remainingBalance) {
      setError("Amount exceeds remaining balance!");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await apiCaller("/loans/pay", {
        loanId: loan.id,
        amount: payValue,
      });
      if (response.status === "Success") {
        onClose();
      } else throw new Error(response.message);
    } catch (err) {
      setError("Failed to process payment. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-200 w-[95%] max-w-sm animate-fadeIn">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Register Payment for {loan.lenderName}
        </h2>

        {error && (
          <div className="mb-3 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <p className="text-sm text-gray-600">
            Remaining Balance:{" "}
            <span className="font-semibold text-gray-800">
              ₹{loan.remainingBalance.toLocaleString("en-IN")}
            </span>
          </p>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter payment amount"
            className="w-full p-2 border rounded-lg focus:ring-blue-400"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                </span>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}