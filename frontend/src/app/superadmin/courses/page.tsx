'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { keyframes } from '@mui/system';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeContext';
import { useUserManagement, Course, CourseModule, CourseTopic } from '@/context/UserManagementContext';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FolderIcon from '@mui/icons-material/Folder';
import TopicIcon from '@mui/icons-material/Topic';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import EditIcon from '@mui/icons-material/Edit';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function SuperAdminCoursesPage() {
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [numModules, setNumModules] = useState<number>(1);
  const [modules, setModules] = useState<Array<{ name: string; topics: Array<{ name: string; file?: File }> }>>([]);
  
  // Assessment Dialog States
  const [assessmentDialog, setAssessmentDialog] = useState(false);
  const [selectedCourseForAssessment, setSelectedCourseForAssessment] = useState<Course | null>(null);
  const [selectedModuleForAssessment, setSelectedModuleForAssessment] = useState<CourseModule | null>(null);
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [assessmentDescription, setAssessmentDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState<number | ''>('');
  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: [string, string, string, string];
    correctAnswer: number;
    explanation: string;
  }>>([]);
  
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { mode, themeColors } = useThemeMode();
  const { 
    currentUser, 
    courses, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    addModuleAssessment,
    updateModuleAssessment,
    deleteModuleAssessment,
    isLoaded 
  } = useUserManagement();
  const isDark = mode === 'dark';

  const colors = {
    pageBg: isDark ? themeColors.backgroundDark : themeColors.backgroundLight,
    cardBg: isDark ? themeColors.paperDark : themeColors.paperLight,
    cardBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.08)',
    textPrimary: isDark ? themeColors.textDark : themeColors.textLight,
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.6)',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.4)',
    accent: themeColors.accent,
  };

  const handleOpenCreateDialog = () => {
    setEditingCourse(null);
    setCourseTitle('');
    setCourseDescription('');
    setNumModules(1);
    setModules([]);
    setCreateDialog(true);
  };

  const handleOpenEditDialog = (course: Course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description || '');
    setNumModules(course.modules.length);
    
    // Convert course modules to form format
    const formModules = course.modules.map(mod => ({
      name: mod.name,
      topics: mod.topics.map(topic => ({
        name: topic.name,
        file: undefined, // Existing files are kept as URLs
        existingPdfUrl: topic.pdfUrl,
        existingPdfName: topic.pdfName,
      })),
    }));
    setModules(formModules);
    setEditDialog(true);
  };

  const handleGenerateModules = () => {
    const newModules = Array.from({ length: numModules }, () => ({
      name: '',
      topics: [],
    }));
    setModules(newModules);
  };

  const handleModuleNameChange = (index: number, name: string) => {
    setModules(prev => prev.map((mod, idx) => idx === index ? { ...mod, name } : mod));
  };

  const handleAddTopic = (moduleIndex: number) => {
    setModules(prev => prev.map((mod, idx) => 
      idx === moduleIndex 
        ? { ...mod, topics: [...mod.topics, { name: '', file: undefined }] }
        : mod
    ));
  };

  const handleTopicNameChange = (moduleIndex: number, topicIndex: number, name: string) => {
    setModules(prev => prev.map((mod, mIdx) => 
      mIdx === moduleIndex
        ? {
            ...mod,
            topics: mod.topics.map((topic, tIdx) => 
              tIdx === topicIndex ? { ...topic, name } : topic
            ),
          }
        : mod
    ));
  };

  const handleFileUpload = (moduleIndex: number, topicIndex: number, file: File) => {
    setModules(prev => prev.map((mod, mIdx) => 
      mIdx === moduleIndex
        ? {
            ...mod,
            topics: mod.topics.map((topic, tIdx) => 
              tIdx === topicIndex ? { ...topic, file } : topic
            ),
          }
        : mod
    ));
  };

  const handleRemoveTopic = (moduleIndex: number, topicIndex: number) => {
    setModules(prev => prev.map((mod, mIdx) => 
      mIdx === moduleIndex
        ? { ...mod, topics: mod.topics.filter((_, tIdx) => tIdx !== topicIndex) }
        : mod
    ));
  };

  const handleCreateCourse = () => {
    if (!courseTitle.trim()) {
      setSnackbar({ open: true, message: 'Please enter course title', severity: 'error' });
      return;
    }

    if (modules.some(mod => !mod.name.trim())) {
      setSnackbar({ open: true, message: 'Please name all modules', severity: 'error' });
      return;
    }

    // Convert modules to Course format
    const courseModules: CourseModule[] = modules.map((mod, idx) => ({
      id: `module-${Date.now()}-${idx}`,
      name: mod.name,
      topics: mod.topics.map((topic, tIdx) => {
        const courseTopic: CourseTopic = {
          id: `topic-${Date.now()}-${idx}-${tIdx}`,
          name: topic.name,
        };

        // Handle file upload (convert to base64 for localStorage)
        if (topic.file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            courseTopic.pdfUrl = result;
            courseTopic.pdfName = topic.file!.name;
            courseTopic.uploadedAt = new Date().toISOString();
          };
          reader.readAsDataURL(topic.file);
        }

        return courseTopic;
      }),
    }));

    const newCourse: Omit<Course, 'id' | 'createdAt'> = {
      title: courseTitle,
      description: courseDescription,
      modules: courseModules,
      createdBy: currentUser?.id || '',
    };

    createCourse(newCourse);
    setSnackbar({ open: true, message: 'Course created successfully!', severity: 'success' });
    setCreateDialog(false);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    if (!courseTitle.trim()) {
      setSnackbar({ open: true, message: 'Please enter course title', severity: 'error' });
      return;
    }

    if (modules.some(mod => !mod.name.trim())) {
      setSnackbar({ open: true, message: 'Please name all modules', severity: 'error' });
      return;
    }

    // Convert modules to Course format
    const courseModules: CourseModule[] = modules.map((mod, idx) => ({
      id: editingCourse.modules[idx]?.id || `module-${Date.now()}-${idx}`,
      name: mod.name,
      topics: mod.topics.map((topic, tIdx) => {
        const existingTopic = editingCourse.modules[idx]?.topics[tIdx];
        const courseTopic: CourseTopic = {
          id: existingTopic?.id || `topic-${Date.now()}-${idx}-${tIdx}`,
          name: topic.name,
        };

        // Use existing PDF if no new file uploaded
        if ((topic as any).existingPdfUrl && !topic.file) {
          courseTopic.pdfUrl = (topic as any).existingPdfUrl;
          courseTopic.pdfName = (topic as any).existingPdfName;
          courseTopic.uploadedAt = existingTopic?.uploadedAt;
        } else if (topic.file) {
          // Handle new file upload
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            courseTopic.pdfUrl = result;
            courseTopic.pdfName = topic.file!.name;
            courseTopic.uploadedAt = new Date().toISOString();
          };
          reader.readAsDataURL(topic.file);
        }

        return courseTopic;
      }),
    }));

    updateCourse(editingCourse.id, {
      title: courseTitle,
      description: courseDescription,
      modules: courseModules,
    });

    setSnackbar({ open: true, message: 'Course updated successfully!', severity: 'success' });
    setEditDialog(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      deleteCourse(courseId);
      setSnackbar({ open: true, message: 'Course deleted successfully', severity: 'success' });
    }
  };

  // Assessment Management Functions
  const handleOpenAssessmentDialog = (course: Course, module: CourseModule) => {
    setSelectedCourseForAssessment(course);
    setSelectedModuleForAssessment(module);
    
    // If assessment exists, load it for editing
    if (module.assessment) {
      setAssessmentTitle(module.assessment.title);
      setAssessmentDescription(module.assessment.description || '');
      setPassingScore(module.assessment.passingScore);
      setTimeLimit(module.assessment.timeLimit || '');
      setQuestions(module.assessment.questions.map(q => ({
        question: q.question,
        options: q.options as [string, string, string, string],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
      })));
    } else {
      // Reset for new assessment
      setAssessmentTitle(`${module.name} Assessment`);
      setAssessmentDescription('');
      setPassingScore(70);
      setTimeLimit('');
      setQuestions([{
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      }]);
    }
    
    setAssessmentDialog(true);
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === index) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        const newOptions = [...q.options] as [string, string, string, string];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSaveAssessment = () => {
    if (!selectedCourseForAssessment || !selectedModuleForAssessment) return;

    // Validate
    if (!assessmentTitle.trim()) {
      setSnackbar({ open: true, message: 'Assessment title is required', severity: 'error' });
      return;
    }

    if (questions.length < 15 || questions.length > 20) {
      setSnackbar({ open: true, message: 'Assessment must have 15-20 questions', severity: 'error' });
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setSnackbar({ open: true, message: `Question ${i + 1} is empty`, severity: 'error' });
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        setSnackbar({ open: true, message: `Question ${i + 1} has empty options`, severity: 'error' });
        return;
      }
    }

    const assessmentData = {
      title: assessmentTitle,
      description: assessmentDescription,
      passingScore,
      timeLimit: timeLimit === '' ? undefined : Number(timeLimit),
      questions: questions.map((q, idx) => ({
        id: `q-${idx}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
    };

    if (selectedModuleForAssessment.assessment) {
      // Update existing assessment
      updateModuleAssessment(
        selectedCourseForAssessment.id,
        selectedModuleForAssessment.id,
        {
          ...assessmentData,
          id: selectedModuleForAssessment.assessment.id,
          moduleId: selectedModuleForAssessment.id,
        }
      );
      setSnackbar({ open: true, message: 'Assessment updated successfully!', severity: 'success' });
    } else {
      // Add new assessment
      addModuleAssessment(
        selectedCourseForAssessment.id,
        selectedModuleForAssessment.id,
        assessmentData
      );
      setSnackbar({ open: true, message: 'Assessment added successfully!', severity: 'success' });
    }

    setAssessmentDialog(false);
  };

  const handleDeleteAssessment = (course: Course, module: CourseModule) => {
    if (window.confirm(`Are you sure you want to delete the assessment for "${module.name}"?`)) {
      deleteModuleAssessment(course.id, module.id);
      setSnackbar({ open: true, message: 'Assessment deleted successfully', severity: 'success' });
    }
  };

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.pageBg }}>
        <Typography sx={{ color: colors.textPrimary }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.pageBg, p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, animation: `${fadeInUp} 0.5s ease-out` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Link href="/superadmin/dashboard" style={{ textDecoration: 'none' }}>
            <IconButton sx={{ color: colors.textSecondary, '&:hover': { backgroundColor: `${colors.accent}20`, color: colors.accent } }}>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <MenuBookIcon sx={{ fontSize: 36, color: colors.accent }} />
              Course Management
            </Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: '1rem', mt: 0.5 }}>
              Create and manage courses with modules and topics
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{
              backgroundColor: colors.accent,
              color: '#fff',
              textTransform: 'none',
              px: 3,
              '&:hover': { backgroundColor: `${colors.accent}dd` },
            }}
          >
            Create New Course
          </Button>
        </Box>
      </Box>

      {/* Courses List */}
      {courses.length === 0 ? (
        <Card sx={{ p: 8, backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, textAlign: 'center' }}>
          <MenuBookIcon sx={{ fontSize: 80, color: colors.textMuted, mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ color: colors.textSecondary, mb: 1, fontWeight: 600 }}>
            No Courses Created Yet
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textMuted, mb: 3 }}>
            Create your first course to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{
              backgroundColor: colors.accent,
              color: '#fff',
              textTransform: 'none',
              '&:hover': { backgroundColor: `${colors.accent}dd` },
            }}
          >
            Create Course
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {courses.map((course) => (
            <Card key={course.id} sx={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ p: 3, display: 'flex', alignItems: 'start', justifyContent: 'space-between', borderBottom: `1px solid ${colors.cardBorder}` }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 1 }}>
                    {course.title}
                  </Typography>
                  {course.description && (
                    <Typography sx={{ color: colors.textSecondary, mb: 2 }}>
                      {course.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                      icon={<FolderIcon sx={{ fontSize: 16 }} />}
                      label={`${course.modules.length} Modules`}
                      size="small"
                      sx={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
                    />
                    <Chip
                      icon={<TopicIcon sx={{ fontSize: 16 }} />}
                      label={`${course.modules.reduce((sum, mod) => sum + mod.topics.length, 0)} Topics`}
                      size="small"
                      sx={{ backgroundColor: '#22C55E20', color: '#22C55E' }}
                    />
                    <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '0.75rem' }}>
                      Created {new Date(course.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenEditDialog(course)}
                    sx={{
                      borderColor: colors.accent,
                      color: colors.accent,
                      textTransform: 'none',
                      '&:hover': { borderColor: colors.accent, backgroundColor: `${colors.accent}15` },
                    }}
                  >
                    Edit
                  </Button>
                  <IconButton
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                    sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#EF444420' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Modules */}
              <Box sx={{ p: 2 }}>
                {course.modules.map((module, moduleIdx) => (
                  <Accordion
                    key={module.id}
                    sx={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${colors.cardBorder}`,
                      mb: 1,
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: colors.textPrimary }} />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <FolderIcon sx={{ color: colors.accent }} />
                        <Typography sx={{ color: colors.textPrimary, fontWeight: 600, flex: 1 }}>
                          Module {moduleIdx + 1}: {module.name}
                        </Typography>
                        <Chip
                          label={`${module.topics.length} Topics`}
                          size="small"
                          sx={{ backgroundColor: `${colors.accent}15`, color: colors.accent, fontSize: '0.7rem' }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {module.topics.length === 0 ? (
                        <Typography sx={{ color: colors.textMuted, fontStyle: 'italic', p: 2 }}>
                          No topics added yet
                        </Typography>
                      ) : (
                        <Box sx={{ pl: 2 }}>
                          {module.topics.map((topic, topicIdx) => (
                            <Box
                              key={topic.id}
                              sx={{
                                p: 2,
                                mb: 1,
                                borderRadius: 2,
                                border: `1px solid ${colors.cardBorder}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <TopicIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                              <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: colors.textPrimary, fontWeight: 500, fontSize: '0.9rem' }}>
                                  {topicIdx + 1}. {topic.name}
                                </Typography>
                                {topic.pdfName && (
                                  <Typography variant="body2" sx={{ color: colors.textMuted, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                    <PictureAsPdfIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                                    {topic.pdfName}
                                  </Typography>
                                )}
                              </Box>
                              {topic.pdfUrl && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = topic.pdfUrl!;
                                    link.download = topic.pdfName || 'document.pdf';
                                    link.click();
                                  }}
                                  sx={{
                                    borderColor: colors.accent,
                                    color: colors.accent,
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    '&:hover': { borderColor: colors.accent, backgroundColor: `${colors.accent}15` },
                                  }}
                                >
                                  Download PDF
                                </Button>
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      {/* Assessment Button */}
                      <Box sx={{ mt: 2, p: 2, borderTop: `1px solid ${colors.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {module.assessment ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Chip
                              icon={<QuizIcon />}
                              label={`${module.assessment.questions.length} Questions • ${module.assessment.passingScore}% Pass`}
                              sx={{ backgroundColor: '#22C55E20', color: '#22C55E', fontWeight: 500 }}
                            />
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenAssessmentDialog(course, module)}
                              sx={{
                                borderColor: colors.accent,
                                color: colors.accent,
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                '&:hover': { borderColor: colors.accent, backgroundColor: `${colors.accent}15` },
                              }}
                            >
                              Edit Assessment
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteAssessment(course, module)}
                              sx={{
                                borderColor: '#EF4444',
                                color: '#EF4444',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                '&:hover': { borderColor: '#EF4444', backgroundColor: '#EF444415' },
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<AssignmentIcon />}
                            onClick={() => handleOpenAssessmentDialog(course, module)}
                            sx={{
                              backgroundColor: colors.accent,
                              color: '#fff',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              '&:hover': { backgroundColor: `${colors.accent}dd` },
                            }}
                          >
                            Add Assessment (15-20 Questions)
                          </Button>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Create Course Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { backgroundColor: colors.cardBg, borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon sx={{ color: colors.accent }} />
          Create New Course
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Course Title */}
            <TextField
              label="Course Title"
              fullWidth
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                  '&:hover fieldset': { borderColor: colors.accent },
                  '&.Mui-focused fieldset': { borderColor: colors.accent },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />

            {/* Course Description */}
            <TextField
              label="Course Description (Optional)"
              fullWidth
              multiline
              rows={2}
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                  '&:hover fieldset': { borderColor: colors.accent },
                  '&.Mui-focused fieldset': { borderColor: colors.accent },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />

            {/* Number of Modules */}
            <Box>
              <TextField
                label="Number of Modules"
                type="number"
                value={numModules}
                onChange={(e) => setNumModules(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                sx={{
                  width: 200,
                  '& .MuiOutlinedInput-root': {
                    color: colors.textPrimary,
                    '& fieldset': { borderColor: colors.cardBorder },
                    '&:hover fieldset': { borderColor: colors.accent },
                    '&.Mui-focused fieldset': { borderColor: colors.accent },
                  },
                  '& .MuiInputLabel-root': { color: colors.textSecondary },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleGenerateModules}
                sx={{ ml: 2, borderColor: colors.accent, color: colors.accent, textTransform: 'none' }}
              >
                Generate Modules
              </Button>
            </Box>

            {/* Modules */}
            {modules.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2, borderColor: colors.cardBorder }} />
                <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 2, fontWeight: 600 }}>
                  Configure Modules
                </Typography>
                {modules.map((module, moduleIdx) => (
                  <Card
                    key={moduleIdx}
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <FolderIcon sx={{ color: colors.accent }} />
                      <TextField
                        label={`Module ${moduleIdx + 1} Name`}
                        fullWidth
                        value={module.name}
                        onChange={(e) => handleModuleNameChange(moduleIdx, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: colors.textPrimary,
                            '& fieldset': { borderColor: colors.cardBorder },
                            '&:hover fieldset': { borderColor: colors.accent },
                            '&.Mui-focused fieldset': { borderColor: colors.accent },
                          },
                          '& .MuiInputLabel-root': { color: colors.textSecondary },
                        }}
                      />
                    </Box>

                    {/* Topics */}
                    <Box sx={{ pl: 3, mb: 2 }}>
                      {module.topics.map((topic, topicIdx) => (
                        <Box key={topicIdx} sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'start' }}>
                          <TextField
                            label={`Topic ${topicIdx + 1} Name`}
                            size="small"
                            fullWidth
                            value={topic.name}
                            onChange={(e) => handleTopicNameChange(moduleIdx, topicIdx, e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: colors.textPrimary,
                                '& fieldset': { borderColor: colors.cardBorder },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                              },
                              '& .MuiInputLabel-root': { color: colors.textSecondary },
                            }}
                          />
                          <Button
                            variant="outlined"
                            component="label"
                            size="small"
                            startIcon={<UploadFileIcon />}
                            sx={{
                              borderColor: colors.accent,
                              color: colors.accent,
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              minWidth: 120,
                            }}
                          >
                            {topic.file ? 'PDF Added' : 'Upload PDF'}
                            <input
                              type="file"
                              hidden
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(moduleIdx, topicIdx, file);
                              }}
                            />
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveTopic(moduleIdx, topicIdx)}
                            sx={{ color: '#EF4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddTopic(moduleIdx)}
                      sx={{ color: colors.accent, textTransform: 'none', fontSize: '0.85rem' }}
                    >
                      Add Topic
                    </Button>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setCreateDialog(false)} sx={{ color: colors.textSecondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCourse}
            disabled={!courseTitle.trim() || modules.length === 0}
            sx={{
              backgroundColor: colors.accent,
              '&:hover': { backgroundColor: `${colors.accent}dd` },
              '&:disabled': { backgroundColor: colors.textMuted, opacity: 0.5 },
            }}
          >
            Create Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => {
          setEditDialog(false);
          setEditingCourse(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { backgroundColor: colors.cardBg, borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon sx={{ color: colors.accent }} />
          Edit Course
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Course Title & Description */}
            <TextField
              label="Course Title"
              fullWidth
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                  '&:hover fieldset': { borderColor: colors.accent },
                  '&.Mui-focused fieldset': { borderColor: colors.accent },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />
            <TextField
              label="Course Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: colors.textPrimary,
                  '& fieldset': { borderColor: colors.cardBorder },
                  '&:hover fieldset': { borderColor: colors.accent },
                  '&.Mui-focused fieldset': { borderColor: colors.accent },
                },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />

            <Divider sx={{ mb: 3, borderColor: colors.cardBorder }} />

            {/* Number of Modules */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Number of Modules"
                type="number"
                value={numModules}
                onChange={(e) => setNumModules(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: colors.textPrimary,
                    '& fieldset': { borderColor: colors.cardBorder },
                    '&:hover fieldset': { borderColor: colors.accent },
                    '&.Mui-focused fieldset': { borderColor: colors.accent },
                  },
                  '& .MuiInputLabel-root': { color: colors.textSecondary },
                }}
              />
              <Button
                variant="contained"
                onClick={handleGenerateModules}
                sx={{
                  backgroundColor: colors.accent,
                  '&:hover': { backgroundColor: `${colors.accent}dd` },
                }}
              >
                Update Modules
              </Button>
            </Box>

            {/* Modules */}
            {modules.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 600, mb: 2 }}>Course Modules:</Typography>
                {modules.map((module, moduleIdx) => (
                  <Card
                    key={moduleIdx}
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        label={`Module ${moduleIdx + 1} Name`}
                        fullWidth
                        value={module.name}
                        onChange={(e) => handleModuleNameChange(moduleIdx, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: colors.textPrimary,
                            '& fieldset': { borderColor: colors.cardBorder },
                            '&:hover fieldset': { borderColor: colors.accent },
                            '&.Mui-focused fieldset': { borderColor: colors.accent },
                          },
                          '& .MuiInputLabel-root': { color: colors.textSecondary },
                        }}
                      />
                    </Box>

                    {/* Topics */}
                    <Box sx={{ pl: 3, mb: 2 }}>
                      {module.topics.map((topic, topicIdx) => (
                        <Box key={topicIdx} sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'start' }}>
                          <TextField
                            label={`Topic ${topicIdx + 1} Name`}
                            size="small"
                            fullWidth
                            value={topic.name}
                            onChange={(e) => handleTopicNameChange(moduleIdx, topicIdx, e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: colors.textPrimary,
                                '& fieldset': { borderColor: colors.cardBorder },
                                '&:hover fieldset': { borderColor: colors.accent },
                                '&.Mui-focused fieldset': { borderColor: colors.accent },
                              },
                              '& .MuiInputLabel-root': { color: colors.textSecondary },
                            }}
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Button
                              variant="outlined"
                              component="label"
                              size="small"
                              startIcon={<UploadFileIcon />}
                              sx={{
                                borderColor: colors.accent,
                                color: colors.accent,
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                minWidth: 120,
                              }}
                            >
                              {topic.file || (topic as any).existingPdfUrl ? 'PDF Added' : 'Upload PDF'}
                              <input
                                type="file"
                                hidden
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(moduleIdx, topicIdx, file);
                                }}
                              />
                            </Button>
                            {(topic as any).existingPdfName && (
                              <Typography variant="caption" sx={{ color: colors.textMuted, fontSize: '0.7rem', textAlign: 'center' }}>
                                {(topic as any).existingPdfName}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveTopic(moduleIdx, topicIdx)}
                            sx={{ color: '#EF4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddTopic(moduleIdx)}
                      sx={{ color: colors.accent, textTransform: 'none', fontSize: '0.85rem' }}
                    >
                      Add Topic
                    </Button>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => {
            setEditDialog(false);
            setEditingCourse(null);
          }} sx={{ color: colors.textSecondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateCourse}
            disabled={!courseTitle.trim() || modules.length === 0}
            sx={{
              backgroundColor: colors.accent,
              '&:hover': { backgroundColor: `${colors.accent}dd` },
              '&:disabled': { backgroundColor: colors.textMuted, opacity: 0.5 },
            }}
          >
            Update Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assessment Dialog */}
      <Dialog
        open={assessmentDialog}
        onClose={() => setAssessmentDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { backgroundColor: colors.cardBg, borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuizIcon sx={{ color: colors.accent }} />
          {selectedModuleForAssessment?.assessment ? 'Edit' : 'Add'} Assessment for {selectedModuleForAssessment?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Assessment Details */}
            <TextField
              label="Assessment Title"
              fullWidth
              value={assessmentTitle}
              onChange={(e) => setAssessmentTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { color: colors.textPrimary },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />

            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={2}
              value={assessmentDescription}
              onChange={(e) => setAssessmentDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { color: colors.textPrimary },
                '& .MuiInputLabel-root': { color: colors.textSecondary },
              }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Passing Score (%)"
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                inputProps={{ min: 0, max: 100 }}
                sx={{
                  '& .MuiOutlinedInput-root': { color: colors.textPrimary },
                  '& .MuiInputLabel-root': { color: colors.textSecondary },
                }}
              />

              <TextField
                label="Time Limit (minutes, optional)"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value === '' ? '' : Number(e.target.value))}
                sx={{
                  '& .MuiOutlinedInput-root': { color: colors.textPrimary },
                  '& .MuiInputLabel-root': { color: colors.textSecondary },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: colors.cardBorder }} />

            {/* Questions */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                  Questions ({questions.length}/20)
                  {questions.length < 15 && (
                    <Typography component="span" sx={{ color: '#EF4444', fontSize: '0.85rem', ml: 1 }}>
                      (Minimum 15 required)
                    </Typography>
                  )}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuestion}
                  disabled={questions.length >= 20}
                  sx={{
                    backgroundColor: colors.accent,
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: `${colors.accent}dd` },
                    '&:disabled': { backgroundColor: colors.textMuted, opacity: 0.5 },
                  }}
                >
                  Add Question
                </Button>
              </Box>

              <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                {questions.map((q, qIdx) => (
                  <Card
                    key={qIdx}
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                        Question {qIdx + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <TextField
                      label="Question"
                      fullWidth
                      multiline
                      rows={2}
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': { color: colors.textPrimary },
                        '& .MuiInputLabel-root': { color: colors.textSecondary },
                      }}
                    />

                    <Typography sx={{ color: colors.textSecondary, fontSize: '0.85rem', mb: 1 }}>
                      Options:
                    </Typography>

                    {[0, 1, 2, 3].map((optIdx) => (
                      <Box key={optIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={String.fromCharCode(65 + optIdx)}
                          size="small"
                          sx={{
                            backgroundColor: q.correctAnswer === optIdx ? '#22C55E' : colors.textMuted,
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleQuestionChange(qIdx, 'correctAnswer', optIdx)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          value={q.options[optIdx]}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': { color: colors.textPrimary },
                          }}
                        />
                      </Box>
                    ))}

                    <Typography sx={{ color: colors.textSecondary, fontSize: '0.75rem', mt: 1, mb: 0.5 }}>
                      Click the letter to mark as correct answer
                    </Typography>

                    <TextField
                      label="Explanation (Optional)"
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      value={q.explanation}
                      onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                      sx={{
                        mt: 1,
                        '& .MuiOutlinedInput-root': { color: colors.textPrimary },
                        '& .MuiInputLabel-root': { color: colors.textSecondary },
                      }}
                    />
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={() => setAssessmentDialog(false)}
            sx={{ color: colors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAssessment}
            variant="contained"
            disabled={questions.length < 15 || questions.length > 20}
            sx={{
              backgroundColor: colors.accent,
              '&:hover': { backgroundColor: `${colors.accent}dd` },
              '&:disabled': { backgroundColor: colors.textMuted, opacity: 0.5 },
            }}
          >
            {selectedModuleForAssessment?.assessment ? 'Update' : 'Add'} Assessment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
