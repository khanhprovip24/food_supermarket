import { Link } from "react-router-dom";
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    alert("Đăng ký thành công (demo)");
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-6 px-4">
        
        <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8">
          
          <h2 className="text-2xl font-bold text-center mb-6">
            Tạo tài khoản
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Nhập email"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
                required
                placeholder="Nhập mật khẩu"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Nhập lại mật khẩu"
                className="w-full border border-gray-300 p-2.5 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 
                         text-white font-semibold py-2.5 
                         rounded-lg transition duration-200"
            >
              Đăng ký
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