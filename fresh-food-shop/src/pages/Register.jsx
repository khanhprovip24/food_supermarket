import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!form.username.trim()) {
      setLocalError("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!form.email.trim()) {
      setLocalError("Vui lòng nhập email");
      return;
    }
    if (form.password.length < 6) {
      setLocalError("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }
    if (form.password !== form.password2) {
      setLocalError("Mật khẩu không khớp");
      return;
    }

    const result = await register({
      username: form.username,
      email: form.email,
      password: form.password,
      password2: form.password2,
      first_name: form.first_name,
      last_name: form.last_name,
    });

    if (result.success) {
      navigate("/");
    } else {
      const errors = result.errors || {};
      if (errors.username) {
        setLocalError(errors.username[0] || "Lỗi tên đăng nhập");
      } else if (errors.email) {
        setLocalError(errors.email[0] || "Lỗi email");
      } else if (errors.password) {
        setLocalError(errors.password[0] || "Lỗi mật khẩu");
      } else {
        setLocalError("Đăng ký thất bại. Vui lòng kiểm tra thông tin");
      }
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-6 px-4">
        <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Tạo tài khoản</h2>

          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {localError || error?.detail || "Có lỗi xảy ra"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="Nhập tên đăng nhập"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Họ</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Nhập họ"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tên</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Nhập tên"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="Nhập email"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="Nhập lại mật khẩu"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 
                         text-white font-semibold py-2.5 
                         rounded-lg transition duration-200
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;