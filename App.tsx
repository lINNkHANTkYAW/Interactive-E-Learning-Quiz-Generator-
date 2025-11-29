import React, { useState, useEffect } from 'react';
import { UserRole, Quiz, QuestionType } from './types';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { QuizPlayer } from './components/student/QuizPlayer';
import { AccessibilityControls } from './components/AccessibilityControls';
import { GraduationCap, LogOut, LayoutDashboard, Brain } from './components/ui/Icons';

const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Solar System Adventure',
    topic: 'Astronomy',
    description: 'Explore the planets and stars in our neighborhood.',
    difficulty: 'Easy',
    createdBy: 'Teacher',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        type: QuestionType.MCQ,
        text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        explanation: 'Mars appears red because of iron oxide (rust) on its surface.',
        points: 10
      },
      {
        id: 'q2',
        type: QuestionType.TRUE_FALSE,
        text: 'The sun is a star.',
        correctAnswer: 'True',
        explanation: 'Yes! The sun is a G-type main-sequence star.',
        points: 10
      }
    ]
  }
];

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  
  // Accessibility State
  const [dyslexicMode, setDyslexicMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Student Stats (Mock)
  const [xp, setXp] = useState(850);
  const [level, setLevel] = useState(4);

  const handleQuizComplete = (score: number, maxScore: number) => {
    setActiveQuiz(null);
    setXp(prev => prev + score);
    if(score === maxScore) {
        // Bonus for perfection
        setXp(prev => prev + 50);
    }
    // Simple level up logic
    if (xp > 1000) {
        setLevel(prev => prev + 1);
        setXp(prev => prev - 1000);
    }
    // In a real app, save result to backend
    alert(`Quiz Completed! You scored ${score}/${maxScore} XP`);
  };

  // Apply visual themes
  useEffect(() => {
    if (dyslexicMode) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
  }, [dyslexicMode]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('contrast-more'); // Tailwind requires config, but we simulate
      document.body.style.filter = 'contrast(125%) saturate(110%)';
      document.body.style.backgroundColor = '#000';
      document.body.style.color = '#fff';
    } else {
      document.body.style.filter = '';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }, [highContrast]);

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center space-y-8 animate-float">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain size={40} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">MindSpark</h1>
            <p className="text-slate-500">Interactive Learning Platform</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setUserRole(UserRole.TEACHER)}
              className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition flex items-center justify-center gap-3"
            >
              <LayoutDashboard /> Teacher Portal
            </button>
            <button 
              onClick={() => setUserRole(UserRole.STUDENT)}
              className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <GraduationCap /> I'm a Student
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Playing Mode (Immersive, no nav)
  if (userRole === UserRole.STUDENT && activeQuiz) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AccessibilityControls 
          dyslexicMode={dyslexicMode}
          toggleDyslexicMode={() => setDyslexicMode(!dyslexicMode)}
          highContrast={highContrast}
          toggleHighContrast={() => setHighContrast(!highContrast)}
        />
        <QuizPlayer 
            quiz={activeQuiz} 
            onComplete={handleQuizComplete}
            onExit={() => setActiveQuiz(null)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${userRole === UserRole.TEACHER ? 'bg-slate-50' : 'bg-slate-100'}`}>
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Brain size={20} />
              </div>
              <span className="font-bold text-xl text-slate-800 hidden md:block">MindSpark</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">{userRole === UserRole.TEACHER ? 'Ms. Johnson' : 'Alex Explorer'}</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
              <button 
                onClick={() => setUserRole(null)}
                className="p-2 text-slate-400 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        {userRole === UserRole.TEACHER ? (
          <TeacherDashboard 
            quizzes={quizzes} 
            onAddQuiz={(q) => setQuizzes([...quizzes, q])} 
          />
        ) : (
          <StudentDashboard 
            quizzes={quizzes} 
            userXP={xp} 
            userLevel={level}
            onStartQuiz={setActiveQuiz}
          />
        )}
      </main>

      <AccessibilityControls 
        dyslexicMode={dyslexicMode}
        toggleDyslexicMode={() => setDyslexicMode(!dyslexicMode)}
        highContrast={highContrast}
        toggleHighContrast={() => setHighContrast(!highContrast)}
      />
    </div>
  );
};

export default App;