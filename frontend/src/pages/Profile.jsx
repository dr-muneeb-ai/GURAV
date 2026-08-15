import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const Profile = () => {
  const { user, setUser, token, backendUrl, navigate } =
    useContext(ShopContext);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // Not logged in — send them to login instead of showing a broken page
  if (!token || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-gray-600">
          Please login to view your profile.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-6 py-2 rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please choose an image first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const { data } = await axios.post(
        `${backendUrl}/api/user/profile-picture`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile picture updated");
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const displayImage = previewUrl || user.profileImage;

  return (
    <div className="max-w-md mx-auto mt-10 sm:mt-14 mb-16 px-4">
      <h1
        className="text-2xl sm:text-3xl text-center mb-8"
        style={{ fontFamily: "'Prata', serif" }}
      >
        My Profile
      </h1>

      <div className="flex flex-col items-center gap-4">

        {/* AVATAR */}
        <div className="relative">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400">
                {user.name?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm hover:bg-[#b9572c] transition"
            aria-label="Change photo"
            type="button"
          >
            ✎
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-black text-white px-6 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Save Photo"}
          </button>
        )}

        {/* USER INFO */}
        <div className="w-full mt-6 flex flex-col gap-3 text-sm sm:text-base">
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{user.name}</span>
          </div>

          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
