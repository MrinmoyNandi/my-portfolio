import { Route, Routes } from "react-router-dom";
import { SiteProvider } from "./lib/SiteProvider.jsx";
import FluidCursor from "./components/FluidCursor.jsx";
import Loader from "./components/Loader.jsx";
import Nav from "./components/Nav.jsx";
import RouteCurtain from "./components/RouteCurtain.jsx";
import Footer from "./sections/Footer.jsx";
import Home from "./pages/Home.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

export default function App() {
  return (
    <SiteProvider>
      <Loader />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <RouteCurtain />
      <FluidCursor />
    </SiteProvider>
  );
}
