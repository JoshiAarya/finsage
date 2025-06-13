"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  name?: string | null;
  email: string;
  monthlyIncome: number | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [income, setIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/fetchProfile");
        const json = await res.json();
        if (res.ok) {
          setProfile(json.data);
          setIncome(json.data.monthlyIncome?.toString() || "");
        } else {
          setMessage(json.error || "Failed to fetch profile");
        }
      } catch (err) {
        setMessage("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  // Handle monthly income update
  const handleUpdateIncome = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/updateIncome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyIncome: parseFloat(income) }),
      });

      const json = await res.json();
      if (res.ok) {
        setMessage("Monthly income updated!");
        setProfile((prev) =>
          prev ? { ...prev, monthlyIncome: parseFloat(income) } : prev
        );
      } else {
        setMessage(json.error || "Failed to update income.");
      }
    } catch (err) {
      setMessage("Error updating income.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Profile</h1>

      {profile ? (
        <>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Email</label>
              <p className="p-2 border rounded bg-gray-50">{profile.email}</p>
            </div>

            {profile.name && (
              <div>
                <label className="block font-semibold">Name</label>
                <p className="p-2 border rounded bg-gray-50">{profile.name}</p>
              </div>
            )}

            <div>
              <label className="block font-semibold">Monthly Income (₹)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
              <button
                onClick={handleUpdateIncome}
                disabled={loading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Updating..." : "Update Income"}
              </button>
            </div>
          </div>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </main>
  );
}
