import { React, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Login, Register, InputPin, Loading, Profile, CheckStatus, Fine } from './components/allPage';

const RoutesApp = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/confirmation_email/:email' element={<InputPin />} />

        <Route path='/profile' element={<Profile />} />
        <Route path='/fine' element={<Fine />} />

        <Route path='/:page_only_status' element={<CheckStatus />} /> 
      </Routes>
    </Suspense >
  )
}

function App() {
  return (
    <BrowserRouter>
      <RoutesApp />
    </BrowserRouter>
  );
}

export default App