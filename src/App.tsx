import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider, useRole } from "@/context/RoleContext";
import { DecisionTreeProvider } from "@/context/DecisionTreeContext";
import Landing from "./pages/Landing";
import RoleSelection from "./pages/RoleSelection";
import HealthcareProviderDashboard from "./pages/HealthcareProviderDashboard";
import DecisionTreeHub from "./pages/DecisionTreeHub";
import DecisionTreeSession from "./pages/DecisionTreeSession";
import DecisionTreeResults from "./pages/DecisionTreeResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  
  if (!role) {
    return <Navigate to="/select-role" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <DecisionTreeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/select-role" element={<RoleSelection />} />
              <Route
                path="/dashboard/healthcare_provider"
                element={
                  <ProtectedRoute>
                    <HealthcareProviderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/decision-tree"
                element={
                  <ProtectedRoute>
                    <DecisionTreeHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/decision-tree/:treeId"
                element={
                  <ProtectedRoute>
                    <DecisionTreeSession />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/decision-tree/:treeId/results"
                element={
                  <ProtectedRoute>
                    <DecisionTreeResults />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DecisionTreeProvider>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
