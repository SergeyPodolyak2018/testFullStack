import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import {Users} from "./features/users"
import {Posts} from "./features/posts"

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate replace to="/users" />} />
          <Route path="users/" element={<Users />}/>
          <Route path="posts/:id" element={<Posts />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
