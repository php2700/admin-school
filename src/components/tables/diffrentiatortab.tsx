// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DiffrentiatorEditor() {
  const [banner, setBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  const getDiffrentiator = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}api/admin/shri-differentiator`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || {};

      setBanner(data.banner || null);
      setBannerPreview(data.banner ? `${import.meta.env.VITE_APP_URL}${data.banner}` : "");
      setSections(data.section || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch diffrentiator data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDiffrentiator();
  }, []);

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
    setBanner(null);
  };

  const addSection = () => setSections((prev) => [...prev, { title: "", description: "" }]);
  const removeSection = (index) => setSections((prev) => prev.filter((_, i) => i !== index));
  const updateSection = (index, field, value) =>
    setSections((prev) => prev.map((sec, i) => (i === index ? { ...sec, [field]: value } : sec)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!banner && !bannerFile) {
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
      if (bannerFile) form.append("banner", bannerFile);
      form.append("section", JSON.stringify(sections));

      const res = await axios.post(`${import.meta.env.VITE_APP_URL}api/admin/shri-differentiator`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data?.data || {};
      setBanner(data.banner || null);
      setBannerPreview(data.banner ? `${import.meta.env.VITE_APP_URL}${data.banner}` : "");
      setSections(data.section || []);
      setSuccess("Diffrentiator updated successfully.");
      setBannerFile(null);
      getDiffrentiator();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save diffrentiator data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      {loading ? (
        <p>Loading diffrentiator data...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Banner */}
            <div>
              <label className="block text-sm font-medium mb-2">Banner</label>
              {bannerPreview ? (
                <div className="relative w-full mb-4">
                  <img
                    src={bannerPreview}
                    alt="banner-preview"
                    className="w-full h-64 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 hover:bg-gray-100 transition"
                  >
                    X
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="w-full rounded border px-3 py-2"
                />
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
                      onClick={() => removeSection(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={sec.title}
                    onChange={(e) => updateSection(idx, "title", e.target.value)}
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm mb-2"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={sec.description}
                    onChange={(e) => updateSection(idx, "description", e.target.value)}
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                    rows={3}
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSection}
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
                Save Diffrentiator
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
