import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { API_URL } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

interface Interview {
  id: string;
  scheduledAt: string;
  result: string;
  score: number | null;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobRole: string;
    experience: number;
  };
}

export function ResultInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}interviews`);
      const data = await response.json();
      console.log("Fetched Data:", data); // Debugging log
      setInterviews(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviews([]); // Prevents crashes
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Interview Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews?.map((interview) => (
            <Card key={interview.id} className="shadow-lg p-4">
              <CardHeader className="text-lg font-semibold">
                {interview.candidate.firstName} {interview.candidate.lastName}
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Email:</strong> {interview.candidate.email}
                </p>
                <p>
                  <strong>Phone:</strong> {interview.candidate.phone}
                </p>
                <p>
                  <strong>Job Role:</strong> {interview.candidate.jobRole}
                </p>

                <p>
                  <strong>Score:</strong>{" "}
                  {interview.score !== null ? interview.score : "N/A"}
                </p>
                <p>
                  <strong>Result:</strong>{" "}
                  <InterviewResult result={interview.result} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {interviews.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-6">
          No interview results available.
        </p>
      )}
    </div>
  );
}

interface InterviewResultProps {
  result: string;
}

export function InterviewResult({ result }: InterviewResultProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "PASSED":
        return "default"; // Assuming "default" maps to a success-like color
      case "FAILED":
        return "destructive";
      case "NOT_EVALUATED":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getBadgeVariant(result)}>{result.replace("_", " ")}</Badge>
  );
}
