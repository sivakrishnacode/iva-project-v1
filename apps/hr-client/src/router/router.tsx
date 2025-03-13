import { Navigate, Route, Routes } from "react-router";
import AuthLayout from "@/pages/auth";
import { LoginForm } from "@/pages/auth/components/login-form";
import { SignUpForm } from "@/pages/auth/components/sign-up-form";
import { NewCandidateForm } from "@/pages/candidates/new-candidate";
import { ShortlistedCandidates } from "@/pages/candidates/short-listed";
import DashboardLayout from "@/pages/dashboard";
import { RejectedCandidates } from "@/pages/candidates/rejected-candidates";
import { CandidateList } from "@/pages/candidates/candiate-list";
import { AllInterviews } from "@/pages/interviews/all-interviews"; // Import AllInterviews component
import { ResultInterviews } from "@/pages/interviews/interview-result";
import { JobAndInterviewQuestion } from "@/pages/settings/jobs";

export default function Router() {
  return (
    <Routes>
      {/* Default Redirects */}
      <Route
        path="/"
        element={<Navigate to="/dashboard/all-candidates" replace />}
      />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

      {/* Authentication Routes */}
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<SignUpForm />} />
      </Route>

      {/* Dashboard Layout Routes */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index path="new-candidate" element={<NewCandidateForm />} />
        <Route path="all-candidates" element={<CandidateList />} />
        <Route path="shortlisted" element={<ShortlistedCandidates />} />
        <Route path="rejected" element={<RejectedCandidates />} />
        <Route path="interviews" element={<AllInterviews />} />{" "}
        {/* ✅ New Route */}
        <Route path="interviews">
          <Route index element={<AllInterviews />} />
          <Route path="result" element={<ResultInterviews />} />
        </Route>
        <Route path="settings">
          <Route path="jobs" element={<JobAndInterviewQuestion />} />
        </Route>
      </Route>

      {/* Catch-All: Redirect unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/dashboard/all-candidates" replace />}
      />
    </Routes>
  );
}
