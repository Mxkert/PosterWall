import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import './components/Form.css';

// Firebase
import { firebase } from './config/firebase';

import { Header } from './components/layout/Header';

import { Listing } from './components/posters/Listing';
import { Submit } from './components/posters/Submit';
import { Archive } from './components/posters/Archive';
import { Search } from './components/Search';
import { Poster } from './components/posters/Poster';
import { Form } from './components/posters/Form';

export const App = () => {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />

        <Route path="/" exact component={ Listing } />
        <Route path="/submit" exact component={ Submit } />
        <Route path="/form" exact component={ Form } />
        <Route path="/search" exact component={ Search } />
        <Route path="/archive" exact component={ Archive } />
        <Route path="/poster/:id" exact component={ Poster } />
      </div>
    </BrowserRouter>
  );
}
