import type { QuizType } from '../types';
import { useSelector } from 'react-redux';
import { selectQuizzes } from '../features/userSlice.ts';

function QuizHistory() {
  const quizzes: QuizType[] | null = useSelector(selectQuizzes);
  if (!quizzes) return null;
  const sortedQuizzes = [...quizzes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

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
    <div className='mt-8 rounded-lg bg-[#1c2e42] p-6 shadow-xl'>
      <h2 className='mb-4 text-xl font-semibold'>Historique de vos quiz</h2>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-full divide-y divide-gray-700'>
          <thead>
            <tr>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-300'>
                Sujet
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-300'>
                Date
              </th>
              <th className='px-4 py-3 text-left text-sm font-medium text-gray-300'>
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
                <td className='px-4 py-3 text-sm whitespace-nowrap'>
                  {quiz.title}
                </td>
                <td className='px-4 py-3 text-sm whitespace-nowrap'>
                  {formatDate(quiz.created_at)}
                </td>
                <td className='px-4 py-3 text-sm whitespace-nowrap'>
                  <span className='rounded-full bg-green-500/20 px-2 py-1 text-green-300'>
                    {quiz.result || 'Non disponible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuizHistory;
