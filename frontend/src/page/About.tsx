import { motion } from 'framer-motion';

export default function About() {
  const sections = [
    {
      title: "Source d'inspiration",
      icon: '💡',
      content:
        "Ce projet est né de l'envie de créer une application de quiz interactive et intelligente. L'objectif était de permettre aux utilisateurs de générer des quiz sur n'importe quel sujet, ou même à partir de leurs propres documents, en utilisant la puissance de l'IA.",
    },
    {
      title: 'Description du projet',
      icon: '⚡️',
      content:
        "AI Quiz est une application web qui génère des quiz à la volée. Le backend, développé avec FastAPI, s'occupe de la logique de génération des quiz en faisant appel à une IA, de l'authentification des utilisateurs et de la sauvegarde des scores. Le frontend, construit avec React et TypeScript, offre une interface utilisateur réactive et moderne pour une expérience de quiz fluide.",
    },
    {
      title: 'Ma roadmap de développement',
      icon: '🗺️',
      content:
        "Le développement s'est déroulé en plusieurs étapes : d'abord, la mise en place de l'architecture backend avec l'authentification JWT et la base de données. Ensuite, l'intégration de l'IA pour la génération de quiz. Puis, la construction de l'interface avec React et Redux pour la gestion de l'état. Enfin, l'ajout des fonctionnalités comme l'historique des quiz et la génération à partir de PDF.",
    },
    {
      title: 'Le défi le plus stimulant',
      icon: '🔀',
      content:
        "Le défi le plus complexe a été d'assurer une génération de quiz pertinente et de qualité. Il a fallu affiner les prompts envoyés à l'IA, gérer les différents niveaux de difficulté et parser la réponse de l'IA pour la transformer en un quiz structuré. Garantir une expérience utilisateur rapide et sans accroc malgré le temps de réponse de l'IA a aussi été un challenge intéressant.",
    },
  ];

  return (
    <main className='flex flex-col bg-slate-900 text-slate-100 transition-colors duration-300'>
      <section className='mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-12'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='mb-12 text-center sm:mb-16'
        >
          <h1 className='text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl'>
            À propos de{' '}
            <span className='bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent'>
              Quizeo
            </span>
          </h1>
          <p className='mx-auto mt-4 max-w-3xl text-lg text-slate-400 sm:text-xl'>
            Les coulisses d'une application de quiz moderne.
          </p>
        </motion.div>

        <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className='flex h-full flex-col items-start rounded-xl bg-slate-800 p-6 shadow-lg backdrop-blur-sm'
            >
              <div className='mb-4 flex items-center gap-4'>
                <span className='text-2xl'>{section.icon}</span>
                <h2 className='text-2xl font-bold'>{section.title}</h2>
              </div>
              <p className='text-base text-slate-400'>{section.content}</p>
            </motion.div>
          ))}
        </div>

        <hr className='my-16 border-t border-slate-700' />

        <div className='flex flex-col items-center gap-12 md:flex-row'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='relative h-48 w-48'
          >
            <img
              src='/romeo.jpeg'
              alt='Développeur'
              className='h-full w-full rounded-full object-cover shadow-2xl'
            />
            <div className='absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-teal-500 to-green-600 opacity-50 blur-xl'></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='flex-1 text-center md:text-left'
          >
            <h2 className='flex items-center justify-center gap-3 text-3xl font-bold md:justify-start'>
              <span className='text-2xl'>👤</span>À propos du développeur
            </h2>
            <p className='mt-4 text-lg text-slate-400'>
              Je suis Roméo, un développeur full-stack passionné par la création
              d'applications web performantes et esthétiques. J'aime explorer de
              nouvelles technologies et construire des projets de A à Z. Ce quiz
              est un exemple de mon travail, combinant un backend robuste en
              Python (FastAPI) et un frontend moderne en TypeScript (React).
              <br />
              Email:{' '}
              <a
                href='mailto:romeomanoela18@gmail.com'
                className='font-semibold text-teal-300 hover:underline'
              >
                romeomanoela18@gmail.com
              </a>
              <br />
              GitHub:{' '}
              <a
                href='https://github.com/PyCoder601'
                target='_blank'
                rel='noopener noreferrer'
                className='font-semibold text-teal-300 hover:underline'
              >
                PyCoder601
              </a>
              <br />
              LinkedIn:{' '}
              <a
                href='https://www.linkedin.com/in/romeo-manoela18/'
                target='_blank'
                rel='noopener noreferrer'
                className='font-semibold text-teal-300 hover:underline'
              >
                Zafimanoela Roméo
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
