// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WelcomeEditor() {
      const [welcome, setWelcome] = useState(null);
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");

      const token = localStorage.getItem("shriRamSchoolToken");

      // Fetch existing welcome data
      const getWelcome = async () => {
            setLoading(true);
            setError("");
            try {
                  const res = await axios.get(
                        `${import.meta.env.VITE_APP_URL}api/admin/welcome`,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );

                  const payload = res.data || null;
                  if (payload) {
                        setWelcome(payload);
                        setTitle(payload.title || "");
                        setDescription(payload.description || "");
                  } else {
                        setWelcome(null);
                        setTitle("");
                        setDescription("");
                  }
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to fetch welcome section"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getWelcome();
      }, []);

      // Save or update welcome data
      const handleSubmit = async (e) => {
            e.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                  const payload = { title, description };
                  const res = await axios.post(
                        `${import.meta.env.VITE_APP_URL}api/admin/welcome`,
                        payload,
                        { headers: { Authorization: `Bearer ${token}` } }
                  );
                  console.log(res.data, "44444444444444444");

                  const created = res.data?.data ?? res.data;
                  setWelcome(created);
                  setSuccess("Welcome section updated successfully.");
            } catch (err) {
                  setError(
                        err.response?.data?.message ||
                              err.message ||
                              "Failed to save welcome section"
                  );
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                  {loading ? (
                        <p>Loading welcome section...</p>
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
                                                placeholder="Welcome title"
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

                                    <div className="flex items-center gap-3">
                                          <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-4 py-2 rounded bg-blue-600 text-white"
                                          >
                                                {welcome
                                                      ? "Update Welcome "
                                                      : "Update Welcome"}
                                          </button>
                                    </div>
                              </form>
                        </>
                  )}
            </div>
      );
}
