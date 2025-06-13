"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setMounted(true);

    // Initialize date here on client only
    const now = new Date();
    setMonth(now.getMonth());
    setYear(now.getFullYear());
  }, []);

  useEffect(() => {
    if (mounted && year) {
      fetchData();
    }
  }, [month, year, category]);

  const fetchData = async () => {
    const res = await fetch(`/api/fetchTransactions?month=${month}&year=${year}&category=${category}`);
    const data = await res.json();
    setTransactions(data.transactions || []);
    setPieData(data.pieData || []);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#FF4444", "#33B5E5", "#99CC00"];

  if (!mounted) return null; // Wait until client-side mount to render

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="p-2 border rounded">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="p-2 border rounded"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
          <option value="">All Categories</option>
          {["food", "groceries", "shopping", "utilities", "EMI", "rent", "subscriptions", "travel", "health", "entertainment", "misc", "investments"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Transaction Summary</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="percent"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <ul className="max-h-[300px] overflow-auto divide-y">
            {transactions.map((tx: any) => (
              <li key={tx.id} className="py-2">
                <div className="font-medium">{tx.description}</div>
                <div className="text-sm text-gray-500">
                  ₹{tx.amount} • {tx.category} • {new Date(tx.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
