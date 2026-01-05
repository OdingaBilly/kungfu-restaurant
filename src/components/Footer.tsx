import logo from "@/assets/logo.jpeg";

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
              <li>+1 (555) 123-4567</li>
              <li>123 Dragon Street</li>
              <li>Food City, FC 12345</li>
            </ul>
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
