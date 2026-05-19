# EduCore User Manual

> **Version**: 1.0 | **Date**: 2026-05-18 | **For**: Students, Parents, Teachers, Volunteers, School Admins

---

## 1. Welcome to EduCore!

EduCore is a student-centered education platform where learning, growing, and emotional fulfillment happen together. We don't just teach knowledge — we nurture the whole child.

### Key Principles:
1. **Student at the Center**: Everything exists to serve the student.
2. **心灵满足 (Nurture the Heart)**: Every interaction radiates warmth and care.
3. **Warm Tone Always**: Effort is celebrated, not just results.

---

## 2. Quick Start: Run the Platform

### Prerequisites
- Node.js 20+
- pnpm 9+ (install with `corepack enable && corepack prepare pnpm@latest --activate`)
- Docker (optional, for local Mongo/Redis)

### Steps to Start

1. **Clone or open the repo**
   ```bash
   cd D:\Development\EducationPlatform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start services (Mongo + Redis via Docker, optional)**
   ```bash
   cd docker
   cp .env.example .env  # Edit if needed
   docker compose up -d
   cd ..
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```

5. **Open the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Swagger docs: http://localhost:4000/docs

---

## 3. Student Guide

### Sign Up / Log In
1. Go to http://localhost:5173/auth/register
2. Enter your name, email, and password
3. Select **Student** as your role
4. Click "Create account" — you'll be redirected to your dashboard!

### Student Dashboard
Your dashboard welcomes you with a warm greeting! Here you can:
- View your progress overview
- Quick links to learning, check-in, and heart space
- Notifications (🔔 bell icon in top right)

### Learning Journey
1. **Diagnostic**: Start here to help the platform understand your level!
   - Go to `/student/diagnostic`
   - Answer questions at your own pace
2. **Training**: Practice questions tailored to your level!
   - Go to `/student/training`
3. **Wrong Answers**: Review and master concepts you struggled with!
   - Go to `/student/wrong-answers`
   - Mark items as "Reviewed" or "Mastered"
4. **Progress**: See your growth over time with charts!
   - Go to `/student/progress`

### 心灵空间 (Heart Space)
A safe space for your feelings, thoughts, and proud moments!
1. **Check-In**: Share your mood daily (no pressure, just for you!)
   - Go to `/student/checkin`
   - Select a mood 🌞☁️🌧️⛈️
   - Add an optional note
   - Save your check-in!
2. **Journal**: Write down your thoughts!
   - Go to `/student/heart/journal`
3. **Proud Wall**: Share your achievements (big or small!)
   - Go to `/student/heart/proud-wall`

### AI Tutor
Get help whenever you need it!
1. Go to `/student/ai-tutor`
2. Type your question (e.g., "What is 2+2?" or "Help with fractions!")
3. Click "Send" — the AI tutor or rule engine will reply warmly!

---

## 4. Parent Guide

### Sign Up / Log In
1. Go to http://localhost:5173/auth/register
2. Enter your name, email, and password
3. Select **Parent** as your role
4. Click "Create account" — welcome to your family hub!

### Parent Dashboard
Your dashboard is your family hub! Here you can:
- Link your child to your account (using their invite code)
- View linked children
- Quick links to announcements, child progress, and conversations

### Link a Child
1. On your dashboard, find the "Link a child" section
2. Enter your child's invite code
3. Select your relationship (Mom, Dad, Guardian, etc.)
4. Click "Link child"

### View Your Child's Progress
1. Go to `/parent/child/:childId/progress`
   - Overview of their learning
   - Module summaries
   - Recent activity
2. **Subject Guide**: Get tips on how to help your child at home!
   - Go to `/parent/child/:childId/subject-guide`

### School Announcements
Stay updated with school news!
- Go to `/parent/announcements`
- Mark announcements as read

### Teacher Conversations
Communicate with your child's teacher warmly!
- Go to `/parent/conversations`
- Select a conversation or start a new one
- Send messages (always keep it kind and respectful!)

---

## 5. Teacher Guide

### Sign Up / Log In
1. Go to http://localhost:5173/auth/register
2. Enter your name, email, and password
3. Select **Teacher** as your role
4. Click "Create account" — welcome to your teacher dashboard!

### Teacher Dashboard / Class Overview
Your dashboard shows your class overview! Here you can:
- View your class roster
- See class-wide weak areas
- Quick links to class insights, student details, announcements, and conversations

### Class Insights
1. Go to `/teacher/class`
   - Student roster (click a student to view their details)
   - Class weak areas (to focus your teaching!)

### View a Student's Details
1. From class roster, click a student's name
2. Or go directly to `/teacher/student/:studentId`
   - Student summary
   - Progress overview
   - Warm insights to help you support them

### School Announcements
Post or view school announcements!
- Go to `/teacher/announcements`

### Parent Conversations
Communicate with parents warmly!
- Go to `/teacher/conversations`

---

## 6. Volunteer Guide

### Sign Up / Log In
1. Go to http://localhost:5173/auth/register
2. Enter your name, email, and password
3. Select **Volunteer** as your role
4. Click "Create account" — welcome to EduCore!

### Volunteer Dashboard
Your dashboard shows volunteer opportunities and impact!
- Go to `/volunteer/dashboard`
- View ways to help (Q&A, content creation, mentoring, etc.)

### Q&A Board
Answer student questions!
- Go to `/volunteer/qa`

---

## 7. School Admin Guide

### Sign Up / Log In
1. Go to http://localhost:5173/auth/register
2. Enter your name, email, and password
3. Select **School Admin** as your role
4. Click "Create account" — welcome to your admin dashboard!

### School Admin Dashboard
- Go to `/school-admin/dashboard`
- Manage classes, teachers, students
- View school-wide analytics
- Configure settings

### Manage Classes
1. Go to `/school-admin/classes`
   - Create new classes
   - Assign teachers to classes

### Manage Teachers
1. Go to `/school-admin/teachers`
   - Add/remove teachers
   - View teacher rosters

---

## 8. PWA (Progressive Web App) Offline Mode

EduCore works offline! Here's how:
1. **Install the app**:
   - On Chrome/Edge: Click "Install EduCore" in the address bar
   - On mobile: "Add to Home Screen"
2. **Use offline**:
   - You can still view cached questions
   - Answer questions offline — answers will sync when you're back online!

---

## 9. i18n (Internationalization)

EduCore supports English and Chinese!
1. Switch language:
   - Click the 🌐 language switcher in the header
   - Or go to Settings > Language

---

## 10. Troubleshooting & Help

### Common Issues
1. **Can't log in?**
   - Check your email and password
   - Make sure your account is registered
2. **Link child not working?**
   - Double-check the invite code
   - Ask your child to re-share it
3. **Questions not loading?**
   - Check your internet connection
   - If offline, cached questions are available
4. **Something else?**
   - Use warm language when reporting issues
   - Check the docs at [docs/](./)

---

## 11. Warm Reminders

- **Celebrate effort, not just results**: Every step forward counts!
- **Be kind**: Always use warm, respectful language with everyone.
- **Take breaks**: Learning is important, but so is rest!
- **You are not alone**: The whole EduCore community is here to support you!

---

## 12. Contributing (For Developers)

Want to help improve EduCore? Great!
- Read the [Developer SOP](./EduCore-Dev-SOP-2026-05-16.md)
- Follow the [Git Workflow](../GIT_WORKFLOW.md)
- Keep the warm tone in all your code and messages!

---

**Last Updated**: 2026-05-18 | **EduCore Team** 🧡
