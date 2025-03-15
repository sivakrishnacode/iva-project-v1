import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { API_URL } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

interface Result {
  id: string;
  candidateId: string;
  score: number | null;
  feedback: string;
  violations: boolean;
  createdAt: string;
}

export function ResultInterviews() {
  const [result, setResult] = useState<Result>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}interviews/result?candidateId=${localStorage.getItem("candidateId")}`
      );
      const data = await response.json();
      console.log("Fetched Data:", data);
      setResult(data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">Interview Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : !result ? (
        <p className="text-center text-gray-500 mt-6">
          No interview results available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card key={result.id} className="shadow-lg p-4">
            <CardHeader className="text-lg font-semibold">
              Interview ID: {result.id}
            </CardHeader>
            <CardContent>
              <p>
                <strong>Score:</strong>{" "}
                {result.score !== null ? result.score : "N/A"}
              </p>
              <p>
                <strong>Feedback:</strong>{" "}
                <InterviewFeedback feedback={result.feedback} />
              </p>
              <p>
                <strong>Violations:</strong> {result.violations ? "Yes" : "No"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(result.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface InterviewFeedbackProps {
  feedback: string;
}

export function InterviewFeedback({ feedback }: InterviewFeedbackProps) {
  const getBadgeVariant = (feedback: string) => {
    switch (feedback.toUpperCase()) {
      case "PASSED":
        return "default";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return <Badge variant={getBadgeVariant(feedback)}>{feedback}</Badge>;
}
