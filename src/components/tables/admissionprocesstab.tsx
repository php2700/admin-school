// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdmissionProcessEditor() {
  const [banner, setBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch existing data
  const getAdmissionProcess = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/admission-process`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data?.data || {};
      setBanner(data.banner || null);
      setBannerPreview(
        data.banner ? `${import.meta.env.VITE_APP_URL}${data.banner}` : ""
      );
      setAcademicYear(data.academicYear || "");
      setSections(
        data.section && data.section.length > 0
          ? data.section
          : [
              {
                title: "",
                description: [{ text: "", subpoints: [] }],
              },
            ]
      );
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
    getAdmissionProcess();
  }, []);

  // Banner handlers
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };
  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
    setBanner(null);
  };

  // Sections handlers
  const addSection = () =>
    setSections((prev) => [
      ...prev,
      { title: "", description: [{ text: "", subpoints: [] }] },
    ]);

  const removeSection = (index) =>
    setSections((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );

  const updateSectionTitle = (index, value) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === index ? { ...sec, title: value } : sec
      )
    );

  // Descriptions handlers
  const addDescription = (secIndex) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              description: [
                ...sec.description,
                { text: "", subpoints: [] },
              ],
            }
          : sec
      )
    );

  const removeDescription = (secIndex, descIndex) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex && sec.description.length > 1
          ? {
              ...sec,
              description: sec.description.filter(
                (_, j) => j !== descIndex
              ),
            }
          : sec
      )
    );

  const updateDescriptionText = (secIndex, descIndex, value) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              description: sec.description.map((desc, j) =>
                j === descIndex ? { ...desc, text: value } : desc
              ),
            }
          : sec
      )
    );

  // Subpoints handlers
  const addSubpoint = (secIndex, descIndex) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              description: sec.description.map((desc, j) =>
                j === descIndex
                  ? {
                      ...desc,
                      subpoints: [...desc.subpoints, ""],
                    }
                  : desc
              ),
            }
          : sec
      )
    );

  const removeSubpoint = (secIndex, descIndex, subIndex) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              description: sec.description.map((desc, j) =>
                j === descIndex
                  ? {
                      ...desc,
                      subpoints: desc.subpoints.filter(
                        (_, k) => k !== subIndex
                      ),
                    }
                  : desc
              ),
            }
          : sec
      )
    );

  const updateSubpoint = (secIndex, descIndex, subIndex, value) =>
    setSections((prev) =>
      prev.map((sec, i) =>
        i === secIndex
          ? {
              ...sec,
              description: sec.description.map((desc, j) =>
                j === descIndex
                  ? {
                      ...desc,
                      subpoints: desc.subpoints.map((sp, k) =>
                        k === subIndex ? value : sp
                      ),
                    }
                  : desc
              ),
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
      if (!banner && !bannerFile) {
        setError("Please upload a banner image.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      if (bannerFile) form.append("banner", bannerFile);
      form.append("academicYear", academicYear);
      form.append("section", JSON.stringify(sections));

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/admission-process`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data?.data || {};
      setBanner(data.banner || null);
      setBannerPreview(
        data.banner ? `${import.meta.env.VITE_APP_URL}${data.banner}` : ""
      );
      setAcademicYear(data.academicYear || "");
      setSections(
        data.section && data.section.length > 0
          ? data.section
          : [
              {
                title: "",
                description: [{ text: "", subpoints: [] }],
              },
            ]
      );
      setSuccess("Admission process updated successfully.");
      setBannerFile(null);
      getAdmissionProcess();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save data"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      {loading ? (
        <p>Loading admission process data...</p>
      ) : (
        <>
          {error && (
            <p className="text-red-500 mb-2 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-600 mb-2 text-center">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Banner */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Banner
              </label>
              {bannerPreview ? (
                <div className="relative w-full mb-4">
                  <img
                    src={bannerPreview}
                    alt="banner-preview"
                    className="w-full h-64 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 hover:bg-gray-100 transition"
                  >
                    X
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="w-full rounded border px-3 py-2"
                />
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="Enter academic year"
                className="w-full rounded border px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Sections */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Sections
              </label>
              {sections.map((sec, secIdx) => (
                <div
                  key={secIdx}
                  className="mb-4 p-4 border rounded-lg relative"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      Section {secIdx + 1}
                    </span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(secIdx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Section Title */}
                  <input
                    type="text"
                    placeholder="Section Title"
                    value={sec.title}
                    onChange={(e) =>
                      updateSectionTitle(secIdx, e.target.value)
                    }
                    className="mt-1 block w-full rounded border px-3 py-2 text-sm mb-2"
                    required
                  />

                  {/* Descriptions */}
                  {sec.description.map((desc, descIdx) => (
                    <div
                      key={descIdx}
                      className="mb-2 p-2 border rounded"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span>Description {descIdx + 1}</span>
                        {sec.description.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeDescription(secIdx, descIdx)
                            }
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            X
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Text"
                        value={desc.text}
                        onChange={(e) =>
                          updateDescriptionText(
                            secIdx,
                            descIdx,
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full rounded border px-3 py-2 text-sm mb-1"
                        required
                      />

                      {/* Subpoints */}
                      {desc.subpoints.map((sp, spIdx) => (
                        <div
                          key={spIdx}
                          className="flex items-center mb-1 gap-2"
                        >
                          <input
                            type="text"
                            placeholder="Subpoint"
                            value={sp}
                            onChange={(e) =>
                              updateSubpoint(
                                secIdx,
                                descIdx,
                                spIdx,
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeSubpoint(secIdx, descIdx, spIdx)
                            }
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addSubpoint(secIdx, descIdx)
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm mt-1"
                      >
                        Add Subpoint
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addDescription(secIdx)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm mt-2"
                  >
                    Add Description
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm mt-2"
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
                Save Admission Process
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
