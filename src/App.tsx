import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CRM from "./pages/CRM";
import Production from "./pages/Production";
import Clients from "./pages/Clients";
import Financial from "./pages/Financial";
import Inbox from "./pages/Inbox";
import Team from "./pages/Team";
import Contracts from "./pages/Contracts";
import Services from "./pages/Services";
import CalendarPage from "./pages/Calendar";
import Settings from "./pages/Settings";
import Intimacoes from "./pages/Intimacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/intimacoes" element={<Intimacoes />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/production" element={<Production />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
