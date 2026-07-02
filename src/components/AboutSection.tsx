import logo from "@/assets/logo.png";

const AboutSection = () => {
  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "50+", label: "Signature Dishes" },
    { value: "5★", label: "Average Rating" },
    { value: "30", label: "Minutes Delivery" },
  ];

  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative z-10 animate-float">
              <img
                src={logo}
                alt="Kungfu Panda Mascot"
                className="w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-75" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </div>

          {/* Content Side */}
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              Our Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              Where <span className="text-primary">Flavor</span> Meets
              <br />
              <span className="text-primary">Mastery</span>
            </h2>
            <div className="section-divider mb-8 mx-0" />
            
            <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
              Born from a love of bold flavors and street food culture, Kungfu Panda 
              brings you dishes crafted with the precision of a martial arts master 
              and the soul of a home cook.
            </p>
            <p className="text-foreground/70 mb-8 leading-relaxed">
              Every recipe tells a story. Every bite is a journey. We don't just 
              serve food—we serve <span className="text-primary font-semibold">experiences</span>.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-display text-3xl text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-foreground/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
