import { Navigate, Route, Routes, useLocation } from "react-router";
import AuthLayout from "@/pages/auth";
import { LoginForm } from "@/pages/auth/components/login-form";
import { SignUpForm } from "@/pages/auth/components/sign-up-form";
import { NewCandidateForm } from "@/pages/candidates/new-candidate";
import DashboardLayout from "@/pages/dashboard";
import { RejectedCandidates } from "@/pages/candidates/rejected-candidates";
import { AllInterviews } from "@/pages/interviews/all-interviews";
import { ResultInterviews } from "@/pages/interviews/interview-result";
import { JobAndInterviewQuestion } from "@/pages/settings/jobs";
import { useEffect } from "react";

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
      {/* Redirect based on authentication */}
      <Route
        path="/"
        element={<Navigate to="/dashboard/new-candidate" replace />}
      />

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
        <Route path="register" element={<SignUpForm />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="new-candidate" element={<NewCandidateForm />} />
        <Route path="available-interviews" element={<AllInterviews />} />
        <Route path="interview/results" element={<ResultInterviews />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
