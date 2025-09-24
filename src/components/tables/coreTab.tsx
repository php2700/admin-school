// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoreEditor() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch existing Core data
  const getCore = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}api/admin/core`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || {};
      setImage(data.image || null);
      setImagePreview(data.image ? `${import.meta.env.VITE_APP_URL}${data.image}` : "");
      setSections(data.section || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch core data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCore();
  }, []);

  // Image handlers
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImage(null);
  };

  // Sections handlers
  const addSection = () => setSections((prev) => [...prev, { title: "", description: [""] }]);
  const removeSection = (index) => setSections((prev) => prev.filter((_, i) => i !== index));
  const updateSectionTitle = (index, value) =>
    setSections((prev) => prev.map((sec, i) => (i === index ? { ...sec, title: value } : sec)));
  const addDescription = (secIndex) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex ? { ...sec, description: [...sec.description, ""] } : sec
      )
    );
  const removeDescription = (secIndex, descIndex) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? { ...sec, description: sec.description.filter((_, j) => j !== descIndex) }
          : sec
      )
    );
  const updateDescription = (secIndex, descIndex, value) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              description: sec.description.map((desc, j) => (j === descIndex ? value : desc)),
            }
          : sec
      )
    );

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!image && !imageFile) {
        setError("Please upload an image.");
        setSaving(false);
        return;
      }

      if (sections.length === 0) {
        setError("Please add at least one section.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      if (imageFile) form.append("image", imageFile);
      form.append("section", JSON.stringify(sections));

      const res = await axios.post(`${import.meta.env.VITE_APP_URL}api/admin/core`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data?.data || {};
      setImage(data.image || null);
      setImagePreview(data.image ? `${import.meta.env.VITE_APP_URL}${data.image}` : "");
      setSections(data.section || []);
      setSuccess("Core updated successfully.");
      setImageFile(null);
      getCore();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save core data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      {loading ? (
        <p>Loading core data...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              {imagePreview ? (
                <div className="relative w-full mb-4">
                  <img
                    src={imagePreview}
                    alt="core-preview"
                    className="w-full h-64 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 hover:bg-gray-100 transition"
                  >
                    X
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded border px-3 py-2"
                />
              )}
            </div>

            {/* Sections */}
            <div>
              <label className="block text-sm font-medium mb-2">Sections</label>
              {sections.map((sec, secIdx) => (
                <div key={secIdx} className="mb-4 p-4 border rounded-lg relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Section {secIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSection(secIdx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Title */}
                  <input
                    type="text"
                    placeholder="Title"
                    value={sec.title}
                    onChange={(e) => updateSectionTitle(secIdx, e.target.value)}
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm mb-2"
                    required
                  />

                  {/* Description array */}
                  {sec.description.map((desc, descIdx) => (
                    <div key={descIdx} className="flex items-center mb-2 gap-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={desc}
                        onChange={(e) => updateDescription(secIdx, descIdx, e.target.value)}
                        className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeDescription(secIdx, descIdx)}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addDescription(secIdx)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm mt-1"
                  >
                    Add Description
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                Add Section
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition text-sm"
              >
                Save Core
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
