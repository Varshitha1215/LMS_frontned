import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, Chip, TextField } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface PseudoCodeQuestionProps {
  question: Record<string, unknown>;
  response: string[] | Record<string, string> | string;
  onResponseChange: (response: string[] | Record<string, string> | string) => void;
  type: 'output' | 'jumbling';
  colors: Record<string, string>;
}

const PseudoCodeQuestion: React.FC<PseudoCodeQuestionProps> = ({
  question,
  response,
  onResponseChange,
  type,
  colors,
}) => {
  const codeLines = Array.isArray(question.code) ? (question.code as string[]) : [];
  const [orderedLines, setOrderedLines] = useState<string[]>(
    Array.isArray(response) ? response : codeLines
  );
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  if (type === 'output') {
    return (
      <Box>
        <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
          {question.content as string}
        </Typography>

        <Paper
          sx={{
            p: 2,
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 2,
            mb: 2,
            fontFamily: 'monospace',
            color: colors.textSecondary,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {(question.pseudoCode as string) || ''}
        </Paper>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Enter the output of the above pseudo code"
          value={typeof response === 'string' ? response : ''}
          onChange={(e) => onResponseChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: colors.textSecondary,
              borderColor: colors.cardBorder,
              '&:hover fieldset': {
                borderColor: colors.accent,
              },
            },
          }}
        />

        {Boolean(question.hint) && (
          <Alert severity="info" sx={{ mt: 2 }} variant="outlined">
            <Typography variant="body2">
              💡 Hint: {String(question.hint)}
            </Typography>
          </Alert>
        )}
      </Box>
    );
  }

  // Jumbling type
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedItem === null || draggedItem === index) return;

    const newOrder = [...orderedLines];
    const draggedLine = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(index, 0, draggedLine);

    setOrderedLines(newOrder);
    onResponseChange(newOrder);
    setDraggedItem(null);
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3 }}>
        {(question.content as string)} (Drag to rearrange)
      </Typography>

      <Box sx={{ mb: 3 }}>
        {orderedLines.map((line: string, index: number) => (
          <Paper
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            sx={{
              p: 2,
              mb: 1,
              backgroundColor: colors.accent + '15',
              border: `2px solid ${colors.accent}`,
              borderRadius: 2,
              cursor: 'move',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              opacity: draggedItem === index ? 0.5 : 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: colors.accent + '25',
              },
            }}
          >
            <DragIndicatorIcon sx={{ color: colors.accent }} />
            <Typography
              sx={{
                fontFamily: 'monospace',
                color: colors.textSecondary,
                flex: 1,
              }}
            >
              {line}
            </Typography>
            <Chip label={`${index + 1}`} size="small" />
          </Paper>
        ))}
      </Box>

      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          const shuffled = [...codeLines].sort(() => Math.random() - 0.5);
          setOrderedLines(shuffled);
          onResponseChange(shuffled);
        }}
        sx={{ mb: 2 }}
      >
        Reset Order
      </Button>
    </Box>
  );
};

export default PseudoCodeQuestion;
