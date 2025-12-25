import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ClassesSection from './components/ClassesSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ClassesSection />
      <Footer />
    </main>
  );
}
