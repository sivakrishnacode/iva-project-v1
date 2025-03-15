import { Navigate, Route, Routes, useLocation } from "react-router";
import AuthLayout from "@/pages/auth";
import { LoginForm } from "@/pages/auth/components/login-form";
import { NewCandidateForm } from "@/pages/candidates/new-candidate";
import DashboardLayout from "@/pages/dashboard";
import { AllInterviews } from "@/pages/interviews/all-interviews";
import { ResultInterviews } from "@/pages/interviews/interview-result";
import { useEffect } from "react";
import CandidateDetails from "@/pages/candidates/candidate-details";

// Protected Route: Restricts access to authenticated users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const candidateEmailLS = localStorage.getItem("candidateEmail");
  const location = useLocation();

  useEffect(() => {
    console.log("Current route:", location.pathname);
    console.log("Candidate Email:", candidateEmailLS);
  }, [location.pathname]);

  if (!candidateEmailLS) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

// Public Route: Prevents authenticated users from accessing login/register pages
function PublicRoute({ children }: { children: React.ReactNode }) {
  const candidateEmailLS = localStorage.getItem("candidateEmail");

  if (candidateEmailLS) {
    return <Navigate to="/dashboard/all-candidates" replace />;
  }

  return children;
}

export default function Router() {
  return (
    <Routes>
      {/* Redirect based on authentication
      <Route
        path="/"
        element={<Navigate to="/dashboard/new-candidate" replace />}
      /> */}

      {/* Authentication Routes (Restricted for logged-in users) */}
      <Route
        path="auth"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="login" element={<LoginForm />} />
      </Route>
      <Route path="register" element={<NewCandidateForm />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="details" element={<CandidateDetails />} />
        <Route path="available-interviews" element={<AllInterviews />} />
        <Route path="results" element={<ResultInterviews />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/dashboard/details" replace />} />
    </Routes>
  );
}
