import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Layout from './components/Layout';
import PetDetail from './pages/PetDetail';
import './App.css';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Login from './pages/Login';
import { TokenProvider } from './contexts/TokenContext';
import Signup from './pages/Signup'
import ViewAccount from './pages/GetAccount';
import EditAccount from './pages/EditAccount';
import Logout from './pages/Logout';

function App() {
  return (
    <BrowserRouter>
      <TokenProvider>
        <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="search" element={<Search />} />
              <Route path="my_profile" element={<ViewAccount />} />
              <Route path="my_profile/edit" element={<EditAccount />} />
              <Route path="logout" element={<Logout />} />
              <Route path="create_listing" element={<CreateListing />} /> {/* Change to REST format? */}
              <Route path="update_listing" element={<UpdateListing />} /> {/* Change to REST format? */}
              <Route path="listing/:listingID" element={<PetDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
      </TokenProvider>
    </BrowserRouter>
  );
}

export default App;
