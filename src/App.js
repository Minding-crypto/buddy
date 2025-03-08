import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import SwipePage from './Pages/SwipePage';
import Garden from './Pages/Garden';
import ProfilePage from './Pages/ProfilePage';
import CreateGarden from './Pages/CreateGarden';
import SignUp from './Pages/SignUp';
import Login from './Pages/Login';
import TermsAndConditions from './Pages/TermsAndConditions';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import CookiesPolicy from './Pages/CookiesPolicy';
import GardeningGuidelines from './Pages/GardeningGuidelines';

function App() {
  
  return (
    <div className="App">
      <Router>
          <Routes>
            {/* Define routes here */}
            <Route path="/" element={<HomePage />} />
            <Route path = '/SwipePage' element={<SwipePage/>}/>
            <Route path="/Garden/:gardenId" element={<Garden/>} />

            <Route path = '/profilepage' element={<ProfilePage/>}/>
            <Route path = '/CreateGarden' element={<CreateGarden/>}/>
            <Route path = '/SignUp' element={<SignUp />}/>
            <Route path = '/Login' element={<Login />}/>
            <Route path = '/terms' element={<TermsAndConditions />}/>
            <Route path = '/privacy' element={<PrivacyPolicy />}/>
            <Route path = '/cookie' element={<CookiesPolicy />}/>
            <Route path = '/guide' element={<GardeningGuidelines/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
