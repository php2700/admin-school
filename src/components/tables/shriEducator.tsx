// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EducatorEditor() {
  const [educator, setEducator] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [descriptions, setDescriptions] = useState([""]); // description array
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch Educator data
  const getEducator = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/shri-educator`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = res.data?.data ?? null;

      if (payload) {
        setEducator(payload);
        setDescriptions(payload.description?.length ? payload.description : [""]);
        setBannerPreview(payload.banner ? `${import.meta.env.VITE_APP_URL}${payload.banner}` : "");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch Educator data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEducator();
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

  // Handle description array
  const handleDescriptionChange = (index, value) => {
    const updated = [...descriptions];
    updated[index] = value;
    setDescriptions(updated);
  };
  const handleAddDescription = () => setDescriptions([...descriptions, ""]);
  const handleRemoveDescription = (index) => {
    const updated = descriptions.filter((_, i) => i !== index);
    setDescriptions(updated.length ? updated : [""]);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!descriptions.some((d) => d.trim() !== "")) {
        setError("At least one description is required.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      if (bannerFile) form.append("banner", bannerFile);
      descriptions.forEach((desc) => form.append("description", desc));

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/shri-educator`,
        form,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data?.data ?? res.data;
      setEducator(updated);
      setSuccess(educator ? "Educator updated successfully." : "Educator created successfully.");
      getEducator();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save Educator");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading Educator...</p>
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

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium">Descriptions</label>
              {descriptions.map((desc, idx) => (
                <div key={idx} className="flex gap-2 mt-2">
                  <textarea
                    value={desc}
                    onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                    className="flex-1 rounded border px-3 py-2"
                    rows={2}
                    placeholder="Description"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDescription(idx)}
                    className="px-4 py-1 text-red-600 border border-red-400 rounded hover:bg-red-50"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDescription}
                className="mt-2 px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Add Description
              </button>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {educator ? "Update Educator" : "Create Educator"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
