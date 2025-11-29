import React, { useState } from 'react';
import { Quiz, Question, QuestionType, UserRole } from '../../types';
import { generateQuizAI } from '../../services/geminiService';
import { PlusCircle, BarChart3, BookOpen, Loader2, Sparkles, Brain } from '../ui/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  quizzes: Quiz[];
  onAddQuiz: (quiz: Quiz) => void;
}

export const TeacherDashboard: React.FC<Props> = ({ quizzes, onAddQuiz }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create'>('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Quiz Gen State
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [qCount, setQCount] = useState(5);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const aiData = await generateQuizAI(topic, difficulty, qCount);
      
      const newQuiz: Quiz = {
        id: crypto.randomUUID(),
        title: aiData.title,
        topic: topic,
        description: aiData.description,
        difficulty: difficulty as 'Easy'|'Medium'|'Hard',
        createdBy: 'Teacher',
        createdAt: new Date().toISOString(),
        questions: aiData.questions.map((q: any) => ({
            id: crypto.randomUUID(),
            type: q.type === 'TRUE_FALSE' ? QuestionType.TRUE_FALSE : QuestionType.MCQ,
            text: q.text,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points || 10
        }))
      };

      onAddQuiz(newQuiz);
      setActiveTab('overview');
    } catch (e) {
      alert("Failed to generate quiz. Please check API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const statsData = [
    { name: 'Mon', completion: 12 },
    { name: 'Tue', completion: 19 },
    { name: 'Wed', completion: 15 },
    { name: 'Thu', completion: 22 },
    { name: 'Fri', completion: 28 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Teacher Dashboard</h1>
          <p className="text-slate-500">Manage your classroom and create content</p>
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <PlusCircle size={20} />
          Create Quiz
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Quizzes</p>
                  <h3 className="text-2xl font-bold text-slate-800">{quizzes.length}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Brain size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Avg Class Score</p>
                  <h3 className="text-2xl font-bold text-slate-800">84%</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">AI Generated</p>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {quizzes.filter(q => q.description.includes("Generated")).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Quizzes List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Recent Quizzes</h3>
              <div className="space-y-4">
                {quizzes.length === 0 ? (
                  <p className="text-slate-400 italic">No quizzes yet. Create one!</p>
                ) : (
                  quizzes.map(q => (
                    <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-800">{q.title}</h4>
                        <p className="text-xs text-slate-500">{q.questions.length} Questions • {q.difficulty}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Analytics Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Weekly Engagement</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveTab('overview')} className="text-slate-400 hover:text-slate-600">Back</button>
            <h2 className="text-2xl font-bold text-slate-800">AI Quiz Generator</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Topic or Subject</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g., Photosynthesis, American History, Fractions"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Questions</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none"
                  value={qCount}
                  onChange={(e) => setQCount(Number(e.target.value))}
                >
                  <option value={3}>3 Questions (Demo)</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className={`w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
                isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] shadow-md'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" /> Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles size={20} /> Generate Quiz
                </>
              )}
            </button>
            
            <div className="text-center text-xs text-slate-400">
              Powered by Gemini 2.5 Flash
            </div>
          </div>
        </div>
      )}
    </div>
  );
};