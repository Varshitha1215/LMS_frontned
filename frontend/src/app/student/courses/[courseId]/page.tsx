'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  Avatar,
  IconButton,
  Button,
  LinearProgress,
  Chip,
  Badge,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { useThemeMode } from '@/context/ThemeContext';
import { useEnrollment } from '@/context/EnrollmentContext';
import { useAchievements } from '@/context/AchievementsContext';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderIcon from '@mui/icons-material/Folder';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { DocumentViewer } from '@/components/DocumentViewer';
import AssessmentComponent, { Assessment } from '@/components/Assessment';
import InputAdornment from '@mui/material/InputAdornment';

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

// Types
interface Topic {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  completed: boolean;
  notes?: {
    fileName: string;
    fileType: 'pdf' | 'docx' | 'pptx';
    fileSize: string;
    uploadedDate: string;
    description: string;
  };
  video?: {
    url: string;
    duration: string;
    description: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  studentsEnrolled: number;
  modules: Module[];
  progress?: number;
}

// Mock Data - Same courses with added notes and videos
const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Complete Data Structures & Algorithms',
    description: 'Master DSA from basics to advanced with hands-on coding problems and real interview questions.',
    instructor: 'Dr. Sarah Johnson',
    thumbnail: '🎯',
    duration: '40 hours',
    level: 'Intermediate',
    rating: 4.8,
    studentsEnrolled: 15420,
    modules: [
      {
        id: 'module-1',
        title: 'Introduction to Data Structures',
        description: 'Learn the fundamentals of data structures and their importance',
        chapters: [
          {
            id: 'chapter-1-1',
            title: 'What are Data Structures?',
            topics: [
              {
                id: 'topic-1-1-1',
                title: 'Introduction to Data Structures',
                duration: '15 min',
                type: 'video',
                completed: false,
                notes: {
                  fileName: 'DS_Introduction.pdf',
                  fileType: 'pdf',
                  fileSize: '2.4 MB',
                  uploadedDate: 'Nov 15, 2024',
                  description: 'Complete introduction to data structures with diagrams and examples',
                },
                video: {
                  url: 'https://www.youtube.com/embed/bum_19loj9A',
                  duration: '15:45',
                  description: 'Learn the basics of data structures and why they are important in programming',
                },
              },
              {
                id: 'topic-1-1-2',
                title: 'Why Data Structures Matter',
                duration: '10 min',
                type: 'article',
                completed: false,
                notes: {
                  fileName: 'Why_DS_Matter.docx',
                  fileType: 'docx',
                  fileSize: '1.2 MB',
                  uploadedDate: 'Nov 15, 2024',
                  description: 'Detailed article explaining the importance of data structures in competitive programming and interviews',
                },
              },
              {
                id: 'topic-1-1-3',
                title: 'Types of Data Structures',
                duration: '20 min',
                type: 'video',
                completed: false,
                notes: {
                  fileName: 'DS_Types_Overview.pptx',
                  fileType: 'pptx',
                  fileSize: '3.8 MB',
                  uploadedDate: 'Nov 16, 2024',
                  description: 'Comprehensive presentation covering all types of data structures',
                },
                video: {
                  url: 'https://www.youtube.com/embed/bum_19loj9A',
                  duration: '22:15',
                  description: 'Overview of different data structures like arrays, linked lists, trees, graphs, etc.',
                },
              },
            ],
          },
          {
            id: 'chapter-1-2',
            title: 'Complexity Analysis',
            topics: [
              {
                id: 'topic-1-2-1',
                title: 'Time Complexity Basics',
                duration: '25 min',
                type: 'video',
                completed: false,
                notes: {
                  fileName: 'Time_Complexity_Guide.pdf',
                  fileType: 'pdf',
                  fileSize: '2.1 MB',
                  uploadedDate: 'Nov 17, 2024',
                  description: 'Complete guide to understanding time complexity with examples',
                },
                video: {
                  url: 'https://www.youtube.com/embed/bum_19loj9A',
                  duration: '28:30',
                  description: 'Master the concept of time complexity and Big O notation',
                },
              },
              {
                id: 'topic-1-2-2',
                title: 'Space Complexity',
                duration: '15 min',
                type: 'video',
                completed: false,
                notes: {
                  fileName: 'Space_Complexity.docx',
                  fileType: 'docx',
                  fileSize: '0.9 MB',
                  uploadedDate: 'Nov 17, 2024',
                  description: 'Understanding space complexity and memory usage',
                },
                video: {
                  url: 'https://www.youtube.com/embed/bum_19loj9A',
                  duration: '18:45',
                  description: 'Learn about space complexity and how to optimize memory usage',
                },
              },
              {
                id: 'topic-1-2-3',
                title: 'Big O Notation Quiz',
                duration: '10 min',
                type: 'quiz',
                completed: false,
                notes: {
                  fileName: 'Big_O_Quiz_Solutions.pdf',
                  fileType: 'pdf',
                  fileSize: '1.5 MB',
                  uploadedDate: 'Nov 18, 2024',
                  description: 'Quiz questions and solutions for Big O notation',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];

  // Initialize all modules as expanded by default
  const initialExpandedModules = course.modules.map((m) => m.id);
  const initialExpandedChapters = course.modules.flatMap((m) => m.chapters.map((c) => c.id));

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(initialExpandedModules);
  const [expandedChapters, setExpandedChapters] = useState<string[]>(initialExpandedChapters);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [fullscreenVideo, setFullscreenVideo] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentModuleAssessment, setCurrentModuleAssessment] = useState<Assessment | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [showCertificateSnackbar, setShowCertificateSnackbar] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState<string | null>(null);

  const { mode, themeColors } = useThemeMode();
  const { updateCourseProgress } = useEnrollment();
  const { addCourseCompletion, getCertificateByCourseId } = useAchievements();
  const isDark = mode === 'dark';

  if (!course) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: isDark ? '#0a0e27' : '#f5f7fa' }}>
        <Box sx={{ textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 60, color: '#999', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666' }}>Course not found</Typography>
          <Button onClick={() => router.push('/student/courses')} sx={{ mt: 2 }}>Back to Courses</Button>
        </Box>
      </Box>
    );
  }

  // Theme-based colors
  const colors = {
    pageBg: isDark ? themeColors.backgroundDark : themeColors.backgroundLight,
    sidebarBg: isDark ? themeColors.primaryDark : themeColors.primary,
    sidebarBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.2)',
    headerBg: isDark ? themeColors.primaryDark : themeColors.primary,
    cardBg: isDark ? themeColors.paperDark : themeColors.paperLight,
    cardBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.08)',
    textPrimary: isDark ? themeColors.textDark : themeColors.textLight,
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0, 0, 0, 0.6)',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.4)',
    accent: themeColors.accent,
    headerText: '#ffffff',
    headerTextSecondary: 'rgba(255,255,255,0.8)',
    headerTextMuted: 'rgba(255,255,255,0.6)',
    menuItemHover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.2)',
    menuItemActive: isDark ? `${themeColors.accent}35` : `${themeColors.accent}25`,
    logoGradient: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
  };

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleCompleteTopicClick = () => {
    if (selectedTopic && !completedTopics.includes(selectedTopic.id)) {
      setCompletedTopics([...completedTopics, selectedTopic.id]);
    }
  };

  const getTopicIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircleIcon sx={{ fontSize: 18, color: colors.accent }} />;
      case 'article': return <ArticleIcon sx={{ fontSize: 18, color: themeColors.secondary }} />;
      case 'quiz': return <QuizIcon sx={{ fontSize: 18, color: themeColors.secondaryLight }} />;
      default: return null;
    }
  };

  const createModuleAssessment = (moduleId: string): Assessment => {
    return {
      id: `assessment-${moduleId}`,
      moduleId,
      title: `Module Assessment - ${course.modules.find(m => m.id === moduleId)?.title}`,
      description: 'Complete this assessment to verify your understanding of the module concepts.',
      totalPoints: 100,
      passingScore: 60,
      timeLimit: 1800, // 30 minutes
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          title: 'What is the primary purpose of this module?',
          content: 'Select the most appropriate answer:',
          options: ['To teach basics', 'To teach advanced concepts', 'To teach intermediate concepts', 'None of the above'],
          correctAnswer: 'To teach basics',
          points: 10,
        },
        {
          id: 'q2',
          type: 'fill-blank',
          title: 'Fill in the blanks',
          content: 'A _____ is a collection of elements with similar properties. Arrays are commonly used for storing _____.',
          hints: ['data structure', 'collections', 'sequential data'],
          points: 15,
        },
        {
          id: 'q3',
          type: 'pseudo-output',
          title: 'Predict the output',
          content: 'What will be the output of the following pseudo code?',
          pseudoCode: `FOR i = 1 TO 5\n  PRINT i * 2\nEND FOR`,
          hint: 'Each iteration will print the double of i',
          points: 15,
        },
        {
          id: 'q4',
          type: 'jumbling',
          title: 'Arrange the code in correct order',
          content: 'Rearrange the following code lines to form a correct program:',
          code: [
            'DECLARE arr[10]',
            'FOR i = 0 TO 9',
            '  arr[i] = i',
            'END FOR',
            'PRINT arr[]',
          ],
          points: 15,
        },
        {
          id: 'q5',
          type: 'matching',
          title: 'Match the terms',
          content: 'Match each concept with its definition:',
          left: ['Array', 'Linked List', 'Stack', 'Queue'],
          right: [
            'LIFO data structure',
            'Sequential collection of elements',
            'Linear collection with pointers',
            'FIFO data structure',
          ],
          points: 15,
        },
        {
          id: 'q6',
          type: 'spot-error',
          title: 'Spot the error',
          content: 'Identify the line with an error:',
          code: [
            'arr[0] = 5',
            'arr[1] = 10',
            'arr[2] = arr[3]  // Error: arr[3] not initialized',
            'arr[3] = 20',
          ],
          errorLine: 2,
          explanation: 'arr[3] is being used before it is initialized on line 3',
          correction: 'arr[2] = 0 or move this line after arr[3] = 20',
          points: 15,
        },
        {
          id: 'q7',
          type: 'coding',
          title: 'Write a function to find sum of array',
          content: 'Write a JavaScript function that takes an array as input and returns the sum of all elements. Function should handle edge cases like empty arrays.',
          inputFormat: 'Array of numbers: [1, 2, 3, 4, 5]',
          outputFormat: 'Number: 15',
          constraints: 'Array length < 1000, numbers can be positive or negative',
          testCases: [
            { input: '[1,2,3,4,5]', output: '15' },
            { input: '[10,20,30]', output: '60' },
            { input: '[]', output: '0' },
          ],
          points: 10,
        },
      ],
    };
  };

  const calculateCourseProgress = () => {
    const allTopics: Topic[] = [];
    course.modules.forEach(m => {
      m.chapters.forEach(c => {
        allTopics.push(...c.topics);
      });
    });
    return Math.round((completedTopics.length / allTopics.length) * 100);
  };

  const calculateModuleProgress = (moduleId: string) => {
    const courseModule = course.modules.find(m => m.id === moduleId);
    if (!courseModule) return 0;
    const allTopics: Topic[] = [];
    courseModule.chapters.forEach(c => {
      allTopics.push(...c.topics);
    });
    const completedInModule = allTopics.filter(t => completedTopics.includes(t.id)).length;
    return Math.round((completedInModule / allTopics.length) * 100);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.pageBg }}>
      {/* ==================== LEFT SIDEBAR ==================== */}
      <Box sx={{
        width: 320,
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100,
        overflowY: 'auto',
        transition: 'all 0.3s ease',
      }}>
        {/* Back Button & Course Info */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.sidebarBorder}` }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/student/courses')}
            sx={{
              color: colors.headerText,
              fontWeight: 500,
              textTransform: 'none',
              mb: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Back to Courses
          </Button>

          <Box sx={{
            p: 1.5,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            border: `1px solid rgba(255,255,255,0.15)`,
          }}>
            <Typography variant="body2" sx={{ color: colors.headerText, fontWeight: 600, mb: 1 }}>
              {course.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ color: colors.headerTextMuted }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 600 }}>
                {calculateCourseProgress()}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateCourseProgress()}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: colors.accent,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>

        {/* Course Structure */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          {course.modules.map((module) => (
            <Box key={module.id} sx={{ mb: 1.5 }}>
              {/* Module */}
              <Box
                onClick={() => toggleModuleExpand(module.id)}
                sx={{
                  p: 1.5,
                  backgroundColor: expandedModules.includes(module.id) ? `${colors.accent}20` : 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `1px solid ${colors.sidebarBorder}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: `${colors.accent}25`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.85rem' }}>
                    {module.title}
                  </Typography>
                  <ChevronRightIcon
                    sx={{
                      fontSize: 18,
                      color: colors.headerTextSecondary,
                      transform: expandedModules.includes(module.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: colors.headerTextMuted, fontSize: '0.7rem' }}>
                    {module.chapters.reduce((acc, c) => acc + c.topics.length, 0)} Topics
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 600, fontSize: '0.7rem' }}>
                    {calculateModuleProgress(module.id)}%
                  </Typography>
                </Box>
              </Box>

              {/* Chapters */}
              <Collapse in={expandedModules.includes(module.id)} timeout={300}>
                <Box sx={{ pl: 1, mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {module.chapters.map((chapter) => (
                    <Box key={chapter.id}>
                      {/* Chapter */}
                      <Box
                        onClick={() => toggleChapterExpand(chapter.id)}
                        sx={{
                          p: 1.2,
                          backgroundColor: expandedChapters.includes(chapter.id) ? 'rgba(255,255,255,0.08)' : 'transparent',
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          border: `1px solid ${colors.sidebarBorder}`,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                          },
                        }}
                      >
                        <FolderIcon sx={{ fontSize: 16, color: colors.accent, flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" sx={{ color: colors.headerTextSecondary, fontWeight: 500, fontSize: '0.75rem', display: 'block' }}>
                            {chapter.title}
                          </Typography>
                        </Box>
                        <ChevronRightIcon
                          sx={{
                            fontSize: 16,
                            color: colors.headerTextMuted,
                            transform: expandedChapters.includes(chapter.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                            flexShrink: 0,
                          }}
                        />
                      </Box>

                      {/* Topics */}
                      <Collapse in={expandedChapters.includes(chapter.id)} timeout={200}>
                        <Box sx={{ pl: 1, mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                          {chapter.topics.map((topic) => (
                            <Box
                              key={topic.id}
                              onClick={() => handleSelectTopic(topic)}
                              sx={{
                                p: 1,
                                backgroundColor: selectedTopic?.id === topic.id ? `${colors.accent}30` : completedTopics.includes(topic.id) ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                                borderRadius: 1,
                                cursor: 'pointer',
                                border: selectedTopic?.id === topic.id ? `1.5px solid ${colors.accent}` : `1px solid ${colors.sidebarBorder}`,
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.8,
                                '&:hover': {
                                  backgroundColor: `${colors.accent}20`,
                                  borderColor: colors.accent,
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 'fit-content' }}>
                                {completedTopics.includes(topic.id) ? (
                                  <CheckCircleIcon sx={{ fontSize: 16, color: '#22C55E' }} />
                                ) : (
                                  getTopicIcon(topic.type)
                                )}
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="caption" sx={{
                                  color: completedTopics.includes(topic.id) ? colors.accent : colors.headerTextSecondary,
                                  fontWeight: selectedTopic?.id === topic.id ? 600 : 500,
                                  fontSize: '0.7rem',
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {topic.title}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  ))}
                </Box>
              </Collapse>

              {/* Module Assessment Button */}
              <Box sx={{ mt: 1, pl: 1 }}>
                <Tooltip 
                  title={calculateModuleProgress(module.id) < 100 ? `Complete all topics to unlock assessment (${calculateModuleProgress(module.id)}% completed)` : 'Take the module assessment'}
                  arrow
                >
                  <Box sx={{ display: 'block' }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={calculateModuleProgress(module.id) < 100}
                      onClick={() => {
                        if (calculateModuleProgress(module.id) === 100) {
                          const assessment = createModuleAssessment(module.id);
                          setCurrentModuleAssessment(assessment);
                          setShowAssessment(true);
                        }
                      }}
                      sx={{
                        borderColor: calculateModuleProgress(module.id) === 100 ? colors.accent : colors.textMuted,
                        color: calculateModuleProgress(module.id) === 100 ? colors.accent : colors.textMuted,
                        fontSize: '0.75rem',
                        py: 0.5,
                        opacity: calculateModuleProgress(module.id) === 100 ? 1 : 0.6,
                        '&:hover': {
                          backgroundColor: calculateModuleProgress(module.id) === 100 ? `${colors.accent}15` : 'transparent',
                          borderColor: calculateModuleProgress(module.id) === 100 ? colors.accent : colors.textMuted,
                        },
                        '&.Mui-disabled': {
                          borderColor: colors.textMuted,
                          color: colors.textMuted,
                        },
                      }}
                    >
                      {calculateModuleProgress(module.id) === 100 ? '📝 Take Assessment' : `🔒 Complete Module (${calculateModuleProgress(module.id)}%)`}
                    </Button>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>

        {/* User Profile */}
        <Box sx={{ p: 2, borderTop: `1px solid ${colors.sidebarBorder}` }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { backgroundColor: colors.menuItemHover },
            }}
          >
            <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${colors.accent} 0%, ${themeColors.primaryLight} 100%)`, fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
              JS
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.headerText, fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2 }}>John</Typography>
              <Typography sx={{ color: colors.headerTextMuted, fontSize: '0.65rem' }}>Student</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ==================== MAIN CONTENT ==================== */}
      <Box sx={{ flex: 1, ml: '320px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <Box sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: colors.headerBg,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.sidebarBorder}`,
          px: 4,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}>
          <TextField
            placeholder="Search in course..."
            size="small"
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                color: colors.headerText,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              },
              '& .MuiOutlinedInput-input': { '&::placeholder': { color: colors.headerTextMuted } },
            }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.headerTextMuted }} /></InputAdornment> }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeSwitcher />
            <IconButton sx={{ color: colors.headerTextSecondary }}>
              <Badge badgeContent={2} sx={{ '& .MuiBadge-badge': { backgroundColor: colors.accent } }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Content Area - Scrollable */}
        <Box sx={{ flex: 1, p: 4, overflowY: 'auto', animation: `${fadeInUp} 0.5s ease-out` }}>
          {selectedTopic ? (
            <Box>
              {/* Topic Header */}
              <Card sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                mb: 4,
                overflow: 'hidden',
              }}>
                <Box sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${themeColors.primary}25 0%, ${colors.accent}15 100%)`,
                  borderBottom: `1px solid ${colors.cardBorder}`,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 1 }}>
                        {selectedTopic.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={selectedTopic.type.charAt(0).toUpperCase() + selectedTopic.type.slice(1)}
                          size="small"
                          sx={{
                            backgroundColor: `${colors.accent}25`,
                            color: colors.accent,
                            fontWeight: 600,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: colors.textMuted, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 16 }} /> {selectedTopic.duration}
                        </Typography>
                      </Box>
                    </Box>
                    {completedTopics.includes(selectedTopic.id) && (
                      <Chip
                        label="Completed"
                        icon={<CheckCircleIcon />}
                        sx={{
                          backgroundColor: '#22C55E25',
                          color: '#22C55E',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Card>

              {/* Notes Section */}
              {selectedTopic.notes && (
                <DocumentViewer
                  fileName={selectedTopic.notes.fileName}
                  fileType={selectedTopic.notes.fileType}
                  fileSize={selectedTopic.notes.fileSize}
                  uploadedDate={selectedTopic.notes.uploadedDate}
                  description={selectedTopic.notes.description}
                  colors={colors}
                  isDark={isDark}
                />
              )}

              {/* Video Section */}
              {selectedTopic.video && (
                <Card sx={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  mt: 3,
                }}>
                  <Box sx={{
                    position: 'relative',
                    paddingBottom: fullscreenVideo ? '0' : '56.25%',
                    height: fullscreenVideo ? '100vh' : 'auto',
                    backgroundColor: '#000',
                  }}>
                    <Box
                      component="iframe"
                      width="100%"
                      height={fullscreenVideo ? '100%' : '100%'}
                      src={selectedTopic.video.url}
                      title={selectedTopic.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      sx={{
                        position: fullscreenVideo ? 'fixed' : 'absolute',
                        top: 0,
                        left: 0,
                        borderRadius: fullscreenVideo ? '0' : '12px 12px 0 0',
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 3, borderTop: fullscreenVideo ? 'none' : `1px solid ${colors.cardBorder}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
                          Video Tutorial
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textMuted }}>
                          Duration: {selectedTopic.video.duration}
                        </Typography>
                      </Box>
                      <Tooltip title={fullscreenVideo ? 'Exit Fullscreen' : 'Fullscreen'}>
                        <IconButton
                          onClick={() => setFullscreenVideo(!fullscreenVideo)}
                          sx={{ color: colors.accent }}
                        >
                          {fullscreenVideo ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      {selectedTopic.video.description}
                    </Typography>
                  </Box>
                </Card>
              )}

              {/* Resources Section */}
              <Card sx={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 3,
                mt: 3,
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 2 }}>
                    Resources & Practice
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontWeight: 500,
                        py: 1.5,
                        '&:hover': { backgroundColor: `${colors.accent}10` },
                      }}
                    >
                      📝 Download Notes
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontWeight: 500,
                        py: 1.5,
                        '&:hover': { backgroundColor: `${colors.accent}10` },
                      }}
                    >
                      🔗 External Resources
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontWeight: 500,
                        py: 1.5,
                        '&:hover': { backgroundColor: `${colors.accent}10` },
                      }}
                    >
                      💬 Q&A Forum
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Box>
          ) : (
            <Card sx={{
              p: 8,
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: 3,
              textAlign: 'center',
            }}>
              <PlayCircleIcon sx={{ fontSize: 80, color: colors.textMuted, mb: 2 }} />
              <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                Select a topic to get started
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textMuted }}>
                Choose any topic from the left sidebar to view notes, videos, and resources
              </Typography>
            </Card>
          )}
        </Box>

        {/* Sticky Bottom - Mark Complete Button */}
        {selectedTopic && (
          <Box sx={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: colors.headerBg,
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${colors.sidebarBorder}`,
            p: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            zIndex: 40,
          }}>
            {!completedTopics.includes(selectedTopic.id) && (
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={handleCompleteTopicClick}
                size="large"
                sx={{
                  background: `linear-gradient(135deg, #22C55E 0%, #16A34A 100%)`,
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: `0 4px 20px rgba(34, 197, 94, 0.3)`,
                  '&:hover': {
                    boxShadow: `0 6px 24px rgba(34, 197, 94, 0.4)`,
                  },
                }}
              >
                Mark Complete
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Assessment Dialog */}
      <Dialog
        open={showAssessment}
        onClose={() => setShowAssessment(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.cardBg,
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 700, fontSize: '1.3rem', pb: 1 }}>
          Module Assessment
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {currentModuleAssessment && (
            <AssessmentComponent
              assessment={currentModuleAssessment}
              onComplete={() => {
                // Mark module as completed
                if (currentModuleAssessment) {
                  const newCompletedModules = [...completedModules, currentModuleAssessment.moduleId];
                  setCompletedModules(newCompletedModules);
                  
                  // Check if all modules are completed (100% course completion)
                  const totalModules = course.modules.length;
                  if (newCompletedModules.length === totalModules) {
                    // Check if certificate doesn't already exist for this course
                    const existingCert = getCertificateByCourseId(course.id);
                    if (!existingCert) {
                      // Generate certificate
                      const certificate = addCourseCompletion(
                        course.id,
                        course.title,
                        course.thumbnail,
                        course.instructor
                      );
                      
                      // Update progress to 100%
                      updateCourseProgress(course.id, 100, totalModules);
                      
                      // Show success snackbar
                      setCertificateNumber(certificate.certificateNumber);
                      setShowCertificateSnackbar(true);
                    }
                  } else {
                    // Update progress based on completed modules
                    const progress = Math.round((newCompletedModules.length / totalModules) * 100);
                    updateCourseProgress(course.id, progress, newCompletedModules.length);
                  }
                }
                setShowAssessment(false);
              }}
              onCancel={() => setShowAssessment(false)}
              colors={colors}
              isDark={isDark}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate Success Snackbar */}
      <Snackbar
        open={showCertificateSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowCertificateSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowCertificateSnackbar(false)}
          severity="success"
          variant="filled"
          icon={<WorkspacePremiumIcon />}
          sx={{
            width: '100%',
            fontSize: '1rem',
            alignItems: 'center',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          🎉 Congratulations! Course completed! Your certificate (#{certificateNumber}) has been added to your achievements.
        </Alert>
      </Snackbar>
    </Box>
  );
}
