import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/config";
import { InterviewSession } from "./interview-session";

interface Interview {
  id: string;
  scheduledAt: string;
  status: string;
  mode: string;
  result: string;
  rescheduleCount: number;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    experience: number;
  };
  job: {
    id: string;
    title: string;
    location: string;
    salary: number;
    status: string;
    questions: {
      id: string;
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: string;
    }[];
  };
}

export function AllInterviews() {
  const [interview, setInterview] = useState<Interview>();
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState<boolean>(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = () => {
    setLoading(true);
    fetch(
      `${API_URL}interviews/?candidateId=${localStorage.getItem("candidateId")}`
    )
      .then((response) => response.json())
      .then((data) => setInterview(data[0]))
      .catch((error) => console.error("Error fetching interviews:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">
        Available Scheduled Interviews
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : attending && interview ? (
        <InterviewSession
          interview={interview}
          onExit={() => setAttending(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interview ? (
            <Card key={interview?.id} className="shadow-lg p-4">
              <CardHeader className="text-lg font-semibold">
                {interview?.candidate?.firstName}{" "}
                {interview?.candidate?.lastName}
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Email:</strong> {interview?.candidate?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {interview?.candidate?.phone}
                </p>
                <p>
                  <strong>Job Role:</strong> {interview?.job?.title}
                </p>
                <p>
                  <strong>Experience:</strong>{" "}
                  {interview?.candidate?.experience} years
                </p>
                <p>
                  <strong>Scheduled At:</strong>{" "}
                  {new Date(interview?.scheduledAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {interview?.status}
                </p>
                <p>
                  <strong>Mode:</strong> {interview?.mode}
                </p>
                <p>
                  <strong>Result:</strong> {interview?.result}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                {interview.status == "SCHEDULED" && (
                  <Button
                    variant={"outline"}
                    onClick={() => setAttending(true)}
                  >
                    Attend
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <></>
          )}
        </div>
      )}
      {!interview && !loading && (
        <p className="text-center text-gray-500 mt-6">
          No interviews scheduled.
        </p>
      )}
    </div>
  );
}
