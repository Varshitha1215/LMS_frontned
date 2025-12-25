import React from 'react';
import { Box, TextField, Typography, Chip } from '@mui/material';

interface FillInTheBlanksQuestionProps {
  question: Record<string, unknown>;
  response: Record<string, string>;
  onResponseChange: (response: Record<string, string>) => void;
  colors: Record<string, string>;
}

const FillInTheBlanksQuestion: React.FC<FillInTheBlanksQuestionProps> = ({
  question,
  response,
  onResponseChange,
  colors,
}) => {
  const handleInputChange = (blankId: string, value: string) => {
    onResponseChange({
      ...(response || {}),
      [blankId]: value,
    });
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3, lineHeight: 1.8 }}>
        {(question.content as string)?.split('_____').map((text: string, index: number) => (
          <Box key={index} sx={{ display: 'inline' }}>
            {text}
            {index < ((question.content as string)?.split('_____').length ?? 1) - 1 && (
              <TextField
                size="small"
                variant="standard"
                placeholder={`Blank ${index + 1}`}
                value={response?.[`blank-${index}`] || ''}
                onChange={(e) => handleInputChange(`blank-${index}`, e.target.value)}
                sx={{
                  mx: 1,
                  width: '150px',
                  '& .MuiInput-underline:before': {
                    borderBottomColor: colors.cardBorder,
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: colors.accent,
                  },
                }}
              />
            )}
          </Box>
        ))}
      </Typography>

      {Boolean(question.hints) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block', mb: 1 }}>
            Hints:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(question.hints as string[]).map((hint: string, index: number) => (
              <Chip key={index} label={hint} variant="outlined" size="small" />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FillInTheBlanksQuestion;
