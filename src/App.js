import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import FormCreate from "./components/form-create";
import FormView from "./components/form-view";
import FormUpdate from "./components/form-update";
function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/form/create' element={<FormCreate/>}/>
          <Route path='/form/view/:id' element={<FormView/>}/>
          <Route path='/form/edit/:id' element={<FormUpdate/>} />
        </Routes>
      </BrowserRouter>
        
    </div>
  );
}

export default App;
