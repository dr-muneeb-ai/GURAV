import React from "react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-3xl font-semibold text-slate-900"
          style={{ fontFamily: "Prata, serif" }}
        >
          Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your store information and admin preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Store Info */}
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Store Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Store Name</label>
              <input
                type="text"
                value="Gurav Drip District"
                readOnly
                className="w-full mt-1 border rounded-xl p-3 bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Admin Email</label>
              <input
                type="email"
                value="admin@gurav.com"
                readOnly
                className="w-full mt-1 border rounded-xl p-3 bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            System Status
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Backend</span>
              <span className="text-green-600 font-semibold">
                Connected
              </span>
            </div>

            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-green-600 font-semibold">
                Connected
              </span>
            </div>

            <div className="flex justify-between">
              <span>Version</span>
              <span>v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">
          Future Features
        </h2>

        <ul className="list-disc ml-6 text-gray-600 space-y-2">
          <li>Change Admin Password</li>
          <li>Manage Categories</li>
          <li>Manage Customers</li>
          <li>Payment Settings</li>
          <li>Delivery Charges</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
