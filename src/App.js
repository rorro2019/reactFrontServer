import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {Upload} from './components/Upload';
import logo from './components/icon.jpg';
import { Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
       <nav className="navbar navbar-expand bg-primary">
       
          <img src={logo}  style={{width:30,
             marginTop: -5, marginRight: 5 }}/>
             <div class=" text-white">
            <h4>File Server</h4></div>
             
          </nav>
    
      <Upload />
  
    </div>
  );
}

export default App;
