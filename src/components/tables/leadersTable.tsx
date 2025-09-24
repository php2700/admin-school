// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeadersTable() {
  const [leaders, setLeaders] = useState([]); 
  const [editingLeader, setEditingLeader] = useState(null); 
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null); 
  const [preview, setPreview] = useState(""); 
  const [removedImage, setRemovedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch leaders list
  const getLeaders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/leaders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaders(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch leaders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeaders();
  }, []);

  const handleAddNew = () => {
    setEditingLeader(null);
    setName("");
    setDesignation("");
    setMessage("");
    setFile(null);
    setPreview("");
    setRemovedImage("");
    setShowForm(true);
    setSuccess("");
    setError("");
  };

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setName(leader.name);
    setDesignation(leader.designation);
    setMessage(leader.message);
    setPreview(
      leader.profileImage ? `${import.meta.env.VITE_APP_URL}${leader.profileImage}` : ""
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
    setRemovedImage(editingLeader?.profileImage || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("designation", designation);
      form.append("message", message);
      if (file) form.append("profileImage", file);
      if (removedImage) form.append("removeImage", removedImage);

      let res;
      if (editingLeader) {
        form.append("_id", editingLeader._id);
        res = await axios.patch(
          `${import.meta.env.VITE_APP_URL}api/admin/leaders`,
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
          `${import.meta.env.VITE_APP_URL}api/admin/leaders`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      const updatedLeader = res.data?.section ?? res.data;
      setSuccess(editingLeader ? "Leader updated successfully" : "Leader added successfully");

      if (editingLeader) {
        setLeaders((prev) =>
          prev.map((l) => (l._id === updatedLeader._id ? updatedLeader : l))
        );
      } else {
        setLeaders((prev) => [...prev, updatedLeader]);
      }

      setEditingLeader(null);
      setFile(null);
      setPreview("");
      setRemovedImage("");
      setName("");
      setDesignation("");
      setMessage("");
      setShowForm(false);
      getLeaders()
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save leader");
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
          Add New Leader
        </button>
      </div>

      {loading ? (
        <p>Loading leaders...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden text-center text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 w-24">Profile Image</th>
                  <th className="border px-3 py-2 w-48">Name</th>
                  <th className="border px-3 py-2 w-48">Designation</th>
                  <th className="border px-3 py-2 w-96">Message</th>
                  <th className="border px-3 py-2 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaders?.map((leader, idx) => (
                  <tr key={leader._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border px-3 py-2">
                      {leader.profileImage && (
                        <img
                          src={`${import.meta.env.VITE_APP_URL}${leader.profileImage}`}
                          alt="leader"
                          className="w-16 h-16 object-cover mx-auto rounded"
                        />
                      )}
                    </td>
                    <td className="border px-3 py-2">{leader.name}</td>
                    <td className="border px-3 py-2">{leader.designation}</td>
                    <td className="border px-3 py-2 text-left break-words">{leader.message}</td>
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => handleEdit(leader)}
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
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4 mt-6">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                  placeholder="Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                  placeholder="Designation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Short message"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Profile Image</label>
                <div className="flex gap-3 mb-3">
                  {preview && (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview("");
                          if (editingLeader?.profileImage) setRemovedImage(editingLeader.profileImage);
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
                    onChange={handleFileChange}
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
                  {editingLeader ? "Update Leader" : "Add Leader"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
