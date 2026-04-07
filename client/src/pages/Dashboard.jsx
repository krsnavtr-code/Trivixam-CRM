import { useAuth } from "../context/AuthContext";
import UserManagement from "../components/UserManagement";

function Dashboard() {
  const {
    user,
    logout,
    isAdmin,
    isChildAdmin,
    hasPermission,
    getRoleDisplayName,
  } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Trivixam CRM
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {getRoleDisplayName()}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isAdmin() && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Admin Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {hasPermission("user_management") && <UserManagement />}
                {hasPermission("manage_roles") && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Role Management
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Manage user roles and permissions
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm">
                      Manage Roles
                    </button>
                  </div>
                )}
                {hasPermission("system_settings") && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      System Settings
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Configure system-wide settings
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm">
                      Settings
                    </button>
                  </div>
                )}
                {hasPermission("view_reports") && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Reports
                    </h3>
                    <p className="text-gray-600 mb-4">
                      View comprehensive system reports
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm">
                      View Reports
                    </button>
                  </div>
                )}
                {hasPermission("manage_customers") && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Customers
                    </h3>
                    <p className="text-gray-600">
                      Manage all customer data and interactions
                    </p>
                  </div>
                )}
                {hasPermission("manage_sales") && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Sales Analytics
                    </h3>
                    <p className="text-gray-600">
                      Track sales performance and metrics
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {isChildAdmin() && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Child Admin Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {hasPermission("manage_customers") && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      My Customers
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Manage assigned customers
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                      View Customers
                    </button>
                  </div>
                )}
                {hasPermission("manage_sales") && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sales Tracking
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Track your sales performance
                    </p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                      View Sales
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activities
                </h3>
                <p className="text-gray-600">
                  View your recent customer interactions and activities
                </p>
              </div>
            </div>
          )}

          {/* Show permissions info for debugging */}
          <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Your Permissions:
            </h3>
            <div className="flex flex-wrap gap-2">
              {user?.role?.permissions?.map((permission) => (
                <span
                  key={permission}
                  className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
