const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Module = require('../models/Module');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('moduleId', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quizzes/module/:moduleId
// @desc    Get quizzes for a specific module
// @access  Public
router.get('/module/:moduleId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ moduleId: req.params.moduleId })
      .populate('moduleId', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get single quiz (without correct answers for students)
// @access  Public
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('moduleId', 'title')
      .populate('createdBy', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // If user is not admin, remove correct answers
    if (req.user.role !== 'admin') {
      const quizWithoutAnswers = {
        ...quiz.toObject(),
        questions: quiz.questions.map(q => ({
          question: q.question,
          choices: q.choices,
          _id: q._id
        }))
      };
      return res.json(quizWithoutAnswers);
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private (Admin only)
router.post('/', authenticate, isAdmin, [
  body('moduleId').notEmpty().withMessage('Module ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.question').trim().notEmpty().withMessage('Question text is required'),
  body('questions.*.choices').isArray({ min: 2 }).withMessage('At least 2 choices are required'),
  body('questions.*.correctAnswer').trim().notEmpty().withMessage('Correct answer is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { moduleId, title, questions } = req.body;

    // Verify module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Validate that correct answers are in choices
    for (const q of questions) {
      if (!q.choices.includes(q.correctAnswer)) {
        return res.status(400).json({ 
          message: `Correct answer "${q.correctAnswer}" must be one of the choices` 
        });
      }
    }

    const quiz = new Quiz({
      moduleId,
      title,
      questions,
      createdBy: req.user._id
    });

    await quiz.save();
    await quiz.populate('moduleId', 'title');
    await quiz.populate('createdBy', 'name email');

    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Private (Admin only)
router.put('/:id', authenticate, isAdmin, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('questions').optional().isArray({ min: 1 }).withMessage('At least one question is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { title, questions } = req.body;

    if (title) quiz.title = title;
    if (questions) {
      // Validate questions
      for (const q of questions) {
        if (!q.choices.includes(q.correctAnswer)) {
          return res.status(400).json({ 
            message: `Correct answer "${q.correctAnswer}" must be one of the choices` 
          });
        }
      }
      quiz.questions = questions;
    }

    await quiz.save();
    await quiz.populate('moduleId', 'title');
    await quiz.populate('createdBy', 'name email');

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers and get score
// @access  Private
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body; // { questionId: selectedAnswer }

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Answers are required' });
    }

    let correct = 0;
    const total = quiz.questions.length;
    const results = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[question._id.toString()] || answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) correct++;
      
      results.push({
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    const score = Math.round((correct / total) * 100);

    res.json({
      score,
      correct,
      total,
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

