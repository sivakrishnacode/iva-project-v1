import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/config";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  status: string;
  resume: string;
  experience: number;
  testLink: string;
  jobId: string | null;
  createdAt: string;
  updatedAt: string;
  interviews: any[];
  isInterviewScheduled: boolean;
}

export default function CandidateDetails() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const email = localStorage.getItem("candidateEmail");

  useEffect(() => {
    async function fetchCandidateDetails() {
      try {
        const response = await fetch(`${API_URL}candidates/?email=${email}`);
        const data = await response.json();
        setCandidate(data[0]);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
    }

    fetchCandidateDetails();
  }, [email]);

  if (!candidate) {
    return <p>Loading candidate details...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg p-6 w-full max-w-xl mx-auto">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-2">
            {candidate.firstName} {candidate.lastName}
          </h2>
          <p className="text-gray-600">Email: {candidate.email}</p>
          <p className="text-gray-600">Phone: {candidate.phone}</p>
          <p className="text-gray-600">
            Date of Birth: {new Date(candidate.dob).toLocaleDateString()}
          </p>
          <p className="text-gray-600">Address: {candidate.address}</p>
          <p className="text-gray-600">Status: {candidate.status}</p>
          <p className="text-gray-600">
            Experience: {candidate.experience} years
          </p>
          {candidate.resume && (
            <p className="text-gray-600">
              Resume:{" "}
              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View
              </a>
            </p>
          )}
          <p className="text-gray-600">
            Test Link: {candidate.testLink || "N/A"}
          </p>
          <p className="text-gray-600">
            Interview Scheduled: {candidate.isInterviewScheduled ? "Yes" : "No"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
