// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FaqTables() {
      const [faqs, setFaqs] = useState([]); // list of FAQs
      const [editingFaq, setEditingFaq] = useState(null); // FAQ being edited
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
      const [showForm, setShowForm] = useState(false);

      const token = localStorage.getItem("shriRamSchoolToken");

      // Fetch FAQ list
      const getFaqs = async () => {
            setLoading(true);
            setError("");
            try {
                  const res = await axios.get(
                        `${import.meta.env.VITE_APP_URL}api/admin/faq-list`,
                        {
                              headers: { Authorization: `Bearer ${token}` },
                        }
                  );
                  setFaqs(res.data || []);
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to fetch FAQs"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getFaqs();
      }, []);

      const handleAddNew = () => {
            setEditingFaq(null);
            setTitle("");
            setDescription("");
            setShowForm(true);
            setSuccess("");
            setError("");
      };

      const handleEdit = (faq) => {
            setEditingFaq(faq);
            setTitle(faq.title);
            setDescription(faq.description);
            setShowForm(true);
            setSuccess("");
            setError("");
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                  const form = { title, description };

                  let res;
                  if (editingFaq) {
                        res = await axios.patch(
                              `${import.meta.env.VITE_APP_URL}api/admin/faq`,
                              { ...form, _id: editingFaq._id },
                              { headers: { Authorization: `Bearer ${token}` } }
                        );
                  } else {
                        res = await axios.post(
                              `${import.meta.env.VITE_APP_URL}api/admin/faq`,
                              form,
                              { headers: { Authorization: `Bearer ${token}` } }
                        );
                  }

                  const updatedFaq = res.data?.section ?? res.data;
                  setSuccess(
                        editingFaq
                              ? "FAQ updated successfully"
                              : "FAQ added successfully"
                  );

                  if (editingFaq) {
                        setFaqs((prev) =>
                              prev.map((f) =>
                                    f._id === updatedFaq._id ? updatedFaq : f
                              )
                        );
                  } else {
                        setFaqs((prev) => [...prev, updatedFaq]);
                  }

                  setEditingFaq(null);
                  setTitle("");
                  setDescription("");
                  setShowForm(false);
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to save FAQ"
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
                        <p>Loading FAQs...</p>
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
                                                {faqs.map((faq, idx) => (
                                                      <tr
                                                            key={faq._id}
                                                            className={
                                                                  idx % 2 === 0
                                                                        ? "bg-white"
                                                                        : "bg-gray-50"
                                                            }
                                                      >
                                                            <td className="border px-3 py-2 text-center">
                                                                  {faq.title}
                                                            </td>
                                                            <td className="border px-3 py-2 text-left break-words">
                                                                  {
                                                                        faq.description
                                                                  }
                                                            </td>
                                                            <td className="border px-3 py-2 text-center">
                                                                  <button
                                                                        onClick={() =>
                                                                              handleEdit(
                                                                                    faq
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
                                                      className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                                                      rows={4}
                                                      placeholder="Short description"
                                                      required
                                                />
                                          </div>

                                          <div className="flex items-center gap-3">
                                                <button
                                                      type="submit"
                                                      disabled={saving}
                                                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                                                >
                                                      {editingFaq
                                                            ? "Update FAQ"
                                                            : "Add FAQ"}
                                                </button>
                                          </div>
                                    </form>
                              )}
                        </>
                  )}
            </div>
      );
}
