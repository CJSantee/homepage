import { Routes, Route, Outlet } from "react-router-dom";
// Custom Components
import Header from './components/Header';
// Pages
import Home from "./pages/home";
import NotFound from './pages/not-found';
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <Routes>
      <Route>
        <Route element={<Layout />} >
          <Route element={<PersistLogin />}>
            <Route path='/' element={<Home />} />
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