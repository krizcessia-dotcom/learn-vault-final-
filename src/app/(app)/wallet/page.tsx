"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Transaction {
  type: string;
  amount: number;
  description: string | null;
  createdAt: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pending, setPending] = useState<{
    lvAmount: number;
    pesoAmount: number;
    status: string;
  } | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState("100");
  const [cashoutAmount, setCashoutAmount] = useState("100");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  function loadData() {
    api.wallet.get().then((r) => r.data && setBalance(r.data.balance));
    api.wallet.transactions().then((r) => r.data && setTransactions(r.data));
    api.wallet.pending().then((r) => r.data !== undefined && setPending(r.data));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handlePurchase() {
    const amount = parseInt(purchaseAmount, 10);
    if (!amount || amount < 10) {
      setError("Min 10 LV");
      return;
    }
    setLoading("purchase");
    setError("");
    const { data, error: err } = await api.wallet.purchasePoints(amount);
    setLoading(null);
    if (err) setError(err);
    else if (data) {
      setBalance(data.balance);
      loadData();
    }
  }

  async function handleCashout() {
    const amount = parseInt(cashoutAmount, 10);
    if (!amount || amount < 100) {
      setError("Min 100 LV for cashout");
      return;
    }
    if (balance !== null && amount > balance) {
      setError("Insufficient balance");
      return;
    }
    setLoading("cashout");
    setError("");
    const { data, error: err } = await api.wallet.cashout(amount);
    setLoading(null);
    if (err) setError(err);
    else if (data) {
      setBalance(data.balance);
      setPending({ lvAmount: amount, pesoAmount: amount * 0.4, status: "PENDING" });
      loadData();
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Wallet</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              min={10}
              className="w-20 p-2 border rounded"
            />
            <button
              onClick={handlePurchase}
              disabled={loading === "purchase"}
              className="px-4 py-2 bg-lv-dark-green text-white rounded-lg font-medium hover:bg-lv-medium-green disabled:opacity-50"
            >
              {loading === "purchase" ? "..." : "Purchase Points"}
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={cashoutAmount}
              onChange={(e) => setCashoutAmount(e.target.value)}
              min={100}
              className="w-20 p-2 border rounded"
            />
            <button
              onClick={handleCashout}
              disabled={loading === "cashout"}
              className="px-4 py-2 bg-lv-dark-green text-white rounded-lg font-medium hover:bg-lv-medium-green disabled:opacity-50"
            >
              {loading === "cashout" ? "..." : "Cash out"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {balance !== null && (
        <p className="text-lg mb-4">
          Balance: <strong>{balance} LV</strong> (2 LV = ₱1, 20% commission on cashout)
        </p>
      )}

      {pending && (
        <div
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: "#E4F0E4" }}
        >
          <h2 className="font-bold text-black text-lg mb-2">
            Pending Cash out
          </h2>
          <p className="text-black">
            {pending.lvAmount.toLocaleString()} LV → ₱
            {pending.pesoAmount.toFixed(2)} — Status: {pending.status}
          </p>
        </div>
      )}

      <div>
        <h2 className="font-bold text-black text-xl mb-6">
          Transaction History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 font-bold text-black">Date</th>
                <th className="text-left py-4 font-bold text-black">Type</th>
                <th className="text-left py-4 font-bold text-black">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-4 text-black">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-black">{tx.type}</td>
                  <td className="py-4 text-black">
                    {tx.description ?? `${tx.amount > 0 ? "+" : ""}${tx.amount} LV`}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-gray-500 text-center">
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
