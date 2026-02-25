import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div
        className={`hidden md:block fixed inset-y-0 left-0 z-50 transition-[width] duration-300 ease-in-out flex flex-col rounded-2xl m-1 overflow-hidden ${
          isExpanded ? "w-64 bg-sofiblue text-white" : "w-16 bg-sofiblue text-white"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar
          isExpanded={isExpanded}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
        />
      </div>

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isExpanded ? "md:ml-64 ml-0" : "md:ml-16 ml-0"
        }`}
      >
        <div className="flex-shrink-0">
          <Navbar isExpanded={isExpanded} />
        </div>

        <main className="flex-1 bg-sofigrey pt-20 overflow-auto" role="main">
          <div className="flex justify-center items-center h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;