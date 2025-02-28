import AuthLayout from "@/pages/auth";
import { LoginForm } from "@/pages/auth/components/login-form";
import { SignUpForm } from "@/pages/auth/components/sign-up-form";
import { CandidateList } from "@/pages/candidates/candiate-list";
import { NewCandidateForm } from "@/pages/candidates/new-candidate";
import DashboardPage from "@/pages/dashboard";
import { Route, Routes } from "react-router";

export default function Router() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />}>
        <Route path="new-candidate" element={<NewCandidateForm />} />
        <Route path="all-candidates" element={<CandidateList />} />
      </Route>

      {/* <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<>register</>} /> */}

      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<SignUpForm />} />
      </Route>
    </Routes>
  );
}
