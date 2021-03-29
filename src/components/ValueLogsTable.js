import React, {useEffect, useState} from "react";
import {Container, Row, Col} from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import Axios from "axios";

const columns = [
    {
        label: 'Fecha',
        field: 'time',
        sort: 'desc',
    },
    {
        label: 'Sensor',
        field: 'sensor',
    },
    {
        label: 'Lectura',
        field: 'value',
    },
];

function ValueLogsTable() {

    const [rows, setRows] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData=()=>{

        Axios.get("http://localhost:8000/api/value_logs/", {
            params: {
                 limit: 10,
                 offset: 0,
                // sensor_id: 1
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                mapData(res.data.results);
            })
            .catch((error) => {
                console.log("Error en la peticion:"+error)
            });
    };

    const mapData = (result)=>{
        let rows = result.map(it => {
            return {
                time: new Date(it.time).toLocaleTimeString("es-ES",{hour12 : true,
                    year:  "2-digit",
                    month:  "2-digit",
                    day:  "2-digit",
                    hour:  "2-digit",
                    minute: "2-digit",
                    second: "2-digit"}),
                sensor:it.sensor,
                value:it.value,
            }
        });
        setRows(rows);
    };


        return (
            <Container className="pt-3">
                <Row  className="mb-5 border-bottom">
                    <Col md={10}>
                        <h1>Registros</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MDBDataTable
                            striped
                            bordered
                            hover
                            data={{columns: columns, rows: rows}}
                        />
                    </Col>
                </Row>
            </Container>
        );
}

export default ValueLogsTable;