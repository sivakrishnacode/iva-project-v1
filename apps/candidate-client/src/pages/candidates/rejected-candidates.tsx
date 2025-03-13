import { useEffect, useState } from "react";
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
import { API_URL } from "@/lib/config";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "HIRED" | "PENDING" | "REJECTED";
}

export function RejectedCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetch(`${API_URL}candidates?status=REJECTED`)
      .then((response) => response.json())
      .then((data) => setCandidates(data))
      .catch((error) =>
        console.error("Error fetching rejected candidates:", error)
      );
  }, []);

  return (
    <div className="flex-1 p-10">
      <h2 className="text-xl font-semibold mb-4">Rejected Candidates</h2>
      <Table>
        <TableCaption>List of all rejected candidates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{`${candidate.firstName} ${candidate.lastName}`}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Rejected</TableCell>
            <TableCell className="text-right">{candidates.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
