import React from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface SpotTheErrorQuestionProps {
  question: Record<string, unknown>;
  response: number | null;
  onResponseChange: (response: number) => void;
  colors: Record<string, string>;
}

const SpotTheErrorQuestion: React.FC<SpotTheErrorQuestionProps> = ({
  question,
  response,
  onResponseChange,
  colors,
}) => {
  const codeLines = (question.code as string[]) || [];
  const errorLine = question.errorLine as number;

  return (
    <Box>
      <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3 }}>
        {(question.content as string)}
      </Typography>

      <Paper
        sx={{
          p: 0,
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3,
        }}
      >
        {codeLines.map((line: string, index: number) => (
          <Box
            key={index}
            onClick={() => onResponseChange(index)}
            sx={{
              p: 2,
              borderBottom: index !== codeLines.length - 1 ? `1px solid ${colors.cardBorder}` : 'none',
              backgroundColor:
                response === index ? colors.accent + '25' : index === errorLine ? '#FEE2E2' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: colors.accent + '15',
              },
            }}
          >
            <Typography
              sx={{
                color: '#999',
                fontWeight: 600,
                minWidth: '30px',
              }}
            >
              {index + 1}.
            </Typography>
            <Typography
              sx={{
                fontFamily: 'monospace',
                color: index === errorLine ? '#DC2626' : colors.textSecondary,
                flex: 1,
                textDecoration: index === errorLine ? 'underline wavy #DC2626' : 'none',
              }}
            >
              {line}
            </Typography>
            {response === index && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {index === errorLine ? (
                  <>
                    <CheckIcon sx={{ color: '#10B981', fontSize: 20 }} />
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
                      Correct
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloseIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                    <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600 }}>
                      Wrong
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Paper>

      {Boolean(question.explanation) && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Error Explanation:
          </Typography>
          <Typography variant="body2">{question.explanation as string}</Typography>
        </Alert>
      )}

      {Boolean(question.correction) && (
        <Alert severity="success">
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Correction:
          </Typography>
          <Typography sx={{ fontFamily: 'monospace', color: '#059669' }}>
            {question.correction as string}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default SpotTheErrorQuestion;
