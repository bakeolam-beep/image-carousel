import { carouselImages } from './data/images';
import { ImageCarousel } from './components/ImageCarousel';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Image Carousel</h1>
        <p className="app__subtitle">A smooth, responsive image slider with navigation controls</p>
      </header>
      <main className="app__main">
        <ImageCarousel images={carouselImages} />
      </main>
    </div>
  );
}

export default App;