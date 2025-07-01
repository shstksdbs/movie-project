import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function DefaultLayout({ children }) {
  const location = useLocation();
  const isMainPage = location.pathname === '/'; // 메인페이지일 때만 조건

  return (
    <div className="app-root" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      <Header />
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...(isMainPage ? {} : { alignItems: 'center' })  // ✅ 메인페이지만 제외
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
