// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ClassroomBannerEditor() {
  const [banner, setBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch the existing Classroom banner
  const getClassroomBanner = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/classroom-banner`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data || null;
      if (data?.banner) {
        setBanner(data);
        setPreview(`${import.meta.env.VITE_APP_URL}${data.banner}`);
      } else {
        setBanner(null);
        setPreview("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch Classroom Banner"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassroomBanner();
  }, []);

  // Handle file selection with min width validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    img.src = objectUrl;

    img.onload = () => {
      if (img.width < 1440) {
        setError("Image width must be at least 1440px.");
        setFile(null);
        setPreview("");
        URL.revokeObjectURL(objectUrl);
      } else {
        setFile(selectedFile);
        setPreview(objectUrl);
        setError("");
      }
    };
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
  };

  // Submit Classroom banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!file && !banner) {
        setError("Please upload a Classroom Banner image.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      if (file) form.append("banner", file); // backend column name is 'banner'

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/classroom-banner`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const created = res.data?.data ?? res.data;
      setBanner(created);
      setPreview(`${import.meta.env.VITE_APP_URL}${created.banner}`);
      setSuccess("Classroom Banner updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save Classroom Banner"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading Classroom Banner...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Classroom Banner Image
              </label>

              {preview ? (
                <div className="mb-4">
                  <div className="w-full">
                    <img
                      src={preview}
                      alt="classroom-banner-preview"
                      className="w-full h-72 object-cover rounded-lg shadow-md border"
                    />
                  </div>
                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m10 12V4M5 20h14"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, JPEG (min width 1440px, max 5MB)
                  </p>
                </label>
              )}

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {banner ? "Update Classroom Banner" : "Upload Classroom Banner"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
