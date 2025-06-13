"use client";

import { useState } from "react";

type GoalData = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
};

const defaultForm: GoalData = {
  name: "",
  targetAmount: 0,
  currentAmount: 0,
  deadline: "",
};

export default function GoalPage() {
  const [nlInput, setNlInput] = useState("");
  const [formData, setFormData] = useState<GoalData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/analyzeGoal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: nlInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData({
          ...data,
          originalInput: nlInput,
        });
        setMessage("AI parsed your goal successfully!");
      } else {
        setMessage(data.error || "Failed to analyze goal.");
      }
    } catch (err) {
      setMessage("Error analyzing goal.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Goal successfully added!");
        setFormData(defaultForm);
        setNlInput("");
      } else {
        setMessage(data.error || "Failed to save goal.");
      }
    } catch (err) {
      setMessage("Error submitting goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Goal</h1>

      <div>
        <label className="block font-semibold">Natural Language Input</label>
        <textarea
          rows={3}
          className="w-full p-2 border rounded"
          value={nlInput}
          onChange={(e) => setNlInput(e.target.value)}
          placeholder="e.g., Save ₹50,000 for a new laptop by December 2025"
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
        {["name", "targetAmount", "currentAmount", "deadline"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">{field}</label>
            <input
              type={field.includes("Amount") ? "number" : field === "deadline" ? "date" : "text"}
              className="w-full p-2 border rounded"
              value={formData[field as keyof GoalData] as string | number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field]:
                    field.includes("Amount")
                      ? parseFloat(e.target.value) || 0
                      : e.target.value,
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
        {loading ? "Submitting..." : "Submit Goal"}
      </button>

      {message && <p className="text-center mt-4">{message}</p>}
    </main>
  );
}
