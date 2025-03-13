import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/config";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "HIRED" | "PENDING" | "REJECTED";
  isInterviewScheduled: boolean;
}

interface Job {
  id: string;
  title: string;
}

export function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("");

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");

  useEffect(() => {
    fetch(`${API_URL}candidates`)
      .then((response) => response.json())
      .then((data) => setCandidates(data))
      .catch((error) => console.error("Error fetching candidates:", error));

    fetch(`${API_URL}settings/jobs`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const updateCandidateStatus = (
    id: string,
    newStatus: "HIRED" | "PENDING" | "REJECTED"
  ) => {
    fetch(`${API_URL}candidates/${id}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((updatedCandidate) => {
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate.id === id
              ? { ...candidate, status: updatedCandidate.status }
              : candidate
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  const bookInterview = () => {
    if (!selectedCandidate || !scheduledTime || !selectedJob) return;

    fetch(`${API_URL}candidates/${selectedCandidate.id}/new-interview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scheduledAt: scheduledTime,
        jobId: selectedJob,
        mode: selectedMode,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate.id === selectedCandidate.id
              ? { ...candidate, isInterviewScheduled: true }
              : candidate
          )
        );
        setSelectedCandidate(null);
        setScheduledTime("");
        setSelectedJob("");
      })
      .catch((error) => console.error("Error booking interview:", error));
  };

  return (
    <div className="flex-1 p-10">
      <Table>
        <TableCaption>
          List of all candidates and their application status.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{`${candidate.firstName} ${candidate.lastName}`}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone}</TableCell>
              <TableCell>
                <Select
                  value={candidate.status}
                  onValueChange={(newStatus) =>
                    updateCandidateStatus(
                      candidate.id,
                      newStatus as Candidate["status"]
                    )
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={candidate.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIRED">Hired</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                {candidate.status === "HIRED" ? (
                  <Button
                    variant="outline"
                    disabled
                    className="bg-gray-500 text-white"
                  >
                    Already Hired
                  </Button>
                ) : candidate.status === "REJECTED" ? (
                  <Button
                    variant="outline"
                    disabled
                    className="bg-red-500 text-white"
                  >
                    Rejected
                  </Button>
                ) : candidate.isInterviewScheduled ? (
                  <Button
                    variant="outline"
                    disabled
                    className="bg-green-500 text-white"
                  >
                    Booked!
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="px-4 py-2"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        Book Interview
                      </Button>
                    </DialogTrigger>
                    {selectedCandidate && (
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Schedule Interview</DialogTitle>
                          <DialogDescription>
                            Select a date, time, and job role for the interview
                            with {selectedCandidate.firstName}{" "}
                            {selectedCandidate.lastName}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="datetime" className="text-right">
                              Date & Time
                            </Label>
                            <Input
                              id="datetime"
                              type="datetime-local"
                              className="col-span-3"
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="jobRole" className="text-right">
                              Job Role
                            </Label>
                            <Select
                              value={selectedJob}
                              onValueChange={setSelectedJob}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Job Role" />
                              </SelectTrigger>
                              <SelectContent>
                                {jobs.map((job) => (
                                  <SelectItem key={job.id} value={job.id}>
                                    {job.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mode" className="text-right">
                              Mode
                            </Label>
                            <Select
                              value={selectedMode}
                              onValueChange={setSelectedMode}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IN_PERSON">
                                  IN_PERSON
                                </SelectItem>
                                <SelectItem value="VIRTUAL">VIRTUAL</SelectItem>
                                <SelectItem value="PHONE">PHONE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={bookInterview}
                            disabled={
                              !scheduledTime || !selectedJob || !selectedMode
                            }
                          >
                            Schedule Interview
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                )}

                {/* {candidate.isInterviewScheduled ? (
                  <Button
                    variant="outline"
                    disabled
                    className="bg-green-500 text-white"
                  >
                    Booked!
                  </Button>
                ) : (
                  
                )} */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total Candidates</TableCell>
            <TableCell className="text-right">{candidates.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
