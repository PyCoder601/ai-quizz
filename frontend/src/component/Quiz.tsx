import { useState, useEffect } from 'react';
import type { QuizElements } from '../types';
import { motion } from 'framer-motion';

interface QuizProps {
  question: QuizElements;
  onAnswer: (selectedOption: number) => void;
  userAnswer?: number;
  questionNumber: number;
  totalQuestions: number;
}

function Quiz({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeLeft(30);
    setIsTransitioning(false);
  }, [question]);

  useEffect(() => {
    if (timeLeft <= 0 || showFeedback) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showFeedback]);

  useEffect(() => {
    if (timeLeft === 0 && selectedOption === null) {
      handleSelectOption(Math.floor(Math.random() * 4));
    }
  }, [timeLeft]);

  const handleSelectOption = (index: number) => {
    if (showFeedback) return;

    setSelectedOption(index);
    setShowFeedback(true);

    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        onAnswer(index);
      }, 300); // Faster transition
    }, 2500); // Shorter delay before next question
  };

  const getOptionClass = (index: number) => {
    if (!showFeedback) {
      return `border-slate-700 bg-slate-700 hover:bg-slate-600 ${selectedOption === index ? 'bg-teal-500 text-white' : ''}`;
    }
    if (index === question.correct_option) {
      return 'border-green-500/30 bg-green-500/10 text-green-400';
    }
    if (selectedOption === index && index !== question.correct_option) {
      return 'border-red-500/30 bg-red-500/10 text-red-400';
    }
    return 'border-slate-700 bg-slate-700 opacity-60';
  };

  const getTimeLeftClass = () => {
    if (timeLeft > 10) return 'bg-green-500/10 text-green-400';
    if (timeLeft > 5) return 'bg-orange-500/10 text-orange-400';
    return 'animate-pulse bg-red-500/10 text-red-400';
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl sm:p-8 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div className='text-sm font-medium text-slate-400'>
          Question {questionNumber}/{totalQuestions}
        </div>
        <div className='flex items-center gap-3'>
          <div className='rounded-full bg-teal-500/20 px-3 py-1 text-sm font-medium text-teal-400'>
            {question.point || 1} point{(question.point || 1) > 1 ? 's' : ''}
          </div>
          <div
            className={`rounded-full px-3 py-1 text-sm font-medium ${getTimeLeftClass()}`}
          >
            {timeLeft}s
          </div>
        </div>
      </div>

      <h2 className='mb-6 text-xl font-bold md:text-2xl'>
        {question.question}
      </h2>

      <div className='mb-4 space-y-3'>
        {Array.isArray(question.options) &&
          question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(index)}
              disabled={showFeedback}
              className={`w-full rounded-lg border p-4 text-left text-slate-100 transition-colors disabled:cursor-not-allowed ${getOptionClass(index)}`}
            >
              <div className='flex items-center'>
                <span className='mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 font-bold'>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-lg border p-4 ${
            selectedOption === question.correct_option
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-red-500/30 bg-red-500/10'
          }`}
        >
          <div className='flex items-center justify-between'>
            <h3
              className={`font-bold ${selectedOption === question.correct_option ? 'text-green-400' : 'text-red-400'}`}
            >
              {selectedOption === question.correct_option
                ? 'Correct! 👍'
                : 'Incorrect 😕'}
            </h3>
            {selectedOption === question.correct_option && (
              <span className='rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400'>
                +{question.point || 1} point
                {(question.point || 1) > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className='mt-2 text-sm text-slate-400'>
            {question.explanation}
          </p>
          <p className='mt-4 text-xs italic text-slate-400/70'>
            Passage à la question suivante...
          </p>
        </motion.div>
      )}

      <div className='mt-8 h-2.5 w-full overflow-hidden rounded-full bg-slate-700'>
        <motion.div
          className='h-full bg-teal-500'
          initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default Quiz;
