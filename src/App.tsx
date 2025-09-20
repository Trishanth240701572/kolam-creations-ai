import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";
import Therapy from "./pages/Therapy";
import Login from "./pages/Login";
import ClinicianHome from "./pages/ClinicianHome";
import PatientHome from "./pages/PatientHome";
import PatientDetail from "./pages/PatientDetail";
import Generator from "./pages/Generator";
import TaskPlayer from "./pages/TaskPlayer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/therapy" element={<Therapy />} />
            <Route path="/education" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/about" element={<Home />} />
            <Route path="/clinician/home" element={<ClinicianHome />} />
            <Route path="/clinician/patient/:id" element={<PatientDetail />} />
            <Route path="/clinician/generator" element={<Generator />} />
            <Route path="/patient/home" element={<PatientHome />} />
            <Route path="/patient/task/:taskId" element={<TaskPlayer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
