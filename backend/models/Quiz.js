const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  choices: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2;
      },
      message: 'At least 2 choices are required'
    }
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one question is required'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);

