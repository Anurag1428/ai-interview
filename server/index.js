require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// In-memory storage (for demo purposes)
// In production, you'd use Redux + localStorage on frontend
let candidates = [];
let nextId = 1;

// Helper functions
const findCandidateById = (id) => candidates.find(c => c.id === id);
const generateId = () => (nextId++).toString();

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    storage: 'in-memory',
    candidatesCount: candidates.length,
    version: '1.0.0'
  });
});

app.get('/api/candidates', asyncHandler(async (req, res) => {
  const { q, status, sort = 'score_desc', limit = 50, page = 1 } = req.query;
  let filteredCandidates = [...candidates];
  
  // Apply filters
  if (q) {
    const query = q.toLowerCase();
    filteredCandidates = filteredCandidates.filter(c => 
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.includes(query)
    );
  }
  
  if (status && status !== 'all') {
    filteredCandidates = filteredCandidates.filter(c => c.interviewStatus === status);
  }

  // Apply sorting
  if (sort === 'score_desc') {
    filteredCandidates.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
  } else {
    filteredCandidates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Apply pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedItems = filteredCandidates.slice(startIndex, endIndex);

  res.json({
    items: paginatedItems,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredCandidates.length,
      pages: Math.ceil(filteredCandidates.length / parseInt(limit))
    }
  });
}));

app.post('/api/candidates', asyncHandler(async (req, res) => {
  const { name, email, phone, resumeText } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Check for duplicate email
  const existingCandidate = candidates.find(c => c.email === email);
  if (existingCandidate) {
    return res.status(409).json({ error: 'Candidate with this email already exists' });
  }

  const newCandidate = {
    id: generateId(),
    name,
    email,
    phone: phone || '',
    resumeText: resumeText || '',
    interviewStatus: 'not_started',
    currentQuestionIndex: 0,
    answers: [],
    finalScore: 0,
    summary: '',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  };

  candidates.push(newCandidate);
  console.log(`✅ Created candidate: ${newCandidate.name} (${newCandidate.email})`);
  res.status(201).json(newCandidate);
}));

app.get('/api/candidates/:id', asyncHandler(async (req, res) => {
  const candidate = findCandidateById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  res.json(candidate);
}));

app.put('/api/candidates/:id', asyncHandler(async (req, res) => {
  const candidateIndex = candidates.findIndex(c => c.id === req.params.id);
  if (candidateIndex === -1) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  candidates[candidateIndex] = {
    ...candidates[candidateIndex],
    ...req.body,
    lastActiveAt: new Date().toISOString()
  };

  console.log(`📝 Updated candidate: ${candidates[candidateIndex].name}`);
  res.json(candidates[candidateIndex]);
}));

app.post('/api/candidates/:id/answers', asyncHandler(async (req, res) => {
  const candidate = findCandidateById(req.params.id);
  
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  candidate.answers.push({
    ...req.body,
    createdAt: new Date().toISOString()
  });
  
  // Calculate average score
  const totalScore = candidate.answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
  candidate.finalScore = candidate.answers.length > 0 
    ? Math.round(totalScore / candidate.answers.length) 
    : 0;
  
  candidate.lastActiveAt = new Date().toISOString();
  
  console.log(`📊 Added answer for ${candidate.name}, new score: ${candidate.finalScore}`);
  res.status(201).json(candidate);
}));

// Analytics endpoint
app.get('/api/analytics', asyncHandler(async (req, res) => {
  const totalCandidates = candidates.length;
  const completedInterviews = candidates.filter(c => c.interviewStatus === 'completed').length;
  const inProgressInterviews = candidates.filter(c => c.interviewStatus === 'in_progress').length;
  
  const candidatesWithScores = candidates.filter(c => c.finalScore > 0);
  const averageScore = candidatesWithScores.length > 0
    ? candidatesWithScores.reduce((sum, c) => sum + c.finalScore, 0) / candidatesWithScores.length
    : 0;

  res.json({
    totalCandidates,
    completedInterviews,
    inProgressInterviews,
    averageScore: Math.round(averageScore),
    completionRate: totalCandidates > 0 ? Math.round((completedInterviews / totalCandidates) * 100) : 0
  });
}));

// Sync endpoint - allows frontend to sync its Redux state with server
app.post('/api/sync', asyncHandler(async (req, res) => {
  const { candidates: frontendCandidates } = req.body;
  
  if (Array.isArray(frontendCandidates)) {
    // Merge frontend candidates with server candidates
    frontendCandidates.forEach(frontendCandidate => {
      const existingIndex = candidates.findIndex(c => c.id === frontendCandidate.id);
      if (existingIndex >= 0) {
        // Update existing candidate
        candidates[existingIndex] = {
          ...candidates[existingIndex],
          ...frontendCandidate,
          lastActiveAt: new Date().toISOString()
        };
      } else {
        // Add new candidate
        candidates.push({
          ...frontendCandidate,
          lastActiveAt: new Date().toISOString()
        });
      }
    });
    
    console.log(`🔄 Synced ${frontendCandidates.length} candidates from frontend`);
  }
  
  res.json({ 
    success: true, 
    candidatesCount: candidates.length,
    message: 'Sync completed successfully'
  });
}));

// Reset endpoint for development
app.post('/api/reset', asyncHandler(async (req, res) => {
  candidates = [];
  nextId = 1;
  console.log('🗑️ Reset all data');
  res.json({ success: true, message: 'All data reset' });
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('\n🚀 AI Interview Assistant Backend (In-Memory)');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 API endpoints: http://localhost:${PORT}/api/candidates`);
  console.log('\n💾 Storage: In-Memory (Redux + localStorage recommended for frontend)');
  console.log('🔄 Frontend should use Redux Persist for state management');
  console.log('\n📋 Available endpoints:');
  console.log('  GET    /api/health');
  console.log('  GET    /api/candidates');
  console.log('  POST   /api/candidates');
  console.log('  GET    /api/candidates/:id');
  console.log('  PUT    /api/candidates/:id');
  console.log('  POST   /api/candidates/:id/answers');
  console.log('  GET    /api/analytics');
  console.log('  POST   /api/sync          (sync Redux state)');
  console.log('  POST   /api/reset         (development only)');
  console.log('\n✨ Ready to serve your AI Interview Assistant!');
  console.log('🎯 Your Redux state will persist on refresh via localStorage\n');
});