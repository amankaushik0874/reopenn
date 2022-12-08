import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, useRoutes } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Data from './Data';


const Main = () => {
  let routes = useRoutes([
    { path: "/", element: <App /> },
    { path: "/data", element: <Data /> },
  ]);
  return routes;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter >
      <Main />
    </BrowserRouter>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
