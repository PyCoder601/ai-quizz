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
import { motion } from 'framer-motion';

function Dashboard() {
  const quiz: QuizType | null = useSelector(selectCurrQuiz);
  const quota: QuotaType = useSelector(selectQuota);

  const [topic, setTopic] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'topic' | 'pdf'>('topic');
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

    if (inputType === 'topic' && !topic.trim()) {
      setError('Veuillez entrer un sujet.');
      return;
    }
    if (inputType === 'pdf' && !file) {
      setError('Veuillez sélectionner un fichier PDF.');
      return;
    }

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
      let response;
      if (inputType === 'topic') {
        response = await api.post('/generate-quiz-from-topic', {
          topic,
          difficulty,
          number_of_questions: numberOfQuestions,
        });
      } else {
        const formData = new FormData();
        formData.append('difficulty', difficulty);
        formData.append('number_of_questions', String(numberOfQuestions));
        if (file) {
          formData.append('file', file);
        }
        response = await api.post('/generate-quiz-from-pdf', formData);
      }

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

  const getQuotaClass = () => {
    if (quota.quota_remaining > 2) return 'bg-green-500/10 text-green-400';
    if (quota.quota_remaining > 0) return 'bg-orange-500/10 text-orange-400';
    return 'bg-red-500/10 text-red-400';
  };

  return (
    <div className='mx-auto w-full p-4 text-slate-100 md:p-6'>
      <header className='mb-8 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <h1 className='text-2xl font-bold'>Tableau de Bord</h1>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-slate-400'>
                Quiz restants :
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getQuotaClass()}`}
              >
                {quota.quota_remaining}
              </span>
            </div>
            <button
              onClick={logout}
              className='rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600'
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main>
        {!quiz ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl'
          >
            <h2 className='mb-2 text-center text-3xl font-bold'>
              Générer un Quiz
            </h2>
            <p className='mb-6 text-center text-slate-400'>
              Complétez ce formulaire pour générer votre quiz personnalisé.
            </p>

            {error && (
              <div className='mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='mx-auto max-w-2xl space-y-6'>
              <div className='flex justify-center rounded-lg bg-slate-700 p-1'>
                <button
                  type='button'
                  onClick={() => {
                    setInputType('topic');
                    setFile(null);
                  }}
                  className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    inputType === 'topic'
                      ? 'bg-teal-500 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Sujet
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setInputType('pdf');
                    setTopic('');
                  }}
                  className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    inputType === 'pdf'
                      ? 'bg-teal-500 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  PDF
                </button>
              </div>

              {inputType === 'topic' ? (
                <div>
                  <label
                    htmlFor='topic'
                    className='mb-2 block text-sm font-medium text-slate-400'
                  >
                    Sujet du quiz
                  </label>
                  <input
                    id='topic'
                    type='text'
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder='Ex: Culture Générale, Mathématiques, ...'
                    className='w-full rounded-lg border border-slate-700 bg-slate-700 p-3 text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
                    required={inputType === 'topic'}
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor='file'
                    className='mb-2 block text-sm font-medium text-slate-400'
                  >
                    Fichier PDF
                  </label>
                  <input
                    id='file'
                    type='file'
                    accept='.pdf'
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className='w-full rounded-lg border border-slate-700 bg-slate-700 text-sm text-slate-400 file:mr-4 file:rounded-l-lg file:border-0 file:bg-teal-500 file:px-4 file:py-3 file:font-semibold file:text-white hover:file:bg-teal-600'
                    required={inputType === 'pdf'}
                  />
                </div>
              )}

              <div className='grid gap-6 sm:grid-cols-2'>
                <div>
                  <label
                    htmlFor='numberOfQuestions'
                    className='mb-2 block text-sm font-medium text-slate-400'
                  >
                    Nombre de questions
                  </label>
                  <input
                    id='numberOfQuestions'
                    type='number'
                    min='1'
                    max='10'
                    value={numberOfQuestions}
                    onChange={(e) =>
                      setNumberOfQuestions(Number(e.target.value))
                    }
                    className='w-full rounded-lg border border-slate-700 bg-slate-700 p-3 text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='difficulty'
                    className='mb-2 block text-sm font-medium text-slate-400'
                  >
                    Niveau de difficulté
                  </label>
                  <select
                    id='difficulty'
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className='w-full rounded-lg border border-slate-700 bg-slate-700 p-3 text-slate-100 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
                  >
                    <option value='easy'>Facile</option>
                    <option value='medium'>Moyen</option>
                    <option value='hard'>Difficile</option>
                  </select>
                </div>
              </div>

              <button
                type='submit'
                className='flex w-full items-center justify-center rounded-full bg-teal-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-500'
                disabled={isLoading || quota.quota_remaining <= 0}
              >
                {isLoading ? (
                  <>
                    <svg
                      className='-ml-1 mr-3 h-5 w-5 animate-spin'
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
          </motion.div>
        ) : quizCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl'
          >
            <h2 className='mb-4 text-center text-3xl font-bold'>
              Quiz terminé!
            </h2>
            <div className='my-6 text-center'>
              <div className='text-5xl font-bold'>
                Score: {score}/{quiz.elements.length}
              </div>
              <div className='mt-2 text-3xl font-bold text-teal-400'>
                Points: {earnedPoints}/{totalPoints}
              </div>
              <p className='mt-4 text-slate-400'>
                {earnedPoints === totalPoints
                  ? 'Parfait! Vous avez tout bon!'
                  : earnedPoints > totalPoints / 2
                    ? 'Bien joué!'
                    : 'Continuez à vous entraîner!'}
              </p>
            </div>

            {saveError && (
              <div className='mx-auto mb-6 max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400'>
                {saveError}
              </div>
            )}

            <div className='mt-8 space-y-4'>
              <h3 className='text-xl font-semibold'>
                Récapitulatif des réponses:
              </h3>
              {quiz.elements.map((question, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${
                    userAnswers[index] === question.correct_option
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-red-500/30 bg-red-500/10'
                  }`}
                >
                  <p className='font-medium'>{question.question}</p>
                  <div className='mt-1 flex items-center justify-between'>
                    <span className='text-sm text-teal-400'>
                      Points: {question.point || 1}
                    </span>
                  </div>
                  <p className='mt-2 text-sm text-slate-400'>
                    Votre réponse: {question.options[userAnswers[index]]}
                  </p>
                  {userAnswers[index] !== question.correct_option && (
                    <p className='mt-1 text-sm text-green-400'>
                      Réponse correcte:{' '}
                      {question.options[question.correct_option]}
                    </p>
                  )}
                  <p className='mt-2 text-sm italic text-slate-400'>
                    {question.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className='mt-8 flex flex-wrap justify-center gap-4'>
              <button
                onClick={restartQuiz}
                className='rounded-lg bg-teal-500 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-600 disabled:bg-slate-500'
                disabled={isSaving}
              >
                {isSaving ? 'Sauvegarde...' : 'Recommencer ce quiz'}
              </button>
              <button
                onClick={createNewQuiz}
                className='rounded-lg bg-slate-700 px-6 py-2 font-medium text-slate-100 transition-colors hover:bg-slate-600 disabled:bg-slate-500'
                disabled={isSaving}
              >
                Créer un nouveau quiz
              </button>
            </div>
          </motion.div>
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

        <QuizHistory />
      </main>
    </div>
  );
}

export default Dashboard;
