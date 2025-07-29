import Hero from "./components/Hero";
import SubscribeSection from "./components/SubscribeSection";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import FloatingWhatsApp from "./components/FloatingWhatsapp";
import Footer from "./components/Footer";
import "./App.css";
import Bubbles from "./components/Bubbles";

export default function App() {
  return (
    <>
      <Bubbles />
      <Hero />
      <SubscribeSection /> 
      <Services />
      <Gallery />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
