// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SportEditor() {
  const [sport, setSport] = useState(null);
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [images, setImages] = useState([]); // local new files
  const [previews, setPreviews] = useState([]); // preview urls
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("shriRamSchoolToken");

  // Fetch sport section data
  const getSport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/sport`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = res.data || null;
      if (payload) {
        setSport(payload);
        setDescription(payload.description || "");
        if (payload.banner) {
          setBannerPreview(`${import.meta.env.VITE_APP_URL}${payload.banner}`);
        }
        const imgs = (payload.images || []).map(
          (img) => `${import.meta.env.VITE_APP_URL}${img}`
        );
        setPreviews(imgs);
      } else {
        setSport(null);
        setDescription("");
        setBannerPreview("");
        setPreviews([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch sport section"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSport();
  }, []);

  // Banner handler
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleRemoveBanner = () => {
    setBanner(null);
    setBannerPreview("");
  };

  // Images handler (max 4)
  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (previews.length + selectedFiles.length > 4) {
      setError("You can upload a maximum of 4 images.");
      return;
    }
    setError("");

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...selectedFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...images];
    const updatedPreviews = [...previews];
    const removedImage = updatedPreviews[index];

    // Check if image is from backend
    if (sport?.images?.length) {
      const backendIdx = sport.images.findIndex(
        (img) => `${import.meta.env.VITE_APP_URL}${img}` === removedImage
      );
      if (backendIdx !== -1) {
        setRemovedImages((prev) => [...prev, sport.images[backendIdx]]);
      }
    }

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedFiles);
    setPreviews(updatedPreviews);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      form.append("description", description);
      if (banner) form.append("banner", banner);
      images.forEach((file) => form.append("images", file));

      if (removedImages.length > 0) {
        removedImages.forEach((img) => form.append("removeImages[]", img));
      }

      const res = await axios.post(
        `${import.meta.env.VITE_APP_URL}api/admin/sport`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const created = res.data?.section ?? res.data;
      setSport(created);
      setSuccess("Sport section updated successfully.");
      setImages([]);
      setRemovedImages([]);
      setBanner(null);

      setBannerPreview(
        created.banner ? `${import.meta.env.VITE_APP_URL}${created.banner}` : ""
      );
      setPreviews(
        (created.images || []).map(
          (img) => `${import.meta.env.VITE_APP_URL}${img}`
        )
      );
      getSport()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save sport section"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {loading ? (
        <p>Loading Sport section...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                rows={4}
                placeholder="Sport description"
                required
              />
            </div>

            {/* Banner */}
            <div>
              <label className="block text-sm font-medium mb-2">Banner</label>
              {bannerPreview ? (
                <div className="mb-4">
                  <img
                    src={bannerPreview}
                    alt="banner-preview"
                    className="w-full h-64 object-cover rounded-lg border shadow-md"
                  />
                  <div className="mt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="px-4 py-1 text-sm text-red-600 border border-red-400 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="border p-2 rounded"
                />
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="flex gap-3 flex-wrap mb-3">
                {previews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {previews.length < 4 && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="border p-2 rounded"
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {sport ? "Update Sport" : "Create Sport"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
