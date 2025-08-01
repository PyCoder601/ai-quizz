import type { QuizType } from '../types';
import { useSelector } from 'react-redux';
import { selectQuizzes } from '../features/userSlice.ts';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function QuizHistory() {
  const quizzes: QuizType[] | null = useSelector(selectQuizzes);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className='mt-12 rounded-xl border border-slate-700 bg-slate-800 p-8 text-center shadow-xl'>
        <h2 className='text-2xl font-bold'>Historique des Quiz</h2>
        <p className='mt-4 text-slate-400'>
          Vous n'avez pas encore terminé de quiz. Votre historique apparaîtra
          ici.
        </p>
      </div>
    );
  }

  const sortedQuizzes = [...quizzes]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className='mt-12 rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-xl sm:p-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Historique des 10 derniers quiz</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-sm font-semibold text-teal-400 hover:text-teal-500 md:hidden'
        >
          {isExpanded ? 'Réduire' : 'Voir tout'}
        </button>
      </div>

      {/* Desktop Table */}
      <div className='mt-6 hidden md:block'>
        <table className='w-full min-w-full divide-y divide-slate-700'>
          <thead className='bg-slate-700'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400'>
                Sujet
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400'>
                Date
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400'>
                Résultat
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-700 bg-slate-800'>
            <AnimatePresence>
              {sortedQuizzes.map((quiz) => (
                <motion.tr
                  key={quiz.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='transition-colors hover:bg-slate-700'
                >
                  <td className='whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-100'>
                    {quiz.title}
                  </td>
                  <td className='whitespace-nowrap px-4 py-4 text-sm text-slate-400'>
                    {formatDate(quiz.created_at)}
                  </td>
                  <td className='whitespace-nowrap px-4 py-4 text-sm'>
                    <span className='rounded-full bg-green-500/10 px-3 py-1 font-medium text-green-400'>
                      {quiz.result || 'N/A'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className='mt-6 md:hidden'>
        <div className='space-y-4'>
          <AnimatePresence>
            {sortedQuizzes
              .slice(0, isExpanded ? 10 : 3)
              .map((quiz) => (
                <motion.div
                  key={quiz.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='rounded-lg bg-slate-700 p-4 shadow-md'
                >
                  <div className='flex items-start justify-between'>
                    <h3 className='font-semibold text-slate-100'>
                      {quiz.title}
                    </h3>
                    <span className='ml-2 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400'>
                      {quiz.result || 'N/A'}
                    </span>
                  </div>
                  <p className='mt-2 text-xs text-slate-400'>
                    {formatDate(quiz.created_at)}
                  </p>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default QuizHistory;
