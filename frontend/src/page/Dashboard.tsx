import React, { useState } from 'react';
import type { QuizType, QuizElements, QuotaType } from '../types';
import Quiz from '../component/Quiz';
import QuizHistory from '../component/QuizHistory';
import api, { logout } from '../apis/api.ts';
import { useDispatch, useSelector } from 'react-redux';
import {
  addQuiz,
  decrementQuota,
  selectCurrQuiz,
  selectQuota,
  setCurrentQuiz,
} from '../features/userSlice.ts';
import type { AppDispatch } from '../store.ts';
import { getRemainingTime } from '../helpers.ts';

function Dashboard() {
  const quiz: QuizType | null = useSelector(selectCurrQuiz);
  const quota: QuotaType = useSelector(selectQuota);

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    dispatch(setCurrentQuiz(null));
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setScore(0);
    setTotalPoints(0);
    setEarnedPoints(0);

    try {
      const response = await api.post('/generate-quiz', {
        topic,
        difficulty,
        number_of_questions: numberOfQuestions,
      });

      const { data } = response;

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

      const totalPossiblePoints = processedQuiz.elements.reduce(
        (sum: number, question: QuizElements) => sum + (question.point || 1),
        0,
      );
      setTotalPoints(totalPossiblePoints);
      dispatch(setCurrentQuiz(processedQuiz));
      dispatch(decrementQuota());
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

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setEarnedPoints(
        (prevPoints) => prevPoints + (currentQuestion.point || 1),
      );
    }

    if (currentQuestionIndex < quiz.elements.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const saveQuizResult = async () => {
    if (!quiz) return;

    setIsSaving(true);
    setSaveError('');

    try {
      await api.patch(`/quizzes-resul/${quiz.id}`, {
        result: `${earnedPoints}/${totalPoints}`,
      });
      const updatedQuiz: QuizType = {
        ...quiz,
        result: `${earnedPoints}/${totalPoints}`,
      };
      dispatch(addQuiz(updatedQuiz));
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const restartQuiz = async () => {
    if (quiz && quiz.id && !quiz.result) {
      await saveQuizResult();
    }

    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setScore(0);
    setEarnedPoints(0);
  };

  const createNewQuiz = async () => {
    if (quiz && quiz.id && !quiz.result) {
      await saveQuizResult();
    }

    dispatch(setCurrentQuiz(null));
  };

  return (
    <div
      className={
        'mx-auto min-h-screen max-w-[95%] sm:max-w-4/6' +
        ' p-4 text-white md:p-6'
      }
    >
      <div>
        <div className='mb-6 rounded-lg bg-[#1c2e42] p-4 shadow-lg'>
          <div className='flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0'>
            <h1 className='text-xl font-bold sm:text-2xl'>QUIZ AI APP</h1>
            <h1
              className='cursor-pointer rounded-2xl bg-red-400 px-2 py-1 text-xl font-bold text-[#1c2e42] sm:text-2xl'
              onClick={logout}
            >
              se deconnécter
            </h1>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-300'>Quiz restants :</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  quota.quota_remaining > 1
                    ? 'bg-green-500/20 text-green-300'
                    : quota.quota_remaining > 0
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                }`}
              >
                {quota.quota_remaining}
              </span>
            </div>
          </div>
        </div>

        <div className=''>
          {!quiz ? (
            <div className='rounded-lg bg-[#1c2e42] p-6 shadow-xl'>
              <h2 className='mb-6 text-center text-2xl font-bold'>
                Générer un Quiz
              </h2>
              <p className='mb-6 text-center text-gray-300'>
                Complétez ce formulaire pour générer votre quiz personnalisé
              </p>

              {error && (
                <div className='mb-6 rounded-lg border border-red-500 bg-red-500/20 p-4 text-red-100'>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-4'>
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
                    placeholder='Ex: Culture Générale, Mathématiques, ...'
                    className={
                      'w-full rounded-lg border border-gray-600 ' +
                      'bg-[#2a4562] p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    }
                    required
                  />
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
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
                      onChange={(e) => {
                        let n: number = parseInt(e.target.value);
                        if (n > 10) n = 10;
                        setNumberOfQuestions(n);
                      }}
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
                </div>

                <button
                  type='submit'
                  className='mt-4 flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-gray-500'
                  disabled={isLoading || quota.quota_remaining <= 0}
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
                  ) : quota.quota_remaining <= 0 ? (
                    getRemainingTime(quota.last_reset)
                  ) : (
                    'Générer mon Quiz'
                  )}
                </button>
              </form>
            </div>
          ) : quizCompleted ? (
            <div className='rounded-lg bg-[#1c2e42] p-6 shadow-xl'>
              <h2 className='mb-4 text-center text-2xl font-bold'>
                Quiz terminé!
              </h2>
              <div className='my-6 text-center'>
                <div className='text-4xl font-bold'>
                  Score: {score}/{quiz.elements.length}
                </div>
                <div className='mt-2 text-2xl font-bold text-blue-300'>
                  Points: {earnedPoints}/{totalPoints}
                </div>
                <p className='mt-2 text-gray-300'>
                  {earnedPoints === totalPoints
                    ? 'Parfait! Vous avez tout bon!'
                    : earnedPoints > totalPoints / 2
                      ? 'Bien joué!'
                      : 'Continuez à vous entraîner!'}
                </p>
              </div>

              {saveError && (
                <div className='mx-auto mb-6 max-w-md rounded-lg border border-red-500 bg-red-500/20 p-4 text-red-100'>
                  {saveError}
                </div>
              )}

              <div className='mt-6 space-y-4'>
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
                    <div className='mt-1 flex items-center justify-between'>
                      <span className='text-sm text-blue-300'>
                        Points: {question.point || 1}
                      </span>
                    </div>
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

              <div className='mt-6 flex flex-wrap justify-center gap-4'>
                <button
                  onClick={restartQuiz}
                  className='rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-gray-500'
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg
                        className='mr-2 inline h-4 w-4 animate-spin'
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
                      Sauvegarde...
                    </>
                  ) : (
                    'Recommencer ce quiz'
                  )}
                </button>
                <button
                  onClick={createNewQuiz}
                  className='rounded-lg bg-gray-600 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-700 disabled:bg-gray-500'
                  disabled={isSaving}
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

        <QuizHistory />
      </div>
    </div>
  );
}

export default Dashboard;
