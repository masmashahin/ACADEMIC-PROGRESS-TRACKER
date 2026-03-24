export default function Topbar({ tabLabel, onLogout }) {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
  
        {/* LEFT - TITLE */}
        <h1 className="text-lg font-semibold">
            {tabLabel || "Dashboard"}
        </h1>
  
        {/* RIGHT - ACTIONS */}
        <button
          onClick={onLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Logout
        </button>
  
      </header>
    );
  }