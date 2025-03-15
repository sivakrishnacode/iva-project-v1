import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/config";

interface InterviewSessionProps {
  interview: {
    job: {
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
    candidate: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      experience: number;
    };
  };
  onExit: () => void;
}

export function InterviewSession({ interview, onExit }: InterviewSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    interview.job.questions.length * 120
  );

  useEffect(() => {
    if (started) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started]);

  const questions = interview.job.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id] || "NotAttend";

  const handleAnswerChange = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      candidateId: interview.candidate.id,
      answers: questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || "NotAttend",
      })),
    };

    try {
      await fetch(`${API_URL}interviews/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      alert("Interview completed! Thank you for attending.");
      onExit();
    } catch (error) {
      console.error("Error submitting interview:", error);
      alert("Failed to submit interview. Please try again.");
    }
  };

  if (!started) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
        <p className="mb-6 text-gray-600">
          Please read the following terms before starting the interview...
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setStarted(true)} className="px-6">
            Start Test
          </Button>
          <Button variant="destructive" onClick={onExit} className="px-6">
            Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Interview Session</h2>
        <span className="text-red-500 font-semibold">
          Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </div>
      <p className="font-semibold mb-2">
        Question {currentQuestionIndex + 1}: {currentQuestion.question}
      </p>
      <div className="space-y-2">
        {["A", "B", "C", "D"].map((option) => (
          <label
            key={option}
            className="block border p-2 rounded-md cursor-pointer"
          >
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={() => handleAnswerChange(option)}
              className="mr-2"
            />
            {currentQuestion[`option${option}` as keyof typeof currentQuestion]}
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Button onClick={handlePrev} disabled={currentQuestionIndex === 0}>
          Prev
        </Button>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === "NotAttend"}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit
          </Button>
        )}
        {Object.keys(answers).length === questions.length && (
          <Button variant="destructive" onClick={onExit}>
            Exit
          </Button>
        )}
      </div>
    </div>
  );
}
