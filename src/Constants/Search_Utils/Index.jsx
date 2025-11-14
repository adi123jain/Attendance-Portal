// import React, { useEffect, useState } from "react";
// import Card from "react-bootstrap/Card";
// import Form from "react-bootstrap/Form";
// import {
//   getRegion,
//   getCircle,
//   getDivision,
//   getSubDivision,
//   getDC,
//   getSubstation,
// } from "../../Services/Auth";

// function SelectBox({
//   title,
//   value,
//   options,
//   onChange,
//   placeholder,
//   error,
//   inputRef,
// }) {
//   return (
//     <div className="col">
//       <Card>
//         <Card.Header>{title}</Card.Header>
//         <Card.Body>
//           <Form.Select
//             ref={inputRef}
//             value={value}
//             onChange={onChange}
//             style={{ borderColor: error ? "red" : undefined }}
//           >
//             <option value="" disabled>
//               {`-- select ${placeholder} --`}
//             </option>
//             {options.length === 0 ? (
//               <option disabled value="">
//                 No data found
//               </option>
//             ) : (
//               options.map((item, index) => (
//                 <option key={item.id || index} value={item.id}>
//                   {item.name}
//                 </option>
//               ))
//             )}
//           </Form.Select>
//           {error && <div className="text-danger mt-1">{error}</div>}
//         </Card.Body>
//       </Card>
//     </div>
//   );
// }

// function SearchUtils({ values, setValues, errors = {}, refs = {} }) {
//   const [regionOptions, setRegionOptions] = useState([]);
//   const [circleOptions, setCircleOptions] = useState([]);
//   const [divisionOptions, setDivisionOptions] = useState([]);
//   const [subDivisionOptions, setSubDivisionOptions] = useState([]);
//   const [dcOptions, setDcOptions] = useState([]);
//   const [substationOptions, setSubstationOptions] = useState([]);

//   const handleChange = (key) => (e) => {
//     const newValue = e.target.value;

//     const resetMap = {
//       region: {
//         circle: "",
//         division: "",
//         subDivision: "",
//         dc: "",
//         subStation: "",
//       },
//       circle: { division: "", subDivision: "", dc: "", subStation: "" },
//       division: { subDivision: "", dc: "", subStation: "" },
//       subDivision: { dc: "", subStation: "" },
//       dc: { subStation: "" },
//     };

//     setValues((prev) => ({
//       ...prev,
//       [key]: newValue,
//       ...(resetMap[key] || {}),
//     }));
//   };

//   useEffect(() => {
//     const fetchRegionData = async () => {
//       try {
//         const res = await getRegion();
//         const list = res?.data?.list || [];
//         setRegionOptions(
//           list.map((item) => ({ id: item.regionId, name: item.name }))
//         );
//       } catch (err) {
//         console.error("Error fetching regions:", err);
//       }
//     };
//     fetchRegionData();
//   }, []);

//   useEffect(() => {
//     if (!values.region) return;
//     const fetchCircleData = async () => {
//       try {
//         const res = await getCircle(values.region);
//         const list = res?.data?.list || [];
//         setCircleOptions(
//           list.map((item) => ({ id: item.circleId, name: item.name }))
//         );
//       } catch (err) {
//         console.error("Error fetching circles:", err);
//       }
//     };
//     fetchCircleData();
//   }, [values.region]);

//   useEffect(() => {
//     if (!values.circle) return;
//     const fetchDivisionData = async () => {
//       try {
//         const res = await getDivision(values.circle);
//         const list = res?.data?.list || [];
//         setDivisionOptions(
//           list.map((item) => ({ id: item.divisionId, name: item.name }))
//         );
//       } catch (err) {
//         console.error("Error fetching divisions:", err);
//       }
//     };
//     fetchDivisionData();
//   }, [values.circle]);

//   useEffect(() => {
//     if (!values.division) return;
//     const fetchSubDivisionData = async () => {
//       try {
//         const res = await getSubDivision(values.division);
//         const list = res?.data?.list || [];
//         setSubDivisionOptions(
//           list.map((item) => ({ id: item.subdivisionId, name: item.name }))
//         );
//       } catch (err) {
//         console.error("Error fetching sub-divisions:", err);
//       }
//     };
//     fetchSubDivisionData();
//   }, [values.division]);

//   useEffect(() => {
//     if (!values.subDivision) return;
//     const fetchDC = async () => {
//       try {
//         const res = await getDC(values.subDivision);
//         const list = res?.data?.list || [];
//         setDcOptions(list.map((item) => ({ id: item.dcId, name: item.name })));
//       } catch (err) {
//         console.error("Error fetching DC's:", err);
//       }
//     };
//     fetchDC();
//   }, [values.subDivision]);

