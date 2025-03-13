import { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/config";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Not used for authentication in this case
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}candidates?email=${email}`);

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected response format.");
      }

      const data = await response.json();

      console.log("====================================");
      console.log(data);
      console.log("====================================");
      if (data && data[0].password == password) {
        localStorage.setItem("candidateEmail", email);
        localStorage.setItem("candidateId", data[0].id);
        localStorage.setItem(
          "candidateName",
          `${data[0].firstName} ${data[0].lastName}`
        );
        navigate("/dashboard/all-candidates");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
