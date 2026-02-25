const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
