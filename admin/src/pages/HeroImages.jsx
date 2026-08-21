import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const MAX_HERO_IMAGES = 6;

const HeroImages = ({ token }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const addFileInputRef = useRef(null);
  const editFileInputRefs = useRef({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/hero/list`);

      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load hero images");
    } finally {
      setLoading(false);
    }
  };

  // ================= Add New Image =================

  const handleAddFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${backendUrl}/api/hero/add`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setImages((prev) => [...prev, data.image]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload failed"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ================= Replace Existing Image =================

  const handleEditFileSelect = async (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    try {
      setEditingId(id);

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.put(
        `${backendUrl}/api/hero/${id}`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setImages((prev) =>
          prev.map((img) => (img._id === id ? data.image : img))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setEditingId(null);
      e.target.value = "";
    }
  };

  // ================= Delete Image =================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hero image permanently?")) return;

    try {
      setDeletingId(id);

      const { data } = await axios.delete(
        `${backendUrl}/api/hero/${id}`,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchImages(); // re-fetch so re-ordered slots stay in sync
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const canAddMore = images.length < MAX_HERO_IMAGES;

  return (
    <div className="space-y-6 sm:space-y-8">

      <div>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white"
          style={{ fontFamily: "Prata, serif" }}
        >
          Hero Section Images
        </h1>

        <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-base">
          Manage the images shown in the homepage hero slider
          ({images.length}/{MAX_HERO_IMAGES} used)
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading images...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">

          {images.map((img, index) => (
            <div
              key={img._id}
              className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,60,.12)] aspect-[4/3]"
            >
              <img
                src={img.imageUrl}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-2 left-2 bg-black/60 text-red-300 text-xs px-2 py-1 rounded-full">
                #{index + 1}
              </div>

              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 hover:opacity-100">

                <button
                  onClick={() => editFileInputRefs.current[img._id]?.click()}
                  disabled={editingId === img._id}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-110 transition disabled:opacity-50"
                  title="Replace image"
                  type="button"
                >
                  {editingId === img._id ? "…" : "✎"}
                </button>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => (editFileInputRefs.current[img._id] = el)}
                  onChange={(e) => handleEditFileSelect(img._id, e)}
                />

                <button
                  onClick={() => handleDelete(img._id)}
                  disabled={deletingId === img._id}
                  className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center text-white hover:scale-110 transition disabled:opacity-50"
                  title="Delete image"
                  type="button"
                >
                  {deletingId === img._id ? "…" : "🗑"}
                </button>

              </div>
            </div>
          ))}

          {canAddMore && (
            <button
              onClick={() => addFileInputRef.current?.click()}
              disabled={uploading}
              type="button"
              className="aspect-[4/3] rounded-3xl border-2 border-dashed border-red-500/30 flex flex-col items-center justify-center gap-2 text-red-300 hover:bg-red-500/5 hover:border-red-500/50 transition-all duration-300 disabled:opacity-50"
            >
              <span className="text-3xl">{uploading ? "…" : "+"}</span>
              <span className="text-sm" style={{ fontFamily: "Prata, serif" }}>
                {uploading ? "Uploading..." : "Add Image"}
              </span>
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={addFileInputRef}
            onChange={handleAddFileSelect}
          />

        </div>
      )}

      {!loading && images.length === 0 && (
        <p className="text-gray-500 text-sm">
          No hero images uploaded yet. Click "Add Image" to upload your first one.
        </p>
      )}

    </div>
  );
};

export default HeroImages;
