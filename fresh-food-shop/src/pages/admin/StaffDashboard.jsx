// import React, { useState } from 'react';
// import { Package, Clock, CheckCircle, XCircle, Eye, Printer } from 'lucide-react';
// import InventoryTable from '../../components/admin/InventoryTable';
// import { orders } from '../../data/mockData';

// const StaffDashboard = () => {
//   const [activeTab, setActiveTab] = useState('orders'); // orders, inventory
//   const [orderList, setOrderList] = useState(orders);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       pending: { label: 'Chờ xử lý', class: 'badge-warning', icon: Clock },
//       processing: { label: 'Đang xử lý', class: 'badge bg-blue-100 text-blue-700', icon: Package },
//       shipping: { label: 'Đang giao', class: 'badge bg-purple-100 text-purple-700', icon: Package },
//       delivered: { label: 'Đã giao', class: 'badge-success', icon: CheckCircle },
//       cancelled: { label: 'Đã hủy', class: 'badge-danger', icon: XCircle },
//     };
    
//     const config = statusConfig[status] || statusConfig.pending;
//     const Icon = config.icon;
    
//     return (
//       <span className={config.class}>
//         <Icon size={14} className="mr-1" />
//         {config.label}
//       </span>
//     );
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//     }).format(price);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const updateOrderStatus = (orderId, newStatus) => {
//     setOrderList((prev) =>
//       prev.map((order) =>
//         order.id === orderId
//           ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
//           : order
//       )
//     );
//   };

//   const stats = {
//     pending: orderList.filter((o) => o.status === 'pending').length,
//     processing: orderList.filter((o) => o.status === 'processing').length,
//     shipping: orderList.filter((o) => o.status === 'shipping').length,
//     total: orderList.length,
//   };

//   return (
//     <div className="min-h-screen bg-earth-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="font-display text-3xl font-bold text-earth-900 mb-2">
//             Staff Dashboard
//           </h1>
//           <p className="text-earth-600">Quản lý đơn hàng và tồn kho</p>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="card p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-earth-600 text-sm font-medium">Chờ xử lý</span>
//               <Clock size={20} className="text-yellow-600" />
//             </div>
//             <p className="text-3xl font-bold text-earth-900">{stats.pending}</p>
//           </div>
          
//           <div className="card p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-earth-600 text-sm font-medium">Đang xử lý</span>
//               <Package size={20} className="text-blue-600" />
//             </div>
//             <p className="text-3xl font-bold text-earth-900">{stats.processing}</p>
//           </div>
          
//           <div className="card p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-earth-600 text-sm font-medium">Đang giao</span>
//               <Package size={20} className="text-purple-600" />
//             </div>
//             <p className="text-3xl font-bold text-earth-900">{stats.shipping}</p>
//           </div>
          
//           <div className="card p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-earth-600 text-sm font-medium">Tổng đơn</span>
//               <CheckCircle size={20} className="text-fresh-600" />
//             </div>
//             <p className="text-3xl font-bold text-earth-900">{stats.total}</p>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-card mb-8">
//           <div className="flex border-b border-earth-200">
//             <button
//               onClick={() => setActiveTab('orders')}
//               className={`flex-1 px-6 py-4 font-semibold transition-colors ${
//                 activeTab === 'orders'
//                   ? 'text-fresh-600 border-b-2 border-fresh-600'
//                   : 'text-earth-600 hover:text-earth-900'
//               }`}
//             >
//               📦 Quản lý Đơn hàng
//             </button>
//             <button
//               onClick={() => setActiveTab('inventory')}
//               className={`flex-1 px-6 py-4 font-semibold transition-colors ${
//                 activeTab === 'inventory'
//                   ? 'text-fresh-600 border-b-2 border-fresh-600'
//                   : 'text-earth-600 hover:text-earth-900'
//               }`}
//             >
//               📊 Quản lý Tồn kho
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         {activeTab === 'orders' ? (
//           <div className="bg-white rounded-2xl shadow-card overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-earth-50 border-b border-earth-200">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-earth-700">
//                       Mã đơn
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-earth-700">
//                       Khách hàng
//                     </th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-earth-700">
//                       Sản phẩm
//                     </th>
//                     <th className="px-6 py-4 text-right text-sm font-semibold text-earth-700">
//                       Tổng tiền
//                     </th>
//                     <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
//                       Trạng thái
//                     </th>
//                     <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
//                       Thời gian
//                     </th>
//                     <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
//                       Thao tác
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-earth-100">
//                   {orderList.map((order) => (
//                     <tr key={order.id} className="hover:bg-earth-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <span className="font-mono text-sm font-semibold text-fresh-600">
//                           {order.id}
//                         </span>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div>
//                           <p className="font-medium text-earth-900">{order.customerName}</p>
//                           <p className="text-sm text-earth-500">{order.customerPhone}</p>
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <p className="text-sm text-earth-700">
//                           {order.items.length} sản phẩm
//                         </p>
//                       </td>
                      
//                       <td className="px-6 py-4 text-right">
//                         <p className="font-bold text-earth-900">{formatPrice(order.total)}</p>
//                         <p className="text-xs text-earth-500">{order.paymentMethod}</p>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="flex justify-center">
//                           {getStatusBadge(order.status)}
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <p className="text-sm text-earth-700 text-center">
//                           {formatDate(order.createdAt)}
//                         </p>
//                       </td>
                      
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => setSelectedOrder(order)}
//                             className="p-2 bg-earth-100 text-earth-700 rounded-lg hover:bg-earth-200 transition-colors"
//                             title="Xem chi tiết"
//                           >
//                             <Eye size={16} />
//                           </button>
                          
//                           {order.status === 'pending' && (
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'processing')}
//                               className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
//                             >
//                               Xác nhận
//                             </button>
//                           )}
                          
