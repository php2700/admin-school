// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EveryChildEditor() {
      const [everyChildLearn, setEveryChildLearn] = useState(null);
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const [files, setFiles] = useState([]);
      const [previews, setPreviews] = useState([]);
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      const [removedImages, setRemovedImages] = useState([]);

      const token = localStorage.getItem("shriRamSchoolToken");

      const getEveryChildLearn = async () => {
            setLoading(true);
            setError("");
            try {
                  const res = await axios.get(
                        `${
                              import.meta.env.VITE_APP_URL
                        }api/admin/every-child-learn`,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );

                  const payload = res.data || null;
                  if (payload) {
                        setEveryChildLearn(payload);
                        setTitle(payload.title || "");
                        setDescription(payload.description || "");
                        const imageUrls = (payload.images || []).map(
                              (img) => `${import.meta.env.VITE_APP_URL}${img}`
                        );
                        setPreviews(imageUrls);
                  } else {
                        setEveryChildLearn(null);
                        setTitle("");
                        setDescription("");
                        setPreviews([]);
                  }
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to fetch Every Child Learn section"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getEveryChildLearn();
      }, []);

      const handleFileChange = (e) => {
            const selectedFiles = Array.from(e.target.files);
            if (files.length + selectedFiles.length > 3) {
                  setError("You can upload a maximum of 3 images.");
                  return;
            }
            setError("");

            const newPreviews = selectedFiles?.map((file) =>
                  URL.createObjectURL(file)
            );

            setFiles((prev) => [...prev, ...selectedFiles]);
            setPreviews((prev) => [...prev, ...newPreviews]);
      };

      // When removing an image
      const handleRemoveImage = (index) => {
            const updatedFiles = [...files];
            const updatedPreviews = [...previews];

            const removedImage = updatedPreviews[index];

            // Check if this is an existing image from backend
            if (everyChildLearn?.images?.length) {
                  const backendImageIndex = everyChildLearn.images.findIndex(
                        (img) =>
                              `${import.meta.env.VITE_APP_URL}${img}` ===
                              removedImage
                  );
                  if (backendImageIndex !== -1) {
                        // Add to removedImages array
                        setRemovedImages((prev) => [
                              ...prev,
                              everyChildLearn.images[backendImageIndex],
                        ]);
                  }
            }

            // Remove from previews and files
            updatedFiles.splice(index, 1);
            updatedPreviews.splice(index, 1);
            setFiles(updatedFiles);
            setPreviews(updatedPreviews);
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                  const form = new FormData();
                  form.append("title", title);
                  form.append("description", description);

                  files.forEach((file) => form.append("images", file));

                  if (removedImages.length > 0) {
                        removedImages.forEach((img) =>
                              form.append("removeImages[]", img)
                        );
                  }

                  const res = await axios.post(
                        `${
                              import.meta.env.VITE_APP_URL
                        }api/admin/every-child-learn`,
                        form,
                        {
                              headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "multipart/form-data",
                              },
                        }
                  );

                  const created = res.data?.section ?? res.data;
                  setEveryChildLearn(created);
                  setSuccess("Every Child Learn section updated successfully.");
                  setFiles([]);
                  setRemovedImages([]); // reset removed images
                  setPreviews(
                        (created.images || []).map(
                              (img) => `${import.meta.env.VITE_APP_URL}${img}`
                        )
                  );
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to save Every Child Learn section"
                  );
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                  {loading ? (
                        <p>Loading Every Child Learn section...</p>
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
                                    <div>
                                          <label className="block text-sm font-medium">
                                                Title
                                          </label>
                                          <input
                                                type="text"
                                                value={title}
                                                onChange={(e) =>
                                                      setTitle(e.target.value)
                                                }
                                                className="mt-1 block w-full rounded border px-3 py-2"
                                                placeholder="Title"
                                                required
                                          />
                                    </div>

                                    <div>
                                          <label className="block text-sm font-medium">
                                                Description
                                          </label>
                                          <textarea
                                                value={description}
                                                onChange={(e) =>
                                                      setDescription(
                                                            e.target.value
                                                      )
                                                }
                                                className="mt-1 block w-full rounded border px-3 py-2"
                                                rows={4}
                                                placeholder="Short description"
                                                required
                                          />
                                    </div>

                                    <div>
                                          <label className="block text-sm font-medium mb-2">
                                                Images
                                          </label>
                                          <div className="flex gap-3 flex-wrap mb-3">
                                                {previews.map((src, index) => (
                                                      <div
                                                            key={index}
                                                            className="relative"
                                                      >
                                                            <img
                                                                  src={src}
                                                                  alt={`preview-${index}`}
                                                                  className="w-40 h-40 object-cover rounded-lg border"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  onClick={() =>
                                                                        handleRemoveImage(
                                                                              index
                                                                        )
                                                                  }
                                                                  className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1"
                                                            >
                                                                  X
                                                            </button>
                                                      </div>
                                                ))}
                                          </div>

                                          {previews.length < 3 && (
                                                <input
                                                      type="file"
                                                      accept="image/*"
                                                      multiple
                                                      onChange={
                                                            handleFileChange
                                                      }
                                                      className="border p-2 rounded"
                                                />
                                          )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                          <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-4 py-2 rounded bg-blue-600 text-white"
                                          >
                                                {everyChildLearn
                                                      ? "Update Section"
                                                      : "Create Section"}
                                          </button>
                                    </div>
                              </form>
                        </>
                  )}
            </div>
      );
}
