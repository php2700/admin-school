// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PhilosophyEditor() {
  const [philosophy, setPhilosophy] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [description, setDescription] = useState(""); // single description
  const [sections, setSections] = useState([""]); // section array
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch philosophy data
  const getPhilosophy = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/philosophy`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = res.data?.data ?? null;

      if (payload) {
        setPhilosophy(payload);
        setDescription(payload.description || "");
        setSections(payload.section?.length ? payload.section : [""]);
        setBannerPreview(payload.banner ? `${import.meta.env.VITE_APP_URL}${payload.banner}` : "");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch Philosophy data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhilosophy();
  }, []);

  // Handle banner image upload
  const handleBannerChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    img.src = objectUrl;

    img.onload = () => {
      if (img.width < 1400) {
        setError("Banner width must be at least 1400px.");
        setBannerFile(null);
        setBannerPreview("");
        URL.revokeObjectURL(objectUrl);
      } else {
        setBannerFile(selectedFile);
        setBannerPreview(objectUrl);
        setError("");
      }
    };
  };

  const handleRemoveBanner = () => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(null);
    setBannerPreview("");
  };

  // Handle section array
  const handleSectionChange = (index, value) => {
    const updated = [...sections];
    updated[index] = value;
    setSections(updated);
  };
  const handleAddSection = () => setSections([...sections, ""]);
  const handleRemoveSection = (index) => {
    const updated = sections.filter((_, i) => i !== index);
    setSections(updated.length ? updated : [""]);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!description.trim() || !sections.some((s) => s.trim() !== "")) {
        setError("Description and at least one section are required.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      if (bannerFile) form.append("banner", bannerFile);
      form.append("description", description);
      sections.forEach((sec) => form.append("section", sec));

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/philosophy`,
        form,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data?.data ?? res.data;
      setPhilosophy(updated);
      setSuccess(philosophy ? "Philosophy updated successfully." : "Philosophy created successfully.");
      getPhilosophy();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save Philosophy");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading Philosophy...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Banner */}
            <div className="w-full">
              <label className="block text-sm font-medium mb-2">Banner</label>
              {bannerPreview ? (
                <div className="mb-3 w-full flex flex-col items-center">
                  <img
                    src={bannerPreview}
                    alt="banner-preview"
                    className="w-full h-72 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="mt-2 px-4 py-1 text-sm text-red-600 border border-red-400 rounded hover:bg-red-50"
                  >
                    Remove Banner
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="w-full border p-2 rounded text-sm"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">Minimum width: 1400px</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border px-3 py-2 mt-2"
                rows={3}
                placeholder="Description"
                required
              />
            </div>

            {/* Sections */}
            <div>
              <label className="block text-sm font-medium">Sections</label>
              {sections.map((sec, idx) => (
                <div key={idx} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={sec}
                    onChange={(e) => handleSectionChange(idx, e.target.value)}
                    className="flex-1 rounded border px-3 py-2"
                    placeholder="Section"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="px-4 py-1 text-red-600 border border-red-400 rounded hover:bg-red-50"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSection}
                className="mt-2 px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Add Section
              </button>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {philosophy ? "Update Philosophy" : "Create Philosophy"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