//                           {order.status === 'processing' && (
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'shipping')}
//                               className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
//                             >
//                               Giao hàng
//                             </button>
//                           )}
                          
//                           {order.status === 'shipping' && (
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'delivered')}
//                               className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
//                             >
//                               Hoàn thành
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <InventoryTable />
//         )}

//         {/* Order Detail Modal */}
//         {selectedOrder && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
//               <div className="sticky top-0 bg-white border-b border-earth-200 px-6 py-4 flex items-center justify-between">
//                 <h3 className="font-display text-2xl font-bold text-earth-900">
//                   Chi tiết đơn hàng
//                 </h3>
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="w-10 h-10 rounded-full hover:bg-earth-100 flex items-center justify-center transition-colors"
//                 >
//                   <XCircle size={24} className="text-earth-600" />
//                 </button>
//               </div>

//               <div className="p-6 space-y-6">
//                 {/* Order Info */}
//                 <div>
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <p className="text-sm text-earth-500">Mã đơn hàng</p>
//                       <p className="font-mono text-lg font-bold text-fresh-600">
//                         {selectedOrder.id}
//                       </p>
//                     </div>
//                     {getStatusBadge(selectedOrder.status)}
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-earth-500 mb-1">Khách hàng</p>
//                       <p className="font-semibold text-earth-900">{selectedOrder.customerName}</p>
//                       <p className="text-sm text-earth-600">{selectedOrder.customerPhone}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-earth-500 mb-1">Thời gian đặt</p>
//                       <p className="font-semibold text-earth-900">
//                         {formatDate(selectedOrder.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Products */}
//                 <div>
//                   <h4 className="font-semibold text-earth-900 mb-3">Sản phẩm</h4>
//                   <div className="space-y-2">
//                     {selectedOrder.items.map((item, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 bg-earth-50 rounded-xl">
//                         <div className="flex-1">
//                           <p className="font-medium text-earth-900">{item.productName}</p>
//                           <p className="text-sm text-earth-600">SL: {item.quantity}</p>
//                         </div>
//                         <p className="font-bold text-earth-900">{formatPrice(item.total)}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div>
//                   <h4 className="font-semibold text-earth-900 mb-3">Địa chỉ giao hàng</h4>
//                   <div className="p-4 bg-earth-50 rounded-xl">
//                     <p className="font-medium text-earth-900">{selectedOrder.shippingAddress.fullName}</p>
//                     <p className="text-earth-700">{selectedOrder.shippingAddress.phone}</p>
//                     <p className="text-earth-700">
//                       {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.ward}
//                     </p>
//                     <p className="text-earth-700">
//                       {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
//                     </p>
//                     {selectedOrder.note && (
//                       <p className="mt-2 text-sm text-earth-600">
//                         <span className="font-medium">Ghi chú:</span> {selectedOrder.note}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Summary */}
//                 <div>
//                   <h4 className="font-semibold text-earth-900 mb-3">Tổng kết</h4>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-earth-700">
//                       <span>Tạm tính:</span>
//                       <span>{formatPrice(selectedOrder.subtotal)}</span>
//                     </div>
//                     <div className="flex justify-between text-earth-700">
//                       <span>Phí vận chuyển:</span>
//                       <span>{formatPrice(selectedOrder.shippingFee)}</span>
//                     </div>
//                     {selectedOrder.discount > 0 && (
//                       <div className="flex justify-between text-fresh-600">
//                         <span>Giảm giá:</span>
//                         <span>-{formatPrice(selectedOrder.discount)}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-lg font-bold text-earth-900 pt-2 border-t border-earth-200">
//                       <span>Tổng cộng:</span>
//                       <span>{formatPrice(selectedOrder.total)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-3">
//                   <button className="flex-1 btn-primary inline-flex items-center justify-center gap-2">
//                     <Printer size={18} />
//                     In đơn hàng
//                   </button>
//                   <button
//                     onClick={() => setSelectedOrder(null)}
//                     className="flex-1 btn-secondary"
//                   >
//                     Đóng
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default StaffDashboard;

import AdminLayout from "../../layouts/AdminLayout";
import OrderManagement from "../../components/admin/OrderManagement";
import InventoryTable from "../../components/admin/InventoryTable";

const StaffDashboard = () => {
  return (
    <AdminLayout role="staff">
      
      <h1 className="font-display text-3xl font-bold text-earth-900 mb-8">
        Bảng điều khiển nhân viên
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="card-organic p-6">
          <p className="text-earth-500">Đơn hàng hôm nay</p>
          <h3 className="text-3xl font-bold text-fresh-600">24</h3>
        </div>

        <div className="card-organic p-6">
          <p className="text-earth-500">Đang xử lý</p>
          <h3 className="text-3xl font-bold text-tangerine-500">8</h3>
        </div>

        <div className="card-organic p-6">
          <p className="text-earth-500">Sắp hết hàng</p>
          <h3 className="text-3xl font-bold text-red-500">5</h3>
        </div>
      </div>

      {/* Order Management */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-earth-800">
          Quản lý đơn hàng
        </h2>
        <div className="card-organic p-6">
          <OrderManagement />
        </div>
      </div>

      {/* Inventory */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-earth-800">
          Quản lý tồn kho
        </h2>
        <div className="card-organic p-6">
          <InventoryTable />
        </div>
      </div>

    </AdminLayout>
  );
};

export default StaffDashboard;

