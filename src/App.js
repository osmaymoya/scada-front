import './App.css';
import React, {useEffect, useState} from 'react';
import Axios from "axios/index";
import {Container, Form} from 'react-bootstrap';
import {Line} from 'react-chartjs-2';


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

    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [sensorId, setSensorId] = useState(null);
    const [sensors, setSensors] = useState([]);

    const limits = [10,20,30,40,50,100,200,300,400,500];

    useEffect(() => {
        loadSensors();
    }, []);

    const loadData=()=>{

      Axios.get("http://localhost:8000/api/value_logs/", {
        params: {
            limit: limit,
            offset: offset,
            sensor_id: sensorId
        },
        headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': 'http://localhost:8000'
        },
      })
          .then((res) => {
            mapData(res.data.results.reverse());
          })
          .catch((error) => {
            console.log("Error en la peticion")
          });
    };

    const loadSensors=()=>{

      Axios.get("http://localhost:8000/api/sensors/", {
        params: {
        },
        headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': 'http://localhost:8000'
        },
      })
          .then((res) => {
            setSensorId(res.data.length > 0 ? res.data[0].id : null);
            setSensors(res.data.map(it=>{
                return <option key={it.id} value={it.id}>{it.name}</option>
            }));
            loadData();
          })
          .catch((error) => {
            console.log("Error en la peticion (" + error + ")" )
          });
    };

    const mapData=data=>{
        let values = [];
        let labels = [];
        if(data.length > 0){
            data.forEach(it=> {
                values.push(it.value);
                labels.push(new Date(it.time).toLocaleTimeString("en-US",{hour12 : true,
                    hour:  "2-digit",
                    minute: "2-digit",
                    second: "2-digit"}));
            } );
        }
        setData(values);
        setLabels(labels)
    };

    const handleSensorChange = event=>{
        setSensorId(event.target.value);
        loadData();
    };

    const handleLimitChange = event=>{
        setLimit(event.target.value);
        loadData();
    };

  return (
    <div className="App">
        <Form.Group>
            <Form.Label>Sensor</Form.Label>
            <Form.Control name="sensorId" as="select" onChange={(e)=>handleSensorChange(e)}>
                {sensors}
            </Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control name="limit" as="select" onChange={(e)=>handleLimitChange(e)}>
                {limits.map(it=> <option key={it} value={it}>{it}</option> )}
            </Form.Control>
        </Form.Group>
        <Container>
            <Line
                data={{labels: [0, ...labels],
                    datasets: [
                        {
                            label: "Label del grafico",
                            borderColor: '#1b087e',
                            borderWidth: 1,
                            hoverBackgroundColor: '#fe4426',
                            hoverBorderColor: '#EE023A',
                            data: [0,...data]
                        }
                    ]}}
                /*width={100}
                height={50}*/
                options={{maintainAspectRatio: true}}
            />
        </Container>
    </div>
  );
}

export default App;
