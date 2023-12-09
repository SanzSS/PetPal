import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Layout from './components/Layout';
import './App.css';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Notifications from './pages/Notifications';

function App() {
  return <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="search" element={<Search />} />
            <Route path="create_listing" element={<CreateListing />} /> {/* Change to REST format? */}
            <Route path="update_listing" element={<UpdateListing />} /> {/* Change to REST format? */}
            <Route path="*" element={<NotFound />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
      </Routes>
    </BrowserRouter>;
}

export default App;
