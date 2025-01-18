"use client";

import { motion, useScroll } from "framer-motion";
import { Button } from "./button";
import { Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const { scrollY } = useScroll();
  const { theme, setTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.header
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: "transparent",
        backdropFilter: "blur(200px)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-lg font-bold">Ronak Punase</div>
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => scrollToSection("projects")}
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => scrollToSection("articles")}
            >
              Articles
            </Button>
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => scrollToSection("videos")}
            >
              Videos
            </Button>
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => scrollToSection("resume")}
            >
              Resume
            </Button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button size="sm">
              Contact <Mail className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