//   useEffect(() => {
//     if (!values.dc) return;
//     const fetchSubstation = async () => {
//       try {
//         const res = await getSubstation(values.dc);
//         const list = res?.data?.list || [];
//         setSubstationOptions(
//           list.map((item) => ({ id: item.substationId, name: item.name }))
//         );
//       } catch (err) {
//         console.error("Error fetching substations:", err);
//       }
//     };
//     fetchSubstation();
//   }, [values.dc]);

//   return (
//     <Card.Body>
//       <div className="row row-cols-1 row-cols-md-3 g-3">
//         <SelectBox
//           title="*Region"
//           placeholder="Region"
//           value={values.region}
//           options={regionOptions}
//           onChange={handleChange("region")}
//           error={errors.region}
//           inputRef={refs.region}
//         />
//         <SelectBox
//           title="Circle"
//           placeholder="Circle"
//           value={values.circle}
//           options={circleOptions}
//           onChange={handleChange("circle")}
//           error={errors.circle}
//         />
//         <SelectBox
//           title="Division"
//           placeholder="Division"
//           value={values.division}
//           options={divisionOptions}
//           onChange={handleChange("division")}
//           error={errors.division}
//         />
//       </div>

//       <div className="row row-cols-1 row-cols-md-3 g-3 mt-3">
//         <SelectBox
//           title="Sub-Division"
//           placeholder="Sub Division"
//           value={values.subDivision}
//           options={subDivisionOptions}
//           onChange={handleChange("subDivision")}
//           error={errors.subDivision}
//         />
//         <SelectBox
//           title="DC"
//           placeholder="DC"
//           value={values.dc}
//           options={dcOptions}
//           onChange={handleChange("dc")}
//           error={errors.dc}
//         />
//         <SelectBox
//           title="Sub-Station"
//           placeholder="Sub Station"
//           value={values.subStation}
//           options={substationOptions}
//           onChange={handleChange("subStation")}
//           error={errors.subStation}
//         />
//       </div>
//     </Card.Body>
//   );
// }

// export default SearchUtils;

import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
  getRegion,
  getCircle,
  getDivision,
  getSubDivision,
  getDC,
  getSubstation,
} from "../../Services/Auth";

function SelectBox({
  title,
  value,
  options,
  onChange,
  placeholder,
  error,
  inputRef,
  disabled,
}) {
  return (
    <div className="col">
      <Card>
        <Card.Header>{title}</Card.Header>
        <Card.Body>
          <Form.Select
            ref={inputRef}
            value={value || ""}
            onChange={onChange}
            style={{ borderColor: error ? "red" : undefined }}
            disabled={disabled}
          >
            <option value="" disabled>{`-- select ${placeholder} --`}</option>
            {options.length === 0 ? (
              <option disabled value="">
                No data found
              </option>
            ) : (
              options.map((item, index) => (
                <option key={item.id || index} value={item.id}>
                  {item.name}
                </option>
              ))
            )}
          </Form.Select>
          {error && <div className="text-danger mt-1">{error}</div>}
        </Card.Body>
      </Card>
    </div>
  );
}

