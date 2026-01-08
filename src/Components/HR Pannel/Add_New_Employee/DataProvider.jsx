import { useEffect, useState } from 'react';
import AddNewEmployee from './Index';
import {
  getEmploymentType,
  getRegion,
  getCircle,
  getDivision,
  getSubDivision,
  getDC,
  getSubstation,
  getDesignation,
  getDepartment,
  getRoDesignation,
  getRoNameByRoId,
  getHrManager,
  getAttendanceLocation,
  getHolidays,
  getShifts,
} from '../../../Services/Auth';

function DataProvider() {
  const [employmentTypes, setEmploymentTypes] = useState([]);

  const [regions, setRegions] = useState([]);
  const [circles, setCircles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [dcs, setDCs] = useState([]);
  const [substations, setSubstations] = useState([]);

  // Selected values
  const [selectedEmployment, setSelectedEmployment] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubDivision, setSelectedSubDivision] = useState('');
  const [selectedDC, setSelectedDC] = useState('');
  const [selectedSubstation, setSelectedSubstation] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Fetch Employment Types
  useEffect(() => {
    const fetchEmployment = async () => {
      try {
        const res = await getEmploymentType();
        setEmploymentTypes(res.data.code === '200' ? res.data.list : []);
      } catch (err) {
        console.error(err);
        setEmploymentTypes([]);
      }
    };
    fetchEmployment();
  }, []);

  // Fetch Regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await getRegion();
        setRegions(res.data.code === '200' ? res.data.list : []);
      } catch (err) {
        console.error(err);
        setRegions([]);
      }
    };
    fetchRegions();
  }, []);

  // Cascading handlers
  const handleEmploymentChange = (employmentId) =>
    setSelectedEmployment(employmentId);

  const handleRegionChange = async (regionId) => {
    setSelectedRegion(regionId);
    setSelectedCircle('');
    setSelectedDivision('');
    setSelectedSubDivision('');
    setSelectedDC('');
    setSelectedSubstation('');
    setCircles([]);
    setDivisions([]);
    setSubDivisions([]);
    setDCs([]);
    setSubstations([]);

    try {
      const res = await getCircle(regionId);
      setCircles(res.data.code === '200' ? res.data.list : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCircleChange = async (circleId) => {
    setSelectedCircle(circleId);
    setSelectedDivision('');
    setSelectedSubDivision('');
    setSelectedDC('');
    setSelectedSubstation('');
    setDivisions([]);
    setSubDivisions([]);
    setDCs([]);
    setSubstations([]);

    try {
      const res = await getDivision(circleId);
      setDivisions(res.data.code === '200' ? res.data.list : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDivisionChange = async (divisionId) => {
    setSelectedDivision(divisionId);
    setSelectedSubDivision('');
    setSelectedDC('');
    setSelectedSubstation('');
    setSubDivisions([]);
    setDCs([]);
    setSubstations([]);

    try {
      const res = await getSubDivision(divisionId);
      setSubDivisions(res.data.code === '200' ? res.data.list : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubDivisionChange = async (subDivisionId) => {
    setSelectedSubDivision(subDivisionId);
    setSelectedDC('');
    setSelectedSubstation('');
    setDCs([]);
    setSubstations([]);

    try {
      const res = await getDC(subDivisionId);
      setDCs(res.data.code === '200' ? res.data.list : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDCChange = async (dcId) => {
    setSelectedDC(dcId);
    setSelectedSubstation('');
    setSubstations([]);

    try {
      const res = await getSubstation(dcId);
      setSubstations(res.data.code === '200' ? res.data.list : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubstationChange = (substationId) =>
    setSelectedSubstation(substationId);

  const [designations, setDesignations] = useState([]);
  // Fetch Designations
  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const res = await getDesignation();
        setDesignations(res.data.code === '200' ? res.data.list : []);
      } catch (err) {
        console.error(err);
        setDesignations([]);
      }
    };
    fetchDesignation();
  }, []);

  // Cascading handlers
  const handleDesignationChange = (employmentId) =>
    setSelectedDesignation(employmentId);

  const [departments, setDepartments] = useState([]);
  // Fetch Department
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await getDepartment();
        setDepartments(res.data.code === '200' ? res.data.list : []);
      } catch (err) {
        console.error(err);
        setDepartments([]);
      }
    };
    fetchDepartment();
  }, []);

  // Cascading handlers
  const handleDepartmentChange = (departmentId) =>
    setSelectedDepartment(departmentId);

  const [roDesignations, setRoDesignations] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [selectedRoDesignation, setSelectedRoDesignation] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');

  // Fetch Ro Designations on mount
  useEffect(() => {
    const fetchRoDesignations = async () => {
      try {
        const res = await getRoDesignation();
        setRoDesignations(res.data.code === '200' ? res.data.list : []);
      } catch (err) {
        console.error(err);
        setRoDesignations([]);
      }
    };
    fetchRoDesignations();
  }, []);

  // Handle Ro Name on designation change
  const handleRoDesignationChange = async (designationId) => {
    setSelectedRoDesignation(designationId);
    setSelectedOfficer('');
    setOfficers([]);

    try {
      const res = await getRoNameByRoId(designationId);
      setOfficers(res.data.code === '200' ? res.data.list : []);
    } catch (err) {
      console.error(err);
      setOfficers([]);
    }
  };

  // Handle officer selection
  const handleOfficerChange = (officerId) => {
    setSelectedOfficer(officerId);
  };

  const [hrManagers, setHrManagers] = useState([]);
  const [selectedHrManager, setSelectedHrManager] = useState('');

  // Fetch HR Managers on load
  useEffect(() => {
    const fetchHrManagers = async () => {
      try {
        const res = await getHrManager();
        if (res.data.code === '200') {
          setHrManagers(res.data.list);
        } else {
          setHrManagers([]);
        }
      } catch (err) {
        console.error('Failed to fetch HR managers:', err);
        setHrManagers([]);
      }
    };
    fetchHrManagers();
  }, []);

  const [attendanceLocations, setAttendanceLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchAttendanceLocation = async () => {
    const payload = {
      regionId: selectedRegion,
      circleId: selectedCircle || null,
      divisionId: selectedDivision || null,
      subDivisionId: selectedSubDivision || null,
      dcId: selectedDC || null,
      substationId: selectedSubstation || null,
    };

    try {
      const response = await getAttendanceLocation(payload);
      const list = response?.data?.value ?? response?.data?.list ?? [];
      setAttendanceLocations(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching Attendance Location:', error);
      setAttendanceLocations([]);
    }
  };

  useEffect(() => {
    if (selectedRegion) {
      // setSelectedLocation('');
      fetchAttendanceLocation();
    } else {
      setAttendanceLocations([]);
      // setSelectedLocation('');
    }
  }, [
    selectedRegion,
    selectedCircle,
    selectedDivision,
    selectedSubDivision,
    selectedDC,
    selectedSubstation,
  ]);

  const [holidayList, setHolidayList] = useState([]);
  const [selectedHoliday, setSelectedHoliday] = useState('');

  // Fetch holidays on mount
  useEffect(() => {
    const fetchHolidayList = async () => {
      try {
        const response = await getHolidays();
        const list = response?.data?.value ?? response?.data?.list ?? [];
        setHolidayList(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error('Error fetching Holiday List:', error);
        setHolidayList([]);
      }
    };

    fetchHolidayList();
  }, []);

  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  // Fetch Default Shift List
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await getShifts();
        const list = response?.data?.value ?? response?.data?.list ?? [];
        setShifts(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error('Error fetching Default Shift:', error);
        setShifts([]);
      }
    };
    fetchShifts();
  }, []);

  return (
    <AddNewEmployee
      employmentList={employmentTypes}
      selectedEmployment={selectedEmployment}
      onEmploymentChange={handleEmploymentChange}
      regionsList={regions}
      circlesList={circles}
      divisionsList={divisions}
      subDivisionsList={subDivisions}
      dcsList={dcs}
      substationsList={substations}
      selectedRegion={selectedRegion}
      selectedCircle={selectedCircle}
      selectedDivision={selectedDivision}
      selectedSubDivision={selectedSubDivision}
      selectedDC={selectedDC}
      selectedSubstation={selectedSubstation}
      onRegionChange={handleRegionChange}
      onCircleChange={handleCircleChange}
      onDivisionChange={handleDivisionChange}
      onSubDivisionChange={handleSubDivisionChange}
      onDCChange={handleDCChange}
      onSubstationChange={handleSubstationChange}
      designationList={designations}
      onDesignationChange={handleDesignationChange}
      selectedDesignation={selectedDesignation}
      departmentList={departments}
      onDepartmentChange={handleDepartmentChange}
      selectedDepartment={selectedDepartment}
      roDesignationsList={roDesignations}
      officersList={officers}
      selectedRoDesignation={selectedRoDesignation}
      selectedOfficer={selectedOfficer}
      onRoDesignationChange={handleRoDesignationChange}
      onOfficerChange={handleOfficerChange}
      hrManagersList={hrManagers}
      selectedHrManager={selectedHrManager}
      onHrManagerChange={setSelectedHrManager}
      attendanceLocations={attendanceLocations}
      selectedLocation={selectedLocation}
      onLocationChange={setSelectedLocation}
      holidayList={holidayList}
      selectedHoliday={selectedHoliday}
      onHolidayChange={setSelectedHoliday}
      shifts={shifts}
      selectedShift={selectedShift}
      onShiftChange={setSelectedShift}
    />
  );
}

export default DataProvider;
