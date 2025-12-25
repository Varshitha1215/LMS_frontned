'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MCQQuestion from './assessment/MCQQuestion';
import FillInTheBlanksQuestion from './assessment/FillInTheBlanksQuestion';
import PseudoCodeQuestion from './assessment/PseudoCodeQuestion';
import MatchingQuestion from './assessment/MatchingQuestion';
import SpotTheErrorQuestion from './assessment/SpotTheErrorQuestion';
import CodingQuestion from './assessment/CodingQuestion';

export interface Question {
  id: string;
  type: 'mcq' | 'fill-blank' | 'pseudo-output' | 'jumbling' | 'matching' | 'spot-error' | 'coding';
  title: string;
  content: string;
  points: number;
  timeLimit?: number;
  [key: string]: unknown;
}

export interface Assessment {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  totalPoints: number;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

interface AssessmentProps {
  assessment: Assessment;
  onComplete: (score: number, responses: Record<string, unknown>) => void;
  onCancel: () => void;
  colors: Record<string, string>;
  isDark: boolean;
}

const AssessmentComponent: React.FC<AssessmentProps> = ({
  assessment,
  onComplete,
  onCancel,
  colors,
  isDark,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeLimit || 3600);
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  const calculateScore = useCallback(() => {
    let score = 0;
    assessment.questions.forEach(question => {
      const response = responses[question.id];
      if (response) {
        const q = question as Question & { correctAnswer?: string; errorLine?: number };
        if (question.type === 'mcq' && response === q.correctAnswer) {
          score += question.points;
        } else if (question.type === 'coding' && (response as Record<string, unknown>).passed) {
          score += question.points;
        } else if (question.type === 'spot-error' && response === q.errorLine) {
          score += question.points;
        } else if (response) {
          score += question.points * 0.5;
        }
      }
    });
    return score;
  }, [assessment.questions, responses]);

  const handleSubmitAssessment = useCallback(() => {
    const score = calculateScore();
    setFinalScore(score);
    setIsCompleted(true);
    onComplete(score, responses);
  }, [calculateScore, onComplete, responses]);

  // Prevent copy, cut, paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault();
        setCheatAttempts(prev => prev + 1);

        if (cheatAttempts >= 2) {
          alert('Assessment terminated due to multiple cheating attempts. Contact instructor.');
          onCancel();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cheatAttempts, onCancel]);

  // Timer
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

  const handleResponseChange = (questionId: string, response: unknown) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    const percentage = (finalScore / assessment.totalPoints) * 100;
    const passed = percentage >= assessment.passingScore;

    return (
      <Card sx={{ p: 4, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
        <Box sx={{ textAlign: 'center' }}>
          {passed ? (
            <CheckCircleIcon sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />
          ) : (
            <ErrorIcon sx={{ fontSize: 80, color: '#EF4444', mb: 2 }} />
          )}

          <Typography variant="h4" sx={{ color: colors.textPrimary, mb: 1, fontWeight: 700 }}>
            {passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h2" sx={{ color: colors.accent, fontWeight: 700 }}>
              {finalScore.toFixed(1)} / {assessment.totalPoints}
            </Typography>
            <Typography variant="h5" sx={{ color: colors.textSecondary, mt: 1 }}>
              {percentage.toFixed(1)}%
            </Typography>
          </Box>

          {!passed && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              You need {assessment.passingScore}% to pass. Try again!
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                setIsCompleted(false);
                setCurrentQuestionIndex(0);
                setResponses({});
                setTimeRemaining(assessment.timeLimit || 3600);
              }}
              sx={{
                backgroundColor: colors.accent,
                color: 'white',
                '&:hover': { opacity: 0.9 },
              }}
            >
              Retake Assessment
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              Close
            </Button>
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Card sx={{ p: 3, mb: 3, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
            {assessment.title}
          </Typography>
          <Chip
            label={`Time: ${formatTime(timeRemaining)}`}
            sx={{
              backgroundColor: timeRemaining < 300 ? '#FEE2E2' : colors.accent,
              color: timeRemaining < 300 ? '#DC2626' : 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        <Typography variant="caption" sx={{ color: colors.textMuted, mt: 1, display: 'block' }}>
          Question {currentQuestionIndex + 1} of {assessment.questions.length}
        </Typography>

        {cheatAttempts > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            ⚠️ Unauthorized action detected (Ctrl+C/A/X). Attempts: {cheatAttempts}/3
          </Alert>
        )}
      </Card>

      {/* Question */}
      <Card sx={{ p: 4, mb: 3, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
        <Typography variant="subtitle2" sx={{ color: colors.textMuted, mb: 1 }}>
          {currentQuestion.type.toUpperCase()} • {currentQuestion.points} Points
        </Typography>

        <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 3, fontWeight: 600 }}>
          {currentQuestion.title}
        </Typography>

        {/* Question Type Components */}
        <Box sx={{ mb: 3 }}>
          {currentQuestion.type === 'mcq' && (
            <MCQQuestion
              question={currentQuestion}
              response={(responses[currentQuestion.id] as string) || ''}
              onResponseChange={(response: string) => handleResponseChange(currentQuestion.id, response)}
              colors={colors}
            />
          )}

          {currentQuestion.type === 'fill-blank' && (
            <FillInTheBlanksQuestion
              question={currentQuestion}
              response={(responses[currentQuestion.id] as Record<string, string>) || {}}
              onResponseChange={(response: Record<string, string>) => handleResponseChange(currentQuestion.id, response)}
              colors={colors}
            />
          )}

          {currentQuestion.type === 'pseudo-output' && (
            <PseudoCodeQuestion
              question={currentQuestion}
              response={(responses[currentQuestion.id] as string) || ''}
              onResponseChange={(response: string | string[] | Record<string, string>) => handleResponseChange(currentQuestion.id, response)}
              type="output"
              colors={colors}
            />
          )}

          {currentQuestion.type === 'jumbling' && (
            <PseudoCodeQuestion
              question={currentQuestion}
              response={(responses[currentQuestion.id] as string[]) || []}
              onResponseChange={(response: string | string[] | Record<string, string>) => handleResponseChange(currentQuestion.id, response)}
              type="jumbling"
              colors={colors}
            />
          )}

          {currentQuestion.type === 'matching' && (
            <MatchingQuestion
              question={currentQuestion}
              response={(responses[currentQuestion.id] as Record<string, string>) || {}}
              onResponseChange={(response: Record<string, string>) => handleResponseChange(currentQuestion.id, response)}
              colors={colors}
            />
          )}

          {currentQuestion.type === 'spot-error' && (
            <SpotTheErrorQuestion
              question={currentQuestion}
              response={(responses[currentQuestion.id] as number) || null}
              onResponseChange={(response: number) => handleResponseChange(currentQuestion.id, response)}
              colors={colors}
            />
          )}

          {currentQuestion.type === 'coding' && (
            <CodingQuestion
              question={currentQuestion}
              response={(responses[currentQuestion.id] as Record<string, unknown>) || {}}
              onResponseChange={(response: Record<string, unknown>) => handleResponseChange(currentQuestion.id, response)}
              colors={colors}
              isDark={isDark}
            />
          )}
        </Box>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          disabled={currentQuestionIndex === 0}
          onClick={handlePrevious}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentQuestionIndex === assessment.questions.length - 1 ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: colors.accent, color: 'white' }}
              onClick={handleSubmitAssessment}
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ backgroundColor: colors.accent, color: 'white' }}
              onClick={handleNext}
            >
              Next Question
            </Button>
          )}
        </Box>

        <Button variant="outlined" color="error" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AssessmentComponent;
