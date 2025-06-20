import Auth from '../component/Auth.tsx';
import { useEffect } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

function Home() {
  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${BASE_URL}/stay-online`, {
        withCredentials: true,
      });
    };

    fetchData().catch();

    const interval = setInterval(fetchData, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className='mx-auto min-h-screen max-w-[95%] text-white sm:max-w-4/6'>
      <div className='container mx-auto px-2 py-12 sm:px-4'>
        <div className='mx-auto mb-16 max-w-4xl space-y-12'>
          <section className='space-y-4 text-center'>
            <h1 className={'text-4xl leading-tight font-bold md:text-5xl'}>
              AI QUIZ
            </h1>
            <h1 className='text-2xl leading-tight font-bold md:text-3xl'>
              Apprenez en vous amusant avec des quiz générés par l'IA
            </h1>
            <p className='mx-auto max-w-3xl text-lg text-gray-300'>
              Développez vos compétences, testez vos connaissances, et laissez
              l'intelligence artificielle créer des défis adaptés à votre
              niveau.
            </p>
          </section>
          {/* Formulaire de login/signup */}
          <Auth />
          {/* Pourquoi ce site */}
          <section className='space-y-4 text-center'>
            <h2 className='text-2xl font-semibold'>
              💡 Apprendre n'a jamais été aussi interactif.
            </h2>
            <p className='text-gray-300'>
              Grâce à notre système intelligent, chaque quiz est conçu
              spécialement pour vous. Que vous soyez étudiant, curieux, ou
              passionné, notre IA vous propose des questions toujours
              pertinentes et engageantes.
            </p>
          </section>

          {/* Fonctionnalités clés */}
          <section className='space-y-6 text-center'>
            <h2 className='text-2xl font-semibold'>💻 Fonctionnalités clés</h2>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='rounded-lg bg-[#1c2e42] p-5 transition-colors hover:bg-[#2a4562]'>
                <h3 className='mb-2 font-medium'>Génération instantanée</h3>
                <p className='text-sm text-gray-300'>
                  Des quiz créés en temps réel par notre IA avancée
                </p>
              </div>
              <div className='rounded-lg bg-[#1c2e42] p-5 transition-colors hover:bg-[#2a4562]'>
                <h3 className='mb-2 font-medium'>Tous niveaux</h3>
                <p className='text-sm text-gray-300'>
                  Adapté à tous : facile, moyen, difficile
                </p>
              </div>
              <div className='rounded-lg bg-[#1c2e42] p-5 transition-colors hover:bg-[#2a4562]'>
                <h3 className='mb-2 font-medium'>Sujets variés</h3>
                <p className='text-sm text-gray-300'>
                  De nombreux thèmes disponibles pour tous les goûts
                </p>
              </div>
              <div className='rounded-lg bg-[#1c2e42] p-5 transition-colors hover:bg-[#2a4562]'>
                <h3 className='mb-2 font-medium'>Espace personnel</h3>
                <p className='text-sm text-gray-300'>
                  Suivez votre progression avec un historique détaillé
                </p>
              </div>
              <div className='rounded-lg bg-[#1c2e42] p-5 transition-colors hover:bg-[#2a4562]'>
                <h3 className='mb-2 font-medium'>Évaluation immédiate</h3>
                <p className='text-sm text-gray-300'>
                  Recevez des explications détaillées pour chaque réponse
                </p>
              </div>
            </div>
          </section>

          {/* Exemples de thèmes */}
          <section className='space-y-6 text-center'>
            <h2 className='text-2xl font-semibold'>🛠️ Exemples de thèmes</h2>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              {[
                'Python pour débutants',
                'Culture Générale',
                "Quiz sur l'Histoire de l'Afrique",
                'Mathématiques',
                'Anglais niveau collège',
                'Informatique & Logique',
              ].map((theme) => (
                <div
                  key={theme}
                  className='cursor-pointer rounded-lg bg-[#1c2e42] p-4 text-center transition-colors hover:bg-[#2a4562]'
                >
                  {theme}
                </div>
              ))}
            </div>
          </section>

          {/* À propos */}
          <section className='space-y-4 rounded-lg bg-[#1c2e42] p-6 text-center'>
            <h2 className='text-2xl font-semibold'>☺️ À propos du projet</h2>
            <p className='font-medium'>
              Un projet éducatif basé sur l'intelligence artificielle.
            </p>
            <p className='text-gray-300'>
              Ce site a été créé pour aider les apprenants à pratiquer
              activement leurs connaissances via des quiz intelligents, générés
              dynamiquement à partir d'un moteur IA entraîné sur du contenu
              pédagogique fiable.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;
