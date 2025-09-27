# AI-Powered Interview Assistant

A comprehensive React application that provides an AI-powered interview experience for full-stack developer positions. The app features two main interfaces: one for interviewees to take timed interviews and another for interviewers to review candidate performance.

## 🚀 Features

### For Interviewees
- **Resume Upload**: Upload PDF or DOCX resumes with automatic extraction of contact information
- **Smart Data Collection**: AI chatbot collects missing information before starting the interview
- **Timed Interview**: 6 questions with different difficulty levels and time limits
  - 2 Easy questions (20 seconds each)
  - 2 Medium questions (60 seconds each) 
  - 2 Hard questions (120 seconds each)
- **Real-time Chat Interface**: Interactive chat with AI interviewer
- **Progress Tracking**: Visual progress indicators and timer
- **Session Persistence**: Resume interviews after page refresh or browser close

### For Interviewers
- **Candidate Dashboard**: View all candidates with scores and status
- **Detailed Analytics**: Individual candidate performance breakdown
- **Search & Filter**: Find candidates by name, email, or status
- **Score Rankings**: Candidates sorted by performance
- **Complete Interview History**: View all questions, answers, and AI feedback

### Technical Features
- **State Management**: Redux with Redux Persist for data persistence
- **Modern UI**: Ant Design components with responsive design
- **PDF/DOCX Parsing**: Automatic resume text extraction
- **AI Integration**: Mock AI service for question generation and evaluation
- **Local Storage**: All data persists locally using IndexedDB
- **Welcome Back Modal**: Seamless session restoration

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **State Management**: Redux Toolkit, Redux Persist
- **UI Library**: Ant Design
- **File Processing**: PDF.js, Mammoth.js
- **Styling**: CSS3 with modern design patterns
- **Build Tool**: Create React App

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-interview-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎯 Usage

### For Candidates
1. Navigate to the **Interviewee** tab
2. Upload your resume (PDF or DOCX format)
3. Review and complete any missing contact information
4. Start the interview and answer 6 questions
5. Each question has a time limit - answer before time runs out
6. View your final score and feedback

### For Interviewers
1. Navigate to the **Interviewer Dashboard** tab
2. View the list of all candidates
3. Use search and filters to find specific candidates
4. Click "View Details" to see complete interview history
5. Review individual question scores and AI feedback
6. Access candidate summaries and overall performance

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AppLayout.tsx    # Main app layout with tabs
│   ├── IntervieweeTab.tsx # Interview interface
│   ├── InterviewerTab.tsx # Dashboard interface
│   ├── ResumeUpload.tsx # Resume upload component
│   ├── ChatInterface.tsx # Chat UI for interviews
│   ├── InterviewTimer.tsx # Timer component
│   ├── WelcomeBackModal.tsx # Session restoration modal
│   └── CandidateDetailModal.tsx # Candidate details view
├── store/               # Redux store configuration
│   ├── index.ts        # Store setup with persistence
│   └── slices/         # Redux slices
│       ├── candidateSlice.ts # Candidate state management
│       ├── interviewSlice.ts # Interview state management
│       └── uiSlice.ts  # UI state management
├── services/           # External services
│   └── aiService.ts    # AI question generation and evaluation
├── utils/              # Utility functions
│   └── resumeParser.ts # Resume parsing logic
└── App.tsx            # Main app component
```

## 🔧 Configuration

The app uses mock AI services for demonstration purposes. To integrate with real AI APIs:

1. Update `src/services/aiService.ts`
2. Replace mock functions with actual API calls
3. Add API keys and configuration as needed

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Data Privacy

- All data is stored locally in the browser
- No data is sent to external servers (except for AI services when configured)
- Resume files are processed locally
- Session data persists across browser sessions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure redirects for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎥 Demo

A live demo is available at: [Demo URL]

## 📞 Support

For questions or support, please contact: [Your Contact Information]

---

**Note**: This is a demonstration project for internship assessment. The AI services are mocked for development purposes. In a production environment, integrate with real AI APIs like OpenAI, Anthropic, or similar services.