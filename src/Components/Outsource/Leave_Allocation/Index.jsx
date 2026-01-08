import React, { useState, useRef, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { PropagateLoader } from 'react-spinners';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import '../../../Constants/Style/styles.css';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Backdrop,
} from '@mui/material';
import {
  getLeaveAllocation,
  leaveAllocationOutsource,
  updateEmployeeLeaves,
} from '../../../Services/Auth';
import SearchBox from './SearchBox';
import {
  StyledTableRow,
  StyledTableCell,
} from '../../../Constants/TableStyles/Index';

// import {
//   StyledTableRow,
//   StyledTableCell,
// } from "../../../Constants/TableStyles/Index";

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
function OutsourceLeaveAllocation() {
  const regionRef = useRef(null);
  const tableRef = useRef(null);
  const [searchValues, setSearchValues] = useState({
    region: '',
    circle: '',
    division: '',
    subDivision: '',
    dc: '',
    subStation: '',
  });

  const [errors, setErrors] = useState({});
  const [showLevelTable, setShowLevelTable] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataInLevelTable, setDataInLevelTable] = useState([]);

  const validate = () => {
    const newErrors = {};
    if (!searchValues.region) {
      newErrors.region = '*region is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (showLevelTable && dataInLevelTable.length > 0 && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showLevelTable, dataInLevelTable]);
  // Search By Level
  const searchByLevel = async () => {
    setShowEmpTable(false);
    setEmpCode('');
    setEmpCodeError('');
    if (!validate()) {
      if (!searchValues.region && regionRef.current) {
        regionRef.current.focus();
      }
      return;
    }
    setOpenBackdrop(true);

    try {
      const payload = {
        regionId: searchValues.region,
        circleId: searchValues.circle,
        divisionId: searchValues.division,
        subDivisionId: searchValues.subDivision,
        dcId: searchValues.dc,
        empCode: null,
      };
      // console.log(payload);

      const response = await leaveAllocationOutsource(payload);
      // console.log("response", response);

      if (response?.data.code == '200' && response?.data.message == 'Success') {
        setShowLevelTable(true);
        setDataInLevelTable(response?.data.list);
      } else {
        alert(response?.data.message);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  // Search By Employee Code
  const [empCode, setEmpCode] = useState('');
  const [empCodeError, setEmpCodeError] = useState('');
  const [showEmpTable, setShowEmpTable] = useState(false);
  const [dataInEmpTable, setDataInEmpTable] = useState([]);
  const empTableRef = useRef(null);

  useEffect(() => {
    if (showEmpTable && empTableRef.current) {
      empTableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEmpTable, dataInEmpTable]);

  const searchByEmpCode = async () => {
    setShowLevelTable(false);
    setSearchValues({
      region: '',
      circle: '',
      division: '',
      subDivision: '',
      dc: '',
      subStation: '',
    });
    setErrors('');
    if (!empCode.trim()) {
      setEmpCodeError('Employee Code is Required.');
      return;
    } else {
      setEmpCodeError('');
    }
    setOpenBackdrop(true);

    const payload = {
      regionId: null,
      circleId: null,
      divisionId: null,
      subDivisionId: null,
      dcId: null,
      empCode: empCode,
    };
    try {
      const res = await leaveAllocationOutsource(payload);
      // console.log("Response:", res?.data);
      if (res?.data.code === '200' && res?.data.message === 'Success') {
        setDataInEmpTable(res?.data.list?.[0]);
        setShowEmpTable(true);
      } else {
        setDataInEmpTable(null);
        setShowEmpTable(true);
        alert(res?.data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  // Modal and Update leaves
  const inputRefs = {
    casualLeave: useRef(null),
    earnLeave: useRef(null),
    commutedLeave: useRef(null),
    optionalLeave: useRef(null),
    paternityLeave: useRef(null),
    specialLeave: useRef(null),
    maternityLeave: useRef(null),
    childCareLeave: useRef(null),
    lwpLeave: useRef(null),
  };

  const [modalShow, setModalShow] = useState(false);
  const [leaveData, setLeaveData] = useState({
    casualLeave: '',
    // earnLeave: "",
    // commutedLeave: "",
    // optionalLeave: "",
    // paternityLeave: "",
    // specialLeave: "",
    // maternityLeave: "",
    // childCareLeave: "",
    // lwpLeave: "",
    empCode: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values
    if (parseInt(value) < 0) return;

    setLeaveData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const modalClose = () => setModalShow(false);
  const modalOpen = (items) => {
    // console.log(items);
    setModalShow(true);
    setLeaveData({
      casualLeave: items.casualLeave || '0',
      // earnLeave: items.earnLeave || "",
      // commutedLeave: items.commutedLeave || "",
      // optionalLeave: items.optionalLeave || "",
      // paternityLeave: items.paternityLeave || "",
      // specialLeave: items.specialLeave || "",
      // maternityLeave: items.maternityLeave || "",
      // childCareLeave: items.childCareLeave || "",
      // lwpLeave: items.lwp || "",
      empCode: items.empCode || '',
    });
  };
  const validateForm = () => {
    const requiredFields = [
      'casualLeave',
      // "earnLeave",
      // "commutedLeave",
      // "optionalLeave",
      // "paternityLeave",
      // "specialLeave",
      // "maternityLeave",
      // "childCareLeave",
      // "lwpLeave",
    ];

    for (let field of requiredFields) {
      const value = leaveData[field];
      if (value === '' || parseInt(value) < 0 || isNaN(value)) {
        alert(`Please enter a valid value for ${field}`);
        inputRefs[field]?.current?.focus();
        return false;
      }
    }
    return true;
  };

  const updateLeaves = async () => {
    if (!validateForm()) return;

    setOpenBackdrop(true);

    const payload = {
      empCode: leaveData.empCode || '',
      casualLeave: leaveData.casualLeave,
      earnLeave: null,
      commutedLeave: null,
      optionalLeave: null,
      paternityLeave: null,
      specialLeave: null,
      maternityLeave: null,
      childCareLeave: null,
      lwp: null,
      managerHrId: sessionStorage.getItem('empCode'),
    };

    try {
      const response = await updateEmployeeLeaves(payload);
      if (response?.data.code == '200' && response?.data.message == 'Success') {
        alert('Leave Updated Successfully!!');
        modalClose();
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Failed to update leaves:', error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg rounded">
        <Card.Header className="text-center p-3">
          <Typography
            variant="h5"
            sx={{
              color: '#0a1f83',
              mb: 2,
              fontFamily: 'serif',
              fontWeight: 'bold',
            }}
          >
            Leave Allocation (Outsource Employee)
          </Typography>
        </Card.Header>

        <Card.Body>
          <SearchBox
            values={searchValues}
            setValues={setSearchValues}
            errors={errors}
            refs={{
              region: regionRef,
            }}
          />

          <div className="text-center mt-4 mb-3">
            <Button
              variant="outlined"
              className="blue-button"
              onClick={searchByLevel}
            >
              Search Leave
            </Button>
          </div>
          <hr />

          <div className="row">
            <div className="col-12 col-md-4">
              <Card>
                <Card.Header className="bg-light">
                  *Search By Employee Code
                </Card.Header>
                <Card.Body>
                  <div className="row gx-2">
                    {/* Input Field */}
                    <div className="col-8">
                      <input
                        type="number"
                        id="empCode"
                        className={`form-control ${
                          empCodeError ? 'is-invalid' : ''
                        }`}
                        placeholder="Enter Employee Code"
                        value={empCode}
                        onChange={(e) => {
                          setEmpCode(e.target.value);
                          if (empCodeError) setEmpCodeError('');
                        }}
                      />
                      {empCodeError && (
                        <div className="invalid-feedback">{empCodeError}</div>
                      )}
                    </div>

                    {/* Search Button */}
                    <div className="col-4">
                      <Button
                        onClick={searchByEmpCode}
                        fullWidth
                        variant="outlined"
                        className="blue-button"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
          {/* <Divider /> */}
        </Card.Body>
      </Card>

      {/* Table by Level */}
      {showLevelTable && (
        <Card
          className="shadow-lg rounded"
          style={{
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          <Card.Header className="text-center p-3">
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
                color: '#0a1f83',
              }}
            >
              Employee Leave Records (Outsource)
            </Typography>
            <TextField
              label="Search by Employee Code or Name"
              variant="outlined"
              sx={{
                mb: 2,
                mt: 1,
                width: '50%',
                mr: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Card.Header>

          <Card.Body>
            <TableContainer component={Paper}>
              <Table ref={tableRef}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Casual Leave</StyledTableCell>
                    {/* <StyledTableCell>Earn Leave</StyledTableCell>
                    <StyledTableCell>Commuted Leave</StyledTableCell>
                    <StyledTableCell>Optional Leave</StyledTableCell>
                    <StyledTableCell>Paternity Leave</StyledTableCell>
                    <StyledTableCell>Special Leave</StyledTableCell>
                    <StyledTableCell>Maternity Leave</StyledTableCell>
                    <StyledTableCell>Child Leave</StyledTableCell>
                    <StyledTableCell>LWP</StyledTableCell>*/}
                    <StyledTableCell>Action</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataInLevelTable && dataInLevelTable.length > 0 ? (
                    dataInLevelTable
                      .filter((item) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          String(item.empCode || '')
                            .toLowerCase()
                            .includes(query) ||
                          String(item.empName || '')
                            .toLowerCase()
                            .includes(query)
                        );
                      })
                      .map((item, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{item.empCode}</StyledTableCell>
                          <StyledTableCell>{item.empName}</StyledTableCell>

                          <StyledTableCell>
                            {item.casualLeave || '0'}
                          </StyledTableCell>
                          {/* <StyledTableCell>{item.earnLeave}</StyledTableCell>
                          <StyledTableCell>
                            {item.commutedLeave}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.optionalLeave}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.paternityLeave}
                          </StyledTableCell>
                          <StyledTableCell>{item.specialLeave}</StyledTableCell>
                          <StyledTableCell>
                            {item.maternityLeave}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.childCareLeave}
                          </StyledTableCell>
                          <StyledTableCell>{item.lwp}</StyledTableCell> */}

                          <StyledTableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              className="green-button"
                              onClick={() => modalOpen(item)}
                            >
                              View
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7}>
                        Data Not Found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>
      )}

      {/* Show Table By EmpCode */}
      {showEmpTable && (
        <Card
          className="shadow-lg rounded"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          <Card.Header className="text-center p-3">
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
                color: '#0a1f83',
              }}
            >
              Employee Leave Records
            </Typography>
          </Card.Header>

          <Card.Body>
            <TableContainer component={Paper}>
              <Table ref={empTableRef}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>S.No.</StyledTableCell>
                    <StyledTableCell>Employee Code</StyledTableCell>
                    <StyledTableCell>Employee Name</StyledTableCell>
                    <StyledTableCell>Casual Leave</StyledTableCell>
                    {/* <StyledTableCell>Earn Leave</StyledTableCell>
                    <StyledTableCell>Commuted Leave</StyledTableCell>
                    <StyledTableCell>Optional Leave</StyledTableCell>
                    <StyledTableCell>Paternity Leave</StyledTableCell>
                    <StyledTableCell>Special Leave</StyledTableCell>
                    <StyledTableCell>Maternity Leave</StyledTableCell>
                    <StyledTableCell>Child Leave</StyledTableCell>
                    <StyledTableCell>LWP</StyledTableCell> */}
                    <StyledTableCell>Action</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataInEmpTable ? (
                    <StyledTableRow>
                      <StyledTableCell>1</StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.empCode}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.empName}
                      </StyledTableCell>

                      <StyledTableCell>
                        {dataInEmpTable.casualLeave}
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        {dataInEmpTable.earnLeave}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.commutedLeave}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.optionalLeave}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.paternityLeave}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.specialLeave}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.maternityLeave}
                      </StyledTableCell>
                      <StyledTableCell>
                        {dataInEmpTable.childCareLeave}
                      </StyledTableCell>
                      <StyledTableCell>{dataInEmpTable.lwp}</StyledTableCell> */}

                      <StyledTableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          className="green-button"
                          onClick={() => modalOpen(dataInEmpTable)}
                        >
                          View
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7}>
                        Data Not Found
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card.Body>
        </Card>
      )}

      <Modal
        show={modalShow}
        onHide={modalClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              variant="h5"
              sx={{
                color: '#0a1f83',
                mb: 2,
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}
            >
              Leave Balance Update (Outsource)
            </Typography>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container">
            <div className="row">
              {[
                {
                  label: 'Casual Leave',
                  name: 'casualLeave',
                  ref: inputRefs.casualLeave || '0',
                },
                // {
                //   label: "Earned Leave",
                //   name: "earnLeave",
                //   ref: inputRefs.earnLeave,
                // },
                // {
                //   label: "Commuted Leave",
                //   name: "commutedLeave",
                //   ref: inputRefs.commutedLeave,
                // },
                // {
                //   label: "Optional Leave",
                //   name: "optionalLeave",
                //   ref: inputRefs.optionalLeave,
                // },
                // {
                //   label: "Paternity Leave",
                //   name: "paternityLeave",
                //   ref: inputRefs.paternityLeave,
                // },
                // {
                //   label: "Special Leave",
                //   name: "specialLeave",
                //   ref: inputRefs.specialLeave,
                // },
                // {
                //   label: "Maternity Leave",
                //   name: "maternityLeave",
                //   ref: inputRefs.maternityLeave,
                // },
                // {
                //   label: "Child Care Leave",
                //   name: "childCareLeave",
                //   ref: inputRefs.childCareLeave,
                // },
                // {
                //   label: "LWP Leave",
                //   name: "lwpLeave",
                //   ref: inputRefs.lwpLeave,
                // },
              ].map((field, index) => (
                <div className="col-md-6 mb-3" key={index}>
                  <label
                    htmlFor={field.name}
                    style={{
                      fontWeight: '600',
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      display: 'block',
                      marginBottom: '6px',
                      color: '#333',
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={leaveData[field.name]}
                    onChange={handleChange}
                    ref={field.ref}
                    className="form-control"
                    style={{
                      borderRadius: '6px',
                      padding: '8px',
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="cancel-button"
            variant="outlined"
            onClick={modalClose}
            style={{ borderRadius: '20px', padding: '6px 20px' }}
          >
            Close
          </Button>
          &nbsp; &nbsp;
          <Button
            className="green-button"
            variant="outlined"
            onClick={updateLeaves}
            style={{
              borderRadius: '20px',
              backgroundColor: '#0a1f83',
              color: '#fff',
              padding: '6px 20px',
              border: 'none',
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <PropagateLoader />
      </Backdrop>
    </>
  );
}
export default OutsourceLeaveAllocation;
