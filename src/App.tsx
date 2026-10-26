import { useState } from 'react';
import './App.css';
import LoginPage from './pages/login/page';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <LoginPage />
    </div>
  );
}

export default App;
