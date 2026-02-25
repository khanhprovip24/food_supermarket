import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Edit2, Save, X, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { inventoryData } from '../../data/mockData';

const InventoryTable = () => {
  const [inventory, setInventory] = useState(inventoryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, ok, low

  const handleEdit = (productId, currentStock) => {
    setEditingId(productId);
    setEditValue(currentStock.toString());
  };

  const handleSave = (productId) => {
    const newStock = parseInt(editValue);
    if (!isNaN(newStock) && newStock >= 0) {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.productId === productId) {
            const status = newStock < item.minStock ? 'low' : 'ok';
            return { ...item, currentStock: newStock, status };
          }
          return item;
        })
      );
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: inventory.length,
    low: inventory.filter((item) => item.status === 'low').length,
    ok: inventory.filter((item) => item.status === 'ok').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-earth-900">Quản lý Tồn kho</h2>
          <p className="text-earth-600 mt-1">Cập nhật và theo dõi số lượng sản phẩm</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white rounded-xl px-4 py-3 shadow-card border border-earth-100">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-earth-600" />
              <div>
                <p className="text-xs text-earth-500">Tổng sản phẩm</p>
                <p className="text-lg font-bold text-earth-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl px-4 py-3 shadow-card border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-xs text-green-700">Đủ hàng</p>
                <p className="text-lg font-bold text-green-900">{stats.ok}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl px-4 py-3 shadow-card border border-yellow-200">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-600" />
              <div>
                <p className="text-xs text-yellow-700">Sắp hết</p>
                <p className="text-lg font-bold text-yellow-900">{stats.low}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-12 pr-4 py-3 border-2 border-earth-200 rounded-xl
                       focus:border-fresh-400 focus:outline-none focus:ring-2 focus:ring-fresh-200"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-fresh-600 text-white'
                  : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('ok')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'ok'
                  ? 'bg-green-600 text-white'
                  : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
              }`}
            >
              Đủ hàng
            </button>
            <button
              onClick={() => setFilterStatus('low')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'low'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
              }`}
            >
              Sắp hết
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-50 border-b border-earth-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-earth-700">
                  Mã SP
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-earth-700">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
                  Tồn kho hiện tại
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
                  Tồn kho tối thiểu
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
                  Xu hướng
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-earth-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {filteredInventory.map((item) => {
                const isEditing = editingId === item.productId;
                const stockPercentage = (item.currentStock / item.minStock) * 100;
                
                return (
                  <tr key={item.productId} className="hover:bg-earth-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-earth-600">
                        #{item.productId.toString().padStart(3, '0')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-earth-900">
                        {item.productName}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 px-3 py-2 border-2 border-fresh-400 rounded-lg text-center
                                   focus:outline-none focus:ring-2 focus:ring-fresh-200"
                          autoFocus
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-earth-900">
                            {item.currentStock}
                          </span>
                          <div className="w-24 h-2 bg-earth-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                item.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-earth-600">{item.minStock}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {item.currentStock >= item.minStock ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Tốt</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <TrendingDown size={18} />
                            <span className="text-xs font-medium">Thấp</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {item.status === 'ok' ? (
                          <span className="badge-success">
                            <CheckCircle size={14} className="mr-1" />
                            Đủ hàng
                          </span>
                        ) : (
                          <span className="badge-warning">
                            <AlertTriangle size={14} className="mr-1" />
                            Sắp hết
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(item.productId)}
                              className="p-2 bg-fresh-600 text-white rounded-lg hover:bg-fresh-700 transition-colors"
                              title="Lưu"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-2 bg-earth-200 text-earth-700 rounded-lg hover:bg-earth-300 transition-colors"
                              title="Hủy"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(item.productId, item.currentStock)}
                            className="p-2 bg-earth-100 text-earth-700 rounded-lg hover:bg-earth-200 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredInventory.length === 0 && (
          <div className="py-12 text-center">
            <Package size={48} className="mx-auto text-earth-300 mb-4" />
            <p className="text-earth-500">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-earth-50 rounded-xl p-4 border border-earth-200">
        <h3 className="font-semibold text-sm text-earth-700 mb-3">Hướng dẫn:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-earth-900">Đủ hàng</p>
              <p className="text-earth-600">Số lượng tồn kho ≥ tối thiểu</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-earth-900">Sắp hết</p>
              <p className="text-earth-600">Số lượng tồn kho {'<'} tối thiểu</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Edit2 size={18} className="text-earth-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-earth-900">Cập nhật nhanh</p>
              <p className="text-earth-600">Click biểu tượng bút để chỉnh sửa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
