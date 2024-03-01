import { Routes, Route, Outlet } from "react-router-dom";
// Custom Components
import Header from './components/Header';
import AuthRoute from "./components/AuthRoute";
import PersistLogin from "./components/PersistLogin";
// Pages
import Home from "./pages/home";
import NotFound from './pages/not-found';
import Admin from "./pages/admin";
import Wordle from "./pages/wordle";
import Message from "./pages/message";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Pool from "./pages/pool";
import PoolGame from "./pages/pool/PoolGame";
import PoolGameUsers from "./pages/pool/PoolGameUsers";
import Profile from "./pages/profile";

function App() {
  return (
    <Routes>
      <Route>
        <Route element={<Layout />} >
          <Route element={<PersistLogin />}>
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Home />} />
            <Route element={<AuthRoute permission='admin' />}>
              <Route path='/admin' element={<Admin />} />
            </Route>
            <Route element={<AuthRoute permission='admin' />}>
              <Route path='/wordle' element={<Wordle />} />
            </Route>
            <Route element={<AuthRoute permission='admin' />}>
              <Route path='/message' element={<Message />} />
            </Route>
            <Route element={<AuthRoute permission='pool' />}>
              <Route path='/pool' element={<Pool />} />
              <Route path='/pool/new' element={<PoolGameUsers />} />
              <Route path='/pool/:pool_game_id' element={<PoolGame />}/>
            </Route>
            <Route path='/users/:username' element={<Profile />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className='d-flex vh-100 flex-column'>
      <Header />
      <Outlet />
    </div>
  )
}

export default App;