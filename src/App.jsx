import { Routes, Route } from 'react-router-dom'
import Character from './Pages/Character'
import Home from './Pages/Home'
import Helper from './Helper'
import './App.css'

function App() {

  return (
    <div className="App">
    <Routes>
        <Route path={Helper.references.baseURL} element={<Home></Home>}></Route>
        <Route path={Helper.references.baseURL + "/Character/:id"} element={<Character></Character>}></Route>
    </Routes>
    </div>
  )
}

export default App
