"use client"
import Header from "@/ui/Header";
import Hero from "@/ui/Hero";
import Footer from "@/ui/Footer";
import Projects from "@/ui/Projects";
import AboutMe from "@/ui/AboutMe";
import Contact from "@/ui/Contact";

function Home () {
  return(
<div className="bg-[#0d1a26] text-white font-mono">
    <Header />
    <main className={"max-w-6xl mx-auto"}>
      <Hero />
      <AboutMe />
      <Projects />
      <Contact />
    </main>
    <Footer />
  </div>
  )
}

export default Home;