import { Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import CustomCursor from '@components/ui/CustomCursor.jsx';

export default function Layout() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
