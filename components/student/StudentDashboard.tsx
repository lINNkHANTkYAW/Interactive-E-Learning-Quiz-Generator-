import React from 'react';
import { Quiz, UserRole } from '../../types';
import { Trophy, Star, Play, Lock } from 'lucide-react';
import { Brain, Sparkles, Flame } from '../ui/Icons';

interface Props {
  quizzes: Quiz[];
  userXP: number;
  userLevel: number;
  onStartQuiz: (quiz: Quiz) => void;
}

export const StudentDashboard: React.FC<Props> = ({ quizzes, userXP, userLevel, onStartQuiz }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-sm">
              <span className="text-4xl">🚀</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, Space Explorer!</h1>
              <div className="flex items-center gap-4 text-indigo-100">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <Trophy size={14} /> Level {userLevel}
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <Star size={14} /> {userXP} XP
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
              <span>Progress to Lvl {userLevel + 1}</span>
              <span>850 / 1000 XP</span>
            </div>
            <div className="h-4 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 w-[85%] shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Brain className="text-indigo-600" /> Your Missions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, idx) => (
            <div 
              key={quiz.id} 
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 hover:border-indigo-400 hover:shadow-md transition-all group cursor-pointer"
              onClick={() => onStartQuiz(quiz)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {quiz.difficulty}
                </span>
                <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <Play size={20} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{quiz.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{quiz.description}</p>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-400 uppercase">{quiz.questions.length} Questions</span>
                <span className="flex items-center gap-1 text-xs font-bold text-orange-500">
                  <Flame size={14} /> +{quiz.questions.reduce((a, b) => a + b.points, 0)} XP
                </span>
              </div>
            </div>
          ))}
          
          {/* Locked Content Placeholders */}
          {[1, 2].map((_, i) => (
             <div key={i} className="bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4 opacity-70">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <p className="font-medium">Complete more missions to unlock!</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};