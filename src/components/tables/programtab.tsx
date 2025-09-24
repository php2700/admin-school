// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProgramEditor() {
  const [programs, setPrograms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false); // For viewing program
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch all programs
  const getPrograms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}api/admin/program-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch program list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrograms();
  }, []);

  // Open form to add or edit
  const openForm = (program = null) => {
    setError("");
    setSuccess("");
    setShowView(false);
    if (program) {
      setSelectedProgram(program);
      setTitle(program.title);
      setSections(program.section || []);
    } else {
      setSelectedProgram(null);
      setTitle("");
      setSections([]);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedProgram(null);
    setTitle("");
    setSections([]);
  };

  // Open view mode
  const openView = (program) => {
    setSelectedProgram(program);
    setSections(program.section || []);
    setShowForm(false);
    setShowView(true);
  };

  const closeView = () => {
    setSelectedProgram(null);
    setSections([]);
    setShowView(false);
  };

  // Sections handlers
  const addSection = () => setSections((prev) => [...prev, { heading: "", description: "" }]);
  const removeSection = (index) => setSections((prev) => prev.filter((_, i) => i !== index));
  const updateSectionHeading = (index, value) =>
    setSections((prev) => prev.map((sec, i) => (i === index ? { ...sec, heading: value } : sec)));
  const updateSectionDescription = (index, value) =>
    setSections((prev) => prev.map((sec, i) => (i === index ? { ...sec, description: value } : sec)));

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required.");
      setSaving(false);
      return;
    }

    if (sections.length === 0) {
      setError("Please add at least one section.");
      setSaving(false);
      return;
    }

    try {
      const payload = { title, section: sections };
      const url = selectedProgram
        ? `${import.meta.env.VITE_APP_URL}api/admin/program`
        : `${import.meta.env.VITE_APP_URL}api/admin/program`;
      const method = selectedProgram ? "patch" : "post";

if(method=='patch') payload._id=selectedProgram._id;

      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(`Program ${selectedProgram ? "updated" : "added"} successfully.`);
      closeForm();
      getPrograms();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save program");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Program List</h2>
        <button
          type="button"
          onClick={() => openForm()}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          Add New Program
        </button>
      </div>

      {loading ? (
        <p>Loading programs...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

          {/* Program List */}
          {programs.length > 0 ? (
            <table className="w-full border mb-6">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((prog, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{prog.title}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        type="button"
                        onClick={() => openForm(prog)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => openView(prog)}
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No programs available.</p>
          )}

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6 border-t pt-4">
              <h3 className="font-medium mb-2">{selectedProgram ? "Edit Program" : "Add Program"}</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Program Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm"
                  required
                />
              </div>

              {/* Sections */}
              <div>
                <label className="block text-sm font-medium mb-2">Sections</label>
                {sections.map((sec, idx) => (
                  <div key={idx} className="mb-4 p-4 border rounded-lg relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Section {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeSection(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Heading"
                      value={sec.heading}
                      onChange={(e) => updateSectionHeading(idx, e.target.value)}
                      className="mt-1 block w-full rounded border px-3 py-2 text-sm mb-2"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={sec.description}
                      onChange={(e) => updateSectionDescription(idx, e.target.value)}
                      className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                      rows={3}
                      required
                    />
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
                  Save Program
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* View Program */}
          {showView && selectedProgram && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">View Program: {selectedProgram.title}</h3>
              {sections.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {sections.map((sec, idx) => (
                    <li key={idx}>
                      <strong>{sec.heading}</strong>: {sec.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sections available.</p>
              )}
              <button
                type="button"
                onClick={closeView}
                className="mt-3 px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 transition text-sm"
              >
                Close
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
