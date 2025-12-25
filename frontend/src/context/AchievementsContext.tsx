'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for different achievement categories
export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  instructor: string;
  completedAt: string;
  certificateNumber: string;
}

export interface ContestAchievement {
  id: string;
  title: string;
  description: string;
  contestName: string;
  rank: number;
  totalParticipants: number;
  earnedAt: string;
  icon: 'gold' | 'silver' | 'bronze' | 'participation';
}

export interface StreakAchievement {
  id: string;
  title: string;
  description: string;
  streakDays: number;
  earnedAt: string;
  icon: 'fire' | 'lightning' | 'star';
}

export interface CourseCompletionAchievement {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  earnedAt: string;
  certificateId: string;
}

export interface Achievement {
  id: string;
  type: 'contest' | 'course' | 'streak';
  data: ContestAchievement | StreakAchievement | CourseCompletionAchievement;
}

interface AchievementsContextType {
  achievements: Achievement[];
  certificates: Certificate[];
  addContestAchievement: (achievement: Omit<ContestAchievement, 'id' | 'earnedAt'>) => void;
  addStreakAchievement: (achievement: Omit<StreakAchievement, 'id' | 'earnedAt'>) => void;
  addCourseCompletion: (courseId: string, courseTitle: string, courseThumbnail: string, instructor: string) => Certificate;
  getCertificateById: (certificateId: string) => Certificate | undefined;
  getCertificateByCourseId: (courseId: string) => Certificate | undefined;
  isLoaded: boolean;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

// Storage keys
const ACHIEVEMENTS_KEY = 'achievements';
const CERTIFICATES_KEY = 'certificates';

// Generate unique certificate number
const generateCertificateNumber = (): string => {
  const prefix = 'CERT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Helper to read from localStorage
const readAchievementsFromStorage = (): Achievement[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    console.error('Failed to parse achievements from localStorage');
  }
  return [];
};

const readCertificatesFromStorage = (): Certificate[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CERTIFICATES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    console.error('Failed to parse certificates from localStorage');
  }
  return [];
};

// Helper to write to localStorage
const writeAchievementsToStorage = (achievements: Achievement[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
};

const writeCertificatesToStorage = (certificates: Certificate[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(certificates));
  }
};

// Sample achievements data for demo
const getInitialAchievements = (): Achievement[] => [
  {
    id: 'contest-1',
    type: 'contest',
    data: {
      id: 'contest-1',
      title: 'Weekly Challenge Winner',
      description: 'Ranked in top 10 in the weekly coding challenge',
      contestName: 'Week 48 Coding Challenge',
      rank: 7,
      totalParticipants: 234,
      earnedAt: '2024-12-01T10:00:00Z',
      icon: 'gold',
    } as ContestAchievement,
  },
  {
    id: 'streak-1',
    type: 'streak',
    data: {
      id: 'streak-1',
      title: '7 Day Streak',
      description: 'Practiced coding for 7 consecutive days',
      streakDays: 7,
      earnedAt: '2024-12-05T10:00:00Z',
      icon: 'fire',
    } as StreakAchievement,
  },
  {
    id: 'contest-2',
    type: 'contest',
    data: {
      id: 'contest-2',
      title: 'Algorithm Master',
      description: 'Solved all hard problems in the monthly contest',
      contestName: 'November Algorithm Contest',
      rank: 15,
      totalParticipants: 500,
      earnedAt: '2024-11-25T10:00:00Z',
      icon: 'silver',
    } as ContestAchievement,
  },
];

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      let storedAchievements = readAchievementsFromStorage();
      const storedCertificates = readCertificatesFromStorage();
      
      // Initialize with sample data if empty
      if (storedAchievements.length === 0) {
        storedAchievements = getInitialAchievements();
        writeAchievementsToStorage(storedAchievements);
      }
      
      setAchievements(storedAchievements);
      setCertificates(storedCertificates);
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      writeAchievementsToStorage(achievements);
    }
  }, [achievements, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      writeCertificatesToStorage(certificates);
    }
  }, [certificates, isLoaded]);

  const addContestAchievement = (achievement: Omit<ContestAchievement, 'id' | 'earnedAt'>) => {
    const id = `contest-${Date.now()}`;
    const newAchievement: Achievement = {
      id,
      type: 'contest',
      data: {
        ...achievement,
        id,
        earnedAt: new Date().toISOString(),
      } as ContestAchievement,
    };
    setAchievements(prev => [newAchievement, ...prev]);
  };

  const addStreakAchievement = (achievement: Omit<StreakAchievement, 'id' | 'earnedAt'>) => {
    const id = `streak-${Date.now()}`;
    const newAchievement: Achievement = {
      id,
      type: 'streak',
      data: {
        ...achievement,
        id,
        earnedAt: new Date().toISOString(),
      } as StreakAchievement,
    };
    setAchievements(prev => [newAchievement, ...prev]);
  };

  const addCourseCompletion = (
    courseId: string,
    courseTitle: string,
    courseThumbnail: string,
    instructor: string
  ): Certificate => {
    const certificateId = `cert-${Date.now()}`;
    const certificateNumber = generateCertificateNumber();
    const earnedAt = new Date().toISOString();

    // Create certificate
    const certificate: Certificate = {
      id: certificateId,
      courseId,
      courseTitle,
      courseThumbnail,
      instructor,
      completedAt: earnedAt,
      certificateNumber,
    };

    // Create course completion achievement
    const achievementId = `course-${Date.now()}`;
    const newAchievement: Achievement = {
      id: achievementId,
      type: 'course',
      data: {
        id: achievementId,
        title: 'Course Completed',
        description: `Successfully completed "${courseTitle}"`,
        courseId,
        courseTitle,
        courseThumbnail,
        earnedAt,
        certificateId,
      } as CourseCompletionAchievement,
    };

    setCertificates(prev => [certificate, ...prev]);
    setAchievements(prev => [newAchievement, ...prev]);

    return certificate;
  };

  const getCertificateById = (certificateId: string): Certificate | undefined => {
    return certificates.find(c => c.id === certificateId);
  };

  const getCertificateByCourseId = (courseId: string): Certificate | undefined => {
    return certificates.find(c => c.courseId === courseId);
  };

  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        certificates,
        addContestAchievement,
        addStreakAchievement,
        addCourseCompletion,
        getCertificateById,
        getCertificateByCourseId,
        isLoaded,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
}
