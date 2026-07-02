import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-card py-16">
      <div className="container px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Kungfu Panda" className="w-12 h-12" />
              <span className="font-display text-xl">
                Kungfu <span className="text-primary">Panda</span>
              </span>
            </div>
            <p className="text-foreground/50 mb-6 max-w-sm">
              Legendary flavors, masterful craft. Experience food that 
              fights for your taste buds.
            </p>
            <div className="flex gap-4">
              {["Instagram", "Twitter", "TikTok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center 
                           hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <span className="text-xs font-medium">
                    {social.slice(0, 2)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {["Menu", "Combos", "About Us", "Locations"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-foreground/50 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3 text-foreground/50">
              <li>hello@kungfupanda.food</li>
              <li>+2547-9702-1412</li>
              <li>Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        {/* Location Map */}
        <div className="mt-12">
          <h4 className="font-semibold mb-4 text-foreground font-display text-xl">Find Us</h4>
          <div className="rounded-lg overflow-hidden border border-border">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7957809649374!2d36.75909007510523!3d-1.2972102356384356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b00575bd5b3%3A0xa84075495653646a!2sKungfu%20Restaurant!5e0!3m2!1sen!2ske!4v1767623340222!5m2!1sen!2ske" 
              width="100%" 
              height="350" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Kungfu Restaurant Location"
              className="w-full"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/40 text-sm">
            © 2025 Kungfu Panda Restaurant. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/40">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
