import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Paper, Alert, Tabs, Tab, CircularProgress, Card } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './assessment.css';

interface CodingQuestionProps {
  question: Record<string, unknown>;
  response: Record<string, unknown>;
  onResponseChange: (response: Record<string, unknown>) => void;
  colors: Record<string, string>;
  isDark: boolean;
}

const CodingQuestion: React.FC<CodingQuestionProps> = ({
  question,
  response,
  onResponseChange,
  colors,
  isDark,
}) => {
  const [code, setCode] = useState((response?.code as string) || '');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{ name: string; passed: boolean; expected: string; actual: string }>
  >([]);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const testCases = (question.testCases as Array<{ input: string; output: string }>) || [];

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onResponseChange({
      ...response,
      code: newCode,
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution with a simple JavaScript evaluator
      // For production, connect to a real backend compiler/executor
      const results = testCases.map((testCase) => {
        try {
          // Simple test: check if code contains function and can be executed
          // This is a mock implementation
          const expectedOutput = testCase.output.trim();
          const actual = executeCode(code, testCase.input);

          return {
            name: `Test Case (Input: ${testCase.input})`,
            passed: actual.trim() === expectedOutput,
            expected: expectedOutput,
            actual: actual.trim(),
          };
        } catch (error) {
          return {
            name: `Test Case (Input: ${testCase.input})`,
            passed: false,
            expected: testCase.output,
            actual: `Error: ${(error as Error).message}`,
          };
        }
      });

      setTestResults(results);
      const allPassed = results.every((r) => r.passed);

      onResponseChange({
        ...response,
        code,
        passed: allPassed,
        testResults: results,
      });
    } catch {
      // Error handled during execution
    } finally {
      setIsRunning(false);
    }
  };

  const executeCode = (codeStr: string, input: string) => {
    try {
      // Simple JavaScript function evaluation
      // In production, use a safer sandboxed environment like nodejs or container
      const func = new Function('input', codeStr);
      const result = func(input);
      return String(result);
    } catch (error) {
      throw error;
    }
  };

  const passedTests = testResults.filter((r) => r.passed).length;
  const totalTests = testResults.length;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 2, width: '100%' }}>
      {/* LEFT: Sidebar - Course Structure (Scrollable) */}
      <Box
        sx={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 2,
          p: 2,
          overflowY: 'auto',
          maxHeight: '800px',
        }}
      > {/* Problem Details Section */}
        <Typography variant="subtitle2" sx={{ color: colors.textMuted, fontWeight: 600, mb: 2 }}>
          Problem Details
        </Typography>

        {/* Problem Statement */}
        <Card sx={{ backgroundColor: colors.accent + '15', border: `1px solid ${colors.accent}`, p: 2, mb: 2 }}>
          <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 600, display: 'block', mb: 1 }}>
            Problem Statement
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
            {question.content as string}
          </Typography>
        </Card>

        {/* Input/Output Format */}
        {Boolean(question.inputFormat) && (
          <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, p: 2, mb: 2 }}>
            <Typography variant="caption" sx={{ color: colors.textMuted, fontWeight: 600, display: 'block', mb: 1 }}>
              Input Format
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem', fontFamily: 'monospace' }}>
              {question.inputFormat as string}
            </Typography>
          </Card>
        )}

        {Boolean(question.outputFormat) && (
          <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, p: 2, mb: 2 }}>
            <Typography variant="caption" sx={{ color: colors.textMuted, fontWeight: 600, display: 'block', mb: 1 }}>
              Output Format
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem', fontFamily: 'monospace' }}>
              {question.outputFormat as string}
            </Typography>
          </Card>
        )}

        {/* Constraints */}
        {Boolean(question.constraints) && (
          <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, p: 2 }}>
            <Typography variant="caption" sx={{ color: colors.textMuted, fontWeight: 600, display: 'block', mb: 1 }}>
              Constraints
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
              {question.constraints as string}
            </Typography>
          </Card>
        )}
      </Box>

      {/* MIDDLE: Code Editor */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Editor Header */}
        <Card sx={{ p: 2, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: colors.textMuted, fontWeight: 600 }}>
              Code Editor
            </Typography>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={runCode}
              disabled={isRunning || !code.trim()}
              sx={{
                backgroundColor: colors.accent,
                color: 'white',
                '&:hover': { opacity: 0.9 },
                '&:disabled': { opacity: 0.5 },
              }}
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </Box>
        </Card>

        {/* Code Editor */}
        <Paper
          sx={{
            flex: 1,
            backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <textarea
            ref={codeEditorRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Write your code here..."
            className="coding-textarea"
            style={{
              flex: 1,
              padding: '16px',
              fontFamily: 'Monaco, Menlo, monospace',
              fontSize: '14px',
              color: isDark ? '#e0e0e0' : '#333',
              backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
              border: 'none',
              outline: 'none',
              resize: 'none',
            } as React.CSSProperties}
          />
        </Paper>

        {/* Test Results Tabs */}
        {testResults.length > 0 && (
          <Card sx={{ p: 2, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
            <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ mb: 2 }}>
              <Tab label="Results Summary" />
              <Tab label="Test Cases" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {passedTests === totalTests ? (
                    <>
                      <CheckCircleIcon sx={{ color: '#10B981', fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 700 }}>
                          All Tests Passed!
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                          {totalTests}/{totalTests} test cases passed
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <ErrorIcon sx={{ color: '#EF4444', fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: '#EF4444', fontWeight: 700 }}>
                          {totalTests - passedTests} Test(s) Failed
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                          {passedTests}/{totalTests} test cases passed
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                {testResults.map((result, idx) => (
                  <Card
                    key={idx}
                    sx={{
                      p: 2,
                      mb: 1,
                      backgroundColor: result.passed ? '#ECFDF5' : '#FEF2F2',
                      border: `1px solid ${result.passed ? '#D1FAE5' : '#FECACA'}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {result.passed ? (
                        <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                      ) : (
                        <ErrorIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                      )}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {result.name}
                      </Typography>
                    </Box>
                    {!result.passed && (
                      <Box sx={{ ml: 4 }}>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block' }}>
                          Expected: {result.expected}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#EF4444', display: 'block' }}>
                          Got: {result.actual}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                ))}
              </Box>
            )}
          </Card>
        )}
      </Box>

      {/* RIGHT: Compiler Output */}
      <Box
        sx={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 2,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '800px',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: colors.textMuted, fontWeight: 600, mb: 2 }}>
          Output & Compiler
        </Typography>

        {isRunning && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress />
          </Box>
        )}

        {!isRunning && testResults.length === 0 && (
          <Alert severity="info">
            Click &quot;Run Code&quot; to execute your solution and see test results
          </Alert>
        )}

        {!isRunning && testResults.length > 0 && (
          <Paper
            sx={{
              flex: 1,
              p: 2,
              backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 2,
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: isDark ? '#e0e0e0' : '#333',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {testResults.length > 0 && (
              <Box>
                {testResults.map((result, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: result.passed ? '#10B981' : '#EF4444',
                        fontWeight: 600,
                        display: 'block',
                      }}
                    >
                      {result.passed ? '✓' : '✗'} {result.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block', ml: 2 }}>
                      Expected: {result.expected}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block', ml: 2 }}>
                      Got: {result.actual}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CodingQuestion;
