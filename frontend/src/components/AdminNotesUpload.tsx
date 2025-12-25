'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useThemeMode } from '@/context/ThemeContext';

interface UploadedNote {
  id: string;
  courseId: string;
  topicId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx';
  fileSize: string;
  uploadedDate: string;
  description: string;
  uploadedBy: string;
}

export default function AdminNotesUploadPanel() {
  const { mode, themeColors } = useThemeMode();
  const isDark = mode === 'dark';

  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    courseId: '',
    topicId: '',
    fileName: '',
    fileType: 'pdf' as 'pdf' | 'docx' | 'pptx',
    description: '',
  });

  const colors = {
    cardBg: isDark ? themeColors.paperDark : themeColors.paperLight,
    cardBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.08)',
    textPrimary: isDark ? themeColors.textDark : themeColors.textLight,
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.6)',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.4)',
    accent: themeColors.accent,
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      courseId: '',
      topicId: '',
      fileName: '',
      fileType: 'pdf',
      description: '',
    });
    setUploadProgress(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown }> | any) => {
    const { name, value } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async () => {
    if (!formData.courseId || !formData.topicId || !formData.fileName) {
      alert('Please fill all required fields');
      return;
    }

    setIsUploading(true);
    // Simulate file upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    const newNote: UploadedNote = {
      id: Date.now().toString(),
      courseId: formData.courseId,
      topicId: formData.topicId,
      fileName: formData.fileName,
      fileType: formData.fileType,
      fileSize: Math.round(Math.random() * 5 + 0.5) + ' MB',
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: formData.description,
      uploadedBy: 'Admin',
    };

    setUploadedNotes([...uploadedNotes, newNote]);
    setIsUploading(false);
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setUploadedNotes(uploadedNotes.filter(note => note.id !== id));
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'pptx': return '🎯';
      default: return '📦';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
            📚 Notes Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleOpenDialog}
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${themeColors.secondary} 100%)`,
              color: isDark ? '#000' : '#fff',
              fontWeight: 600,
            }}
          >
            Upload Notes
          </Button>
        </Box>

        {uploadedNotes.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No notes uploaded yet. Click the &quot;Upload Notes&quot; button to add study materials for students.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                  <TableCell sx={{ color: colors.textPrimary, fontWeight: 700 }}>File</TableCell>
                  <TableCell sx={{ color: colors.textPrimary, fontWeight: 700 }}>Course ID</TableCell>
                  <TableCell sx={{ color: colors.textPrimary, fontWeight: 700 }}>Topic ID</TableCell>
                  <TableCell sx={{ color: colors.textPrimary, fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ color: colors.textPrimary, fontWeight: 700 }}>Size</TableCell>
                  <TableCell sx={{ color: colors.textPrimary, fontWeight: 700 }}>Uploaded</TableCell>
                  <TableCell sx={{ color: colors.textPrimary, fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedNotes.map(note => (
                  <TableRow key={note.id} sx={{ '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' } }}>
                    <TableCell sx={{ color: colors.textSecondary }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{getFileIcon(note.fileType)}</span>
                        {note.fileName}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: colors.textSecondary }}>{note.courseId}</TableCell>
                    <TableCell sx={{ color: colors.textSecondary }}>{note.topicId}</TableCell>
                    <TableCell>
                      <Chip
                        label={note.fileType.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${colors.accent}25`,
                          color: colors.accent,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: colors.textMuted }}>{note.fileSize}</TableCell>
                    <TableCell sx={{ color: colors.textMuted }}>{note.uploadedDate}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ color: colors.accent }}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: colors.textMuted }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(note.id)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.cardBg, color: colors.textPrimary, fontWeight: 700 }}>
          Upload Study Notes
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.cardBg, pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Course ID"
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              placeholder="e.g., course-1"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: colors.textMuted,
                  opacity: 1,
                },
              }}
            />
            <TextField
              fullWidth
              label="Topic ID"
              name="topicId"
              value={formData.topicId}
              onChange={handleInputChange}
              placeholder="e.g., topic-1-1-1"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                },
              }}
            />
            <TextField
              fullWidth
              label="File Name"
              name="fileName"
              value={formData.fileName}
              onChange={handleInputChange}
              placeholder="e.g., Introduction_to_DSA.pdf"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.textSecondary }}>File Type</InputLabel>
              <Select
                name="fileType"
                value={formData.fileType}
                onChange={handleInputChange}
                label="File Type"
                sx={{
                  color: colors.textPrimary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.cardBorder,
                  },
                }}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="docx">DOCX (Word)</MenuItem>
                <MenuItem value="pptx">PPTX (PowerPoint)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add a brief description of the notes content..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                },
              }}
            />

            {isUploading && (
              <Box>
                <Typography variant="caption" sx={{ color: colors.textMuted, mb: 1, display: 'block' }}>
                  Uploading... {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.cardBg, p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ color: colors.textSecondary }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={isUploading}
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${themeColors.secondary} 100%)`,
              color: isDark ? '#000' : '#fff',
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
