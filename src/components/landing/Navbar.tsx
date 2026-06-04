import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Features", "Technology", "Pricing", "About"];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 z-50">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center neon-glow">
            <span className="text-primary-foreground font-bold font-orbitron">N</span>
          </div>
          <span className="font-orbitron font-bold text-xl tracking-wider text-foreground">
            Nirpesh AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
          <Link to="/dashboard">
            <Button className="btn-3d bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron">
              Start for Free
            </Button>
          </Link>
        </nav>

        <button
          className="md:hidden z-50 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href={`/${link.toLowerCase()}`}
            className="text-2xl font-orbitron font-bold text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
          <Button className="btn-3d bg-primary text-primary-foreground hover:bg-primary/90 font-orbitron mt-4 px-8 py-6 text-lg">
            Start for Free
          </Button>
        </Link>
      </div>
    </header>
  );
}
