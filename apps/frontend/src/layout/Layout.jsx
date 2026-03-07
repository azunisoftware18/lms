import { Outlet } from "react-router-dom";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
