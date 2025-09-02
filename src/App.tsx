import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import StockCars from "./pages/StockCars";
import CustomOrder from "./pages/CustomOrder";
import Financing from "./pages/Financing";
import SellCar from "./pages/SellCar";
import About from "./pages/About";
import CarDetails from "./pages/CarDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/masini-in-stoc" element={<StockCars />} />
            <Route path="/masina/:id" element={<CarDetails />} />
            <Route path="/masina-la-comanda" element={<CustomOrder />} />
            <Route path="/finantare" element={<Financing />} />
            <Route path="/vinde-masina" element={<SellCar />} />
            <Route path="/despre-noi" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
