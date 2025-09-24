// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CbseEditor() {
  const [cbseSection, setCbseSection] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch existing CBSE section
  const getCbseSection = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/cbse-section`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = res.data || null;
      if (payload) {
        setCbseSection(payload);
        setDescription(payload.decscription || "");
      } else {
        setCbseSection(null);
        setDescription("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch CBSE section"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCbseSection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {decscription: description };
      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/cbse-section`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedSection = res.data?.data ?? res.data;
      setCbseSection(updatedSection);
      setSuccess("CBSE section updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save CBSE section"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading CBSE section...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                rows={6}
                placeholder="Enter CBSE section description"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {cbseSection ? "Update Section" : "Create Section"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
