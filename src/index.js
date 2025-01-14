import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // Assuming you have an App.js file

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // This will render your app into the <div id="root"></div> in your index.html
);
