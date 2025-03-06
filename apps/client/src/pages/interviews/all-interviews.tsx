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
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export function AllInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Fetch Interviews
  const fetchInterviews = () => {
    setLoading(true);
    fetch(`${API_URL}interviews`)
      .then((response) => response.json())
      .then((data) => setInterviews(data))
      .catch((error) => console.error("Error fetching interviews:", error))
      .finally(() => setLoading(false));
  };

  // Delete Interview
  const deleteInterview = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`http://localhost:3000/interviews/${id}`, {
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

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg p-4 animate-pulse">
              <CardHeader className="h-6 bg-gray-300 rounded"></CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="h-8 w-20 bg-gray-300 rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Interviews List */}
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
                    <strong>Scheduled At:</strong>{" "}
                    {new Date(interview.scheduledAt).toLocaleString()}
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

          {/* No Interviews Message */}
          {interviews.length === 0 && !loading && (
            <p className="text-center text-gray-500 mt-6">
              No interviews scheduled.
            </p>
          )}
        </>
      )}
    </div>
  );
}
