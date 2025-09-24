// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GalleryListTables() {
      const [galleries, setGalleries] = useState([]);
      const [editingGallery, setEditingGallery] = useState(null);
      const [file, setFile] = useState(null);
      const [preview, setPreview] = useState(""); // preview for add/edit
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      const [showForm, setShowForm] = useState(false);

      const token = localStorage.getItem("shriRamSchoolToken");

      // Fetch gallery list
      const getGalleries = async () => {
            setLoading(true);
            setError("");
            try {
                  const res = await axios.get(
                        `${import.meta.env.VITE_APP_URL}api/admin/gallery-list`,
                        {
                              headers: { Authorization: `Bearer ${token}` },
                        }
                  );
                  setGalleries(res.data?.data || []);
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to fetch gallery images"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getGalleries();
      }, []);

      const handleAddNew = () => {
            setEditingGallery(null);
            setFile(null);
            setPreview("");
            setShowForm(true);
            setSuccess("");
            setError("");
      };

      const handleEdit = (gallery) => {
            setEditingGallery(gallery);
            setFile(null);
            setPreview(`${import.meta.env.VITE_APP_URL}${gallery.image}`); // show existing image
            setShowForm(true);
            setSuccess("");
            setError("");
      };

      const handleFileChange = (e) => {
            const selectedFile = e.target.files?.[0] ?? null;
            if (!selectedFile) return;
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // show preview of uploaded file
      };

      // Submit gallery image
      const handleSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                  if (!file && !editingGallery) {
                        setError("Please upload an image.");
                        setSaving(false);
                        return;
                  }

                  const form = new FormData();
                  if (file) form.append("image", file);
                  if (editingGallery) form.append("_id", editingGallery._id);

                  const res = editingGallery
                        ? await axios.patch(
                                `${
                                      import.meta.env.VITE_APP_URL
                                }api/admin/gallery`,
                                form,
                                {
                                      headers: {
                                            Authorization: `Bearer ${token}`,
                                            "Content-Type":
                                                  "multipart/form-data",
                                      },
                                }
                          )
                        : await axios.post(
                                `${
                                      import.meta.env.VITE_APP_URL
                                }api/admin/gallery`,
                                form,
                                {
                                      headers: {
                                            Authorization: `Bearer ${token}`,
                                            "Content-Type":
                                                  "multipart/form-data",
                                      },
                                }
                          );

                  const updatedGallery = res.data?.data ?? res.data;
                  setSuccess(
                        editingGallery
                              ? "Gallery updated successfully"
                              : "Gallery added successfully"
                  );

                  if (editingGallery) {
                        setGalleries((prev) =>
                              prev.map((g) =>
                                    g._id === updatedGallery._id
                                          ? updatedGallery
                                          : g
                              )
                        );
                  } else {
                        setGalleries((prev) => [...prev, updatedGallery]);
                  }

                  setEditingGallery(null);
                  setFile(null);
                  setPreview("");
                  setShowForm(false);
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to save image"
                  );
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                        <button
                              onClick={handleAddNew}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                        >
                              Add Gallery Image
                        </button>
                  </div>

                  {loading ? (
                        <p>Loading gallery images...</p>
                  ) : (
                        <>
                              {error && (
                                    <p className="text-red-500 mb-2 text-center">
                                          {error}
                                    </p>
                              )}
                              {success && (
                                    <p className="text-green-600 mb-2 text-center">
                                          {success}
                                    </p>
                              )}

                              {/* Table */}
                              <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-center text-sm">
                                          <thead className="bg-gray-100">
                                                <tr>
                                                      <th className="border px-3 py-2 w-48">
                                                            Image
                                                      </th>
                                                      <th className="border px-3 py-2 w-24">
                                                            Actions
                                                      </th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {galleries?.map(
                                                      (gallery, idx) => (
                                                            <tr
                                                                  key={
                                                                        gallery._id
                                                                  }
                                                                  className={
                                                                        idx %
                                                                              2 ===
                                                                        0
                                                                              ? "bg-white"
                                                                              : "bg-gray-50"
                                                                  }
                                                            >
                                                                  <td className="border px-3 py-2 text-center">
                                                                        <img
                                                                              src={`${
                                                                                    import.meta
                                                                                          .env
                                                                                          .VITE_APP_URL
                                                                              }${
                                                                                    gallery.image
                                                                              }`}
                                                                              alt="gallery"
                                                                              className="w-40 h-28 object-cover mx-auto rounded" // smaller size
                                                                        />
                                                                  </td>
                                                                  <td className="border px-3 py-2 text-center">
                                                                        <button
                                                                              onClick={() =>
                                                                                    handleEdit(
                                                                                          gallery
                                                                                    )
                                                                              }
                                                                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                                                                        >
                                                                              Edit
                                                                        </button>
                                                                  </td>
                                                            </tr>
                                                      )
                                                )}
                                          </tbody>
                                    </table>
                              </div>

                              {/* Form */}
                              {showForm && (
                                    <form
                                          onSubmit={handleSubmit}
                                          className="space-y-4 border-t pt-4 mt-6"
                                    >
                                          <div>
                                                <label className="block text-sm font-medium mb-2">
                                                      Gallery Image
                                                </label>
                                                <input
                                                      type="file"
                                                      accept="image/*"
                                                      onChange={
                                                            handleFileChange
                                                      }
                                                      className="block w-full text-sm text-gray-700 border rounded px-3 py-2"
                                                      required={!editingGallery}
                                                />

                                                {/* Preview */}
                                                {preview && (
                                                      <div className="mt-4">
                                                            <p className="text-xs text-gray-500 mb-1">
                                                                  Preview:
                                                            </p>
                                                            <img
                                                                  src={preview}
                                                                  alt="preview"
                                                                  className="w-full max-w-md h-56 object-cover rounded border shadow"
                                                            />
                                                      </div>
                                                )}
                                          </div>

                                          <div className="flex items-center gap-3">
                                                <button
                                                      type="submit"
                                                      disabled={saving}
                                                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                                                >
                                                      {editingGallery
                                                            ? "Update Image"
                                                            : "Add Image"}
                                                </button>
                                          </div>
                                    </form>
                              )}
                        </>
                  )}
            </div>
      );
}
