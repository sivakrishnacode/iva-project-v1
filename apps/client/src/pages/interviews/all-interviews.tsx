import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";

interface Interview {
  id: string;
  scheduledAt: string;
  status: string;
  mode: string;
  result: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobRole: string;
    experience: number;
  };
}

export function AllInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = () => {
    setLoading(true);
    fetch(`${API_URL}interviews`)
      .then((response) => response.json())
      .then((data) => setInterviews(data))
      .catch((error) => console.error("Error fetching interviews:", error))
      .finally(() => setLoading(false));
  };

  const deleteInterview = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_URL}interviews/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete interview");
      setInterviews((prev) => prev.filter((interview) => interview.id !== id));
    } catch (error) {
      console.error("Error deleting interview:", error);
      alert("Failed to delete interview. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">All Scheduled Interviews</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
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
                  <strong>Experience:</strong> {interview.candidate.experience}{" "}
                  years
                </p>
                <p>
                  <strong>Scheduled At:</strong>{" "}
                  {new Date(interview.scheduledAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {interview.status}
                </p>
                <p>
                  <strong>Mode:</strong> {interview.mode}
                </p>
                <p>
                  <strong>Result:</strong> {interview.result}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => deleteInterview(interview.id)}
                  disabled={deletingId === interview.id}
                  className="flex items-center"
                >
                  {deletingId === interview.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash className="w-4 h-4 mr-2" />
                  )}
                  {deletingId === interview.id ? "Deleting..." : "Delete"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {interviews.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-6">
          No interviews scheduled.
        </p>
      )}
    </div>
  );
}
