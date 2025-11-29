import React, { useState, useEffect } from 'react';
import { Quiz, Question, QuestionType } from '../../types';
import { CheckCircle, XCircle, ChevronRight, Volume2, Trophy, Flame } from '../ui/Icons';

interface Props {
  quiz: Quiz;
  onComplete: (score: number, maxScore: number) => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<Props> = ({ quiz, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex) / quiz.questions.length) * 100;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Reset speaking on new question
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedOption(answer);
    setIsAnswered(true);
    setShowFeedback(true);

    const correct = answer === currentQuestion.correctAnswer;
    if (correct) {
      setScore(prev => prev + currentQuestion.points);
      setStreak(prev => prev + 1);
      // Play sound effect here (optional)
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowFeedback(false);
    } else {
      onComplete(score + (selectedOption === currentQuestion.correctAnswer ? currentQuestion.points : 0), quiz.questions.reduce((acc, q) => acc + q.points, 0));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={onExit} className="text-slate-400 hover:text-red-500 font-bold text-sm">EXIT</button>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full">
            <Flame size={18} fill="currentColor" />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">
            <Trophy size={18} />
            <span>{score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-3 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-indigo-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 mb-6 relative overflow-hidden">
          <button 
            onClick={() => speakText(currentQuestion.text)}
            className={`absolute top-6 right-6 p-2 rounded-full ${isSpeaking ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <Volume2 size={24} />
          </button>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-tight pr-12">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.type === QuestionType.TRUE_FALSE ? (
              <>
                {['True', 'False'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={isAnswered}
                    className={`p-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-[1.02] border-2 ${
                      isAnswered
                        ? opt === currentQuestion.correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : opt === selectedOption
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-slate-50 border-slate-200 opacity-50'
                        : 'bg-white border-slate-200 hover:border-indigo-500 hover:shadow-md text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </>
            ) : (
              currentQuestion.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={isAnswered}
                  className={`text-left p-6 rounded-2xl text-lg font-medium transition-all transform hover:scale-[1.02] border-2 ${
                    isAnswered
                      ? opt === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : opt === selectedOption
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-slate-50 border-slate-200 opacity-50'
                      : 'bg-white border-slate-200 hover:border-indigo-500 hover:shadow-md text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 text-sm font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Feedback Area */}
        {showFeedback && (
          <div className={`rounded-2xl p-6 mb-6 animate-float ${
            selectedOption === currentQuestion.correctAnswer 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              {selectedOption === currentQuestion.correctAnswer ? (
                <CheckCircle className="text-green-600 shrink-0" size={32} />
              ) : (
                <XCircle className="text-red-600 shrink-0" size={32} />
              )}
              <div>
                <h3 className={`font-bold text-lg ${
                  selectedOption === currentQuestion.correctAnswer ? 'text-green-800' : 'text-red-800'
                }`}>
                  {selectedOption === currentQuestion.correctAnswer ? 'Excellent!' : 'Not quite right'}
                </h3>
                <p className="text-slate-700 mt-1">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex justify-end mt-4 h-16">
        {isAnswered && (
          <button
            onClick={handleNext}
            className="bg-indigo-600 text-white px-8 rounded-xl font-bold text-xl hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg flex items-center gap-2"
          >
            {currentIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'} <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};