import { PrismaService } from '@/db/prisma.service';
import { Injectable } from '@nestjs/common';
import { InterviewStatus, Prisma } from '@prisma/client';

@Injectable()
export class InterviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllInterviews(status?: InterviewStatus, candidateId?: string) {
    return this.prisma.interview.findMany({
      where: {
        ...(status && { status }),
        ...(candidateId && { candidateId }),
      },
      include: {
        candidate: true,
        job: {
          include: {
            questions: true,
          },
        },
      },
      orderBy: { score: 'asc' },
    });
  }

  async deleteInterview(id: string) {
    const data = await this.prisma.interview.delete({
      where: { id },
    });

    if (data.testResultId) {
      await this.prisma.testResult.delete({
        where: { id: data.testResultId },
      });
    }

    return { message: 'Interview deleted successfully' };
  }

  async submitInterview(submissionData: {
    candidateId: string;
    answers?: { questionId: string; answer: string }[];
  }) {
    const { candidateId, answers } = submissionData;

    if (!answers || !Array.isArray(answers)) {
      throw new Error("Invalid or missing 'answers' array.");
    }

    // Fetch all questions related to the candidate's job
    const jobQuestions = await this.prisma.jobQuestion.findMany();
    const totalQuestions = jobQuestions.length;

    let score = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = totalQuestions - answers.length;

    for (const answer of answers) {
      const question = await this.prisma.jobQuestion.findUnique({
        where: { id: answer.questionId },
      });
      if (question) {
        if (question.correctAnswer === answer.answer) {
          correctAnswers++;
          score++;
        } else {
          incorrectAnswers++;
        }
      }
    }

    // Generate feedback based on performance
    let feedback = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly. `;
    feedback += `Incorrect answers: ${incorrectAnswers}. Unanswered: ${unanswered}. `;

    if (score >= totalQuestions * 0.8) {
      feedback += 'Excellent performance!';
    } else if (score >= totalQuestions * 0.5) {
      feedback += 'Good effort! A bit more practice will help.';
    } else {
      feedback += 'Needs improvement. Keep learning!';
    }

    // Store test result in database
    const data = await this.prisma.testResult.create({
      data: {
        candidateId,
        score,
        feedback,
        violations: false,
      },
    });

    // Update interview status with test result
    await this.prisma.interview.updateMany({
      where: { candidateId, status: 'SCHEDULED' },
      data: { score, status: 'COMPLETED', testResultId: data.id },
    });

    return { message: 'Interview submitted successfully', score, feedback };
  }

  async getTestResult(candidateId?: string) {
    return this.prisma.testResult.findFirst({
      where: candidateId ? { candidateId } : undefined,
      include: {
        candidate: true,
        interviews: true,
      },
    });
  }
}
