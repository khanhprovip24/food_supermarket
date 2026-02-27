import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem trang cá nhân.</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Đăng nhập
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await authService.updateProfile(formData);
    
    if (result.success) {
      setSuccess('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
      console.log('Profile updated:', result.user);
      // Update form with new data
      if (result.user) {
        setFormData({
          first_name: result.user.first_name || '',
          last_name: result.user.last_name || '',
          phone: result.user.phone || '',
          address: result.user.address || '',
        });
      }
    } else {
      setError(result.errors?.detail || 'Cập nhật thất bại');
      console.error('Update error:', result.errors);
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - Account Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Username</p>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                </div>

                {user.is_admin && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-sm font-medium text-amber-900">👑 Admin Account</p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <Link
                  to="/orders"
                  className="block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium transition"
                >
                  📦 Đơn hàng của tôi
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 font-medium transition"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    isEditing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isEditing ? '✕ Hủy' : '✏️ Chỉnh sửa'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handlechange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nhập họ của bạn"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handlechange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nhập tên của bạn"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlechange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handlechange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium transition disabled:bg-gray-400"
                    >
                      {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Họ</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {user.first_name || '—'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tên</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {user.last_name || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Số điện thoại</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.phone || '—'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Địa chỉ</p>
                    <p className="text-lg font-semibold text-gray-800 whitespace-pre-wrap">
                      {user.address || '—'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
