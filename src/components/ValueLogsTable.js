import React, {useEffect, useState, useMemo, useRef, useCallback} from "react";
import styled from 'styled-components'
import {Container, Row, Col, Form} from 'react-bootstrap';
import Axios from "axios";

import { useTable, usePagination } from 'react-table'


const Styles = styled.div`
  table {
    th,
    td {
        padding: 5px 20px 5px 5px;
    }
  }
`;

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
                   columns,
                   data,
                   fetchData,
                   loading,
                   pageCount: controlledPageCount,
                   sensorId,
               }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            pageCount: controlledPageCount,
        },
        usePagination
    );

    // Listen for changes in pagination and use the state to fetch our new data
    useEffect(() => {
        fetchData({ pageIndex, pageSize, sensorId })
    }, [fetchData, pageIndex, pageSize, sensorId]);

    // Render the UI for your table
    return (
        <>
            <Styles>
                <div className="table-responsive">
            <table {...getTableProps()} className="table table-hover mb-3 w-100">
                <thead className="thead-dark">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} scope="col">
                                {column.render('Header')}
                                <span>
                    {column.isSorted
                        ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                        : ''}
                  </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                <tr>
                    {loading ? (
                        // Use our custom loading state to show a loading indicator
                        <td colSpan="10000">Loading...</td>
                    ) : (
                        <td colSpan="10000">{page.length == 0 ? "No data to show" : ""}</td>
                        // <td colSpan="10000">
                        //     Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                        //     results
                        // </td>
                    )}
                </tr>
                </tbody>
            </table>
                </div>
            </Styles>
            {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
            <div className="">
                <div className="btn-group">
                    <button className="btn btn-outline-success" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>{' '}
                    <button className="btn btn-outline-success" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button className="btn btn-outline-success" onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>{' '}
                    <button className="btn btn-outline-success" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>{' '}
                </div>
                <span> Page{' '}<strong> {pageIndex + 1} of {pageOptions.length} </strong>{' '}</span>
                <span> | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

function ValueLogsTable() {

    // const [rows, setRows] = useState([]);

    const columns = useMemo(
        () => [
            {
                Header: 'Fecha',
                accessor: 'time',
            },
            {
                Header: 'Sensor',
                accessor: 'sensor',
            },
            {
                Header: 'Lectura',
                accessor: 'value',
            },
            {
                Header: 'UM',
                accessor: 'um',
            },
        ],
        []
    );

    // const sensors = loadSensors();

    // We'll start our table without any data
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);

    const [sensors, setSensors] = useState([]);
    const [sensorId, setSensorId] = useState(-1);

    const fetchData = useCallback(({ pageSize, pageIndex, sensorId}) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.

        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current;

        // Set the loading state
        setLoading(true);
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
            const startRow = pageSize * pageIndex;
            // const endRow = startRow + pageSize;

            Axios.get("http://localhost:8000/api/value_logs/", {
                params: {
                    limit: pageSize,
                    offset: startRow,
                    sensor_id: sensorId
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    setData(res.data.results.map(it => {
                        return {
                            time: new Date(it.time).toLocaleTimeString("es-ES",{hour12 : true,
                                year:  "2-digit",
                                month:  "2-digit",
                                day:  "2-digit",
                                hour:  "2-digit",
                                minute: "2-digit",
                                second: "2-digit"}),
                            sensor: it.sensor.name,
                            value: it.value,
                            um: it.measure_unit.symbol,
                        }
                    }));
                    // Your server could send back total page count.
                    // For now we'll just fake it, too
                    setPageCount(Math.ceil(res.data.count / pageSize));

                    setLoading(false)
                })
                .catch((error) => {
                    console.log("Error en la peticion:"+error)
                });


        }
    }, []);


    useEffect(() => {
        loadSensors();
    }, []);

    const loadSensors = () => {

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
                    return {id: it.id, name: it.name}
                }));
            })
            .catch((error) => {
                console.log("Error en la peticion (" + error + ")" )
            });
    };

    const handleSensorChange = event=>{
        setSensorId(event.target.value);
        // if(live) resetCicle();
        // else loadData();
    };


        return (
            <Container>
                <Row  className="mb-4 border-bottom">
                    <Col md={10}>
                        <h1>Registros</h1>
                    </Col>
                </Row>
                <Row>
                    <Form.Group as={Col} sm="4">
                        <Form.Label className={"left"}>Sensor</Form.Label>
                        <Form.Control name="sensorId" as="select" onChange={(e)=>handleSensorChange(e)}>
                            {sensors.map(it=> <option key={it.id} value={it.id}>{it.name}</option> )}
                        </Form.Control>
                    </Form.Group>
                </Row>
                <Row>
                    <Col>
                        <Table
                            columns={columns}
                            data={data}
                            fetchData={fetchData}
                            loading={loading}
                            pageCount={pageCount}
                            sensorId={sensorId}
                        />
                    </Col>
                </Row>
            </Container>
        );
}

export default ValueLogsTable;
