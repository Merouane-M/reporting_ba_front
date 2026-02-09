import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [isPinned, setIsPinned] = useState(false); // Tracks if sidebar is pinned (locked expanded)
  const [isHovered, setIsHovered] = useState(false); // Tracks hover state
  const isExpanded = isPinned || isHovered; // Expanded if pinned or hovered

  return (
    <div className="min-h-screen flex bg-gray-100"> {/* Outer container */}
      {/* Sidebar - Fixed on the left, collapsible */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-[width] duration-300 ease-in-out flex flex-col overflow-hidden ${
          isExpanded ? "w-64 bg-sofiblue text-white" : "w-16 bg-sofiblue text-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar isExpanded={isExpanded} isPinned={isPinned} setIsPinned={setIsPinned} />
      </div>
      
      {/* Main content area - Adjusts margin based on sidebar expansion */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isExpanded ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar isExpanded={isExpanded} />
        <main className="flex-1 p-16 bg-sofigrey overflow-auto" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;