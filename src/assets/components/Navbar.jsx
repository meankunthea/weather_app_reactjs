export default function Navbar({ activeTab, setActiveTab, activeUnit, setActiveUnit }) {
  return (
    <div className="flex items-center justify-between">
      {/* Tabs */}
      <div className="flex gap-4">
        {["Today", "Week"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[13px] font-bold pb-1 bg-transparent border-0 cursor-pointer transition-all ${
              activeTab === tab
                ? "text-gray-800 border-b-2 border-gray-800"
                : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
            }`}
            style={{ fontFamily: "inherit" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Unit toggle + Avatar */}
      <div className="flex items-center gap-1">
        {["C", "F"].map((u) => (
          <button
            key={u}
            onClick={() => setActiveUnit(u)}
            className={`w-7 h-7 rounded-full border-0 text-[10px] font-bold cursor-pointer transition-all ${
              activeUnit === u
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            style={{ fontFamily: "inherit" }}
          >
            °{u}
          </button>
        ))}
        <div className="w-[30px] h-[30px] rounded-full bg-gray-800 flex items-center justify-center ml-2 cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="3" fill="white" />
            <path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
