'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useUserManagement } from '@/context/UserManagementContext';

// UI-friendly course data structure (for backwards compatibility with UI components)
export interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  totalModules: number;
  completedModules: number;
  lastAccessed: string;
  enrolledAt: string;
}

interface EnrollmentContextType {
  enrolledCourses: EnrolledCourse[];
  enrolledCourseIds: string[];
  enrollCourse: (courseId: string) => Promise<void>;
  unenrollCourse: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  updateCourseProgress: (courseId: string, progress: number, completedModules: number) => void;
  updateLastAccessed: (courseId: string) => void;
  refreshEnrollments: () => Promise<void>;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUserManagement();
  const isAuthenticated = currentUser !== null;
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrolledCourseIds = enrolledCourses.map(c => c.id);

  // Fetch enrolled courses from backend (or localStorage for now)
  const refreshEnrollments = useCallback(async () => {
    if (!isAuthenticated) {
      setEnrolledCourses([]);
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when coursesApi is implemented
      // const enrollments = await coursesApi.getMyCourses();
      
      // For now, use localStorage or empty array
      const storedEnrollments = localStorage.getItem(`enrollments_${currentUser?.id}`);
      if (storedEnrollments) {
        setEnrolledCourses(JSON.parse(storedEnrollments));
      } else {
        setEnrolledCourses([]);
      }
      setIsLoaded(true);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to fetch enrollments:', err);
      setError(error.message || 'Failed to load enrolled courses');
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  // Fetch enrollments when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshEnrollments();
    } else {
      setEnrolledCourses([]);
      setIsLoaded(true);
    }
  }, [isAuthenticated, refreshEnrollments]);

  const enrollCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      setError('Please log in to enroll in courses');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when coursesApi is implemented
      // await coursesApi.enroll(courseId);
      
      // For now, add to localStorage
      const newCourse: EnrolledCourse = {
        id: courseId,
        title: 'Course ' + courseId,
        instructor: 'Instructor',
        thumbnail: '📚',
        level: 'Beginner',
        progress: 0,
        totalModules: 10,
        completedModules: 0,
        lastAccessed: 'Never',
        enrolledAt: new Date().toISOString(),
      };
      
      const updated = [...enrolledCourses, newCourse];
      setEnrolledCourses(updated);
      if (currentUser) {
        localStorage.setItem(`enrollments_${currentUser.id}`, JSON.stringify(updated));
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to enroll:', err);
      setError(error.message || 'Failed to enroll in course');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unenrollCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      setError('Please log in to manage enrollments');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when coursesApi is implemented
      // await coursesApi.unenroll(courseId);
      
      // Remove from local state
      const updated = enrolledCourses.filter(c => c.id !== courseId);
      setEnrolledCourses(updated);
      if (currentUser) {
        localStorage.setItem(`enrollments_${currentUser.id}`, JSON.stringify(updated));
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to unenroll:', err);
      setError(error.message || 'Failed to unenroll from course');
      await refreshEnrollments();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourseIds.includes(courseId);
  };

  const updateCourseProgress = (courseId: string, progress: number, completedModules: number) => {
    const updated = enrolledCourses.map(c =>
      c.id === courseId
        ? { ...c, progress, completedModules, lastAccessed: 'Just now' }
        : c
    );
    setEnrolledCourses(updated);
    if (currentUser) {
      localStorage.setItem(`enrollments_${currentUser.id}`, JSON.stringify(updated));
    }
    // TODO: Sync progress to backend
  };

  const updateLastAccessed = (courseId: string) => {
    const updated = enrolledCourses.map(c =>
      c.id === courseId
        ? { ...c, lastAccessed: 'Just now' }
        : c
    );
    setEnrolledCourses(updated);
    if (currentUser) {
      localStorage.setItem(`enrollments_${currentUser.id}`, JSON.stringify(updated));
    }
    // TODO: Sync to backend
  };

  return (
    <EnrollmentContext.Provider
      value={{
        enrolledCourses,
        enrolledCourseIds,
        enrollCourse,
        unenrollCourse,
        isEnrolled,
        updateCourseProgress,
        updateLastAccessed,
        refreshEnrollments,
        isLoading,
        isLoaded,
        error,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext);
  if (context === undefined) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
}
