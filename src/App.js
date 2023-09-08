import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Notes from './components/Notes';
import New from './components/New';
import Gallery from './components/Gallery';
import Footer from './components/Footer';



function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Gallery />} />
          <Route exact path='/my_notes' element={<Notes />} />
          <Route exact path='/new' element={<New />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
