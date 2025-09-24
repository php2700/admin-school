// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SocietyEditor() {
  const [societyData, setSocietyData] = useState(null);
  const [description, setDescription] = useState("");
  const [society, setSociety] = useState([""]);
  const [clubs, setClubs] = useState([""]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch Society Data
  const getSociety = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/society`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = res.data ? res.data?.data : null;
      if (payload) {
        setSocietyData(payload);
        setDescription(payload.description || "");
        setSociety(payload.society?.length ? payload.society : [""]);
        setClubs(payload.clubs?.length ? payload.clubs : [""]);
        if (payload.banner) {
          setPreview(`${import.meta.env.VITE_APP_URL}${payload.banner}`);
        }
      } else {
        setSocietyData(null);
        setDescription("");
        setSociety([""]);
        setClubs([""]);
        setPreview("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch society"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSociety();
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

  // Handle Array Inputs (society, clubs)
  const handleArrayChange = (setter, arr, i, value) => {
    const updated = [...arr];
    updated[i] = value;
    setter(updated);
  };

  const handleAddItem = (setter, arr) => {
    setter([...arr, ""]);
  };

  const handleRemoveItem = (setter, arr, i) => {
    const updated = arr.filter((_, idx) => idx !== i);
    setter(updated.length ? updated : [""]);
  };

  // Submit Society Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!file && !societyData) {
        setError("Please upload a society banner image.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      form.append("description", description);
      society.forEach((s) => form.append("society[]", s));
      clubs.forEach((c) => form.append("clubs[]", c));
      if (file) form.append("banner", file);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/society`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const created = res.data?.data ?? res.data;
      setSocietyData(created);
      setSuccess("Society updated successfully.");
      getSociety();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save society"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading society...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded border px-3 py-2"
                rows={3}
                placeholder="Enter description"
                required
              />
            </div>

            {/* Society */}
            <div>
              <label className="block text-sm font-medium mb-2">Society</label>
              {society.map((s, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={s}
                    onChange={(e) =>
                      handleArrayChange(setSociety, society, i, e.target.value)
                    }
                    className="block w-full rounded border px-3 py-2"
                    placeholder={`Society ${i + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(setSociety, society, i)}
                    className="px-2 py-1 text-sm text-red-600 border border-red-400 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem(setSociety, society)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                + Add Society
              </button>
            </div>

            {/* Clubs */}
            <div>
              <label className="block text-sm font-medium mb-2">Clubs</label>
              {clubs.map((c, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={c}
                    onChange={(e) =>
                      handleArrayChange(setClubs, clubs, i, e.target.value)
                    }
                    className="block w-full rounded border px-3 py-2"
                    placeholder={`Club ${i + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(setClubs, clubs, i)}
                    className="px-2 py-1 text-sm text-red-600 border border-red-400 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem(setClubs, clubs)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                + Add Club
              </button>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Society Banner
              </label>

              {preview ? (
                <div className="mb-4">
                  <img
                    src={preview}
                    alt="society-banner-preview"
                    className="w-full h-72 object-cover rounded-lg shadow-md border"
                  />
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
                {societyData ? "Update Society" : "Create Society"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
