import Auth from '../component/Auth.tsx';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice.ts';
import { Link } from 'react-router-dom';

function Home() {
  const user = useSelector(selectUser);
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='mx-auto min-h-screen w-full'>
      <div className='container mx-auto px-4 py-6 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='space-y-6 text-center md:text-left'
          >
            <h1 className='text-4xl font-extrabold text-teal-300 md:text-7xl'>
              QUIZEO
            </h1>
            <h2 className='text-2xl leading-tight font-semibold text-slate-400 md:text-3xl'>
              Apprenez en vous amusant avec des quiz générés par l'IA
            </h2>
            <p className='mx-auto max-w-2xl text-lg'>
              Développez vos compétences, testez vos connaissances, et laissez
              l'intelligence artificielle créer des défis adaptés à votre
              niveau.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user === null ? (
              <Auth />
            ) : (
              <Link
                to={'/espace-compte'}
                className='rounded-lg bg-teal-300/10 px-4 py-2 text-4xl font-semibold text-teal-300'
              >
                Revenir dans l'espace compte
              </Link>
            )}
          </motion.div>
        </div>

        <div className='mx-auto mt-12 max-w-5xl space-y-12'>
          <motion.section
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={featureVariants}
            className='space-y-4 text-center'
          >
            <h2 className='text-3xl font-bold'>
              💡 Apprendre n'a jamais été aussi interactif.
            </h2>
            <p className='mx-auto max-w-3xl text-lg text-slate-400'>
              Grâce à notre système intelligent, chaque quiz est conçu
              spécialement pour vous. Que vous soyez étudiant, curieux, ou
              passionné, notre IA vous propose des questions toujours
              pertinentes et engageantes.
            </p>
          </motion.section>

          <motion.section
            id='features'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={featureVariants}
            className='space-y-8'
          >
            <h2 className='text-center text-3xl font-bold'>
              💻 Fonctionnalités clés
            </h2>
            <div className='grid gap-6 md:grid-cols-3'>
              {[
                'Génération instantanée',
                'Tous niveaux',
                'Sujets variés',
                'Espace personnel',
                'Évaluation immédiate',
                'Basé sur vos PDF',
              ].map((feature) => (
                <motion.div
                  key={feature}
                  variants={itemVariants}
                  className='rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl'
                >
                  <h3 className='mb-2 text-xl font-semibold'>{feature}</h3>
                  <p className='text-slate-400'>
                    {
                      {
                        'Génération instantanée':
                          'Des quiz créés en temps réel par GEMINI.',
                        'Tous niveaux':
                          'Adapté à tous : facile, moyen, difficile.',
                        'Sujets variés':
                          'De nombreux thèmes disponibles pour tous les goûts.',
                        'Espace personnel':
                          'Suivez votre progression avec un historique détaillé.',
                        'Évaluation immédiate':
                          'Recevez des explications détaillées pour chaque réponse.',
                        'Basé sur vos PDF':
                          'Générez des quiz directement depuis vos documents PDF.',
                      }[feature]
                    }
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={featureVariants}
            className='space-y-8'
          >
            <h2 className='text-center text-3xl font-bold'>
              🛠️ Exemples de thèmes
            </h2>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              {[
                'Python pour débutants',
                'Culture Générale',
                "Histoire de l'Afrique",
                'Mathématiques',
                'Anglais niveau collège',
                'Informatique & Logique',
              ].map((theme) => (
                <motion.div
                  key={theme}
                  variants={itemVariants}
                  className='cursor-pointer rounded-lg bg-slate-800 p-4 text-center shadow-md transition-colors hover:bg-slate-700'
                >
                  {theme}
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default Home;
