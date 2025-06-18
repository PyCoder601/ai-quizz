import React, { useState } from 'react';
import type { QuizType, QuizElements } from '../types';
import Quiz from '../component/Quiz';
import api from '../apis/api.ts';

function Dashboard() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setScore(0);

    try {
      const response = await api.post('/generate-quiz', {
        topic,
        difficulty,
        number_of_questions: numberOfQuestions,
      });
      const { data } = response;
      // Traitement des options qui peuvent être sous forme de string JSON
      const processedQuiz = {
        ...data,
        elements: data.elements.map((element: QuizElements) => ({
          ...element,
          options:
            typeof element.options === 'string'
              ? JSON.parse(element.options)
              : element.options,
        })),
      };

      setQuiz(processedQuiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedOption: number) => {
    if (!quiz || quizCompleted) return;

    const currentQuestion = quiz.elements[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_option;

    // Mettre à jour les réponses de l'utilisateur
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    // Mettre à jour le score
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    // Passer à la question suivante ou terminer le quiz
    if (currentQuestionIndex < quiz.elements.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setScore(0);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#243B55] to-[#141E30] p-6 text-white'>
      <div className='mx-auto max-w-4xl'>
        {!quiz ? (
          <div className='rounded-lg bg-[#1c2e42] p-8 shadow-xl'>
            <h1 className='mb-6 text-center text-3xl font-bold'>
              Générer un Quiz
            </h1>
            <p className='mb-8 text-center text-gray-300'>
              Complétez ce formulaire pour générer votre quiz personnalisé
            </p>

            {error && (
              <div className='mb-6 rounded-lg border border-red-500 bg-red-500/20 p-4 text-red-100'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='topic'
                  className='mb-2 block text-sm font-medium'
                >
                  Sujet du quiz
                </label>
                <input
                  id='topic'
                  type='text'
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder='Ex: Python, Histoire de France, Mathématiques...'
                  className='w-full rounded-lg border border-gray-600 bg-[#2a4562] p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='numberOfQuestions'
                  className='mb-2 block text-sm font-medium'
                >
                  Nombre de questions
                </label>
                <input
                  id='numberOfQuestions'
                  type='number'
                  min='1'
                  max='20'
                  value={numberOfQuestions}
                  onChange={(e) =>
                    setNumberOfQuestions(parseInt(e.target.value))
                  }
                  className='w-full rounded-lg border border-gray-600 bg-[#2a4562] p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='difficulty'
                  className='mb-2 block text-sm font-medium'
                >
                  Niveau de difficulté
                </label>
                <select
                  id='difficulty'
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className='w-full rounded-lg border border-gray-600 bg-[#2a4562] p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                >
                  <option value='easy'>Facile</option>
                  <option value='medium'>Moyen</option>
                  <option value='hard'>Difficile</option>
                </select>
              </div>

              <button
                type='submit'
                className='flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Génération en cours...
                  </>
                ) : (
                  'Générer mon Quiz'
                )}
              </button>
            </form>
          </div>
        ) : quizCompleted ? (
          <div className='rounded-lg bg-[#1c2e42] p-8 text-center shadow-xl'>
            <h2 className='mb-4 text-3xl font-bold'>Quiz terminé!</h2>
            <div className='my-8 text-5xl font-bold'>
              Score: {score}/{quiz.elements.length}
              <p className='mt-2 text-lg font-normal text-gray-300'>
                {score === quiz.elements.length
                  ? 'Parfait! Vous avez tout bon!'
                  : score > quiz.elements.length / 2
                    ? 'Bien joué!'
                    : 'Continuez à vous entraîner!'}
              </p>
            </div>

            <div className='mt-8 space-y-6'>
              <h3 className='text-xl font-semibold'>
                Récapitulatif des réponses:
              </h3>
              {quiz.elements.map((question, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 ${
                    userAnswers[index] === question.correct_option
                      ? 'border border-green-500 bg-green-500/20'
                      : 'border border-red-500 bg-red-500/20'
                  }`}
                >
                  <p className='font-medium'>{question.question}</p>
                  <p className='mt-2 text-sm'>
                    Votre réponse: {question.options[userAnswers[index]]}
                  </p>
                  {userAnswers[index] !== question.correct_option && (
                    <p className='mt-1 text-sm text-green-300'>
                      Réponse correcte:{' '}
                      {question.options[question.correct_option]}
                    </p>
                  )}
                  <p className='mt-2 text-sm text-gray-300'>
                    {question.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className='mt-8 space-x-4'>
              <button
                onClick={restartQuiz}
                className='rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600'
              >
                Recommencer ce quiz
              </button>
              <button
                onClick={() => setQuiz(null)}
                className='rounded-lg bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-700'
              >
                Créer un nouveau quiz
              </button>
            </div>
          </div>
        ) : (
          <div className='relative'>
            <Quiz
              question={quiz.elements[currentQuestionIndex]}
              onAnswer={handleAnswer}
              userAnswer={userAnswers[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quiz.elements.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
