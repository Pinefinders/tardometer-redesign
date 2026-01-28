import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PasswordGate from "./components/PasswordGate";
import Index from "./pages/Index";
import Leaderboards from "./pages/Leaderboards";
import Algorithm from "./pages/Algorithm";
import HowItWorks from "./pages/HowItWorks";
import OpenSource from "./pages/OpenSource";
import Archives from "./pages/Archives";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PasswordGate>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/algorithm" element={<Algorithm />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/open-source" element={<OpenSource />} />
            <Route path="/archives" element={<Archives />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PasswordGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
