import AdminLayout from "../../layouts/AdminLayout";
import UserManagement from "../../components/admin/UserManagement";
import OrderManagement from "../../components/admin/OrderManagement";

const ManagerDashboard = () => {
  return (
    <AdminLayout role="manager">
      
      <h1 className="font-display text-3xl font-bold text-earth-900 mb-8">
        Bảng điều khiển quản lý
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="card-organic p-6">
          <p className="text-earth-500">Doanh thu tháng</p>
          <h3 className="text-3xl font-bold text-fresh-600">120M</h3>
        </div>

        <div className="card-organic p-6">
          <p className="text-earth-500">Tổng đơn hàng</p>
          <h3 className="text-3xl font-bold text-tangerine-500">320</h3>
        </div>

        <div className="card-organic p-6">
          <p className="text-earth-500">Khách hàng</p>
          <h3 className="text-3xl font-bold text-earth-900">540</h3>
        </div>

        <div className="card-organic p-6">
          <p className="text-earth-500">Sản phẩm</p>
          <h3 className="text-3xl font-bold text-sunshine-500">85</h3>
        </div>
      </div>

      {/* User Management */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-earth-800">
          Quản lý người dùng
        </h2>
        <div className="card-organic p-6">
          <UserManagement />
        </div>
      </div>

      {/* Order Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-earth-800">
          Danh sách đơn hàng
        </h2>
        <div className="card-organic p-6">
          <OrderManagement />
        </div>
      </div>

    </AdminLayout>
  );
};

export default ManagerDashboard;
