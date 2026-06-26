import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Product from "./pages/Product";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import AdminGuard from "./components/admin/AdminGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminItems from "./pages/admin/AdminItems";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminStaff from "./pages/admin/AdminStaff";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/product/:sku" element={<Product />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/items" element={<AdminGuard><AdminItems /></AdminGuard>} />
              <Route path="/admin/categories" element={<AdminGuard><AdminCategories /></AdminGuard>} />
              <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
              <Route path="/admin/staff" element={<AdminGuard><AdminStaff /></AdminGuard>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
