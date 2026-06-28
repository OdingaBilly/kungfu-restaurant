import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import PageTransition from "@/components/PageTransition";
import MobileTabBar from "@/components/MobileTabBar";
import AdminGuard from "./components/admin/AdminGuard";

const Index = lazy(() => import("./pages/Index"));
const Menu = lazy(() => import("./pages/Menu"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Product = lazy(() => import("./pages/Product"));
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminItems = lazy(() => import("./pages/admin/AdminItems"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminStaff = lazy(() => import("./pages/admin/AdminStaff"));
const AdminSuppliers = lazy(() => import("./pages/admin/AdminSuppliers"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminPurchaseOrders = lazy(() => import("./pages/admin/AdminPurchaseOrders"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/product/:sku" element={<PageTransition><Product /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/items" element={<AdminGuard><AdminItems /></AdminGuard>} />
          <Route path="/admin/categories" element={<AdminGuard><AdminCategories /></AdminGuard>} />
          <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
          <Route path="/admin/suppliers" element={<AdminGuard><AdminSuppliers /></AdminGuard>} />
          <Route path="/admin/inventory" element={<AdminGuard><AdminInventory /></AdminGuard>} />
          <Route path="/admin/purchase-orders" element={<AdminGuard><AdminPurchaseOrders /></AdminGuard>} />
          <Route path="/admin/staff" element={<AdminGuard><AdminStaff /></AdminGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
            <MobileTabBar />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
