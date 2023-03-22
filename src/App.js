import { RegisterPage, LoginPage, AdminLoginPage, MainPage } from 'pages';
import {AdminUsersPage,AdminTweetsPage} from 'pages/admin'
import { Route, Routes } from 'react-router-dom';
import 'styles/app.css';

export default function App() {
  return (
    <div className="app">
      <div className='container'>
          <Routes>
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/admin_login' element={<AdminLoginPage />} />
            <Route path='/main' element={<MainPage />} />
            <Route path='/admin_users' element={<AdminUsersPage />}></Route>
            <Route path='/admin_tweets' element={<AdminTweetsPage />}></Route>
          </Routes>
      </div>
    </div>
  );
}

