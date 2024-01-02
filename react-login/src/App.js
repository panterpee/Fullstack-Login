import * as React from 'react';
import Button from '@mui/material/Button';
import './App.css';

function pathLogin() {
 return window.location = "/login"
}

function App() {

  return (
    <div className="">
       <Button variant="contained" onClick={pathLogin}>Hello world</Button>
    </div>
  );
}

export default App;

