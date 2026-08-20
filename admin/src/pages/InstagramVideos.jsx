import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const MAX_VIDEOS = 6;

const InstagramVideos = ({ token }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const addFileInputRef = useRef(null);
  const editFileInputRefs = useRef({});

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/video/list`);

      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  // ================= Add New Video =================

  const handleAddFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("video", file);

      const { data } = await axios.post(
        `${backendUrl}/api/video/add`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setVideos((prev) => [...prev, data.video]);
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

  // ================= Replace Existing Video =================

  const handleEditFileSelect = async (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      e.target.value = "";
      return;
    }

    try {
      setEditingId(id);

      const formData = new FormData();
      formData.append("video", file);

      const { data } = await axios.put(
        `${backendUrl}/api/video/${id}`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        setVideos((prev) =>
          prev.map((v) => (v._id === id ? data.video : v))
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

  // ================= Delete Video =================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      setDeletingId(id);

      const { data } = await axios.delete(
        `${backendUrl}/api/video/${id}`,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchVideos(); // re-fetch so re-ordered slots stay in sync
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

  const canAddMore = videos.length < MAX_VIDEOS;

  return (
    <div className="space-y-6 sm:space-y-8">

      <div>
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white"
          style={{ fontFamily: "Prata, serif" }}
        >
          Instagram Videos
        </h1>

        <p className="text-gray-500 mt-1 sm:mt-2 text-xs sm:text-base">
          Manage the {MAX_VIDEOS} videos shown in the homepage Instagram
          section ({videos.length}/{MAX_VIDEOS} used)
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading videos...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">

          {videos.map((video, index) => (
            <div
              key={video._id}
              className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,60,.12)] aspect-[4/5]"
            >
              <video
                src={video.videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay
              />

              <div className="absolute top-2 left-2 bg-black/60 text-red-300 text-xs px-2 py-1 rounded-full">
                v{index + 1}
              </div>

              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 hover:opacity-100">

                <button
                  onClick={() => editFileInputRefs.current[video._id]?.click()}
                  disabled={editingId === video._id}
                  className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-black hover:scale-110 transition disabled:opacity-50"
                  title="Replace video"
                  type="button"
                >
                  {editingId === video._id ? "…" : "✎"}
                </button>

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  ref={(el) => (editFileInputRefs.current[video._id] = el)}
                  onChange={(e) => handleEditFileSelect(video._id, e)}
                />

                <button
                  onClick={() => handleDelete(video._id)}
                  disabled={deletingId === video._id}
                  className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center text-white hover:scale-110 transition disabled:opacity-50"
                  title="Delete video"
                  type="button"
                >
                  {deletingId === video._id ? "…" : "🗑"}
                </button>

              </div>
            </div>
          ))}

          {canAddMore && (
            <button
              onClick={() => addFileInputRef.current?.click()}
              disabled={uploading}
              type="button"
              className="aspect-[4/5] rounded-3xl border-2 border-dashed border-red-500/30 flex flex-col items-center justify-center gap-2 text-red-300 hover:bg-red-500/5 hover:border-red-500/50 transition-all duration-300 disabled:opacity-50"
            >
              <span className="text-3xl">{uploading ? "…" : "+"}</span>
              <span className="text-sm" style={{ fontFamily: "Prata, serif" }}>
                {uploading ? "Uploading..." : "Add Video"}
              </span>
            </button>
          )}

          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={addFileInputRef}
            onChange={handleAddFileSelect}
          />

        </div>
      )}

      {!loading && videos.length === 0 && (
        <p className="text-gray-500 text-sm">
          No videos uploaded yet. Click "Add Video" to upload your first one.
        </p>
      )}

    </div>
  );
};

export default InstagramVideos;
