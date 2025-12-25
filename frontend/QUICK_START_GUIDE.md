# 🚀 Quick Start Guide - Courses Module

## 📍 File Locations

```
src/app/student/courses/
├── page.tsx                          # Main courses browsing page
└── [courseId]/
    └── page.tsx                      # Course detail & topic viewer

src/components/
└── AdminNotesUpload.tsx             # Admin upload panel component

Documentation/
├── COURSES_MODULE_DOCUMENTATION.md   # Complete feature guide
├── ADMIN_NOTES_UPLOAD_GUIDE.md      # Admin instructions
└── DESIGN_SPECIFICATIONS.md          # UI/UX design details
```

---

## 🎯 Core Features at a Glance

### 1. Courses Browsing (`/student/courses`)
**What it does**: Display all courses with filtering by enrolled/available
**Key features**:
- ✅ Two-tab interface (Enrolled | Available)
- ✅ Expandable course cards showing structure
- ✅ Enroll/Continue buttons
- ✅ Progress tracking
- ✅ Responsive design

**To test**:
```bash
# Navigate to
http://localhost:3000/student/courses

# Actions:
1. Click "Enroll Now" → moves to Enrolled tab
2. Click "Continue" → goes to course detail
3. Click "View Course Content" → expands modules
```

### 2. Course Detail Page (`/student/courses/[courseId]`)
**What it does**: Show course structure, topics, notes, and videos
**Key features**:
- ✅ Left sidebar with expandable course structure
- ✅ Middle area showing selected topic content
- ✅ Notes viewer (PDF/DOCX/PPTX support)
- ✅ Embedded video player
- ✅ Progress tracking with completion status

**To test**:
```bash
# Navigate to specific course
http://localhost:3000/student/courses/course-1

# Actions:
1. Click topic in sidebar → content loads
2. Click "Mark Complete" → updates progress
3. Expand/collapse modules and chapters
4. Watch video (uses embedded YouTube)
5. Toggle fullscreen on video player
```

### 3. Admin Notes Upload
**What it does**: Allow admins to upload study materials
**Key features**:
- ✅ Upload dialog with form validation
- ✅ Support for PDF, DOCX, PPTX formats
- ✅ Progress tracking during upload
- ✅ Notes management table
- ✅ Edit/delete capabilities

**To use**:
```typescript
// Import component
import AdminNotesUpload from '@/components/AdminNotesUpload';

// Use in page
<AdminNotesUpload />
```

---

## 🔧 Configuration & Customization

### Change Course Data

**File**: `src/app/student/courses/page.tsx` (lines 98-250)

```typescript
// Edit mockCourses array
const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Your Course Title',
    description: 'Description here',
    instructor: 'Instructor name',
    thumbnail: '🎯', // emoji
    duration: '40 hours',
    level: 'Beginner', // Beginner | Intermediate | Advanced
    rating: 4.8,
    studentsEnrolled: 15420,
    modules: [
      // ... module structure
    ],
  },
];
```

### Add New Module/Chapter/Topic

```typescript
// Inside modules array
{
  id: 'module-5',
  title: 'New Module Title',
  description: 'Module description',
  chapters: [
    {
      id: 'chapter-5-1',
      title: 'Chapter Title',
      topics: [
        {
          id: 'topic-5-1-1',
          title: 'Topic Title',
          duration: '20 min',
          type: 'video', // video | article | quiz
          completed: false,
          notes: {
            fileName: 'filename.pdf',
            fileType: 'pdf', // pdf | docx | pptx
            fileSize: '2.4 MB',
            uploadedDate: 'Dec 12, 2024',
            description: 'Description of notes',
          },
          video: {
            url: 'https://www.youtube.com/embed/{VIDEO_ID}',
            duration: '20:15',
            description: 'Video description',
          },
        },
      ],
    },
  ],
}
```

### Customize Theme Integration

**File**: `src/context/ThemeContext.tsx`

The courses pages automatically use the 7-theme system:
- Midnight Ocean 🌊
- Lavender Dream 💜
- Forest Night 🌲
- Sunset Blaze 🔥
- Arctic Frost ❄️
- Royal Purple 👑
- Cyber Neon 🌐

Colors automatically update based on selected theme!

---

## 🎨 Styling & Layout

### Key Color Variables
```typescript
const colors = {
  pageBg: isDark ? themeColors.backgroundDark : themeColors.backgroundLight,
  sidebarBg: isDark ? themeColors.primaryDark : themeColors.primary,
  cardBg: isDark ? themeColors.paperDark : themeColors.paperLight,
  textPrimary: isDark ? themeColors.textDark : themeColors.textLight,
  accent: themeColors.accent,
  // ... more colors
};
```

### Adjust Spacing
```typescript
// Sidebar width
width: 320, // Change to 280, 360, etc.

// Card padding
p: 3, // Default is 3rem (24px), change to 2, 4, etc.

// Font sizes
fontSize: '1.1rem', // Adjust as needed
```

### Change Animations
```typescript
// Collapse/Expand timing
timeout={400}, // Change to 200, 600, etc. (milliseconds)

// Animation duration
transition: 'all 0.3s ease', // Adjust 0.3s as needed
```

---

## 🔌 Integration with Backend

### API Endpoints to Connect

**Get Courses**
```typescript
// Current: mockCourses from local data
// Implement:
const response = await fetch('/api/courses');
const courses = await response.json();
```

**Get Course Details**
```typescript
const response = await fetch(`/api/courses/${courseId}`);
const course = await response.json();
```

**Get Notes**
```typescript
const response = await fetch(`/api/courses/${courseId}/topics/${topicId}/notes`);
const notes = await response.json();
```

