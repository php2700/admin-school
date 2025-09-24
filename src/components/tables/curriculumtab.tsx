// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CurriculumEditor() {
  const [curriculum, setCurriculum] = useState(null);
  const [methodology, setMethodology] = useState("");
  const [approach, setApproach] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch Curriculum Data
  const getCurriculum = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/curriculum`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = res.data ? res.data?.data : null;
      if (payload) {
        setCurriculum(payload);
        setMethodology(payload.methodology_description || "");
        setApproach(payload.approach_description || "");
        if (payload.banner) {
          setPreview(`${import.meta.env.VITE_APP_URL}${payload.banner}`);
        }
      } else {
        setCurriculum(null);
        setMethodology("");
        setApproach("");
        setPreview("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch curriculum"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurriculum();
  }, []);

  // Handle File Upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    img.src = objectUrl;

    img.onload = () => {
      if (img.width < 1400) {
        setError("Image width must be at least 1400px.");
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

  // Submit Curriculum Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!file && !curriculum) {
        setError("Please upload a curriculum banner image.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      form.append("methodology_description", methodology);
      form.append("approach_description", approach);
      if (file) form.append("banner", file);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/curriculum`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const created = res.data?.data ?? res.data;
      setCurriculum(created);
      setSuccess("Curriculum updated successfully.");
      getCurriculum();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save curriculum"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading curriculum...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Methodology */}
            <div>
              <label className="block text-sm font-medium">
                Methodology Description
              </label>
              <textarea
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                rows={3}
                placeholder="Enter methodology description"
                required
              />
            </div>

            {/* Approach */}
            <div>
              <label className="block text-sm font-medium">
                Approach Description
              </label>
              <textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                rows={3}
                placeholder="Enter approach description"
                required
              />
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Curriculum Banner
              </label>

              {preview ? (
                <div className="mb-4">
                  <div className="w-full">
                    <img
                      src={preview}
                      alt="curriculum-banner-preview"
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
                    PNG, JPG, JPEG (min width 1400px, max 5MB)
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

            {/* Submit */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {curriculum ? "Update Curriculum" : "Create Curriculum"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
