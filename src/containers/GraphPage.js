import React, {useEffect, useState} from 'react';
import Axios from "axios/index";
import {Container, Form, Row, Col, Button} from 'react-bootstrap';
import {Line} from 'react-chartjs-2';

let intervalo;
let intervalTime = 1000;
let limit = 10;
let offset = 0;
let sensorId = 0;

const limits = [10,20,30,40,50,100,200,300,400,500];
const intervals = [1000, 3000,5000,10000,15000,20000];

function GraphPage() {

    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [sensorName, setSensorName] = useState("");
    const [sensors, setSensors] = useState([]);
    const [live, setLive] = useState(1);

    useEffect(() => {
        loadSensors();
        initCicle();
    }, []);

    const initCicle = ()=>{
        intervalo=setInterval(loadData,intervalTime);
    };

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
            console.log("Error en la peticion (" + error + ")")
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
            sensorId = res.data.length > 0 ? res.data[0].id : null;
            setSensorName(res.data.length > 0 ? res.data[0].name : "");
            setSensors(res.data.map(it=>{
                return {id: it.id, name: it.name}
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
                labels.push(new Date(it.time).toLocaleTimeString("es-ES",{hour12 : true,
                    hour:  "2-digit",
                    minute: "2-digit",
                    second: "2-digit"}));
            } );
        }
        setData(values);
        setLabels(labels)
    };

    const resetCicle = () => {
        clearInterval(intervalo);
        loadData();
        initCicle();
    };

    const handleSensorChange = event=>{
        sensorId = event.target.value;
        setSensorName(sensors.find(it=>it.id == event.target.value).name);
        if(live) resetCicle();
        else loadData();
    };

    const handleLimitChange = event=>{
        limit = event.target.value;
        if(live) resetCicle();
        else loadData();
    };

    const handleIntervalChange = event=>{
        intervalTime = event.target.value;
        if(live) resetCicle();
        else loadData();
    };

    const handleLive = ()=>{
        if(live) clearInterval(intervalo);
        else{
            loadData();
            initCicle();
        }
        setLive(!live);
    };

  return (
    <Container>
            <Form as={Container} fluid>
                <Row>
                    <Form.Group as={Col} sm="4">
                        <Form.Label className={"left"}>Sensor</Form.Label>
                        <Form.Control name="sensorId" as="select" onChange={(e)=>handleSensorChange(e)}>
                            {sensors.map(it=> <option key={it.id} value={it.id}>{it.name}</option> )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group  as={Col} sm="4">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control name="limit" as="select" onChange={(e)=>handleLimitChange(e)}>
                            {limits.map(it=> <option key={it} value={it}>{it}</option> )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group  as={Col} sm="4">
                        <Form.Label>Intervalos (ms)</Form.Label>
                        <Form.Control name="interval" as="select" onChange={(e)=>handleIntervalChange(e)}>
                            {intervals.map(it=> <option key={it} value={it}>{it}</option> )}
                        </Form.Control>
                    </Form.Group>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" onClick={()=>handleLive()}>
                            { live ? "Detener" : "Iniciar"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        <Container>
            <Line
                data={{labels: labels,
                    datasets: [
                        {
                            label: sensorName,
                            borderColor: '#1b087e',
                            borderWidth: 1,
                            hoverBackgroundColor: '#fe4426',
                            hoverBorderColor: '#EE023A',
                            data: data
                        }
                    ]}}
                /*width={100}
                height={50}*/
                options={{maintainAspectRatio: true}}
            />
        </Container>
    </Container>
  );
}

export default GraphPage;
