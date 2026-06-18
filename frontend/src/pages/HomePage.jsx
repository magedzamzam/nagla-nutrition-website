import { useEffect } from 'react';
import Ribbon from '../components/Ribbon.jsx';
import Nav from '../components/Nav.jsx';
import Masthead from '../components/Masthead.jsx';
import PullQuote from '../components/PullQuote.jsx';
import Bio from '../components/Bio.jsx';
import Specialties from '../components/Specialties.jsx';
import Stories from '../components/Stories.jsx';
import Gallery from '../components/Gallery.jsx';
import Contact from '../components/Contact.jsx';
import Locations from '../components/Locations.jsx';
import Footer from '../components/Footer.jsx';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Dr. Nagla F. ElSalawy — Certified Nutrition Consultant & Clinical Pathologist | Cairo, Egypt';
  }, []);

  return (
    <>
      <Ribbon />
      <Nav />
      <main>
        <Masthead />
        <PullQuote />
        <Bio />
        <Specialties />
        <Stories />
        <Gallery />
        <Contact />
        <Locations />
      </main>
      <Footer />
    </>
  );
}
