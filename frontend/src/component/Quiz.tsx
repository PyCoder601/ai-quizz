import { useState, useEffect } from 'react';
import type { QuizElements } from '../types';

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
  userAnswer,
  questionNumber,
  totalQuestions,
}: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 secondes par question
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset le timer et la sélection quand on change de question
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeLeft(30);
    setIsTransitioning(false);
  }, [question]);

  // Timer pour chaque question
  useEffect(() => {
    if (timeLeft <= 0 || showFeedback) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showFeedback]);

  // Soumet automatiquement quand le temps est écoulé
  useEffect(() => {
    if (timeLeft === 0 && selectedOption === null) {
      handleSelectOption(Math.floor(Math.random() * 4)); // Choix aléatoire si temps écoulé
    }
  }, [timeLeft]);

  const handleSelectOption = (index: number) => {
    if (showFeedback) return; // Empêche de changer après avoir soumis

    setSelectedOption(index);
    setShowFeedback(true);

    // Appeler onAnswer après un délai pour montrer le feedback
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        onAnswer(index);
      }, 500); // Délai pour l'animation de transition
    }, 1500); // Délai pour montrer le feedback
  };

  // Détermine la classe CSS pour chaque option
  const getOptionClass = (index: number) => {
    if (!showFeedback) {
      return selectedOption === index
        ? 'bg-blue-500 border-blue-600'
        : 'bg-[#2a4562] border-gray-600 hover:bg-[#3a5572]';
    }

    if (index === question.correct_option) {
      return 'bg-green-500/20 border-green-500';
    }

    if (selectedOption === index && index !== question.correct_option) {
      return 'bg-red-500/20 border-red-500';
    }

    return 'bg-[#2a4562] border-gray-600 opacity-50';
  };

  return (
    <div
      className={`rounded-lg bg-[#1c2e42] p-8 shadow-xl transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className='mb-6 flex items-center justify-between'>
        <div className='text-sm font-medium text-gray-300'>
          Question {questionNumber}/{totalQuestions}
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            timeLeft > 10
              ? 'bg-green-500/20 text-green-300'
              : timeLeft > 5
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'animate-pulse bg-red-500/20 text-red-300'
          }`}
        >
          {timeLeft} secondes
        </div>
      </div>

      <h2 className='mb-8 text-xl font-bold md:text-2xl'>
        {question.question}
      </h2>

      <div className='mb-8 space-y-4'>
        {Array.isArray(question.options) &&
          question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(index)}
              disabled={showFeedback}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${getOptionClass(index)}`}
            >
              <div className='flex items-start'>
                <span className='mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#243B55]'>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
      </div>

      {showFeedback && (
        <div
          className={`mt-6 rounded-lg p-4 ${
            selectedOption === question.correct_option
              ? 'border border-green-500 bg-green-500/20'
              : 'border border-red-500 bg-red-500/20'
          }`}
        >
          <h3 className='mb-2 font-bold'>
            {selectedOption === question.correct_option
              ? 'Correct! 👍'
              : 'Incorrect 😕'}
          </h3>
          <p className='text-gray-300'>{question.explanation}</p>
          <p className='mt-4 text-sm text-gray-400 italic'>
            Passage à la question suivante...
          </p>
        </div>
      )}

      <div className='mt-8 h-2 overflow-hidden rounded-full bg-gray-700'>
        <div
          className='h-full bg-blue-500 transition-all duration-300 ease-out'
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Quiz;
