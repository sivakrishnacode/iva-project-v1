import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Eye } from "lucide-react";
import { API_URL } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobData {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  questions: InterviewQuestion[];
}

interface InterviewQuestion {
  id?: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

export function JobAndInterviewQuestion() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<
    InterviewQuestion[]
  >([]);

  const [newJob, setNewJob] = useState<JobData>({
    id: "",
    title: "",
    description: "",
    location: "",
    salary: 0,
    questions: [],
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}settings/jobs`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchJobQuestions = (jobId: string) => {
    console.log("====================================");
    console.log(jobId);
    console.log("====================================");
    const job = jobs.find((job) => job.id === jobId);
    console.log(job);

    if (job) {
      setSelectedQuestions(job.questions);
      setQuestionModalOpen(true);
    }
  };

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
      },
    ]);
  };

  const openQuestionModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setQuestions([]);
    setModalOpen(true);
  };

  const createJob = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}settings/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      if (!response.ok) throw new Error("Failed to create job");
      setJobModalOpen(false);
      setNewJob({
        id: "",
        title: "",
        description: "",
        location: "",
        salary: 0,
        questions: [],
      });
      fetchJobs();
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  const saveQuestions = async () => {
    if (!selectedJobId) return;
    setLoading(true);

    try {
      await Promise.all(
        questions.map((question) =>
          fetch(`${API_URL}settings/job-questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...question, jobId: selectedJobId }),
          })
        )
      );
      setModalOpen(false);
      setSelectedJobId(null);
      setQuestions([]);
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save interview questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">All Jobs</h2>
        <Button
          onClick={() => setJobModalOpen(true)}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="shadow-lg p-6">
            <CardHeader className="text-lg font-semibold">
              {job.title}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{job.description}</p>
              <p className="mt-2">
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Salary:</strong> ${job.salary}
              </p>
              <p>
                <strong>Questions:</strong> {job.questions?.length ?? 0}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => openQuestionModal(job.id)}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Questions
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchJobQuestions(job.id)}
                className="flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" /> Show Questions
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Show Interview Questions Modal */}
      <Dialog open={questionModalOpen} onOpenChange={setQuestionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interview Questions</DialogTitle>
          </DialogHeader>

          {selectedQuestions.length > 0 ? (
            selectedQuestions.map((q, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4 shadow-md">
                <p className="font-semibold">{q.question}</p>
                <p>A) {q.optionA}</p>
                <p>B) {q.optionB}</p>
                <p>C) {q.optionC}</p>
                <p>D) {q.optionD}</p>
                <p className="mt-2 font-bold">
                  Correct Answer: {q.correctAnswer}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No questions available.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Job</DialogTitle>
          </DialogHeader>
          <Input
            name="title"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            className="mb-3"
          />
          <Textarea
            name="description"
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            className="mb-3"
          />
          <Input
            name="location"
            placeholder="Location"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            className="mb-3"
          />
          <Input
            name="salary"
            placeholder="Salary"
            type="number"
            value={newJob.salary}
            onChange={(e) =>
              setNewJob({ ...newJob, salary: Number(e.target.value) })
            }
            className="mb-3"
          />
          <Button onClick={createJob} disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Interview Questions</DialogTitle>
          </DialogHeader>

          {questions.map((q, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4 shadow-md">
              <Input
                placeholder="Question"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                className="mb-3"
              />
              <Input
                placeholder="Option A"
                value={q.optionA}
                onChange={(e) =>
                  handleQuestionChange(index, "optionA", e.target.value)
                }
                className="mb-3"
              />
              <Input
                placeholder="Option B"
                value={q.optionB}
                onChange={(e) =>
                  handleQuestionChange(index, "optionB", e.target.value)
                }
                className="mb-3"
              />
              <Input
                placeholder="Option C"
                value={q.optionC}
                onChange={(e) =>
                  handleQuestionChange(index, "optionC", e.target.value)
                }
                className="mb-3"
              />
              <Input
                placeholder="Option D"
                value={q.optionD}
                onChange={(e) =>
                  handleQuestionChange(index, "optionD", e.target.value)
                }
                className="mb-3"
              />
              <Input
                placeholder="Correct Answer (A/B/C/D)"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
                className="mb-3"
              />
            </div>
          ))}

          <Button variant="secondary" onClick={addQuestion} className="mb-4">
            <Plus className="w-4 h-4 mr-2" /> Add Another Question
          </Button>

          <Button onClick={saveQuestions} disabled={loading}>
            {loading ? "Saving..." : "Save Questions"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
