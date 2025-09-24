// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FacilityEditor() {
  const [banner, setBanner] = useState(null); // banner object from DB
  const [file, setFile] = useState(null); // banner file
  const [preview, setPreview] = useState(""); // banner preview
  const [sections, setSections] = useState([]); // array of section objects
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch existing facility
  const getFacility = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}api/admin/facility`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || {};
      setBanner(data.banner ? data : null);
      setPreview(data.banner ? `${import.meta.env.VITE_APP_URL}${data.banner}` : "");
      setSections(data.section || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch facility");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFacility();
  }, []);

  // Handle banner file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleRemoveBanner = () => {
    setFile(null);
    setPreview("");
  };

  // Section handlers
  const handleAddSection = () => {
    setSections((prev) => [...prev, { title: "", description: "" }]);
  };

  const handleRemoveSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, field, value) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, [field]: value } : sec))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!file && !banner) {
        setError("Please upload a banner image.");
        setSaving(false);
        return;
      }

      if (sections.length === 0) {
        setError("Please add at least one section.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      if (file) form.append("banner", file); // send banner file
      form.append("section", JSON.stringify(sections)); // send sections as JSON

      const res = await axios.post(`${import.meta.env.VITE_APP_URL}api/admin/facility`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data?.data || res.data;
      setBanner(data);
      setPreview(data.banner ? `${import.meta.env.VITE_APP_URL}${data.banner}` : "");
      setSections(data.section || []);
      setSuccess("Facility updated successfully.");
      setFile(null);
      getFacility()
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save facility");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      {loading ? (
        <p>Loading facility...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner */}
            <div>
              <label className="block text-sm font-medium mb-2">Banner</label>
              {preview ? (
                <div className="relative mb-4">
                  <img
                    src={preview}
                    alt="banner-preview"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="absolute top-2 right-2 text-red-600 bg-white rounded-full p-1 hover:bg-gray-100 transition"
                  >
                    X
                  </button>
                </div>
              ) : (
                <input type="file" accept="image/*" className="w-full rounded border px-3 py-2" onChange={handleFileChange} />
              )}
            </div>

            {/* Sections */}
            <div>
              <label className="block text-sm font-medium mb-2">Sections</label>
              {sections.map((sec, idx) => (
                <div key={idx} className="mb-4 p-4 border rounded-lg relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Section {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={sec.title}
                      onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                      className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Description"
                      value={sec.description}
                      onChange={(e) =>
                        handleSectionChange(idx, "description", e.target.value)
                      }
                      className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
              >
                Add Section
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
              >
                Save Facility
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
