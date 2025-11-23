import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { Question, LeaderboardEntry, QuizResultPayload, ScreenState, Quote } from './types';
import { MOTIVATIONAL_QUOTES, QUIZ_QUESTIONS } from './constants';
import { fetchLeaderboard, postQuizResult } from './services/sheetService';

const App: React.FC = () => {
  // App State
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('WELCOME');
  const [userName, setUserName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  // Quiz State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Result State
  const [motivationalQuote, setMotivationalQuote] = useState<Quote | null>(null);
  const [isPostingResult, setIsPostingResult] = useState<boolean>(false);
  const [postError, setPostError] = useState<string | null>(null);
  
  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // --- Logic: Initialization ---

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startQuiz = () => {
    if (!userName.trim()) {
      setNameError('Please identify yourself to proceed.');
      return;
    }
    setNameError('');
    const shuffled = shuffleArray(QUIZ_QUESTIONS);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    
    // Slight delay for exit animation feel
    setTimeout(() => setCurrentScreen('QUIZ'), 150);
  };

  const handleAnswerSelect = (optionKey: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optionKey);
  };

  const submitAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswerSubmitted(true);
    const currentQ = questions[currentQuestionIndex];
    if (selectedAnswer === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setMotivationalQuote(randomQuote);
    setCurrentScreen('RESULTS');
  };

  // --- Logic: Results & API ---
  const hasPostedRef = useRef(false);

  useEffect(() => {
    if (currentScreen === 'RESULTS' && motivationalQuote && userName && !hasPostedRef.current) {
      hasPostedRef.current = true;
      const payload: QuizResultPayload = {
        name: userName,
        score: score,
        timestamp: new Date().toISOString(),
        quote: motivationalQuote.quote
      };

      const submitData = async () => {
        setIsPostingResult(true);
        const success = await postQuizResult(payload);
        if (!success) {
          setPostError("Note: Network connection issue. Score saved locally.");
        }
        setIsPostingResult(false);
      };
      
      submitData();
    }
    
    if (currentScreen !== 'RESULTS') {
      hasPostedRef.current = false;
    }
  }, [currentScreen, motivationalQuote, userName, score]);

  // --- Logic: Leaderboard ---
  const loadLeaderboard = useCallback(async () => {
    setIsLoadingLeaderboard(true);
    setLeaderboardError(null);
    try {
      const data = await fetchLeaderboard();
      data.sort((a, b) => {
        // Primary: Score Descending (Higher is better)
        if (b.score !== a.score) return b.score - a.score;
        
        // Secondary: Timestamp Ascending (Older is better)
        // If 'b' came later (larger timestamp), 'b' should be lower in rank.
        // Therefore, we subtract B from A? No, wait:
        // A (10:00) vs B (11:00). A < B. 
        // We want A to be index 0, B to be index 1.
        // Ascending sort: a - b. (Negative result puts a first).
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
      setLeaderboard(data);
    } catch (err) {
      setLeaderboardError("Unable to retrieve global rankings.");
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  useEffect(() => {
    if (currentScreen === 'LEADERBOARD') {
      loadLeaderboard();
    }
  }, [currentScreen, loadLeaderboard]);

  const goToLeaderboard = () => {
    setCurrentScreen('LEADERBOARD');
  };

  const goHome = () => {
    setUserName('');
    setCurrentScreen('WELCOME');
  };

  // --- Renderers ---

  const renderWelcome = () => (
    <div className="glass-card rounded-3xl p-6 md:p-12 text-center animate-fade-in-up relative overflow-hidden group max-w-xl mx-auto w-full max-h-full flex flex-col justify-center">
      {/* Decorative top sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-70"></div>
      
      <div className="relative z-10">
        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6 md:mb-8 backdrop-blur-md opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <span className="text-[10px] md:text-sm font-semibold tracking-widest text-blue-400 uppercase">Proficiency Assessment</span>
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Python Modules
        </h1>
        <p className="text-slate-400 text-sm md:text-xl font-light mb-8 max-w-lg mx-auto opacity-0 animate-fade-in-up leading-relaxed" style={{ animationDelay: '300ms' }}>
          Evaluate your understanding of modular architecture and package management.
        </p>
        
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-center space-x-3 md:space-x-4">
            <div className="flex -space-x-2 md:-space-x-3">
               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-500 border-2 border-slate-900 shadow-lg z-30"></div>
               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-300 border-2 border-slate-900 shadow-lg z-20"></div>
               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-amber-700 border-2 border-slate-900 shadow-lg z-10"></div>
            </div>
            <p className="text-slate-300 text-xs md:text-base">
              <span className="font-semibold text-white">Top 3 Rankers</span> rewarded.
            </p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6 max-w-sm mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="relative group">
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur ${nameError ? 'from-red-600 to-red-600 opacity-100' : ''}`}></div>
            <input
              type="text"
              placeholder="Enter your name correctly"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="relative w-full bg-slate-950 text-white px-4 md:px-6 py-3 md:py-4 text-sm md:text-lg rounded-xl border border-slate-800 focus:outline-none placeholder-slate-600 transition-all text-center tracking-wide shadow-inner"
              onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
            />
          </div>
          {nameError && <p className="text-red-400 text-[10px] md:text-sm animate-pulse font-medium">{nameError}</p>}

          <Button variant="sleekPrimary" onClick={startQuiz}>
            Initialize Quiz
          </Button>
          
          <button 
            onClick={goToLeaderboard} 
            className="w-full py-2 text-slate-500 text-[10px] md:text-sm hover:text-white transition-colors border-b border-transparent hover:border-slate-700"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (questions.length === 0) return null;
    const currentQ = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="w-full h-full flex flex-col animate-fade-in-up overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-slate-900/50 rounded-full h-1.5 md:h-2 mb-4 md:mb-8 backdrop-blur-sm shrink-0">
          <div 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="glass-card rounded-2xl p-4 md:p-10 relative overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="mb-4 md:mb-8 shrink-0">
            <div className="flex justify-between items-center mb-2 md:mb-3">
              <span className="text-blue-400 font-bold text-[10px] md:text-xs tracking-widest uppercase bg-blue-500/10 px-2 md:px-3 py-1 rounded-md">Question {currentQuestionIndex + 1} / {questions.length}</span>
              <span className="text-slate-500 text-[10px] md:text-xs uppercase tracking-wider font-medium">Module Check</span>
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-white leading-tight md:leading-relaxed tracking-tight">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4 mb-4 md:mb-10 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {(['A', 'B', 'C', 'D'] as const).map((optionKey) => {
              const isSelected = selectedAnswer === optionKey;
              const isCorrect = currentQ.answer === optionKey;
              
              let variantStyle = "bg-slate-800/30 border-slate-700/50 text-slate-300 hover:bg-slate-800/60 hover:border-slate-600";
              
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  variantStyle = "bg-green-500/10 border-green-500/50 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
                } else if (isSelected && !isCorrect) {
                  variantStyle = "bg-red-500/10 border-red-500/50 text-red-200";
                } else {
                  variantStyle = "opacity-40 grayscale";
                }
              } else if (isSelected) {
                // Fixed: Removed scale to prevent overflow. Using shadow/border color instead.
                variantStyle = "bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.2)]";
              }

              return (
                <button
                  key={optionKey}
                  onClick={() => handleAnswerSelect(optionKey)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left py-3 px-3 md:p-5 rounded-xl border transition-all duration-300 flex items-start group ${variantStyle}`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-lg text-[10px] md:text-xs font-bold mr-3 md:mr-5 shrink-0 transition-colors duration-300 ${
                     isAnswerSubmitted && isCorrect ? 'bg-green-500 text-white' :
                     isAnswerSubmitted && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                     isSelected ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                  }`}>
                    {optionKey}
                  </span>
                  {/* Fixed: Added break-words, whitespace-normal, min-w-0 to prevent overflow */}
                  <span className="text-sm md:text-lg leading-snug pt-0.5 flex-1 break-words whitespace-normal min-w-0">{currentQ.options[optionKey]}</span>
                </button>
              );
            })}
          </div>

          <div className="shrink-0 mt-auto pt-2">
            {isAnswerSubmitted ? (
              <div className="animate-fade-in-up">
                <div className={`p-3 md:p-5 rounded-xl mb-4 border ${selectedAnswer === currentQ.answer ? 'bg-green-950/30 border-green-900' : 'bg-red-950/30 border-red-900'}`}>
                   <p className="font-bold mb-1 md:mb-2 flex items-center gap-2 text-sm md:text-base">
                     {selectedAnswer === currentQ.answer ? (
                       <span className="text-green-400 flex items-center gap-2">✓ Correct Analysis</span>
                     ) : (
                       <span className="text-red-400 flex items-center gap-2">✕ Incorrect</span>
                     )}
                   </p>
                   <p className="text-slate-300 text-xs md:text-sm md:text-base leading-relaxed opacity-90">
                     {currentQ.explanation}
                   </p>
                </div>
                <Button variant="sleekPrimary" fullWidth onClick={nextQuestion}>
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            ) : (
              <Button 
                fullWidth 
                variant="submit"
                onClick={submitAnswer} 
                disabled={!selectedAnswer} 
                className={`transition-all duration-500 ${!selectedAnswer ? 'opacity-50 grayscale' : 'opacity-100'}`}
              >
                Submit Response
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="glass-card rounded-3xl p-6 md:p-14 text-center animate-fade-in-up max-w-lg mx-auto w-full">
      <div className="relative inline-block mb-6 md:mb-8">
        <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-full border border-slate-700 flex items-center justify-center shadow-2xl mx-auto">
          <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400">{score}<span className="text-slate-600 text-lg md:text-xl font-normal">/10</span></span>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 tracking-tight">Assessment Complete</h2>
      <p className="text-slate-400 text-xs md:text-base mb-8 md:mb-10">
        Performance log for <span className="text-white font-medium">{userName}</span> saved.
      </p>

      {motivationalQuote && (
        <div className="bg-slate-900/50 border border-white/5 p-6 md:p-8 rounded-2xl mb-8 md:mb-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 group-hover:h-full transition-all duration-700"></div>
          <p className="text-lg md:text-2xl text-slate-200 font-serif italic mb-2 md:mb-4 opacity-90 leading-relaxed">"{motivationalQuote.quote}"</p>
          <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">- {motivationalQuote.author}</p>
        </div>
      )}

      {postError && (
        <div className="bg-yellow-500/10 text-yellow-200 text-xs md:text-sm p-3 md:p-4 rounded-lg mb-6 border border-yellow-500/20">
          {postError}
        </div>
      )}

      <div className="space-y-3 md:space-y-4">
        <Button variant="sleekPrimary" fullWidth onClick={goToLeaderboard}>
          View Leaderboard
        </Button>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="glass-card rounded-2xl p-4 md:p-10 w-full flex flex-col h-[90vh] md:h-[80vh] animate-fade-in-up">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 shrink-0 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Leaderboard</h2>
          <p className="text-[10px] md:text-sm text-slate-500 uppercase tracking-widest mt-0.5">Top Performers</p>
        </div>
        <div className="w-auto min-w-[110px] md:min-w-[140px]">
          <Button variant="sleekSecondary" fullWidth onClick={goHome}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-slate-950/30 rounded-xl border border-white/5 flex flex-col min-h-0">
        <div className="grid grid-cols-12 gap-2 md:gap-4 p-3 md:p-5 bg-slate-900/80 border-b border-white/5 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Participant</div>
          <div className="col-span-4 text-right">Score</div>
        </div>

        <div className="overflow-y-auto flex-1 p-2 md:p-3 space-y-2 custom-scrollbar">
          {isLoadingLeaderboard ? (
             <div className="flex items-center justify-center h-full">
               <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : leaderboardError ? (
             <div className="text-center py-10 text-sm text-red-400">{leaderboardError}</div>
          ) : leaderboard.length === 0 ? (
             <div className="text-center py-20 text-base text-slate-600 font-light">Repository empty. Be the pioneer.</div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              let rowStyle = "hover:bg-white/5 border border-transparent";
              let rankStyle = "text-slate-400";
              let scoreStyle = "text-slate-500";
              
              // Top 3 Specific Styles
              if (rank === 1) {
                rowStyle = "bg-gradient-to-r from-yellow-900/10 to-transparent border border-yellow-500/30 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]";
                rankStyle = "text-yellow-400 font-bold scale-110";
                scoreStyle = "text-yellow-400";
              } else if (rank === 2) {
                rowStyle = "bg-gradient-to-r from-slate-700/10 to-transparent border border-slate-400/30";
                rankStyle = "text-slate-300 font-bold scale-110";
                scoreStyle = "text-slate-300";
              } else if (rank === 3) {
                rowStyle = "bg-gradient-to-r from-orange-900/10 to-transparent border border-orange-700/30";
                rankStyle = "text-orange-400 font-bold scale-110";
                scoreStyle = "text-orange-400";
              } else if (rank <= 10) {
                 rowStyle = "bg-blue-900/5 border border-blue-500/10";
                 rankStyle = "text-blue-300 font-medium";
                 scoreStyle = "text-blue-300";
              }

              // Self Highlight
              if (entry.name === userName && currentScreen === 'LEADERBOARD') {
                 rowStyle = "bg-purple-600/20 border border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.1)]";
              }

              return (
                <div 
                  key={`${entry.name}-${entry.timestamp}-${index}`}
                  className={`grid grid-cols-12 gap-2 md:gap-4 p-3 md:p-4 rounded-xl items-center transition-all duration-300 ${rowStyle}`}
                >
                  <div className={`col-span-2 text-center font-mono text-xs md:text-base ${rankStyle}`}>
                    {rank === 1 ? '🥇' : rank === 