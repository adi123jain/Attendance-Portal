import { useState, useEffect, useRef, useMemo } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import {
  Typography,
  Button,
  Backdrop,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from '@mui/material';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PropagateLoader } from 'react-spinners';

import {
  empWalletAmount,
  getAllVendors,
  getCircle,
  getDC,
  getDivision,
  getIncentiveHeads,
  getRegion,
  getSubDivision,
  getVendorArmedForce,
  maxAmountByDesignation,
  requestRRAC,
} from '../../../Services/Auth';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

// const headerBackground = "linear-gradient(to right, #90A4AE, #78909C)";
// const oddRowBackground = "#F9FAFB";
// const evenRowBackground = "#F1F3F4";
// const hoverBackground = "#E0E0E0";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     background: headerBackground,
//     color: theme.palette.common.white,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     textAlign: "center",
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: oddRowBackground,
//   },
//   "&:nth-of-type(even)": {
//     backgroundColor: evenRowBackground,
//   },
//   "&:hover": {
//     backgroundColor: hoverBackground,
//   },
// }));

function RRAC_Scheme() {
  const sessionRegion = sessionStorage.getItem('regionId');
  const sessionCircle = sessionStorage.getItem('circleId');
  const sessionDivision = sessionStorage.getItem('divisionId');
  const sessionSubdivision = sessionStorage.getItem('subdivisionId');
  const sessionDc = sessionStorage.getItem('dcId');
  const designationName = sessionStorage.getItem('designationName');
  const departmentName = sessionStorage.getItem('departmentName');
  const sessionEmpCode = sessionStorage.getItem('empCode');

  const departmentId = sessionStorage.getItem('departmentId');
  const designationId = sessionStorage.getItem('designationId');

  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [dcs, setDCs] = useState([]);
  const [subStations, setSubStations] = useState([]);
  const [errors, setErrors] = useState({});

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubDivision, setSelectedSubDivision] = useState('');
  const [selectedDC, setSelectedDC] = useState('');
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Load Regions
  useEffect(() => {
    (async () => {
      try {
        const response = await getRegion();
        setRegions(response.data.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
  }, []);

  // Fetch Circles when Region changes
  useEffect(() => {
    if (!selectedRegion) return;
    (async () => {
      try {
        const res = await getCircle(selectedRegion);
        setCircles(res.data.list || []);
      } catch (error) {
        console.error('Error fetching circles:', error);
      }
    })();
  }, [selectedRegion]);

  // Fetch Divisions when Circle changes
  useEffect(() => {
    if (!selectedCircle) return;
    (async () => {
      try {
        const res = await getDivision(selectedCircle);
        setDivisions(res.data.list || []);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    })();
  }, [selectedCircle]);

  // Fetch SubDivisions when Division changes
  useEffect(() => {
    if (!selectedDivision) return;
    (async () => {
      try {
        const res = await getSubDivision(selectedDivision);
        setSubDivisions(res.data.list || []);
      } catch (error) {
        console.error('Error fetching sub divisions:', error);
      }
    })();
  }, [selectedDivision]);

  // Fetch DCs when SubDivision changes
  useEffect(() => {
    if (!selectedSubDivision) return;
    (async () => {
      try {
        const res = await getDC(selectedSubDivision);
        setDCs(res.data.list || []);
      } catch (error) {
        console.error('Error fetching DCs:', error);
      }
    })();
  }, [selectedSubDivision]);

  const [disabledLevels, setDisabledLevels] = useState({
    region: false,
    circle: false,
    division: false,
    subDivision: false,
    dc: false,
  });

  useEffect(() => {
    const init = async () => {
      try {
        if (sessionRegion && sessionRegion !== 'null' && sessionRegion !== '') {
          setSelectedRegion(sessionRegion);
          setDisabledLevels((prev) => ({ ...prev, region: true }));

          const circleRes = await getCircle(sessionRegion);
          setCircles(circleRes.data.list || []);
        }

        if (sessionCircle && sessionCircle !== 'null' && sessionCircle !== '') {
          setSelectedCircle(sessionCircle);
          setDisabledLevels((prev) => ({ ...prev, circle: true }));

          const divisionRes = await getDivision(sessionCircle);
          setDivisions(divisionRes.data.list || []);
        }

        if (
          sessionDivision &&
          sessionDivision !== 'null' &&
          sessionDivision !== ''
        ) {
          setSelectedDivision(sessionDivision);
          setDisabledLevels((prev) => ({ ...prev, division: true }));

          const subDivRes = await getSubDivision(sessionDivision);
          setSubDivisions(subDivRes.data.list || []);
        }

        if (
          sessionSubdivision &&
          sessionSubdivision !== 'null' &&
          sessionSubdivision !== ''
        ) {
          setSelectedSubDivision(sessionSubdivision);
          setDisabledLevels((prev) => ({ ...prev, subDivision: true }));

          const dcRes = await getDC(sessionSubdivision);
          setDCs(dcRes.data.list || []);
        }

        if (sessionDc && sessionDc !== 'null' && sessionDc !== '') {
          setSelectedDC(sessionDc);
          setDisabledLevels((prev) => ({ ...prev, dc: true }));
        }
      } catch (error) {
        console.error('Error initializing dropdowns:', error);
      }
    };

    init();
  }, []);

  // Amount by Designation
  const [monthlyAmount, setMonthlyAmount] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await maxAmountByDesignation(designationId, sessionDc);
        //console.log(response);
        setMonthlyAmount(response.data.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
  }, []);

  // Amount by Designation
  const [totalAmount, setTotalAmount] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await empWalletAmount();
        setTotalAmount(response.data.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
  }, []);

  const [headsInTable, setHeadsInTable] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await getIncentiveHeads();
        console.log(response);
        setHeadsInTable(response.data.list || []);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    })();
  }, []);

  const [rowData, setRowData] = useState({});

  // mock API calls
  const getArmedForce = async () => {
    try {
      const response = await getVendorArmedForce();
      console.log('API 1 Response:', response);

      return response.data.list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    } catch (error) {
      console.error('Error fetching vendors for 1:', error);
      return [];
    }
  };

  const getAll = async () => {
    try {
      const response = await getAllVendors();
      console.log('API 2 Response:', response);

      return response.data.list.map((item) => ({
        id: item.id,
        name: item.companyName,
      }));
    } catch (error) {
      console.error('Error fetching vendors for 2:', error);
      return [];
    }
  };

  // Checkbox change
  const handleCheckboxChange = async (checked, item) => {
    if (!checked) {
      // clear row data if unchecked
      setRowData((prev) => ({
        ...prev,
        [item.id]: { checked: false, vendors: [] },
      }));
      return;
    }

    let vendors = [];
    if (item.id === 1) {
      vendors = await getArmedForce();
    } else if (item.id === 2) {
      vendors = await getAll();
    }

    setRowData((prev) => ({
      ...prev,
      [item.id]: {
        checked: true,
        vendors,
        vendor: '',
        count: '',
        amount: '',
      },
    }));
  };

  // Update individual field
  const updateRowField = (itemId, field, value) => {
    setRowData((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  // Requested & Remaining calculation (auto updates with rowData)
  const requestedAmount = useMemo(() => {
    return Object.values(rowData)
      .filter((row) => row.checked)
      .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  }, [rowData]);

  const remainingAmount = useMemo(() => {
    return totalAmount - requestedAmount;
  }, [totalAmount, requestedAmount]);

  const formRefs = useRef({});

  // store input refs dynamically
  const setInputRef = (itemId, field, el) => {
    if (!formRefs.current[itemId]) formRefs.current[itemId] = {};
    formRefs.current[itemId][field] = el;
  };

  const handleSubmit = async () => {
    // 1. DC validation
    if (!selectedDC) {
      alert('DC is required');
      document.getElementById('dc-select')?.focus();
      return;
    }

    const checkedRows = Object.entries(rowData).filter(
      ([_, row]) => row.checked,
    );

    // 2. At least one checkbox
    if (checkedRows.length === 0) {
      alert('Please check at least one head.');
      return;
    }

    // 3. Validate fields per checked row
    for (const [id, row] of checkedRows) {
      const itemId = Number(id);

      if (itemId === 1 || itemId === 2) {
        if (!row.vendor) {
          alert('Vendor is required');
          formRefs.current[itemId]?.vendor?.focus();
          return;
        }
        if (!row.count) {
          alert('Count is required');
          formRefs.current[itemId]?.count?.focus();
          return;
        }
        if (!row.amount) {
          alert('Amount is required');
          formRefs.current[itemId]?.amount?.focus();
          return;
        }
      } else if (itemId === 4) {
        if (!row.count) {
          alert('Count is required');
          formRefs.current[itemId]?.count?.focus();
          return;
        }
        if (!row.amount) {
          alert('Amount is required');
          formRefs.current[itemId]?.amount?.focus();
          return;
        }
      } else {
        if (!row.amount) {
          alert('Amount is required');
          formRefs.current[itemId]?.amount?.focus();
          return;
        }
      }
    }
    setOpenBackdrop(true);
    try {
      //  If validation passes
      const selectedRows = checkedRows.map(([id, row]) => ({
        headAmount: parseFloat(row.amount || null),
        headId: id,
        vendorId: row.vendor || null,
        headCount: row.count || null,
      }));

      const payload = {
        regionId: selectedRegion,
        circleId: selectedCircle,
        divisionId: selectedDivision,
        subdivisionId: selectedSubDivision,
        dcId: selectedDC,
        empCode: sessionEmpCode,
        designationId: designationId,
        amount: parseInt(requestedAmount),
        monthYear: new Date().toISOString().slice(0, 7),
        heads: selectedRows,
      };

      //console.log("Submit Data:", payload);

      const response = await requestRRAC(payload);
      // console.log(response);
      if (response.data.code === '200') {
        alert(
          response.data.message +
            'Please Save Your Reference Number : ' +
            response.data.list[0].refNo,
        );
        setOpenBackdrop(false);
        window.location.reload();
      } else {
        alert(response.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log('Error', error);
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="text-center">
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: '#0a1f83',
            }}
          >
            Request for Revenue Realization & Commercial Activity
          </Typography>
        </Card.Header>
        <Card.Body>
          {/* Card 1 */}
          <Card>
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: '#0a1f83',
                }}
              >
                Basic Information
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={2} md={4} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>Region </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedRegion}
                        id="selectedRegion"
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedRegion(value);
                          setSelectedCircle('');
                          setCircles([]);
                          setSelectedDivision('');
                          setDivisions([]);
                          setSelectedSubDivision('');
                          setSubDivisions([]);
                          setSelectedDC('');
                          setDCs([]);
                        }}
                        disabled={disabledLevels.region}
                      >
                        <option disabled value="">
                          -- select Region --
                        </option>
                        {regions.map((r) => (
                          <option key={r.regionId} value={r.regionId}>
                            {r.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Circle </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedCircle}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCircle(value);

                          setSelectedDivision('');
                          setDivisions([]);
                          setSelectedSubDivision('');
                          setSubDivisions([]);
                          setSelectedDC('');
                          setDCs([]);
                        }}
                        disabled={!selectedRegion || disabledLevels.circle}
                      >
                        <option disabled value="">
                          -- select Circle --
                        </option>
                        {circles.map((c) => (
                          <option key={c.circleId} value={c.circleId}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Division </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedDivision}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedDivision(value);
                          setSelectedSubDivision('');
                          setSubDivisions([]);
                          setSelectedDC('');
                          setDCs([]);
                        }}
                        disabled={!selectedCircle || disabledLevels.division}
                      >
                        <option disabled value="">
                          -- select Division --
                        </option>
                        {divisions.map((d) => (
                          <option key={d.divisionId} value={d.divisionId}>
                            {d.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Sub Division </Card.Header>
                    <Card.Body>
                      <Form.Select
                        value={selectedSubDivision}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedSubDivision(value);
                          setSelectedDC('');
                          setDCs([]);
                        }}
                        disabled={
                          !selectedDivision || disabledLevels.subDivision
                        }
                      >
                        <option disabled value="">
                          -- select Sub Division --
                        </option>
                        {subDivisions.map((s) => (
                          <option key={s.subdivisionId} value={s.subdivisionId}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Row 2 */}

              <Row xs={1} sm={2} md={4} className="g-3 mt-2">
                <Col>
                  <Card>
                    <Card.Header>Distribution Center </Card.Header>
                    <Card.Body>
                      <Form.Select
                        id="dc-select"
                        value={selectedDC}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedDC(value);
                        }}
                        disabled={!selectedSubDivision || disabledLevels.dc}
                      >
                        <option disabled value="">
                          -- select DC --
                        </option>
                        {dcs.map((dc) => (
                          <option key={dc.dcId} value={dc.dcId}>
                            {dc.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Designation </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        value={designationName}
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Department </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        value={departmentName}
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Current Month/Year </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="month"
                        value={new Date().toISOString().slice(0, 7)}
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Card 2 */}
          <Card className="mt-4">
            <Card.Header className="text-center">
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: '#0a1f83',
                }}
              >
                Expenses
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Row 1 */}
              <Row xs={1} sm={2} md={4} className="g-3">
                <Col>
                  <Card>
                    <Card.Header>Monthly Amount</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        value={monthlyAmount}
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Your Wallet Amount </Card.Header>
                    <Card.Body>
                      <Form.Control type="text" value={totalAmount} disabled />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header> Requested Amount </Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="text"
                        value={requestedAmount}
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card>
                    <Card.Header>Remaining Amount</Card.Header>
                    <Card.Body>
                      <Form.Control
                        type="number"
                        value={remainingAmount}
                        disabled
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
              //color: "#0a1f83",
            }}
            color="error"
          >
            *Please select the checkbox and enter amount in given input.
          </Typography>

          <TableContainer component={Paper} sx={{ marginTop: '15px' }}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No.</StyledTableCell>
                  <StyledTableCell>Select </StyledTableCell>
                  <StyledTableCell>Head Name </StyledTableCell>
                  <StyledTableCell>Select Vendors </StyledTableCell>
                  <StyledTableCell>Head Count</StyledTableCell>
                  <StyledTableCell>Enter Amount</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              {/* <TableBody>
              {headsInTable && headsInTable.length > 0 ? (
                headsInTable.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>

                    <StyledTableCell>
                      <input
                        type="checkbox"
                        value={item.id}
                        className="getID"
                      />
                    </StyledTableCell>
                    <StyledTableCell>{item.name}</StyledTableCell>
                    <StyledTableCell>
                      <Form.Select>
                        <option disabled value="">
                          -- select Company --
                        </option>
                      </Form.Select>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Form.Control type="number" placeholder="Enter Count" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Form.Control type="number" placeholder="Enter Amount" />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={14}>Data Not Found</StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody> */}

              <TableBody>
                {headsInTable && headsInTable.length > 0 ? (
                  headsInTable.map((item, index) => {
                    const row = rowData[item.id] || {};
                    return (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>

                        {/* Checkbox */}
                        <StyledTableCell>
                          <input
                            type="checkbox"
                            checked={row.checked || false}
                            onChange={(e) =>
                              handleCheckboxChange(e.target.checked, item)
                            }
                          />
                        </StyledTableCell>

                        <StyledTableCell>{item.name}</StyledTableCell>

                        {/* Vendors Select */}
                        <StyledTableCell>
                          {row.checked && (item.id === 1 || item.id === 2) && (
                            <Form.Select
                              value={row.vendor || ''}
                              onChange={(e) =>
                                updateRowField(
                                  item.id,
                                  'vendor',
                                  e.target.value,
                                )
                              }
                              ref={(el) => setInputRef(item.id, 'vendor', el)}
                            >
                              <option value="" disabled>
                                -- select Company --
                              </option>
                              {row.vendors?.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.name}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </StyledTableCell>

                        {/* Head Count */}
                        <StyledTableCell>
                          {row.checked &&
                            (item.id === 1 ||
                              item.id === 2 ||
                              item.id === 4) && (
                              <Form.Control
                                type="number"
                                value={row.count || ''}
                                placeholder="Enter Count"
                                onChange={(e) =>
                                  updateRowField(
                                    item.id,
                                    'count',
                                    e.target.value,
                                  )
                                }
                                ref={(el) => setInputRef(item.id, 'count', el)}
                              />
                            )}
                        </StyledTableCell>

                        {/* Amount */}
                        <StyledTableCell>
                          <Form.Control
                            type="number"
                            value={row.amount || ''}
                            placeholder="Enter Amount"
                            disabled={!row.checked}
                            onChange={(e) =>
                              updateRowField(item.id, 'amount', e.target.value)
                            }
                            ref={(el) => setInputRef(item.id, 'amount', el)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={14}>
                      Data Not Found
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button className="cancel-button" component={Link} to="/">
            Cancel
          </Button>
          &nbsp;
          <Button className="blue-button" onClick={handleSubmit}>
            Submit
          </Button>
        </Card.Footer>
      </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}

export default RRAC_Scheme;
