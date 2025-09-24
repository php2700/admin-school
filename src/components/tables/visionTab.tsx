// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VisionEditor() {
      const [visionData, setVisionData] = useState(null);
      const [imageFile, setImageFile] = useState(null);
      const [preview, setPreview] = useState("");
      const [visions, setVisions] = useState([""]);
      const [missions, setMissions] = useState([""]);
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");

      const token = localStorage.getItem("shriRamSchoolToken");

      // Fetch Vision data
      const getVision = async () => {
            setLoading(true);
            setError("");
            try {
                  const res = await axios.get(
                        `${import.meta.env.VITE_APP_URL}api/admin/vision`,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );

                  const payload = res.data?.data ?? null;
                  if (payload) {
                        setVisionData(payload);

                        // Handle image from backend
                        const imagePath = payload.image || payload.image || "";
                        setPreview(
                              `${import.meta.env.VITE_APP_URL}${imagePath}`
                        );

                        setVisions(
                              payload.vision?.length ? payload.vision : [""]
                        );
                        setMissions(
                              payload.mission?.length ? payload.mission : [""]
                        );
                  }
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to fetch Vision data"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getVision();
      }, []);

      // Image handlers
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

      // Vision/Mission handlers
      const handleArrayChange = (arr, setArr, index, value) => {
            const updated = [...arr];
            updated[index] = value;
            setArr(updated);
      };

      const handleAddItem = (arr, setArr) => setArr([...arr, ""]);

      const handleRemoveItem = (arr, setArr, index) => {
            const updated = arr.filter((_, i) => i !== index);
            setArr(updated.length ? updated : [""]);
      };

      // Submit
      const handleSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                  if (
                        !preview ||
                        !visions.some((v) => v.trim()) ||
                        !missions.some((m) => m.trim())
                  ) {
                        setError("Image, vision, and mission are required.");
                        setSaving(false);
                        return;
                  }

                  const form = new FormData();
                  if (imageFile) form.append("image", imageFile);
                  visions.forEach((v) => form.append("vision", v));
                  missions.forEach((m) => form.append("mission", m));

                  const res = await axios.post(
                        `${import.meta.env.VITE_APP_URL}api/admin/vision`,
                        form,
                        {
                              headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "multipart/form-data",
                              },
                        }
                  );

                  const updated = res.data?.data ?? res.data;
                  setVisionData(updated);

                  // Update preview after save
                  const imagePath = updated.image || updated.imageUrl || "";
                  setPreview(
                        imagePath
                              ? imagePath.startsWith("http")
                                    ? imagePath
                                    : `${
                                            import.meta.env.VITE_APP_URL
                                      }${imagePath}`
                              : ""
                  );

                  setSuccess(
                        visionData
                              ? "Vision updated successfully."
                              : "Vision created successfully."
                  );
                  getVision();
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to save Vision data"
                  );
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                  {loading ? (
                        <p>Loading Vision...</p>
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

                                    {/* Vision */}
                                    <div>
                                          <label className="block text-sm font-medium">
                                                Vision
                                          </label>
                                          {visions.map((v, idx) => (
                                                <div
                                                      key={idx}
                                                      className="flex gap-2 mt-2"
                                                >
                                                      <textarea
                                                            value={v}
                                                            onChange={(e) =>
                                                                  handleArrayChange(
                                                                        visions,
                                                                        setVisions,
                                                                        idx,
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                            className="flex-1 rounded border px-3 py-2"
                                                            rows={2}
                                                            placeholder="Vision"
                                                            required
                                                      />
                                                      <button
                                                            type="button"
                                                            onClick={() =>
                                                                  handleRemoveItem(
                                                                        visions,
                                                                        setVisions,
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
                                                onClick={() =>
                                                      handleAddItem(
                                                            visions,
                                                            setVisions
                                                      )
                                                }
                                                className="mt-2 px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                                          >
                                                Add Vision
                                          </button>
                                    </div>

                                    {/* Mission */}
                                    <div>
                                          <label className="block text-sm font-medium">
                                                Mission
                                          </label>
                                          {missions.map((m, idx) => (
                                                <div
                                                      key={idx}
                                                      className="flex gap-2 mt-2"
                                                >
                                                      <textarea
                                                            value={m}
                                                            onChange={(e) =>
                                                                  handleArrayChange(
                                                                        missions,
                                                                        setMissions,
                                                                        idx,
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                            className="flex-1 rounded border px-3 py-2"
                                                            rows={2}
                                                            placeholder="Mission"
                                                            required
                                                      />
                                                      <button
                                                            type="button"
                                                            onClick={() =>
                                                                  handleRemoveItem(
                                                                        missions,
                                                                        setMissions,
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
                                                onClick={() =>
                                                      handleAddItem(
                                                            missions,
                                                            setMissions
                                                      )
                                                }
                                                className="mt-2 px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                                          >
                                                Add Mission
                                          </button>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex items-center gap-3">
                                          <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-4 py-2 rounded bg-blue-600 text-white"
                                          >
                                                {visionData
                                                      ? "Update Vision"
                                                      : "Create Vision"}
                                          </button>
                                    </div>
                              </form>
                        </>
                  )}
            </div>
      );
}
