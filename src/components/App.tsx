import * as React from 'react';
import Footer from './Footer';
import Instructions from './Instructions';
import Minesweeper from './Minesweeper';
import Title from './Title';

const App: React.FC = () => (
  <div className="container">
    <Title text="Minesweeper" />
    <Instructions />
    <Minesweeper />
    <Footer />
  </div>
);

export default App;
