const express = require('express');
const path = require('path');
const coursesData = require('./courses.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/courses', (req, res) => {
  res.json(coursesData);
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = coursesData.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
});

app.get('/api/courses/:id/chapters/:chapterId', (req, res) => {
  const courseId = parseInt(req.params.id);
  const chapterId = parseInt(req.params.chapterId);
  const course = coursesData.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  const chapter = course.chapters.find(ch => ch.id === chapterId);
  if (!chapter) {
    return res.status(404).json({ message: 'Chapter not found' });
  }
  res.json(chapter);
});

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/course/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

app.get('/course/:id/chapter/:chapterId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chapter.html'));
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
