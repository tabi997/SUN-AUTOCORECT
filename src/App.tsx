import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import FloatingButtons from "./components/FloatingButtons";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import StockCars from "./pages/StockCars";
import SellCar from "./pages/SellCar";
import Contact from "./pages/Contact";
import About from "./pages/About";
import CarDetails from "./pages/CarDetails";
import PoliticaCookies from "./pages/PoliticaCookies";
import PoliticaConfidentialitate from "./pages/PoliticaConfidentialitate";
import TermeniConditii from "./pages/TermeniConditii";
import GDPR from "./pages/GDPR";

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
            <Route path="/vinde-masina" element={<SellCar />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/despre-noi" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* Legal Pages */}
            <Route path="/politica-cookies" element={<PoliticaCookies />} />
            <Route path="/politica-confidentialitate" element={<PoliticaConfidentialitate />} />
            <Route path="/termeni-conditii" element={<TermeniConditii />} />
            <Route path="/gdpr" element={<GDPR />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingButtons />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
