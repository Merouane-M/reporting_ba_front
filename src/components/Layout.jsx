import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 bg-sofigrey">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
