import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import './App.css';

function App() {
  return <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
    </BrowserRouter>;
}

export default App;
