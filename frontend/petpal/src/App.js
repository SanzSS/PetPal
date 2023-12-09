import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Layout from './components/Layout';
import PetDetail from './pages/PetDetail';
import './App.css';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import { TokenProvider } from './contexts/TokenContext';
import Signup from './pages/Signup'
import ViewAccount from './pages/GetAccount';
import EditAccount from './pages/EditAccount';
import Logout from './pages/Logout';
import { UserTypeProvider } from './contexts/UserTypeContext';
import CreateApplication from './pages/CreateApplication';
import ListApplications from './pages/ListApplication';
import ViewShelter from './pages/ViewShelter';

function App() {
  return (
    <BrowserRouter>
      <TokenProvider>
      <UserTypeProvider>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="search" />} />
              <Route path="search" element={<Search />} />
              <Route path="account" element={<ViewAccount />} />
              <Route path="account/edit" element={<EditAccount />} />
              <Route path="user/:userID" element={<ViewAccount />} />
              <Route path="logout" element={<Logout />} />
              <Route path="create_listing" element={<CreateListing />} /> {/* Change to REST format? */}
              <Route path="update_listing/:listingID" element={<UpdateListing />} /> {/* Change to REST format? */}
              <Route path="listing/:listingID" element={<PetDetail />} />
              <Route path="*" element={<NotFound />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="listing/:petID/apply" element={< CreateApplication /> } />
              <Route path="my_applications" element={< ListApplications /> } /> {/* seeker and shelter */}
              <Route path="shelter/:shelterID" element={<ViewShelter />} />
            </Route>
        </Routes>
      </UserTypeProvider>
      </TokenProvider>
    </BrowserRouter>
  );

}

export default App;
