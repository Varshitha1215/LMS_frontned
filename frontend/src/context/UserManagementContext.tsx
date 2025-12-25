'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Backend API disabled - using localStorage only

// Types
export interface CourseTopic {
  id: string;
  name: string;
  pdfUrl?: string;
  pdfName?: string;
  uploadedAt?: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[]; // 4 options
  correctAnswer: number; // index of correct option (0-3)
  explanation?: string; // Optional explanation for the answer
}

export interface ModuleAssessment {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  passingScore: number; // percentage (e.g., 70 for 70%)
  questions: AssessmentQuestion[];
  timeLimit?: number; // in minutes, optional
}

export interface CourseModule {
  id: string;
  name: string;
  topics: CourseTopic[];
  assessment?: ModuleAssessment; // Optional assessment for this module
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  modules: CourseModule[];
  createdBy: string; // SuperAdmin ID
  createdAt: string;
  institute?: string; // Optional: If course is specific to an institute
  selectedByOrgAdmins?: string[]; // OrgAdmin IDs who selected this course
  selectedByAdmins?: string[]; // Admin IDs who selected this course
}

export interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin' | 'superadmin' | 'orgadmin';
  institute: string;
  department: string;
  studentId?: string;
  adminId?: string;
  password?: string; // Optional for security
  registeredAt: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  assignedAdminIds?: string[]; // IDs of admins who can access this student's data
  assignedStudentIds?: string[]; // IDs of students this admin can access
  selectedCourseIds?: string[]; // Course IDs selected by OrgAdmin or Admin
}

