# Quiz Components

This directory contains all quiz-related components organized for easy navigation and maintenance.

## Structure

```
src/components/quiz/
├── index.js                 # Main export file for all quiz components
├── QuizView.vue            # Main quiz container component
├── ui/                     # UI components
│   ├── Timer.vue           # Quiz timer component
│   └── QuizButton.vue      # Styled quiz action buttons
├── question/               # Question-related components
│   └── QuestionCard.vue    # Individual question display and interaction
├── progress/               # Progress tracking components
│   └── QuizProgress.vue    # Quiz progress indicator and statistics
└── results/                # Results and completion components
    └── QuizResults.vue     # Quiz completion results and statistics
```

## Components Overview

### Main Components

#### `QuizView.vue`
The main quiz container that orchestrates the entire quiz experience.
- Manages quiz state and flow
- Handles question navigation
- Integrates all sub-components
- Emits completion events

### UI Components

#### `Timer.vue` (`ui/Timer.vue`)
A sophisticated timer component with visual progress indication.

**Props:**
- `duration` (Number, required) - Timer duration in minutes
- `autoTerminate` (Boolean, default: false) - Auto-terminate when time expires
- `allowNegative` (Boolean, default: false) - Allow negative time display
- `running` (Boolean, default: true) - Controls timer state
- `resumeSeconds` (Number, default: null) - Resume from specific time
- `hide` (Boolean, default: false) - Hide timer display

**Events:**
- `timeout` - Emitted when timer expires
- `tick` - Emitted every second with time remaining

**Features:**
- Animated progress bar with color coding
- Handles page visibility changes
- Supports pause/resume functionality
- Mobile-responsive design

#### `QuizButton.vue` (`ui/QuizButton.vue`)
Styled button component for quiz actions.

**Props:**
- `label` (String) - Button text
- `colorClass` (String) - Additional CSS classes
- `aria` (String) - Accessibility label
- `click` (Function) - Click handler

### Question Components

#### `QuestionCard.vue` (`question/QuestionCard.vue`)
Displays individual questions with answer options and navigation.

**Props:**
- `question` (Object, required) - Question data with options and correct answer
- `currentIndex` (Number, required) - Current question index
- `totalQuestions` (Number, required) - Total number of questions
- `selectedOption` (String, default: null) - Currently selected answer
- `isAnswered` (Boolean, default: false) - Whether question has been answered
- `showCorrectAnswer` (Boolean, default: false) - Show correct answer (for review)
- `allowChange` (Boolean, default: true) - Allow changing answers
- `allowSkip` (Boolean, default: false) - Allow skipping questions
- `canGoPrevious` (Boolean, default: true) - Enable previous navigation

**Events:**
- `select` - Answer option selected
- `next` - Next question requested
- `previous` - Previous question requested
- `skip` - Skip question requested

**Features:**
- Markdown rendering for questions and answers
- Visual feedback for selected/correct/incorrect answers
- Progress indicator
- Responsive design with accessibility support

### Progress Components

#### `QuizProgress.vue` (`progress/QuizProgress.vue`)
Comprehensive progress tracking with statistics and question status.

**Props:**
- `totalQuestions` (Number, required) - Total questions count
- `currentQuestionIndex` (Number, required) - Current question index
- `questionStatuses` (Array, default: []) - Status of each question
- `answers` (Array, default: []) - User answers
- `timeElapsed` (Number, default: 0) - Time elapsed in seconds
- `timeLimit` (Number, default: null) - Time limit in minutes
- `chapters` (Array, default: []) - Chapter information
- `currentChapter` (Number, default: 0) - Current chapter index
- `showQuestionStatus` (Boolean, default: true) - Show question dots
- `showChapterProgress` (Boolean, default: false) - Show chapter progress
- `showStats` (Boolean, default: true) - Show performance statistics
- `allowJumping` (Boolean, default: false) - Allow jumping to questions

**Events:**
- `jumpToQuestion` - Jump to specific question index

**Features:**
- Animated progress bars
- Question status indicators (correct/incorrect/unanswered)
- Performance statistics (accuracy, timing, streak)
- Chapter-based progress tracking
- Mobile-responsive grid layout

### Results Components

#### `QuizResults.vue` (`results/QuizResults.vue`)
Comprehensive quiz completion results with detailed statistics.

**Props:**
- `correctAnswers` (Number, required) - Number of correct answers
- `totalQuestions` (Number, required) - Total questions attempted
- `totalTime` (Number, default: 0) - Total time taken in seconds
- `timeLimit` (Number, default: null) - Time limit in minutes
- `detailedAnswers` (Array, default: []) - Detailed answer review data
- `difficultyBreakdown` (Array, default: []) - Performance by difficulty
- `topicTitle` (String, default: '') - Quiz topic title
- `showReview` (Boolean, default: true) - Show detailed review option

**Events:**
- `restart` - Restart current quiz
- `newQuiz` - Start new quiz
- `viewTopics` - Navigate to topics

**Features:**
- Animated score circle with SVG progress
- Performance breakdown by difficulty
- Detailed question review with expandable sections
- Time statistics and analysis
- Encouraging performance messages
- Multiple action options for post-quiz navigation

## Usage Examples

### Basic Quiz Setup

```vue
<template>
  <div class="quiz-container">
    <QuizView
      :topic="currentTopic"
      :settings="quizSettings"
      @complete="handleQuizComplete"
    />
  </div>
</template>

<script setup>
import { QuizView } from '@/components/quiz'

const quizSettings = {
  questionsPerChapter: 10,
  timePerQuestion: 60,
  showTimer: true
}

const handleQuizComplete = (results) => {
  console.log('Quiz completed:', results)
}
</script>
```

### Custom Question Display

```vue
<template>
  <QuestionCard
    :question="currentQuestion"
    :current-index="questionIndex"
    :total-questions="totalQuestions"
    :selected-option="selectedAnswer"
    @select="handleAnswerSelect"
    @next="handleNext"
    @previous="handlePrevious"
  >
    <template #timer>
      <Timer
        :duration="5"
        :running="isActive"
        @timeout="handleTimeout"
      />
    </template>
  </QuestionCard>
</template>
```

### Progress Tracking

```vue
<template>
  <QuizProgress
    :total-questions="25"
    :current-question-index="currentIndex"
    :question-statuses="questionStatuses"
    :answers="userAnswers"
    :time-elapsed="timeElapsed"
    :show-stats="true"
    @jump-to-question="handleJumpToQuestion"
  />
</template>
```

### Results Display

```vue
<template>
  <QuizResults
    :correct-answers="correctCount"
    :total-questions="totalCount"
    :total-time="timeTaken"
    :detailed-answers="reviewData"
    :difficulty-breakdown="difficultyStats"
    @restart="restartQuiz"
    @new-quiz="startNewQuiz"
    @view-topics="goToTopics"
  />
</template>
```

## Styling and Theming

All components use Tailwind CSS classes and follow a consistent design system:
- Primary colors: Blue/Cyan gradient
- Success: Green shades
- Warning: Yellow/Orange shades  
- Error: Red shades
- Neutral: Gray shades

Components are fully responsive and include hover/focus states for accessibility.

## Accessibility Features

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly markup
- High contrast color combinations
- Focus management and indicators

## Performance Considerations

- Components use `computed` properties for reactive calculations
- Event listeners are properly cleaned up in `onUnmounted`
- Large lists use virtual scrolling where appropriate
- Images and assets are optimized for different screen sizes

## Testing

Each component should be tested for:
- Prop validation and default values
- Event emission and handling
- Responsive behavior across devices
- Accessibility compliance
- Performance with large datasets
