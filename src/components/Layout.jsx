import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [isPinned, setIsPinned] = useState(false); // Tracks if sidebar is pinned (locked expanded)
  const [isHovered, setIsHovered] = useState(false); // Tracks hover state
  const isExpanded = isPinned || isHovered; // Expanded if pinned or hovered

  return (
    <div className="min-h-screen flex bg-gray-100"> {/* Outer container */}
      {/* Sidebar - Fixed on the left, collapsible, hidden on small screens */}
      <div
        className={`hidden md:block fixed inset-y-0 left-0 z-50 transition-[width] duration-300 ease-in-out flex flex-col rounded-2xl m-1 overflow-hidden ${
          isExpanded ? "w-64 bg-sofiblue text-white" : "w-16 bg-sofiblue text-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar isExpanded={isExpanded} isPinned={isPinned} setIsPinned={setIsPinned} />
      </div>
      
      {/* Main content area - Adjusts margin based on sidebar expansion, no margin on small screens */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isExpanded ? "md:ml-64 ml-0" : "md:ml-16 ml-0"
        }`}
      >
        <div className="flex-shrink-0">
          <Navbar isExpanded={isExpanded} />
        </div>
        <main className="flex-1 bg-sofigrey overflow-auto" role="main">
          <div className="flex justify-center items-center h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;