interface UserManagementContextType {
  users: RegisteredUser[];
  pendingStudents: RegisteredUser[];
  verifiedStudents: RegisteredUser[];
  pendingAdmins: RegisteredUser[];
  verifiedAdmins: RegisteredUser[];
  pendingOrgAdmins: RegisteredUser[];
  verifiedOrgAdmins: RegisteredUser[];
  currentUser: RegisteredUser | null;
  setCurrentUser: (user: RegisteredUser | null) => void;
  // Student management (for OrgAdmin) - OrgAdmin verifies students of their institute
  getPendingStudentsByInstitute: (institute: string) => RegisteredUser[];
  getVerifiedStudentsByInstitute: (institute: string) => RegisteredUser[];
  verifyStudent: (studentId: string, verifiedBy: string) => Promise<void>;
  rejectStudent: (studentId: string) => Promise<void>;
  // Admin management (for OrgAdmin) - OrgAdmin verifies admins of their institute
  getPendingAdminsByInstitute: (institute: string) => RegisteredUser[];
  getVerifiedAdminsByInstitute: (institute: string) => RegisteredUser[];
  getAllPendingAdmins: () => RegisteredUser[];
  getAllVerifiedAdmins: () => RegisteredUser[];
  verifyAdmin: (adminId: string, verifiedBy: string) => Promise<void>;
  rejectAdmin: (adminId: string) => Promise<void>;
  // OrgAdmin management (for SuperAdmin only) - SuperAdmin verifies OrgAdmins
  getAllPendingOrgAdmins: () => RegisteredUser[];
  getAllVerifiedOrgAdmins: () => RegisteredUser[];
  getUniqueInstitutes: () => string[];
  // Admin-Student Mapping
  assignAdminToStudent: (studentId: string, adminId: string) => void;
  removeAdminFromStudent: (studentId: string, adminId: string) => void;
  getStudentsForAdmin: (adminId: string) => RegisteredUser[];
  getAdminsForStudent: (studentId: string) => RegisteredUser[];
  // Course Management
  courses: Course[];
  createCourse: (course: Omit<Course, 'id' | 'createdAt'>) => Course;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  getCourseById: (courseId: string) => Course | undefined;
  getAllCourses: () => Course[];
  getCoursesForOrgAdmin: () => Course[];
  getCoursesForAdmin: (adminId: string, orgAdminId: string) => Course[];
  getCoursesForStudent: (studentId: string) => Course[];
  selectCourseByOrgAdmin: (courseId: string, orgAdminId: string) => void;
  deselectCourseByOrgAdmin: (courseId: string, orgAdminId: string) => void;
  selectCourseByAdmin: (courseId: string, adminId: string) => void;
  deselectCourseByAdmin: (courseId: string, adminId: string) => void;
  // Assessment Management
  addModuleAssessment: (courseId: string, moduleId: string, assessment: Omit<ModuleAssessment, 'id' | 'moduleId'>) => void;
  updateModuleAssessment: (courseId: string, moduleId: string, assessment: ModuleAssessment) => void;
  deleteModuleAssessment: (courseId: string, moduleId: string) => void;
  getModuleAssessment: (courseId: string, moduleId: string) => ModuleAssessment | undefined;
  // Common functions
  registerUser: (user: Omit<RegisteredUser, 'id' | 'registeredAt' | 'isVerified'>) => Promise<RegisteredUser>;
  getUserByEmail: (email: string) => RegisteredUser | undefined;
  validateLogin: (email: string, password: string) => Promise<{ success: boolean; user?: RegisteredUser; error?: string }>;
  isLoaded: boolean;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

// Storage keys
const USERS_STORAGE_KEY = 'registeredUsers';
const CURRENT_USER_STORAGE_KEY = 'currentUser';
const COURSES_STORAGE_KEY = 'courses';

// Helper to generate unique ID
const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Helper to generate course ID
const generateCourseId = (): string => {
  return `course-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Helper to read current user from localStorage
const readCurrentUserFromStorage = (): RegisteredUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    console.error('Failed to parse current user from localStorage');
  }
  return null;
};

// Helper to write current user to localStorage
const writeCurrentUserToStorage = (user: RegisteredUser | null) => {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }
};

// Helper to read from localStorage
const readUsersFromStorage = (): RegisteredUser[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    console.error('Failed to parse users from localStorage');
  }
  return [];
};

// Helper to write to localStorage
const writeUsersToStorage = (users: RegisteredUser[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
};

// Helper to read courses from localStorage
const readCoursesFromStorage = (): Course[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(COURSES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    console.error('Failed to parse courses from localStorage');
  }
  return [];
};

// Helper to write courses to localStorage
const writeCoursesToStorage = (courses: Course[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }
};

// Initial users - ONLY Super Admin has default credentials
// All other users (OrgAdmins, Admins, Students) must register through the registration flow
// OrgAdmins and Admins require Super Admin approval before they can access their accounts
const initialMockUsers: RegisteredUser[] = [
  // Only Super Admin is pre-configured - This is the system administrator
  {
    id: 'user-superadmin-001',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@gmail.com',
    role: 'superadmin',
    institute: 'System',
    department: 'Administration',
    password: 'Superadmin@123',
    registeredAt: '2024-01-01T00:00:00.000Z',
    isVerified: true,
    verifiedAt: '2024-01-01T00:00:00.000Z',
  },
  // No other default users - All must register and go through approval workflow
];

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [currentUser, setCurrentUserState] = useState<RegisteredUser | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set current user and persist to localStorage
  const setCurrentUser = (user: RegisteredUser | null) => {
    setCurrentUserState(user);
    writeCurrentUserToStorage(user);
  };

  // Load users from localStorage on mount (Backend disabled)
  useEffect(() => {
    const frameId = requestAnimationFrame(async () => {
      // Load from localStorage only (Backend disabled)
      const storedUsers = readUsersFromStorage();
      if (storedUsers.length === 0) {
        // Initialize with mock users if empty
        setUsers(initialMockUsers);
        writeUsersToStorage(initialMockUsers);
      } else {
        // Ensure superadmin always exists
        const hasSuperAdmin = storedUsers.some(u => u.role === 'superadmin');
        if (!hasSuperAdmin) {
          const updatedUsers = [...storedUsers, initialMockUsers[0]];
          setUsers(updatedUsers);
          writeUsersToStorage(updatedUsers);
        } else {
          setUsers(storedUsers);
        }
      }
      
      // Load courses
      const storedCourses = readCoursesFromStorage();
      setCourses(storedCourses);
      
      // Load current user
      const storedCurrentUser = readCurrentUserFromStorage();
      if (storedCurrentUser) {
        setCurrentUserState(storedCurrentUser);
      }
      
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Save to localStorage whenever users change
  useEffect(() => {
    if (isLoaded) {
      writeUsersToStorage(users);
    }
  }, [users, isLoaded]);

  // Save to localStorage whenever courses change
  // This ensures ALL course updates (create, update, delete) from SuperAdmin
  // automatically propagate to all dashboards (OrgAdmin, Admin, Student)
  // in real-time through shared state and localStorage synchronization
  useEffect(() => {
    if (isLoaded) {
      writeCoursesToStorage(courses);
      console.log('💾 Courses auto-saved to localStorage:', courses.length, 'courses');
    }
  }, [courses, isLoaded]);

  // Listen for localStorage changes from other tabs/windows
  // This ensures real-time synchronization across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COURSES_STORAGE_KEY && e.newValue) {
        try {
          const updatedCourses = JSON.parse(e.newValue);
          setCourses(updatedCourses);
          console.log('🔄 Courses updated from another tab:', updatedCourses.length, 'courses');
        } catch (error) {
          console.error('Error parsing courses from storage event:', error);
        }
      } else if (e.key === USERS_STORAGE_KEY && e.newValue) {
        try {
          const updatedUsers = JSON.parse(e.newValue);
          setUsers(updatedUsers);
          console.log('🔄 Users updated from another tab:', updatedUsers.length, 'users');
        } catch (error) {
          console.error('Error parsing users from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ==================== STUDENT MANAGEMENT (for OrgAdmin) ====================
  
  // Get pending students (unverified students)
  const pendingStudents = users.filter(u => u.role === 'student' && !u.isVerified);
  
  // Get verified students
  const verifiedStudents = users.filter(u => u.role === 'student' && u.isVerified);

  // Get pending students by institute (for OrgAdmin filtering)
  const getPendingStudentsByInstitute = (institute: string): RegisteredUser[] => {
    return users.filter(u => 
      u.role === 'student' && 
      !u.isVerified && 
      u.institute.toLowerCase() === institute.toLowerCase()
    );
  };

  // Get verified students by institute (for OrgAdmin filtering)
  const getVerifiedStudentsByInstitute = (institute: string): RegisteredUser[] => {
    return users.filter(u => 
      u.role === 'student' && 
      u.isVerified && 
      u.institute.toLowerCase() === institute.toLowerCase()
    );
  };

  // Verify a student (by OrgAdmin) - localStorage only
  const verifyStudent = async (studentId: string, verifiedBy: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === studentId
          ? { ...u, isVerified: true, verifiedAt: new Date().toISOString(), verifiedBy }
          : u
      )
    );
  };

  // Reject a student (remove from system) - localStorage only
  const rejectStudent = async (studentId: string) => {
    setUsers(prev => prev.filter(u => u.id !== studentId));
  };

  // ==================== ADMIN/ORGADMIN MANAGEMENT (for SuperAdmin) ====================

  // Get pending admins
  const pendingAdmins = users.filter(u => u.role === 'admin' && !u.isVerified);
  
  // Get verified admins
  const verifiedAdmins = users.filter(u => u.role === 'admin' && u.isVerified);

  // Get pending org admins
  const pendingOrgAdmins = users.filter(u => u.role === 'orgadmin' && !u.isVerified);
  
  // Get verified org admins
  const verifiedOrgAdmins = users.filter(u => u.role === 'orgadmin' && u.isVerified);

  // Get pending admins by institute
  const getPendingAdminsByInstitute = (institute: string): RegisteredUser[] => {
    return users.filter(u => 
      u.role === 'admin' && 
      !u.isVerified && 
      u.institute.toLowerCase() === institute.toLowerCase()
    );
  };

  // Get verified admins by institute
  const getVerifiedAdminsByInstitute = (institute: string): RegisteredUser[] => {
    return users.filter(u => 
      u.role === 'admin' && 
      u.isVerified && 
      u.institute.toLowerCase() === institute.toLowerCase()
    );
  };

  // Get all pending admins (for SuperAdmin)
  const getAllPendingAdmins = (): RegisteredUser[] => {
    return users.filter(u => u.role === 'admin' && !u.isVerified);
  };

  // Get all verified admins (for SuperAdmin)
  const getAllVerifiedAdmins = (): RegisteredUser[] => {
    return users.filter(u => u.role === 'admin' && u.isVerified);
  };

  // Get all pending org admins (for SuperAdmin)
  const getAllPendingOrgAdmins = (): RegisteredUser[] => {
    return users.filter(u => u.role === 'orgadmin' && !u.isVerified);
  };

  // Get all verified org admins (for SuperAdmin)
  const getAllVerifiedOrgAdmins = (): RegisteredUser[] => {
    return users.filter(u => u.role === 'orgadmin' && u.isVerified);
  };

  // Get unique institutes from all users
  const getUniqueInstitutes = (): string[] => {
    const institutes = users
      .filter(u => u.institute && u.institute !== 'System')
      .map(u => u.institute);
    return [...new Set(institutes)].sort();
  };

  // Verify an admin or orgadmin (by SuperAdmin) - localStorage only
  const verifyAdmin = async (adminId: string, verifiedBy: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === adminId
          ? { ...u, isVerified: true, verifiedAt: new Date().toISOString(), verifiedBy }
          : u
      )
    );
  };

  // Reject an admin or orgadmin (remove from system) - localStorage only
  const rejectAdmin = async (adminId: string) => {
    setUsers(prev => prev.filter(u => u.id !== adminId));
  };

  // ==================== ADMIN-STUDENT MAPPING ====================

  // Assign an admin to a student (OrgAdmin function)
  const assignAdminToStudent = (studentId: string, adminId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === studentId) {
        const assignedAdminIds = user.assignedAdminIds || [];
        if (!assignedAdminIds.includes(adminId)) {
          return { ...user, assignedAdminIds: [...assignedAdminIds, adminId] };
        }
      }
      if (user.id === adminId) {
        const assignedStudentIds = user.assignedStudentIds || [];
        if (!assignedStudentIds.includes(studentId)) {
          return { ...user, assignedStudentIds: [...assignedStudentIds, studentId] };
        }
      }
      return user;
    }));
  };

  // Remove an admin from a student
  const removeAdminFromStudent = (studentId: string, adminId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === studentId) {
        const assignedAdminIds = user.assignedAdminIds || [];
        return { ...user, assignedAdminIds: assignedAdminIds.filter(id => id !== adminId) };
      }
      if (user.id === adminId) {
        const assignedStudentIds = user.assignedStudentIds || [];
        return { ...user, assignedStudentIds: assignedStudentIds.filter(id => id !== studentId) };
      }
      return user;
    }));
  };

  // Get all students assigned to an admin
  const getStudentsForAdmin = (adminId: string): RegisteredUser[] => {
    const admin = users.find(u => u.id === adminId);
    if (!admin || !admin.assignedStudentIds) return [];
    return users.filter(u => admin.assignedStudentIds?.includes(u.id));
  };

  // Get all admins assigned to a student
  const getAdminsForStudent = (studentId: string): RegisteredUser[] => {
    const student = users.find(u => u.id === studentId);
    if (!student || !student.assignedAdminIds) return [];
    return users.filter(u => student.assignedAdminIds?.includes(u.id));
  };

  // ==================== COMMON FUNCTIONS ====================

  // Register a new user (localStorage only - Backend disabled)
  const registerUser = async (userData: Omit<RegisteredUser, 'id' | 'registeredAt' | 'isVerified'>): Promise<RegisteredUser> => {
    // Using localStorage only (Backend disabled)
    const newUser: RegisteredUser = {
      ...userData,
      id: generateUserId(),
      registeredAt: new Date().toISOString(),
      isVerified: false,
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Get user by email
  const getUserByEmail = (email: string): RegisteredUser | undefined => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  // Validate login (localStorage only - Backend disabled)
  const validateLogin = async (email: string, password: string): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> => {
    // Using localStorage only (Backend disabled)
    const user = getUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'User not found. Please check your credentials and try again.' };
    }
    
    // Check if user has password stored
    if (!user.password) {
      return { success: false, error: 'Invalid credentials.' };
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }
    
    // Check if user is verified based on role
    if (!user.isVerified) {
      if (user.role === 'student') {
        return { 
          success: false, 
          error: 'Your account is pending verification. Please wait for the Organization Admin to verify your account.' 
        };
      } else if (user.role === 'orgadmin') {
        return { 
          success: false, 
          error: 'Your Organization Admin account is pending approval. Please wait for the Super Admin to approve your registration.' 
        };
      } else if (user.role === 'admin') {
        return { 
          success: false, 
          error: 'Your Admin account is pending approval. Please wait for your Organization Admin to approve your registration.' 
        };
      }
    }
    
    // Update current user
    setCurrentUser(user);
    return { success: true, user };
  };

  // ==================== COURSE MANAGEMENT ====================

  // Create a new course (SuperAdmin only)
  const createCourse = (course: Omit<Course, 'id' | 'createdAt'>): Course => {
    const newCourse: Course = {
      ...course,
      id: generateCourseId(),
      createdAt: new Date().toISOString(),
      selectedByOrgAdmins: course.selectedByOrgAdmins || [],
      selectedByAdmins: course.selectedByAdmins || [],
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  // Update a course
  // Update a course
  // When SuperAdmin updates a course, changes automatically reflect across all dashboards:
  // - OrgAdmin sees updated course details in enrollment list
  // - Admin sees updated course details in their course selection list
  // - Student sees updated modules, topics, and assessments in their courses
  // This is achieved through React state update -> localStorage sync -> context re-render
  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
  };

  // Delete a course
  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  // Get course by ID
  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(c => c.id === courseId);
  };

  // Get all courses (SuperAdmin can see all)
  const getAllCourses = (): Course[] => {
    return courses;
  };

  // Get courses for OrgAdmin (all courses available)
  const getCoursesForOrgAdmin = (): Course[] => {
    return courses;
  };

  // Get courses for Admin (only courses selected by their OrgAdmin)
  const getCoursesForAdmin = (adminId: string, orgAdminId: string): Course[] => {
    const orgAdmin = users.find(u => u.id === orgAdminId);
    if (!orgAdmin || !orgAdmin.selectedCourseIds) return [];
    
    return courses.filter(c => orgAdmin.selectedCourseIds?.includes(c.id));
  };

  // Get courses for Student (only courses selected by their assigned admins)
  const getCoursesForStudent = (studentId: string): Course[] => {
    const student = users.find(u => u.id === studentId);
    if (!student || !student.assignedAdminIds) return [];
    
    // Get all courses selected by admins assigned to this student
    const adminIds = student.assignedAdminIds;
    const admins = users.filter(u => adminIds.includes(u.id));
    
    const courseIds = new Set<string>();
    admins.forEach(admin => {
      admin.selectedCourseIds?.forEach(courseId => courseIds.add(courseId));
    });
    
    return courses.filter(c => courseIds.has(c.id));
  };

  // OrgAdmin selects a course
  const selectCourseByOrgAdmin = (courseId: string, orgAdminId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === orgAdminId) {
        const selectedCourseIds = u.selectedCourseIds || [];
        if (!selectedCourseIds.includes(courseId)) {
          return { ...u, selectedCourseIds: [...selectedCourseIds, courseId] };
        }
      }
      return u;
    }));
    
    // Also update in courses
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const selectedByOrgAdmins = c.selectedByOrgAdmins || [];
        if (!selectedByOrgAdmins.includes(orgAdminId)) {
          return { ...c, selectedByOrgAdmins: [...selectedByOrgAdmins, orgAdminId] };
        }
      }
      return c;
    }));
  };

  // OrgAdmin deselects a course
  const deselectCourseByOrgAdmin = (courseId: string, orgAdminId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === orgAdminId) {
        const selectedCourseIds = u.selectedCourseIds || [];
        return { ...u, selectedCourseIds: selectedCourseIds.filter(id => id !== courseId) };
      }
      return u;
    }));
    
    // Also update in courses
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const selectedByOrgAdmins = c.selectedByOrgAdmins || [];
        return { ...c, selectedByOrgAdmins: selectedByOrgAdmins.filter(id => id !== orgAdminId) };
      }
      return c;
    }));
  };

  // Admin selects a course
  const selectCourseByAdmin = (courseId: string, adminId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === adminId) {
        const selectedCourseIds = u.selectedCourseIds || [];
        if (!selectedCourseIds.includes(courseId)) {
          return { ...u, selectedCourseIds: [...selectedCourseIds, courseId] };
        }
      }
      return u;
    }));
    
    // Also update in courses
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const selectedByAdmins = c.selectedByAdmins || [];
        if (!selectedByAdmins.includes(adminId)) {
          return { ...c, selectedByAdmins: [...selectedByAdmins, adminId] };
        }
      }
      return c;
    }));
  };

  // Admin deselects a course
  const deselectCourseByAdmin = (courseId: string, adminId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === adminId) {
        const selectedCourseIds = u.selectedCourseIds || [];
        return { ...u, selectedCourseIds: selectedCourseIds.filter(id => id !== courseId) };
      }
      return u;
    }));
    
    // Also update in courses
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const selectedByAdmins = c.selectedByAdmins || [];
        return { ...c, selectedByAdmins: selectedByAdmins.filter(id => id !== adminId) };
      }
      return c;
    }));
  };

  // Assessment Management Functions
  const addModuleAssessment = (
    courseId: string,
    moduleId: string,
    assessment: Omit<ModuleAssessment, 'id' | 'moduleId'>
  ) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            modules: course.modules.map(module => {
              if (module.id === moduleId) {
                return {
                  ...module,
                  assessment: {
                    ...assessment,
                    id: `assessment-${Date.now()}`,
                    moduleId: moduleId,
                  },
                };
              }
              return module;
            }),
          };
        }
        return course;
      });
    });
  };

  const updateModuleAssessment = (
    courseId: string,
    moduleId: string,
    assessment: ModuleAssessment
  ) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            modules: course.modules.map(module => {
              if (module.id === moduleId) {
                return {
                  ...module,
                  assessment: assessment,
                };
              }
              return module;
            }),
          };
        }
        return course;
      });
    });
  };

  const deleteModuleAssessment = (courseId: string, moduleId: string) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            modules: course.modules.map(module => {
              if (module.id === moduleId) {
                const { assessment: _assessment, ...rest } = module;
                return rest as CourseModule;
              }
              return module;
            }),
          };
        }
        return course;
      });
    });
  };

  const getModuleAssessment = (courseId: string, moduleId: string): ModuleAssessment | undefined => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return undefined;
    const courseModule = course.modules.find(m => m.id === moduleId);
    return courseModule?.assessment;
  };

  return (
    <UserManagementContext.Provider
      value={{
        users,
        pendingStudents,
        verifiedStudents,
        pendingAdmins,
        verifiedAdmins,
        pendingOrgAdmins,
        verifiedOrgAdmins,
        currentUser,
        setCurrentUser,
        // Student management
        getPendingStudentsByInstitute,
        getVerifiedStudentsByInstitute,
        verifyStudent,
        rejectStudent,
        // Admin/OrgAdmin management
        getPendingAdminsByInstitute,
        getVerifiedAdminsByInstitute,
        getAllPendingAdmins,
        getAllVerifiedAdmins,
        getAllPendingOrgAdmins,
        getAllVerifiedOrgAdmins,
        getUniqueInstitutes,
        verifyAdmin,
        rejectAdmin,
        // Admin-Student Mapping
        assignAdminToStudent,
        removeAdminFromStudent,
        getStudentsForAdmin,
        getAdminsForStudent,
        // Course Management
        courses,
        createCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
        getAllCourses,
        getCoursesForOrgAdmin,
        getCoursesForAdmin,
        getCoursesForStudent,
        selectCourseByOrgAdmin,
        deselectCourseByOrgAdmin,
        selectCourseByAdmin,
        deselectCourseByAdmin,
        // Assessment Management
        addModuleAssessment,
        updateModuleAssessment,
        deleteModuleAssessment,
        getModuleAssessment,
        // Common
        registerUser,
        getUserByEmail,
        validateLogin,
        isLoaded,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
}
