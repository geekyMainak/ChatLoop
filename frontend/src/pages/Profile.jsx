import React, { useRef, useState } from "react";
import axios from "axios";
import { IoCameraOutline, IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { serverUrl } from "../config";
import { setUserData } from "../redux/userSlice";

function Profile() {
  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const imageInputRef = useRef();

  const [name, setName] = useState(userData?.name || "");
  const [userName, setUserName] = useState(userData?.userName || "");

  const [frontendImage, setFrontendImage] = useState(
    userData?.image ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  const [backendImage, setBackendImage] = useState(null);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Preview selected image
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // Save Profile
  const handleProfile = async (e) => {
    e.preventDefault();

    setSaving(true);
    setErr("");

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("userName", userName);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));

      alert("Profile updated successfully");
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);

      setErr(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-5 py-10">

      {/* Back Button */}

      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"
      >
        <IoArrowBack className="text-3xl text-fuchsia-600" />
      </button>

      {/* Card */}

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="h-48 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 relative flex justify-center">

          {/* Profile Picture */}

          <div
            className="absolute -bottom-20 cursor-pointer"
            onClick={() => imageInputRef.current.click()}
          >
            <div className="relative">

              <div className="w-40 h-40 rounded-full border-[6px] border-white overflow-hidden bg-white shadow-xl">

                <img
                  src={frontendImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />

              </div>

              <div
                className="absolute bottom-2 right-2
                bg-gradient-to-r
                from-violet-600
                via-fuchsia-600
                to-pink-500
                rounded-full
                p-2
                shadow-lg"
              >
                <IoCameraOutline
                  size={24}
                  className="text-white"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Form */}

        <div className="pt-28 pb-10 px-10">

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            My Profile
          </h2>

          <form
            onSubmit={handleProfile}
            className="space-y-5"
          >

            {/* Hidden File Input */}

            <input
              ref={imageInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />

            {/* Name */}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:ring-2 focus:ring-fuchsia-300 focus:border-fuchsia-500"
              />
            </div>

            {/* Username */}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Username
              </label>

              <input
                type="text"
                value={userName}
                onChange={(e) =>
                  setUserName(e.target.value)
                }
                placeholder="Enter username"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none transition focus:ring-2 focus:ring-fuchsia-300 focus:border-fuchsia-500"
              />
            </div>

            {/* Email */}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={userData?.email || ""}
                readOnly
                disabled
                className="w-full rounded-xl border border-gray-300 bg-gray-100 text-gray-500 p-4 cursor-not-allowed"
              />
            </div>

            {/* Error */}

            {err && (
              <p className="text-red-500 text-sm">
                * {err}
              </p>
            )}

            {/* Button */}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-[1.02] hover:shadow-xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;