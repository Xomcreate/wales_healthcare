import React, { useState } from "react";
import {
  FaFileInvoiceDollar,
  FaCreditCard,
  FaReceipt,
  FaChartBar,
  FaArrowRight,
  FaPlus,
  FaDownload,
  FaSearch,
  FaCheckCircle,
  FaShieldAlt,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_COLOR = "#0d9488";

export default function InvoicesPayments() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [showBillingFlowModal, setShowBillingFlowModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  // Sample data corresponding to the portal screens
  const [invoicesList, setInvoicesList] = useState([
    { id: "INV-2026-001", customer: "Mary Johnson", amount: "$450.00", status: "Paid", date: "Mar 10, 2026" },
    { id: "INV-2026-002", customer: "David Brown", amount: "$320.00", status: "Pending", date: "Mar 11, 2026" },
    { id: "INV-2026-003", customer: "Sarah Lee", amount: "$600.00", status: "Draft", date: "Mar 12, 2026" },
  ]);

  // Form states for creating a new invoice
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    amount: "",
    dueDate: "",
    description: "",
  });

  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    if (!newInvoice.customer || !newInvoice.amount) return;

    const created = {
      id: `INV-2026-00${invoicesList.length + 1}`,
      customer: newInvoice.customer,
      amount: newInvoice.amount.startsWith("$") ? newInvoice.amount : `$${newInvoice.amount}`,
      status: "Draft",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setInvoicesList([created, ...invoicesList]);
    setNewInvoice({ customer: "", amount: "", dueDate: "", description: "" });
    setShowCreateInvoiceModal(false);
  };

  const paymentsList = [
    { txId: "TXN-88492", invoice: "INV-2026-001", gateway: "Stripe Gateway", amount: "$450.00", status: "Successful", date: "Mar 10, 2026" },
    { txId: "TXN-88493", invoice: "INV-2026-002", gateway: "Paystack", amount: "$320.00", status: "Processing", date: "Mar 11, 2026" },
  ];

  const receiptsList = [
    { rcptId: "RCP-5501", invoice: "INV-2026-001", client: "Mary Johnson", amount: "$450.00", issuedDate: "Mar 10, 2026" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-10"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
            Invoices, Receipts & Payments
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage billing flows, track transaction history, and generate financial reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowBillingFlowModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
          >
            <FaInfoCircle className="text-[11px]" style={{ color: BRAND_COLOR }} />
            <span>Billing Flow Guide</span>
          </button>
          <button
            onClick={() => setShowCreateInvoiceModal(true)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* BILLING FLOW BANNER */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Standard Lifecycle</p>
          <p className="text-xs text-slate-300 font-medium">
            Completed service $\rightarrow$ billable record $\rightarrow$ invoice $\rightarrow$ customer payment $\rightarrow$ receipt
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-teal-300 font-semibold">
          <FaShieldAlt /> Secure Gateway Integration
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {[
          { key: "invoices", label: "Invoices", icon: <FaFileInvoiceDollar /> },
          { key: "payments", label: "Payments", icon: <FaCreditCard /> },
          { key: "receipts", label: "Receipts", icon: <FaReceipt /> },
          { key: "reports", label: "Financial Reports", icon: <FaChartBar /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition shrink-0 ${
              activeTab === tab.key
                ? "border-teal-600 text-teal-700 bg-teal-50/40"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: INVOICES SCREEN */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Invoice List & Status</h4>
            <span className="text-xs text-slate-400">Create, edit draft, send, void, view status</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Invoice ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {invoicesList.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{inv.id}</td>
                      <td className="py-3.5 px-4 text-slate-700">{inv.customer}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{inv.amount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          inv.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                          inv.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 hover:bg-teal-100 transition">
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS SCREEN */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Transaction History & Statuses</h4>
            <span className="text-xs text-slate-400">View gateway response, reconcile</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Invoice Ref</th>
                    <th className="py-3.5 px-4">Gateway</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paymentsList.map((pay) => (
                    <tr key={pay.txId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{pay.txId}</td>
                      <td className="py-3.5 px-4 text-slate-600">{pay.invoice}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{pay.gateway}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{pay.amount}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Integration Note Notice */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 text-xs text-teal-900 flex items-start gap-3">
            <FaInfoCircle className="text-teal-600 text-sm mt-0.5 shrink-0" />
            <p>
              <strong>Security Compliance Note:</strong> The exact gateway is selected based on country, currency, and fees. The application stores transaction references and statuses rather than raw card details.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: RECEIPTS SCREEN */}
      {activeTab === "receipts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Receipt History</h4>
            <span className="text-xs text-slate-400">Generate/send receipt after confirmed payment</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Receipt ID</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Invoice Ref</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {receiptsList.map((rcpt) => (
                    <tr key={rcpt.rcptId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{rcpt.rcptId}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{rcpt.client}</td>
                      <td className="py-3.5 px-4 text-slate-500">{rcpt.invoice}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{rcpt.amount}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition">
                          <FaDownload className="text-[10px]" /> Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL REPORTS SCREEN */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue (MTD)</p>
              <h4 className="text-2xl font-black text-slate-900 mt-2">$78,420.00</h4>
              <p className="text-[11px] text-teal-600 font-semibold mt-1">+8.4% growth</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding Balances</p>
              <h4 className="text-2xl font-black text-amber-600 mt-2">$3,200.00</h4>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">Pending collection</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Refunds Processed</p>
              <h4 className="text-2xl font-black text-slate-900 mt-2">$0.00</h4>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Zero issues</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-slate-900">Export Financial Data</h4>
              <p className="text-xs text-slate-500 mt-0.5">Filter data by service, customer and export if allowed.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition shadow-sm">
              <FaDownload className="text-xs" /> Export Full Report (.CSV)
            </button>
          </div>
        </div>
      )}

      {/* ================= CREATE INVOICE MODAL ================= */}
      <AnimatePresence>
        {showCreateInvoiceModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateInvoiceModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">Create New Invoice</h4>
                <button onClick={() => setShowCreateInvoiceModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newInvoice.customer}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Amount ($)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 450.00"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Item Description</label>
                  <textarea
                    rows="3"
                    placeholder="Details about the care or service provided..."
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateInvoiceModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-700 transition"
                  >
                    Save Draft / Send
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= BILLING FLOW GUIDE MODAL ================= */}
      <AnimatePresence>
        {showBillingFlowModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBillingFlowModal(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 top-20 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 w-full sm:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-base font-black text-slate-900">End-to-End Billing Flow</h4>
                <button onClick={() => setShowBillingFlowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                {[
                  "Completed service",
                  "Billable record generated",
                  "Invoice creation & dispatch",
                  "Customer payment processing via secure gateway",
                  "Payment confirmation validation",
                  "Receipt generation",
                  "Financial report logging"
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">{idx + 1}</span>
                    <span className="font-semibold text-slate-800">{step}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowBillingFlowModal(false)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}