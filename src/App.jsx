import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
// import Projects from "./sections/Projects";
import Experiences from "./sections/Experiences";
// import Testimonial from "./sections/Testimonial";
import Contact from "./sections/Contact";
import Footer from './sections/Footer';
import ImagePreloader from './components/ImagePreloader';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  useEffect(() => {
    // Smooth, inertial scrolling (wheel + touch). Respects reduced-motion.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      smoothTouch: true,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen w-full">
        <ImagePreloader />
        <Navbar />
        <Hero />
        <About />
        {/* <Projects /> */}
        <Experiences />
        {/* <Testimonial /> */}
        <Contact />
        <Footer/>
      </div>
    </ThemeProvider>
  );
};

export default App;
