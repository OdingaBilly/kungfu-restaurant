const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
      
      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl mb-6">
            Ready to <span className="text-primary">Feast</span>?
          </h2>
          <p className="text-foreground/60 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of food lovers who've discovered the legend. 
            Your taste buds will thank you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-kungfu text-lg animate-pulse-glow">
              Order Now
            </button>
            <button className="btn-kungfu-outline text-lg">
              Call Us
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-foreground/40 text-sm">
            <span>🚀 30-min Delivery</span>
            <span>⭐ 4.9 Rating</span>
            <span>🔒 Secure Payment</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
