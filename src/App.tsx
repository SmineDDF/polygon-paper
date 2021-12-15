import { useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { Draw } from './Draw';
import image from './image1.png';

function App() {
  const canvas = useRef(null);

  useEffect(() => {
    const draw = new Draw();

    if (canvas.current) {
      draw.init(canvas.current, image);
    }
  }, [])

  return (
    <div className="App">
      <canvas ref={canvas} width={1000} height={1000} style={{ border: '1px solid black' }} />
    </div>
  );
}

export default App;
