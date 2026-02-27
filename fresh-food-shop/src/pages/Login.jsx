import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setLocalError(""); // Xóa error khi user bắt đầu nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.username.trim() || !form.password.trim()) {
      setLocalError("Vui lòng nhập username và mật khẩu");
      return;
    }

    const result = await login({
      username: form.username,
      password: form.password,
    });

    if (result.success) {
      navigate("/");
    } else {
      const errors = result.errors || {};
      if (errors.detail) {
        setLocalError(errors.detail);
      } else if (errors.non_field_errors) {
        setLocalError(errors.non_field_errors[0]);
      } else {
        setLocalError("Đăng nhập thất bại. Vui lòng kiểm tra thông tin");
      }
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-6 px-4">
        <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {localError || error?.detail || "Có lỗi xảy ra"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="Nhập mật khẩu"
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
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-green-600 font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;