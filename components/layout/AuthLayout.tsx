"use client";

import { useState, useEffect } from "react";
import { Hammer } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as image from "@/assets";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const images = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1661960643553-ccfbf7d921f6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVwYWlyfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1661911021547-b0188f22d548?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1712789541201-fea8447a8914?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2FyJTIwbWFpbnRlbmFuY2V8ZW58MHx8MHx8fDA%3D",
];

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      {/* Left Side: Media Context */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        {images.map((img, idx) => (
          <div
            key={img}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              idx === currentImage ? "opacity-40" : "opacity-0"
            )}
          >
            <img src={img} alt="Context" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <Image
              src={image.brand_logo}
              alt="Brand Logo"
              width={256}
              height={171}
              className="invert"
            />
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
              {title}
            </h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
              {description}
            </p>
          </div>

          <div className="flex gap-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentImage ? "w-8 bg-white" : "w-1.5 bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fdfdfd]">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-700">
          {children}
        </div>
      </div>
    </div>
  );
}
