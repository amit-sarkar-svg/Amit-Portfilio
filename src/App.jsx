import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Tagline from "./sections/Tagline";
import Work from "./sections/Work";
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
      <Navbar />
      <main id="main">
        <Hero />
        <Tagline />
        <Work />
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
