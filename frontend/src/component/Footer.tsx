import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className={`mt-auto py-4 text-center text-sm`}>
      © 2025 Quizeo: Conçu et developpé par{' '}
      <Link to={'mailto:romeomanoela18@gmail.com'} className={'font-semibold'}>
        Zafimanoela Romeo
      </Link>
    </footer>
  );
}

export default Footer;
