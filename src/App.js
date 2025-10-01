import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/1.css';
import QP from './jsx/QP';
import Seite1 from './jsx/Seite1';
import Seite2 from './jsx/Seite2';
import Tabelesicht from './jsx/Tabelesicht';
import Filter from './jsx/Filter';
import T from   './jsx/T';
import { Table } from 'react-bootstrap';
import { Anthropic } from '@anthropic-ai/sdk';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QP />} />
        <Route path="/seite1" element={<Seite1 />} />
        <Route path="/seite2" element={<Seite2 />} />
        <Route path="/Tabelesicht" element={<Tabelesicht />} />
       <Route path="/Filter" element={<Filter />} />
       <Route path="/T" element={<T />} />
      
      </Routes>
    </BrowserRouter>
  );
}
export default App;
