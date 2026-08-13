import axios from "axios";
import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backendUrl + "/api/admin/login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      );

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D3D3D3]">
      <div className="bg-gradient-to-br
      from-[#F5F5F7]
      via-[#64748B]
      to-[#F5F5F7] shadow-xl rounded-3xl p-10 w-[420px] border border-[#B9572C]/20">

        <h1
          className="text-4xl text-center text-[#B9572C] mb-8"
          style={{ fontFamily: "Prata, serif" }}
        >
          Admin Login
        </h1>

        <form onSubmit={onSubmitHandler}>

          <div className="mb-5">
            <label className="block mb-2 text-gray-700 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:border-[#B9572C]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:border-[#B9572C]"
              required
            />
          </div>

          <button
            type="submit"
            className="
            w-full
            bg-[#B9572C]
            text-white
            py-3
            rounded-xl
            shadow-[0_0_20px_rgba(185,87,44,0.4)]
            hover:scale-105
            transition-all
            duration-300
            "
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;
