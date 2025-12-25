import React from 'react';
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

interface MCQQuestionProps {
  question: Record<string, unknown>;
  response: string;
  onResponseChange: (response: string) => void;
  colors: Record<string, string>;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  response,
  onResponseChange,
  colors,
}) => {
  return (
    <Box>
      <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
        {(question.content as string)}
      </Typography>

      <RadioGroup
        value={response || ''}
        onChange={(e) => onResponseChange(e.target.value)}
      >
        {(question.options as string[]).map((option: string, index: number) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={
              <Typography sx={{ color: colors.textSecondary }}>
                {option}
              </Typography>
            }
            sx={{
              mb: 1.5,
              p: 2,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 2,
              backgroundColor: response === option ? (colors.accent as string) + '15' : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: (colors.accent as string) + '10',
              },
            }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default MCQQuestion;
