import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Layout from './components/Layout';
import PetDetail from './pages/PetDetail';
import './App.css';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';

function App() {
  return <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="search" element={<Search />} />
            <Route path="create_listing" element={<CreateListing />} /> {/* Change to REST format? */}
            <Route path="update_listing/:listingID" element={<UpdateListing />} /> {/* Change to REST format? */}
            <Route path="listing/:listingID" element={<PetDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
    </BrowserRouter>;
}

export default App;
