import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import FavoritesSection from "@/components/FavoritesSection";
import DailySuggestionsSection from "@/components/DailySuggestionsSection";
import AboutSection from "@/components/AboutSection";
import JoinClubSection from "@/components/JoinClubSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/menu/CartDrawer";
import FloatingCart from "@/components/menu/FloatingCart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FavoritesSection />
      <MenuSection />
      <DailySuggestionsSection />
      <AboutSection />
      <JoinClubSection />
      <CTASection />
      <Footer />
      <FloatingCart />
      <CartDrawer />
    </div>
  );
};

export default Index;
