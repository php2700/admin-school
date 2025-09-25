// @ts-nocheck
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MandatoryEditor() {
  const token = localStorage.getItem("shriRamSchoolToken");

  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [documents, setDocuments] = useState({
    documents1: { heading: "", subHeading: [] },
    documents2: { heading: "", subHeading: [] },
    documents3: { heading: "", subHeading: [] },
    documents4: { heading: "", subHeading: [] },
    documents5: { heading: "", subHeading: [] },
    documents6: { heading: "", subHeading: [] },
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Scroll to top on message
  useEffect(() => {
    if (message.text) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [message]);

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_URL}api/admin/mandatory`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          const data = res.data;

          if (data.banner) setBannerPreview(`${import.meta.env.VITE_APP_URL}${data.banner}`);

          const newDocs = { ...documents };
          for (let i = 1; i <= 6; i++) {
            const key = `documents${i}`;
            if (data[key]) {
              const docData = { ...data[key] };
              docData.subHeading = docData.subHeading.map((sub) => ({
                ...sub,
                imageUrl: sub.image ? `${import.meta.env.VITE_APP_URL}${sub.image}` : "",
              }));
              newDocs[key] = docData;
            }
          }
          setDocuments(newDocs);
        }
      } catch (err) {
        console.error("Error fetching mandatory data:", err);
        setMessage({ type: "error", text: "Failed to load data." });
      }
    };
    fetchData();
  }, []);

  // Banner change
  const handleBannerChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBanner(e.target.files[0]);
      setBannerPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Heading change
  const handleHeadingChange = (docKey, value) => {
    setDocuments((prev) => ({
      ...prev,
      [docKey]: { ...prev[docKey], heading: value },
    }));
  };

  // Add subHeading
  const addSubHeading = (docKey) => {
    setDocuments((prev) => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        subHeading: [...prev[docKey].subHeading, { key: "", value: "", image: null, imageUrl: "" }],
      },
    }));
  };

  // Remove subHeading
  const removeSubHeading = (docKey, index) => {
    setDocuments((prev) => {
      const updated = [...prev[docKey].subHeading];
      updated.splice(index, 1);
      return { ...prev, [docKey]: { ...prev[docKey], subHeading: updated } };
    });
  };

  // Handle subHeading change
  const handleSubHeadingChange = (docKey, index, field, value) => {
    setDocuments((prev) => {
      const updated = [...prev[docKey].subHeading];
      const sub = { ...updated[index] };

      if (field === "image" && value instanceof File) {
        sub.image = value;
        sub.imageUrl = URL.createObjectURL(value);

        if (["documents1", "documents4", "documents5", "documents3"].includes(docKey)) {
          sub.value = ""; // Clear value if it's a text-based document
        }
      } else if (field === "value") {
        if (["documents1", "documents4", "documents5", "documents3"].includes(docKey)) {
          sub.value = value;
        }
      } else if (field === "key") {
        sub.key = value;
      }

      updated[index] = sub;
      return { ...prev, [docKey]: { ...prev[docKey], subHeading: updated } };
    });
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (banner) formData.append("banner", banner);

      Object.entries(documents).forEach(([docKey, docData]) => {
        formData.append(`${docKey}[heading]`, docData.heading || "");

        docData.subHeading.forEach((sub, idx) => {
          formData.append(`${docKey}[subHeading][${idx}][key]`, sub.key || "");

          if (["documents1", "documents4", "documents5"].includes(docKey)) {
            formData.append(`${docKey}[subHeading][${idx}][value]`, sub.value || "");
          } else if (["documents2", "documents6"].includes(docKey)) {
            if (sub.image) formData.append(`${docKey}[subHeading][${idx}][image]`, sub.image);
          } else if (docKey === "documents3") {
            if (sub.value) formData.append(`${docKey}[subHeading][${idx}][value]`, sub.value);
            if (sub.image) formData.append(`${docKey}[subHeading][${idx}][image]`, sub.image);
          }
        });
      });

      await axios.post(`${import.meta.env.VITE_APP_URL}api/admin/mandatory`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setMessage({ type: "success", text: "Mandatory data saved successfully!" });
    } catch (err) {
      console.error("Error saving mandatory data:", err);
      setMessage({ type: "error", text: "Failed to save mandatory data." });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Success/Error Messages */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Banner */}
      <div className="mb-8">
        <label className="block mb-2 font-medium text-gray-700">Banner</label>
        <label
          htmlFor="banner-upload"
          className="flex items-center justify-center w-full h-14 px-6 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
        >
          <span className="text-blue-600 font-medium">{banner ? banner.name : "Click to upload banner"}</span>
          <input id="banner-upload" type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
        </label>
        {bannerPreview && (
          <div className="mt-4 w-full h-64 overflow-hidden rounded-lg border shadow">
            <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Documents */}
      {Object.entries(documents).map(([docKey, docData]) => (
        <div key={docKey} className="border rounded-lg p-6 mb-6 shadow-sm bg-gray-50">
          <h3 className="text-lg font-semibold mb-3 capitalize text-gray-800">{docKey}</h3>
          <input
            type="text"
            placeholder="Heading"
            value={docData.heading}
            onChange={(e) => handleHeadingChange(docKey, e.target.value)}
            className="w-full mb-4 rounded border px-3 py-2 text-sm"
          />

          {docData.subHeading.map((sub, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-2 items-start mb-3 border p-3 rounded">
              <input
                type="text"
                placeholder="Key"
                value={sub.key}
                onChange={(e) => handleSubHeadingChange(docKey, idx, "key", e.target.value)}
                className="flex-1 rounded border px-3 py-2 text-sm"
              />

              {docKey === "documents3" ? (
                <>
                  <input
                    type="text"
                    placeholder="Value"
                    value={sub.value || ""}
                    disabled={!!sub.image}
                    onChange={(e) => handleSubHeadingChange(docKey, idx, "value", e.target.value)}
                    className="flex-1 rounded border px-3 py-2 text-sm"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    disabled={!!sub.value}
                    onChange={(e) =>
                      handleSubHeadingChange(docKey, idx, "image", e.target.files ? e.target.files[0] : null)
                    }
                    className="flex-1 text-sm"
                  />
                  {sub.imageUrl && <img src={sub.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded border" />}
                </>
              ) : ["documents1", "documents4", "documents5"].includes(docKey) ? (
                <input
                  type="text"
                  placeholder="Value"
                  value={sub.value || ""}
                  onChange={(e) => handleSubHeadingChange(docKey, idx, "value", e.target.value)}
                  className="flex-1 rounded border px-3 py-2 text-sm"
                />
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleSubHeadingChange(docKey, idx, "image", e.target.files ? e.target.files[0] : null)
                    }
                    className="flex-1 text-sm"
                  />
                  {sub.imageUrl && <img src={sub.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded border" />}
                </>
              )}

              <button
                type="button"
                onClick={() => removeSubHeading(docKey, idx)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSubHeading(docKey)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Add SubHeading
          </button>
        </div>
      ))}

      <div className="text-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Save Mandatory Data
        </button>
      </div>
    </div>
  );
}
