# AI-Powered Interview Assistant (Crisp)

A comprehensive React-based interview platform that provides AI-powered assessment for Full Stack Developer positions. Built for the Swipe Internship Assignment.

## 🚀 Features

### Interviewee Experience
- **Resume Upload**: Support for PDF and DOCX files with automatic data extraction
- **Smart Data Collection**: AI chatbot collects missing information (Name, Email, Phone) before starting
- **Timed Interview**: 6 questions with progressive difficulty (2 Easy → 2 Medium → 2 Hard)
- **Real-time Feedback**: Instant AI evaluation with detailed scoring and suggestions
- **Session Persistence**: Resume interrupted sessions with "Welcome Back" modal

### Interviewer Dashboard
- **Candidate Management**: View all candidates sorted by performance scores
- **Detailed Analytics**: Complete chat history, scores, and AI summaries for each candidate
- **Advanced Filtering**: Search and filter candidates by status and performance
- **Progress Tracking**: Visual progress indicators and completion status

### Technical Highlights
- **State Management**: Redux Toolkit with Redux Persist for data persistence
- **Modern UI**: Ant Design components with custom styling
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Local Storage**: All data persisted locally - no external database required

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Redux Toolkit
- **UI Library**: Ant Design
- **State Persistence**: Redux Persist
- **File Processing**: PDF.js, Mammoth.js
- **Routing**: React Router DOM
- **Build Tool**: Create React App

## 📋 Question Categories

1. **React Fundamentals** (Easy)
2. **JavaScript Core Concepts** (Easy)
3. **React Advanced Patterns** (Medium)
4. **Node.js & Backend** (Medium)
5. **System Design** (Hard)
6. **Algorithms & Data Structures** (Hard)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-interview-assistant
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

## 🎯 Usage Guide

### For Candidates
1. Upload your resume (PDF/DOCX format)
2. Complete any missing profile information
3. Start the timed interview (6 questions total)
4. Receive instant AI feedback and final score

### For Interviewers
1. Switch to "Interviewer Dashboard" tab
2. View all candidates and their performance metrics
3. Click "View Details" to see complete interview history
4. Use search and filters to manage candidates efficiently

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AppLayout.tsx   # Main layout with tabs
│   ├── IntervieweeTab.tsx
│   ├── InterviewerTab.tsx
│   ├── ChatInterface.tsx
│   ├── ResumeUpload.tsx
│   └── ...
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   └── index.ts
├── services/           # AI service and utilities
└── utils/              # Helper functions
```

## 🎨 Key Design Decisions

### AI Evaluation System
- **Content Analysis**: Evaluates technical keywords and concepts
- **Time Management**: Considers response time in scoring
- **Progressive Difficulty**: Adapts evaluation criteria based on question difficulty
- **Comprehensive Feedback**: Provides strengths and improvement areas

### State Management
- **Redux Toolkit**: Simplified Redux with modern patterns
- **Persistence**: Automatic local storage with redux-persist
- **Type Safety**: Full TypeScript integration

### User Experience
- **Responsive Design**: Mobile-first approach with Ant Design
- **Error Handling**: Graceful error states and user feedback
- **Performance**: Optimized rendering and state updates

## 🔧 Customization

### Adding New Questions
Edit `src/services/aiService.ts` to add new questions to the `FULL_STACK_QUESTIONS` array.

### Modifying Evaluation Logic
Update the `analyzeAnswerContent` function in `aiService.ts` to customize scoring algorithms.

### UI Theming
Modify the Ant Design theme in `src/App.tsx` ConfigProvider.

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `build` folder
- **GitHub Pages**: Use `gh-pages` package

## 🤝 Contributing

This project was built as part of the Swipe Internship Assignment. The implementation focuses on:
- Clean, maintainable code
- Modern React patterns
- Comprehensive TypeScript usage
- Professional UI/UX design

## 📄 License

MIT License - feel free to use this project as a reference for your own implementations.

---

**Built with ❤️ for the Swipe Internship Assignment**