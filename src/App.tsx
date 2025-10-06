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
import PatientFamilyDashboard from "./pages/PatientFamilyDashboard";
import GenerateDecisionTree from "./pages/GenerateDecisionTree";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import DecisionTreeHub from "./pages/DecisionTreeHub";
import DecisionTreeSession from "./pages/DecisionTreeSession";
import DecisionTreeResults from "./pages/DecisionTreeResults";
import LearnHub from "./pages/LearnHub";
import LegislationDetail from "./pages/LegislationDetail";
import AssessHub from "./pages/AssessHub";
import ApplyHub from "./pages/ApplyHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <DecisionTreeProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/select-role" element={<RoleSelection />} />
              <Route path="/learn" element={<LearnHub />} />
              <Route path="/learn/:legislationId" element={<LegislationDetail />} />
              <Route path="/assess" element={<AssessHub />} />
              <Route path="/apply" element={<ApplyHub />} />
              <Route
                path="/dashboard/healthcare_provider"
                element={<RequireRole><HealthcareProviderDashboard /></RequireRole>}
              />
              <Route
                path="/dashboard/patient_family"
                element={<RequireRole><PatientFamilyDashboard /></RequireRole>}
              />
              <Route
                path="/generate-decision-tree"
                element={<RequireRole><GenerateDecisionTree /></RequireRole>}
              />
              <Route
                path="/document-analysis"
                element={<RequireRole><DocumentAnalysis /></RequireRole>}
              />
              <Route
                path="/decision-tree"
                element={<RequireRole><DecisionTreeHub /></RequireRole>}
              />
              <Route
                path="/decision-tree/:treeId"
                element={<RequireRole><DecisionTreeSession /></RequireRole>}
              />
              <Route
                path="/decision-tree/:treeId/results"
                element={<RequireRole><DecisionTreeResults /></RequireRole>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DecisionTreeProvider>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

function RequireRole({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  
  if (!role) {
    return <Navigate to="/select-role" replace />;
  }
  
  return <>{children}</>;
}

export default App;
