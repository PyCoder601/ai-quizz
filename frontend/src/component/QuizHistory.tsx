import type { QuizType } from '../types';
import { useSelector } from 'react-redux';
import { selectQuizzes } from '../features/userSlice.ts';
import { useState } from 'react';

function QuizHistory() {
  const quizzes: QuizType[] | null = useSelector(selectQuizzes);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!quizzes) return null;

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
    <div className='mt-8 rounded-lg bg-[#1c2e42] p-2 shadow-xl sm:p-6'>
      <div className='flex items-center justify-between'>
        <h2 className='mb-4 text-xl font-semibold'>
          Historique de vos 10 derniers quiz
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='mb-4 text-sm text-blue-300 md:hidden'
        >
          {isExpanded ? 'Réduire' : 'Voir tout'}
        </button>
      </div>

      {/* Version desktop: tableau standard */}
      <div className='hidden md:block'>
        <table className='w-full min-w-full divide-y divide-gray-700'>
          <thead>
            <tr>
              <th className='px-2 py-3 text-left text-sm font-medium text-gray-300'>
                Sujet
              </th>
              <th className='px-2 py-3 text-left text-sm font-medium text-gray-300'>
                Date
              </th>
              <th className='px-2 py-3 text-left text-sm font-medium text-gray-300'>
                Résultat
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {sortedQuizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className='transition-colors hover:bg-[#243B55]'
              >
                <td className='px-2 py-3 text-sm whitespace-nowrap'>
                  {quiz.title}
                </td>
                <td className='px-2 py-3 text-sm whitespace-nowrap'>
                  {formatDate(quiz.created_at)}
                </td>
                <td className='px-2 py-3 text-sm whitespace-nowrap'>
                  <span className='rounded-full bg-green-500/20 px-2 py-1 text-green-300'>
                    {quiz.result || 'Non disponible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='md:hidden'>
        <div className='space-y-3'>
          {sortedQuizzes.slice(0, isExpanded ? 10 : 3).map((quiz) => (
            <div
              key={quiz.id}
              className='rounded-lg bg-[#243B55] p-3 shadow transition-colors hover:bg-[#2a4562]'
            >
              <div className='flex justify-between'>
                <h3 className='font-medium'>{quiz.title}</h3>
                <span className='rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300'>
                  {quiz.result || 'Non disponible'}
                </span>
              </div>
              <p className='mt-1 text-xs text-gray-400'>
                {formatDate(quiz.created_at)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizHistory;
