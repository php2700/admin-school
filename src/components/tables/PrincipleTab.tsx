// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PrincipleEditor() {
  const [principle, setPrinciple] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch existing data (if any) using POST
  const getPrinciple = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/principals`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = res.data?.data || null;

      if (payload) {
        setPrinciple(payload);
        setName(payload.name || "");
        setMessage(payload.message || "");
        setImagePreview(
          payload.image ? `${import.meta.env.VITE_APP_URL}${payload.image}` : ""
        );
        setBannerPreview(
          payload.bannerImage
            ? `${import.meta.env.VITE_APP_URL}${payload.bannerImage}`
            : ""
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch principal message"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrinciple();
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    if (type === "image") {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (type === "banner") {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      img.onload = () => {
        if (img.width < 1400) {
          setError("Banner image width must be at least 1400px.");
          setBannerImage(null);
          setBannerPreview("");
          URL.revokeObjectURL(objectUrl);
        } else {
          setBannerImage(file);
          setBannerPreview(objectUrl);
          setError("");
        }
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!name || !message) {
        setError("Name and message are required.");
        setSaving(false);
        return;
      }

      const form = new FormData();
      if (principle?._id) form.append("_id", principle._id); // send id if updating
      form.append("name", name);
      form.append("message", message);
      if (image) form.append("image", image);
      if (bannerImage) form.append("bannerImage", bannerImage);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/principals`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updated = res.data?.data ?? res.data;
      setPrinciple(updated);
      setSuccess(principle ? "Principal message updated." : "Principal message created.");
      getPrinciple()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save principal message"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading principal message...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Image
              </label>
              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="profile"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="border p-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                placeholder="Principal's Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                rows={4}
                placeholder="Principal's message"
                required
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-2">
                Banner Image
              </label>
              {bannerPreview && (
                <div className="mb-3">
                  <img
                    src={bannerPreview}
                    alt="banner"
                    className="w-full h-72 object-cover rounded-lg border"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "banner")}
                className="border p-2 rounded text-sm"
              />
              <p className="text-xs text-gray-500">Minimum width: 1400px</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {principle ? "Update Message" : "Create Message"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
