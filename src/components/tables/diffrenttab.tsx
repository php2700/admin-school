// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DifferentEditor() {
      const [data, setData] = useState(null);
      const [imageFile, setImageFile] = useState(null);
      const [preview, setPreview] = useState("");
      const [descriptions, setDescriptions] = useState([""]);
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");

      const token = localStorage.getItem("shriRamSchoolToken");

      const getData = async () => {
            setLoading(true);
            setError("");
            try {
                  const res = await axios.get(
                        `${
                              import.meta.env.VITE_APP_URL
                        }api/admin/diffrent-quality`,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );

                  const payload = res.data?.data ?? null;
                  if (payload) {
                        setData(payload);

                        // Set image preview
                        setPreview(
                              payload.image
                                    ? `${import.meta.env.VITE_APP_URL}${
                                            payload.image
                                      }`
                                    : ""
                        );

                        // Set description array
                        setDescriptions(
                              payload.description?.length
                                    ? payload.description
                                    : [""]
                        );
                  }
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to fetch data"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getData();
      }, []);

      const handleFileChange = (e) => {
            const selectedFile = e.target.files?.[0] ?? null;
            if (!selectedFile) return;

            const img = new Image();
            const objectUrl = URL.createObjectURL(selectedFile);
            img.src = objectUrl;
            img.onload = () => {
                  if (img.width < 1400) {
                        setError("Image width must be at least 1400px.");
                        setImageFile(null);
                        setPreview("");
                        URL.revokeObjectURL(objectUrl);
                  } else {
                        setImageFile(selectedFile);
                        setPreview(objectUrl);
                        setError("");
                  }
            };
      };

      const handleRemoveImage = () => {
            if (preview) URL.revokeObjectURL(preview);
            setImageFile(null);
            setPreview("");
      };

      // Description handlers
      const handleDescriptionChange = (index, value) => {
            const updated = [...descriptions];
            updated[index] = value;
            setDescriptions(updated);
      };

      const handleAddDescription = () => setDescriptions([...descriptions, ""]);
      const handleRemoveDescription = (index) => {
            setDescriptions((prev) => {
                  const updated = prev.filter((_, i) => i !== index);
                  return updated.length ? updated : [""];
            });
      };

      // Submit handler
      const handleSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                  if (!preview || !descriptions.some((d) => d.trim())) {
                        setError(
                              "Image and at least one description are required."
                        );
                        setSaving(false);
                        return;
                  }

                  const form = new FormData();
                  if (imageFile) form.append("image", imageFile);
                  descriptions.forEach((desc) =>
                        form.append("description", desc)
                  );

                  const res = await axios.post(
                        `${
                              import.meta.env.VITE_APP_URL
                        }api/admin/diffrent-quality`,
                        form,
                        {
                              headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "multipart/form-data",
                              },
                        }
                  );

                  const updated = res.data?.data ?? res.data;
                  setData(updated);

                  // Update preview after save
                  setPreview(
                        updated.image
                              ? `${import.meta.env.VITE_APP_URL}${
                                      updated.image
                                }`
                              : ""
                  );

                  setSuccess(
                        data ? "Updated successfully." : "Created successfully."
                  );
                  getData();
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to save data"
                  );
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                  {loading ? (
                        <p>Loading data...</p>
                  ) : (
                        <>
                              {error && (
                                    <p className="text-red-500 mb-2">{error}</p>
                              )}
                              {success && (
                                    <p className="text-green-600 mb-2">
                                          {success}
                                    </p>
                              )}

                              <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                              >
                                    {/* Image */}
                                    <div className="w-full">
                                          <label className="block text-sm font-medium mb-2">
                                                Image
                                          </label>
                                          {preview ? (
                                                <div className="mb-3 w-full flex flex-col items-center">
                                                      <img
                                                            src={preview}
                                                            alt="preview"
                                                            className="w-full h-72 object-cover rounded-lg border"
                                                      />
                                                      <button
                                                            type="button"
                                                            onClick={
                                                                  handleRemoveImage
                                                            }
                                                            className="mt-2 px-4 py-1 text-sm text-red-600 border border-red-400 rounded hover:bg-red-50"
                                                      >
                                                            Remove Image
                                                      </button>
                                                </div>
                                          ) : (
                                                <input
                                                      type="file"
                                                      accept="image/*"
                                                      onChange={
                                                            handleFileChange
                                                      }
                                                      className="w-full border p-2 rounded text-sm"
                                                />
                                          )}
                                          <p className="text-xs text-gray-500 mt-1">
                                                Minimum width: 1400px
                                          </p>
                                    </div>

                                    {/* Description */}
                                    <div>
                                          <label className="block text-sm font-medium">
                                                Description
                                          </label>
                                          {descriptions.map((desc, idx) => (
                                                <div
                                                      key={idx}
                                                      className="flex gap-2 mt-2"
                                                >
                                                      <textarea
                                                            value={desc}
                                                            onChange={(e) =>
                                                                  handleDescriptionChange(
                                                                        idx,
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                            className="flex-1 rounded border px-3 py-2"
                                                            rows={2}
                                                            placeholder="Description"
                                                            required
                                                      />
                                                      <button
                                                            type="button"
                                                            onClick={() =>
                                                                  handleRemoveDescription(
                                                                        idx
                                                                  )
                                                            }
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
                                                {data ? "Update" : "Create"}
                                          </button>
                                    </div>
                              </form>
                        </>
                  )}
            </div>
      );
}
