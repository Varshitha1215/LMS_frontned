import React from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemButton } from '@mui/material';

interface MatchingQuestionProps {
  question: Record<string, unknown>;
  response: Record<string, string>;
  onResponseChange: (response: Record<string, string>) => void;
  colors: Record<string, string>;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  response,
  onResponseChange,
  colors,
}) => {
  const leftItems = (question.left as string[]) || [];
  const rightItems = (question.right as string[]) || [];

  const handleMatch = (leftIndex: number, rightIndex: number) => {
    onResponseChange({
      ...(response || {}),
      [leftIndex]: `${rightIndex}`,
    });
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3 }}>
        {(question.content as string)}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* Left Column */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: colors.textMuted, mb: 2, fontWeight: 600 }}>
            Column A
          </Typography>
          <List>
            {leftItems.map((item: string, index: number) => (
              <ListItem key={index} sx={{ mb: 1, p: 0 }}>
                <Paper
                  sx={{
                    width: '100%',
                    p: 2,
                    backgroundColor: colors.accent + '15',
                    border: `1px solid ${colors.accent}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ color: colors.textSecondary, fontWeight: 500 }}>
                    {item}
                  </Typography>
                  {response?.[index] !== undefined && (
                    <Typography variant="caption" sx={{ color: colors.accent, display: 'block', mt: 1 }}>
                      → Matched with option {parseInt(response[index]) + 1}
                    </Typography>
                  )}
                </Paper>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Column */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: colors.textMuted, mb: 2, fontWeight: 600 }}>
            Column B
          </Typography>
          <List>
            {rightItems.map((item: string, rightIndex: number) => (
              <ListItemButton
                key={rightIndex}
                sx={{ mb: 1, p: 2, border: `1px solid ${colors.cardBorder}`, borderRadius: 2 }}
                onClick={() => {
                  // Find unmapped left item and match
                  const unmappedIndex = leftItems.findIndex(
                    (_, idx) => !response?.[idx]
                  );
                  if (unmappedIndex !== -1) {
                    handleMatch(unmappedIndex, rightIndex);
                  }
                }}
              >
                <Typography sx={{ color: colors.textSecondary, fontWeight: 500 }}>
                  {rightIndex + 1}. {item}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>

      <Button
        variant="outlined"
        size="small"
        onClick={() => onResponseChange({})}
        sx={{ mt: 2 }}
      >
        Clear Matches
      </Button>
    </Box>
  );
};

export default MatchingQuestion;
