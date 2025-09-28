// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SchoolActivity() {
      const [activities, setActivities] = useState([]);
      const [editingActivity, setEditingActivity] = useState(null);
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const [file, setFile] = useState(null); // single file
      const [preview, setPreview] = useState(""); // single preview
      const [removedImage, setRemovedImage] = useState("");
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      const [showForm, setShowForm] = useState(false);

      const token = localStorage.getItem("shriRamSchoolToken");

      const getActivities = async () => {
            setLoading(true);
            setError("");
            try {
                  const res = await axios.get(
                        `${
                              import.meta.env.VITE_APP_URL
                        }api/admin/activity-list`,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setActivities(res.data || []);
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to fetch activities"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getActivities();
      }, []);

      const handleAddNew = () => {
            setEditingActivity(null);
            setTitle("");
            setDescription("");
            setFile(null);
            setPreview("");
            setRemovedImage("");
            setShowForm(true);
            setSuccess("");
            setError("");
      };

      const handleEdit = (activity) => {
            setEditingActivity(activity);
            setTitle(activity.title);
            setDescription(activity.description);
            setPreview(
                  activity.image
                        ? `${import.meta.env.VITE_APP_URL}${activity.image}`
                        : ""
            );
            setFile(null);
            setRemovedImage("");
            setShowForm(true);
            setSuccess("");
            setError("");
      };

      const handleFileChange = (e) => {
            const selectedFile = e.target.files[0];
            if (!selectedFile) return;
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setRemovedImage(editingActivity?.image || "");
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
                  if (file) form.append("image", file);
                  if (removedImage) form.append("removeImage", removedImage);

                  let res;
                  if (editingActivity) {
                        form.append("_id", editingActivity._id);
                        res = await axios.patch(
                              `${
                                    import.meta.env.VITE_APP_URL
                              }api/admin/activity`,
                              form,
                              {
                                    headers: {
                                          Authorization: `Bearer ${token}`,
                                          "Content-Type": "multipart/form-data",
                                    },
                              }
                        );
                  } else {
                        res = await axios.post(
                              `${
                                    import.meta.env.VITE_APP_URL
                              }api/admin/activity`,
                              form,
                              {
                                    headers: {
                                          Authorization: `Bearer ${token}`,
                                          "Content-Type": "multipart/form-data",
                                    },
                              }
                        );
                  }

                  const updatedActivity = res.data?.section ?? res.data;
                  setSuccess(
                        editingActivity
                              ? "Activity updated successfully"
                              : "Activity added successfully"
                  );

                  if (editingActivity) {
                        setActivities((prev) =>
                              prev.map((act) =>
                                    act._id === updatedActivity._id
                                          ? updatedActivity
                                          : act
                              )
                        );
                  } else {
                        setActivities((prev) => [...prev, updatedActivity]);
                  }

                  setEditingActivity(null);
                  setFile(null);
                  setPreview("");
                  setRemovedImage("");
                  setTitle("");
                  setDescription("");
                  setShowForm(false);
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to save activity"
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
                              Add New
                        </button>
                  </div>

                  {loading ? (
                        <p>Loading activities...</p>
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
                                                      <th className="border px-3 py-2 w-24">
                                                            Image
                                                      </th>
                                                      <th className="border px-3 py-2 w-64">
                                                            Title
                                                      </th>
                                                      <th className="border px-3 py-2 w-96">
                                                            Description
                                                      </th>
                                                      <th className="border px-3 py-2 w-24">
                                                            Actions
                                                      </th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {activities.map((act, idx) => (
                                                      <tr
                                                            key={act._id}
                                                            className={`${
                                                                  idx % 2 === 0
                                                                        ? "bg-white"
                                                                        : "bg-gray-50"
                                                            }`}
                                                      >
                                                            <td className="border px-3 py-2">
                                                                  {act.image && (
                                                                        <img
                                                                              src={`${
                                                                                    import.meta
                                                                                          .env
                                                                                          .VITE_APP_URL
                                                                              }${
                                                                                    act.image
                                                                              }`}
                                                                              alt="activity"
                                                                              className="w-16 h-16 object-cover mx-auto rounded"
                                                                        />
                                                                  )}
                                                            </td>
                                                            <td className="border px-3 py-2 text-center text-sm">
                                                                  {act.title ? act.title : 'N/A'}
                                                            </td>
                                                            <td className="border px-3 py-2 text-left text-sm break-words">
                                                                  {
                                                                        act.description
                                                                  }
                                                            </td>
                                                            <td className="border px-3 py-2 text-center">
                                                                  <button
                                                                        onClick={() =>
                                                                              handleEdit(
                                                                                    act
                                                                              )
                                                                        }
                                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                                                                  >
                                                                        Edit
                                                                  </button>
                                                            </td>
                                                      </tr>
                                                ))}
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
                                                <label className="block text-sm font-medium">
                                                      Title
                                                </label>
                                                <input
                                                      type="text"
                                                      value={title}
                                                      onChange={(e) =>
                                                            setTitle(
                                                                  e.target.value
                                                            )
                                                      }
                                                      className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                                                      placeholder="Title"
                                                      
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
                                                      className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                                                      rows={4}
                                                      placeholder="Short description"
                                                      required
                                                />
                                          </div>

                                          <div>
                                                <label className="block text-sm font-medium mb-2">
                                                      Image
                                                </label>
                                                <div className="flex gap-3 mb-3">
                                                      {preview && (
                                                            <div className="relative">
                                                                  <img
                                                                        src={
                                                                              preview
                                                                        }
                                                                        alt="preview"
                                                                        className="w-32 h-32 object-cover rounded-lg border"
                                                                  />
                                                                  <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                              setFile(
                                                                                    null
                                                                              );
                                                                              setPreview(
                                                                                    ""
                                                                              );
                                                                              if (
                                                                                    editingActivity?.image
                                                                              )
                                                                                    setRemovedImage(
                                                                                          editingActivity.image
                                                                                    );
                                                                        }}
                                                                        className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 hover:bg-gray-100 transition"
                                                                  >
                                                                        X
                                                                  </button>
                                                            </div>
                                                      )}
                                                </div>
                                                {!preview && (
                                                      <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={
                                                                  handleFileChange
                                                            }
                                                            className="border p-2 rounded text-sm"
                                                      />
                                                )}
                                          </div>

                                          <div className="flex items-center gap-3">
                                                <button
                                                      type="submit"
                                                      disabled={saving}
                                                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                                                >
                                                      {editingActivity
                                                            ? "Update Activity"
                                                            : "Add Activity"}
                                                </button>
                                          </div>
                                    </form>
                              )}
                        </>
                  )}
            </div>
      );
}
