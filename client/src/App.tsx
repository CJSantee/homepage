import { Routes, Route, Outlet } from "react-router-dom";
// Custom Components
import Header from './components/Header';
// Pages
import Home from "./pages/home";
import NotFound from './pages/not-found';
import PersistLogin from "./components/PersistLogin";
import Admin from "./pages/admin";
import Wordle from "./pages/wordle";
import AuthRoute from "./components/AuthRoute";
import Message from "./pages/message";
import SignIn from "./pages/sign-in";

function App() {
  return (
    <Routes>
      <Route>
        <Route element={<Layout />} >
          <Route element={<PersistLogin />}>
            <Route path='/signin' element={<SignIn />} />
            <Route path='/' element={<Home />} />
            <Route element={<AuthRoute permission='admin' />}>
              <Route path='/admin' element={<Admin />} />
            </Route>
            <Route element={<AuthRoute />}>
              <Route path='/wordle' element={<Wordle />} />
            </Route>
            <Route element={<AuthRoute />}>
              <Route path='/message' element={<Message />} />
            </Route>
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