function SearchUtils({ values, setValues, errors = {}, refs = {} }) {
  const [regionOptions, setRegionOptions] = useState([]);
  const [circleOptions, setCircleOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [subDivisionOptions, setSubDivisionOptions] = useState([]);
  const [dcOptions, setDcOptions] = useState([]);
  const [substationOptions, setSubstationOptions] = useState([]);

  const handleChange = (key) => (e) => {
    const newValue = e.target.value;

    // Reset dependent values
    const resetMap = {
      region: {
        circle: "",
        division: "",
        subDivision: "",
        dc: "",
        subStation: "",
      },
      circle: { division: "", subDivision: "", dc: "", subStation: "" },
      division: { subDivision: "", dc: "", subStation: "" },
      subDivision: { dc: "", subStation: "" },
      dc: { subStation: "" },
    };

    setValues((prev) => ({
      ...prev,
      [key]: newValue,
      ...(resetMap[key] || {}),
    }));

    // Reset dependent options
    const resetOptionsMap = {
      region: ["circle", "division", "subDivision", "dc", "substation"],
      circle: ["division", "subDivision", "dc", "substation"],
      division: ["subDivision", "dc", "substation"],
      subDivision: ["dc", "substation"],
      dc: ["substation"],
    };

    const newOptions = {
      region: regionOptions,
      circle: circleOptions,
      division: divisionOptions,
      subDivision: subDivisionOptions,
      dc: dcOptions,
      substation: substationOptions,
    };
    (resetOptionsMap[key] || []).forEach((optKey) => {
      newOptions[optKey] = [];
    });

    setRegionOptions(newOptions.region);
    setCircleOptions(newOptions.circle);
    setDivisionOptions(newOptions.division);
    setSubDivisionOptions(newOptions.subDivision);
    setDcOptions(newOptions.dc);
    setSubstationOptions(newOptions.substation);
  };

  // useEffect(() => {
  //   const fetchRegionData = async () => {
  //     try {
  //       const res = await getRegion();
  //       const list = res?.data?.list || [];
  //       setRegionOptions(list.map((i) => ({ id: i.regionId, name: i.name })));
  //     } catch (err) {
  //       console.error("Error fetching regions:", err);
  //     }
  //   };
  //   fetchRegionData();
  // }, []);

  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        const res = await getRegion();
        const list = res?.data?.list || [];
        const formattedList = list.map((item) => ({
          id: item.regionId,
          name: item.name,
        }));
        setRegionOptions(formattedList);

        // If empCode is 89427825, set region value automatically to 2
        const empCode = sessionStorage.getItem("empCode");
        if (empCode === "89427825") {
          const defaultRegion = formattedList.find((item) => item.id === 2);
          if (defaultRegion) {
            setValues((prev) => ({
              ...prev,
              region: defaultRegion.id,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
      }
    };

    fetchRegionData();
  }, [setValues]);

  useEffect(() => {
    if (!values.region) return setCircleOptions([]);
    const fetchCircleData = async () => {
      try {
        const res = await getCircle(values.region);
        const list = res?.data?.list || [];
        setCircleOptions(list.map((i) => ({ id: i.circleId, name: i.name })));
      } catch (err) {
        console.error("Error fetching circles:", err);
      }
    };
    fetchCircleData();
  }, [values.region]);

  useEffect(() => {
    if (!values.circle) return setDivisionOptions([]);
    const fetchDivisionData = async () => {
      try {
        const res = await getDivision(values.circle);
        const list = res?.data?.list || [];
        setDivisionOptions(
          list.map((i) => ({ id: i.divisionId, name: i.name }))
        );
      } catch (err) {
        console.error("Error fetching divisions:", err);
      }
    };
    fetchDivisionData();
  }, [values.circle]);

  useEffect(() => {
    if (!values.division) return setSubDivisionOptions([]);
    const fetchSubDivisionData = async () => {
      try {
        const res = await getSubDivision(values.division);
        const list = res?.data?.list || [];
        setSubDivisionOptions(
          list.map((i) => ({ id: i.subdivisionId, name: i.name }))
        );
      } catch (err) {
        console.error("Error fetching sub-divisions:", err);
      }
    };
    fetchSubDivisionData();
  }, [values.division]);

  useEffect(() => {
    if (!values.subDivision) return setDcOptions([]);
    const fetchDC = async () => {
      try {
        const res = await getDC(values.subDivision);
        const list = res?.data?.list || [];
        setDcOptions(list.map((i) => ({ id: i.dcId, name: i.name })));
      } catch (err) {
        console.error("Error fetching DC's:", err);
      }
    };
    fetchDC();
  }, [values.subDivision]);

  useEffect(() => {
    if (!values.dc) return setSubstationOptions([]);
    const fetchSubstation = async () => {
      try {
        const res = await getSubstation(values.dc);
        const list = res?.data?.list || [];
        setSubstationOptions(
          list.map((i) => ({ id: i.substationId, name: i.name }))
        );
      } catch (err) {
        console.error("Error fetching substations:", err);
      }
    };
    fetchSubstation();
  }, [values.dc]);

  const sessionEmpCode = sessionStorage.getItem("empCode");
  const isDisabled = sessionEmpCode === "89427825";

  return (
    <Card.Body>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        <SelectBox
          title="*Region"
          placeholder="Region"
          value={values.region}
          options={regionOptions}
          onChange={handleChange("region")}
          error={errors.region}
          inputRef={refs.region}
          disabled={isDisabled}
        />
        <SelectBox
          title="Circle"
          placeholder="Circle"
          value={values.circle}
          options={circleOptions}
          onChange={handleChange("circle")}
          error={errors.circle}
          disabled={isDisabled}
        />
        <SelectBox
          title="Division"
          placeholder="Division"
          value={values.division}
          options={divisionOptions}
          onChange={handleChange("division")}
          error={errors.division}
          disabled={isDisabled}
        />
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-3 mt-3">
        <SelectBox
          title="Sub-Division"
          placeholder="Sub Division"
          value={values.subDivision}
          options={subDivisionOptions}
          onChange={handleChange("subDivision")}
          error={errors.subDivision}
          disabled={isDisabled}
        />
        <SelectBox
          title="DC"
          placeholder="DC"
          value={values.dc}
          options={dcOptions}
          onChange={handleChange("dc")}
          error={errors.dc}
          disabled={isDisabled}
        />
        <SelectBox
          title="Sub-Station"
          placeholder="Sub Station"
          value={values.subStation}
          options={substationOptions}
          onChange={handleChange("subStation")}
          error={errors.subStation}
          disabled={isDisabled}
        />
      </div>
    </Card.Body>
  );
}

export default SearchUtils;
