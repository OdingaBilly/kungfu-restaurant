import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TypeWriter from "./TypeWriter";
import chickenSpread from "@/assets/chicken-spread.jpg";

const HeroSection = () => {
  const heroWords = ["Legendary", "Delicious", "Unforgettable", "Masterful"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={chickenSpread}
          alt="Delicious food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Spray Paint Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-32 right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />

      {/* Content */}
      <div className="container relative z-10 text-center px-6">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground/90">
              Now Open for Orders
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight animate-slide-up">
            <TypeWriter words={heroWords} className="text-primary" />
            <br />
            <span className="text-foreground">Flavors Await</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Where street food meets martial arts mastery. Every bite is a{" "}
            <span className="text-primary font-semibold">knockout</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <button className="btn-kungfu text-lg">
              View Menu
            </button>
            <button className="btn-kungfu-outline text-lg">
              Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
