import React from "react";
import { motion } from "framer-motion";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export function AnimatedButton({ children, variant = "primary", className = "", ...props }: AnimatedButtonProps) {
  const baseClasses = "inline-block text-center relative font-orbitron font-bold uppercase tracking-wider py-4 px-8 rounded-lg overflow-hidden transition-all duration-300";

  const variants = {
    primary: "bg-primary text-primary-foreground btn-3d neon-border",
    secondary: "bg-secondary text-secondary-foreground btn-3d",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10 neon-glow",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...(props as never)}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
      )}
    </motion.button>
  );
}
