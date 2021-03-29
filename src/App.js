import './App.css';
import React, {useEffect, useState} from 'react';
// import Axios from "axios/index";
import { BrowserRouter} from 'react-router-dom';
import { Route } from 'react-router';
import GraphPage from "./containers/GraphPage";
import Menu from "./components/Menu";
import ValueLogsTable from "./components/ValueLogsTable";


// class Axios {
//     constructor(baseUrl, bearerToken) {
//
//         return axios.create({
//             headers: {
//                 AccessControlAllowOrigin: '*'
//             }
//         });
//     }
// }
//
// const myService = new Axios('baseURL', 'bearerToken');

function App() {
  return (
    <>
        <BrowserRouter>
            <Menu />
            <Route path="/graficos" exact render={(props) => <GraphPage />}/>
            <Route path="/datos" exact render={(props) => <ValueLogsTable />}/>
        </BrowserRouter>
    </>
  );
}

export default App;
