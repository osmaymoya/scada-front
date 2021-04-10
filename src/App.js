import './App.css';
// import Axios from "axios/index";
import { BrowserRouter} from 'react-router-dom';
import { Route } from 'react-router';
import {Container, Row, Col} from 'react-bootstrap';
import GraphPage from "./containers/GraphPage";
import Menu from "./components/Menu";
import ValueLogsTable from "./components/ValueLogsTable";
import styled from 'styled-components'

const Styles = styled.div`
    footer {
        // position: relative;
        // bottom: 0;
        width: 100%;
        padding: 15px 0;
    }
`;

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

const Footer = () =>{
    return (
        <footer className="bg-dark">
            <Container fluid >
                <Row>
                    <Col sm={12} className="text-center text-white">
                        Desarrollado por <a href="mailto: osmaymoya@gmail.com"  className="text-white">Osmay Moya Miranda</a>
                    </Col>
                </Row>
            </Container>
        </footer>
        )
};

function App() {
  return (
    <Styles>
        <div className="">
            <BrowserRouter>
                <Menu />
                <div className="mb-4">
                    <Route path="/graficos" exact render={(props) => <GraphPage />}/>
                    <Route path="/datos" exact render={(props) => <ValueLogsTable />}/>
                </div>
                <Footer/>
            </BrowserRouter>
        </div>
    </Styles>
  );
}

export default App;
