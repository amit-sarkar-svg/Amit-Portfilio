import { lazy, Suspense } from "react";
import Background from "./components/Background";
import ScrollProgress from "./components/ScrollProgress";
import CommandPalette from "./components/CommandPalette";
import CursorRing from "./components/CursorRing";
import { GooFilter } from "./components/GooButton";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Tagline from "./sections/Tagline";
import Work from "./sections/Work";
const Impact = lazy(() => import("./sections/Impact"));
import Process from "./sections/Process";
import Skills from "./sections/Skills";
import Faq from "./sections/Faq";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import NotFound from "./sections/NotFound";

const App = () => {
  if (window.location.pathname !== "/") return <NotFound />;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] px-3 py-2 rounded-lg bg-white text-black button-sm"
      >
        Skip to content
      </a>
      <GooFilter />
      <Background />
      <CursorRing />
      <CommandPalette />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <Tagline />
        <Work />
        <Suspense fallback={<div id="impact" className="min-h-[480px]" />}>
          <Impact />
        </Suspense>
        <Process />
        <Skills />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
