import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import api from "./utils/api";
// Custom Components
import Header from './components/Header';
// Pages
import Home from "./pages/home";
import NotFound from './pages/not-found';

function App() {
  useEffect(() => {
    async function getData() {
      const {data} = await api.get('/');
      console.log('data', data);
    }
    getData();
  }, []);

  return (
    <Routes>
      <Route>
        <Route element={<Layout />} >
          <Route path='/' element={<Home />} />
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