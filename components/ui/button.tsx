import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "gold" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95";

  const styles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg shadow-gold/20 active:shadow-md",
    gold: "bg-gold-500 text-black hover:bg-gold-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:shadow-[0_0_10px_rgba(212,175,55,0.3)]",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md active:shadow-sm",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(base, styles[variant], sizes[size], className)}
      {...props}
    />
  );
}
