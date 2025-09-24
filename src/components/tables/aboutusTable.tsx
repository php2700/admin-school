// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AboutusEditor() {
  const [about, setAbout] = useState(null);
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState([""]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch About Us data
  const getAbout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/about`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = res.data ?? null;

      if (payload) {
        setAbout(payload);
        setTitle(payload.title || "");
        setDescriptions(payload.description?.length ? payload.description : [""]);
        setPreview(payload.image ? `${import.meta.env.VITE_APP_URL}${payload.image}` : "");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch About Us");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAbout();
  }, []);

  // Handle image upload
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
      if (!title || !descriptions.some((d) => d.trim() !== "")) {
        setError("Title and at least one description are required.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      form.append("title", title);
      descriptions.forEach((desc) => form.append("description", desc));
      if (file) form.append("image", file);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/about`,
        form,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data?.data ?? res.data;
      setAbout(updated);
      setSuccess(about ? "About Us updated successfully." : "About Us created successfully.");
      getAbout()
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save About Us");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading About Us...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
             <div className="w-full">
  <label className="block text-sm font-medium mb-2">Image</label>

  {preview ? (
    <div className="mb-3 w-full flex flex-col items-center">
      <img
        src={preview}
        alt="preview"
        className="w-full h-72 object-cover rounded-lg border"
      />
      <button
        type="button"
        onClick={handleRemoveImage}
        className="mt-2 px-4 py-1 text-sm text-red-600 border border-red-400 rounded hover:bg-red-50"
      >
        Remove Image
      </button>
    </div>
  ) : (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="w-full border p-2 rounded text-sm"
    />
  )}

  <p className="text-xs text-gray-500 mt-1">Minimum width: 1400px</p>
</div>

            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                placeholder="Title"
                required
              />
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

            {/* Image */}
           

            {/* Submit */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {about ? "Update About Us" : "Create About Us"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
