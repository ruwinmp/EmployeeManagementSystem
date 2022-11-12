import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes ,Route } from "react-router-dom";

import {Shared} from "../src/components/Shared/Shared";
import {Home} from "../src/components/Home/Home";
import {Employee} from "../src/components/Employee/Employee";
import {Department} from "../src/components/Department/Department";

function App() {
  return (
      <BrowserRouter>
        <div className='container'>
          <Shared/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/Employee' element={<Employee/>} />
            <Route path='/Department' element={<Department/>} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
