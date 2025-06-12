"use client";

import { useState } from "react";

type TransactionData = {
  amount: number;
  category: string;
  vendor: string;
  method: string;
  description: string;
  originalInput?: string;
};

const defaultForm: TransactionData = {
  amount: 0,
  category: "",
  vendor: "",
  method: "",
  description: "",
};

export default function TransactionPage() {
  const [nlInput, setNlInput] = useState("");
  const [formData, setFormData] = useState<TransactionData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: nlInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({
          ...data,
          originalInput: nlInput,
        });
        setMessage("AI parsed the transaction successfully!");
      } else {
        setMessage(data.error || "Failed to analyze input.");
      }
    } catch (err) {
      setMessage("Error analyzing input.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Transaction successfully added!");
        setFormData(defaultForm);
        setNlInput("");
      } else {
        setMessage(data.error || "Failed to save transaction.");
      }
    } catch (err) {
      setMessage("Error submitting transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Transaction</h1>

      <div>
        <label className="block font-semibold">Natural Language Input</label>
        <textarea
          rows={3}
          className="w-full p-2 border rounded"
          value={nlInput}
          onChange={(e) => setNlInput(e.target.value)}
          placeholder="e.g., Paid ₹500 to Zomato via UPI"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !nlInput}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Analyzing..." : "Analyze with AI"}
        </button>
      </div>

      <hr />

      <div className="space-y-4">
        {["amount", "category", "vendor", "method", "description"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">{field}</label>
            <input
              type={field === "amount" ? "number" : "text"}
              className="w-full p-2 border rounded"
              value={formData[field as keyof TransactionData] as string | number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field]: field === "amount" ? parseFloat(e.target.value) || 0 : e.target.value,
                })
              }
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Submitting..." : "Submit Transaction"}
      </button>

      {message && <p className="text-center mt-4">{message}</p>}
    </main>
  );
}
