import { Crown, Gift, Percent, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";

const PERKS = [
  { icon: Gift, title: "Birthday Treats", description: "Free meal on your special day" },
  { icon: Percent, title: "Member Discounts", description: "Up to 20% off every order" },
  { icon: Zap, title: "Early Access", description: "Try new dishes before anyone else" },
];

const JoinClubSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary/20 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 border border-primary/10 rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-kungfu-gold/20 border border-kungfu-gold/40 rounded-full px-5 py-2.5 mb-6">
              <Crown className="w-5 h-5 text-kungfu-gold" />
              <span className="font-semibold text-kungfu-gold">Kungfu Panda Club</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl mb-6">
              Join the <span className="text-primary">Inner Circle</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-xl mx-auto">
              Become part of our exclusive community and unlock legendary rewards, 
              special offers, and VIP treatment.
            </p>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {PERKS.map((perk, index) => (
              <div
                key={perk.title}
                className="group bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsla(0,100%,38%,0.1)]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-2xl mb-4 group-hover:bg-primary/30 transition-colors">
                  <perk.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{perk.title}</h3>
                <p className="text-foreground/50 text-sm">{perk.description}</p>
              </div>
            ))}
          </div>

          {/* Signup Form */}
          <div className="bg-gradient-to-r from-primary/20 via-card to-primary/20 rounded-3xl p-8 md:p-12 border border-primary/30">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Crown className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-display text-2xl mb-2">Welcome to the Club!</h3>
                <p className="text-foreground/60">
                  Check your email for your exclusive welcome offer 🎉
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to join"
                    required
                    className="w-full px-6 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-kungfu whitespace-nowrap flex items-center gap-2 group"
                >
                  Join the Club
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
            
            {!isSubmitted && (
              <p className="text-foreground/40 text-xs text-center mt-4">
                🔒 No spam, ever. Unsubscribe anytime. Get 10% off your first order when you join!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinClubSection;