**Update Progress**
```typescript
await fetch(`/api/progress/${courseId}/${topicId}`, {
  method: 'POST',
  body: JSON.stringify({ completed: true }),
});
```

**Upload Notes (Admin)**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('courseId', courseId);
formData.append('topicId', topicId);

const response = await fetch('/api/notes/upload', {
  method: 'POST',
  body: formData,
});
```

---

## 🐛 Common Issues & Solutions

### Issue: Course ID not found
```
Solution:
1. Check courseId in URL matches mockCourses
2. Verify course exists in data
3. Check [courseId] folder path is correct
```

### Issue: Topics not showing
```
Solution:
1. Expand module in sidebar (click module header)
2. Expand chapter (click chapter header)
3. Check topics array is not empty
4. Verify topic IDs are unique
```

### Issue: Video not playing
```
Solution:
1. Check YouTube URL is embedded format
   ✅ https://www.youtube.com/embed/{ID}
   ❌ https://youtu.be/{ID}
2. Verify video is public (not private/unlisted)
3. Check CORS settings if using external source
```

### Issue: Notes not displaying
```
Solution:
1. Verify notes object exists in topic data
2. Check fileName includes extension
3. Verify fileType matches (pdf, docx, pptx)
4. Ensure description is not empty
```

### Issue: Progress not saving
```
Solution:
1. Currently stored in component state (will reset on refresh)
2. To persist: Connect to backend/localStorage
3. Add this to handleCompleteTopicClick:
   localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
```

---

## 📱 Mobile Optimization

### Current Responsive Breakpoints

The app is mobile-responsive, but for full mobile optimization:

```typescript
// Add mobile-specific styles
const isMobile = useMediaQuery('(max-width:768px)');

// Adjust sidebar on mobile
<Box sx={{ width: isMobile ? 0 : 320, ... }}>
```

### Mobile Drawer Pattern
```typescript
import { Drawer } from '@mui/material';

// Replace fixed sidebar with drawer on mobile
const [mobileOpen, setMobileOpen] = useState(false);

<Drawer
  open={mobileOpen}
  onClose={() => setMobileOpen(false)}
>
  {/* Sidebar content */}
</Drawer>
```

---

## 🔐 Authentication & Authorization

### Current State
- No authentication checks (assumes logged-in user)

### To Add Authentication
```typescript
'use client';
import { useAuth } from '@/context/AuthContext'; // Create this

export default function CoursesPage() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <Spinner />;
  if (!user) {
    redirect('/login');
  }
  
  // Rest of component
}
```

### Role-Based Access
```typescript
// Only admins can see AdminNotesUpload
{user.role === 'admin' && <AdminNotesUpload />}

// Only enrolled students can access course detail
if (!enrolledCourseIds.includes(courseId)) {
  return <AccessDenied />;
}
```

---

## 📊 State Management

### Current State Structure
```typescript
const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
const [completedTopics, setCompletedTopics] = useState<string[]>([]);
const [expandedModules, setExpandedModules] = useState<string[]>([]);
const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
```

### For Production, Use Redux/Zustand
```typescript
// Example with Zustand
import { create } from 'zustand';

const useCoursesStore = create((set) => ({
  enrolledCourses: [],
  completedTopics: [],
  selectedTopic: null,
  
  enrollCourse: (id) => set(state => ({
    enrolledCourses: [...state.enrolledCourses, id]
  })),
  
  markComplete: (topicId) => set(state => ({
    completedTopics: [...state.completedTopics, topicId]
  })),
}));
```

---

## 🧪 Testing

### Key Scenarios to Test

```javascript
// 1. Course Enrollment
describe('Course Enrollment', () => {
  test('clicking Enroll moves course to enrolled tab', () => {
    // Click Enroll button
    // Assert course appears in Enrolled tab
  });
});

// 2. Topic Selection
describe('Topic Selection', () => {
  test('clicking topic loads content', () => {
    // Click topic in sidebar
    // Assert selectedTopic updates
    // Assert notes display
    // Assert video displays
  });
});

// 3. Progress Tracking
describe('Progress Tracking', () => {
  test('marking complete updates progress', () => {
    // Click Mark Complete
    // Assert topic shows checkmark
    // Assert progress percentage updates
  });
});

// 4. Expansion/Collapse
describe('Content Navigation', () => {
  test('expanding module shows chapters', () => {
    // Click module
    // Assert chapters visible
  });
});
```

---

## 🚀 Deployment Checklist

- [ ] Replace mockCourses with API calls
- [ ] Connect to backend for progress tracking
- [ ] Implement admin authentication
- [ ] Add error boundaries
- [ ] Add loading spinners for async operations
- [ ] Optimize images and videos
- [ ] Set up analytics tracking
- [ ] Test on mobile devices
- [ ] Add 404/error pages
- [ ] Set up error logging
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Security audit (OWASP)

---

## 📚 Additional Resources

- **Theme System**: See `src/context/ThemeContext.tsx`
- **MUI Documentation**: https://mui.com/
- **Next.js App Router**: https://nextjs.org/docs/app
- **Type Definitions**: See `Topic`, `Chapter`, `Module`, `Course` interfaces

---

## 💬 Support

### For Questions About:
- **UI/UX**: Check `DESIGN_SPECIFICATIONS.md`
- **Admin Tasks**: Check `ADMIN_NOTES_UPLOAD_GUIDE.md`
- **Features**: Check `COURSES_MODULE_DOCUMENTATION.md`
- **Code**: Check inline comments in `.tsx` files

---

**Happy Coding! 🎉**

*Version 1.0 - December 12, 2025*
