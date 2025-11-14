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
    getFeederBySubstation,
} from "../../../Services/Auth";

function SelectBox({
    title,
    value,
    options,
    onChange,
    placeholder,
    error,
    inputRef,
}) {
    return (
        <div className="col">
            <Card className="shadow-sm">
                <Card.Header>{title}</Card.Header>
                <Card.Body>
                    <Form.Select
                        ref={inputRef}
                        value={value || ""}
                        onChange={onChange}
                        style={{ borderColor: error ? "red" : undefined }}
                    >
                        <option value="" disabled>{`-- Select ${placeholder} --`}</option>
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

function SearchForPostings({
    values,
    setValues,
    errors = {},
    refs = {},
    feederListBySubstation,
}) {
    const [options, setOptions] = useState({
        region: [],
        circle: [],
        division: [],
        subDivision: [],
        dc: [],
        substation: [],
    });

    const handleChange = (key) => async (e) => {
        const newValue = e.target.value;

        const resetFields = {
            region: {
                circle: "",
                division: "",
                subDivision: "",
                dc: "",
                subStation: "",
                feeder: "",
                feederName: "",
            },
            circle: {
                division: "",
                subDivision: "",
                dc: "",
                subStation: "",
                feeder: "",
                feederName: "",
            },
            division: {
                subDivision: "",
                dc: "",
                subStation: "",
                feeder: "",
                feederName: "",
            },
            subDivision: { dc: "", subStation: "", feeder: "", feederName: "" },
            dc: { subStation: "", feeder: "", feederName: "" },
            subStation: { feeder: "", feederName: "" },
        };

        setValues((prev) => ({
            ...prev,
            [key]: newValue,
            ...(resetFields[key] || {}),
        }));

        if (typeof feederListBySubstation === "function") {
            if (key !== "subStation") feederListBySubstation([]);
        }

        if (
            key === "subStation" &&
            newValue &&
            typeof feederListBySubstation === "function"
        ) {
            try {
                const response = await getFeederBySubstation(newValue);
                const feederList = response?.data || [];
                feederListBySubstation(feederList);
            } catch (err) {
                console.error("Error fetching feeders for SubStation:", err);
                feederListBySubstation([]);
            }
        }
    };

    const fetchAndSet = async (fetchFunc, setterKey, mapper) => {
        try {
            const res = await fetchFunc();
            const list = res?.data?.list || [];
            setOptions((prev) => ({ ...prev, [setterKey]: list.map(mapper) }));
        } catch (err) {
            console.error(`Error fetching ${setterKey}:`, err);
            setOptions((prev) => ({ ...prev, [setterKey]: [] }));
        }
    };

    useEffect(() => {
        fetchAndSet(getRegion, "region", (item) => ({
            id: item.regionId,
            name: item.name,
        }));
    }, []);
    useEffect(() => {
        if (values.region)
            fetchAndSet(
                () => getCircle(values.region),
                "circle",
                (item) => ({ id: item.circleId, name: item.name })
            );
        else setOptions((prev) => ({ ...prev, circle: [] }));
    }, [values.region]);
    useEffect(() => {
        if (values.circle)
            fetchAndSet(
                () => getDivision(values.circle),
                "division",
                (item) => ({ id: item.divisionId, name: item.name })
            );
        else setOptions((prev) => ({ ...prev, division: [] }));
    }, [values.circle]);
    useEffect(() => {
        if (values.division) {
            fetchAndSet(
                () => getSubDivision(values.division),
                "subDivision",
                (item) => ({ id: item.subdivisionId, name: item.name })
            );
        } else {
            setOptions((prev) => ({ ...prev, subDivision: [] }));
        }
    }, [values.division]);

    useEffect(() => {
        if (values.subDivision)
            fetchAndSet(
                () => getDC(values.subDivision),
                "dc",
                (item) => ({ id: item.dcId, name: item.name })
            );
        else setOptions((prev) => ({ ...prev, dc: [] }));
    }, [values.subDivision]);

    // ✅ Fetch Substations when DC changes
    useEffect(() => {
        if (values.dc) {
            fetchAndSet(
                () => getSubstation(values.dc),
                "substation",
                (item) => ({ id: item.substationId, name: item.name })
            );
        } else {
            setOptions((prev) => ({ ...prev, substation: [] }));
        }
    }, [values.dc]);

    return (
        <Card.Body>
            <div className="row row-cols-1 row-cols-md-3 g-3">
                <SelectBox
                    title="*Region"
                    placeholder="Region"
                    value={values.region}
                    options={options.region}
                    onChange={handleChange("region")}
                    error={errors.region}
                    inputRef={refs.region}
                />
                <SelectBox
                    title="Circle"
                    placeholder="Circle"
                    value={values.circle}
                    options={options.circle}
                    onChange={handleChange("circle")}
                    error={errors.circle}
                />
                <SelectBox
                    title="Division"
                    placeholder="Division"
                    value={values.division}
                    options={options.division}
                    onChange={handleChange("division")}
                    error={errors.division}
                />
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-3 mt-3">
                <SelectBox
                    title="Sub-Division"
                    placeholder="Sub Division"
                    value={values.subDivision}
                    options={options.subDivision}
                    onChange={handleChange("subDivision")}
                    error={errors.subDivision}
                />
                <SelectBox
                    title="DC"
                    placeholder="DC"
                    value={values.dc}
                    options={options.dc}
                    onChange={handleChange("dc")}
                    error={errors.dc}
                />
                <SelectBox
                    title="Sub-Station"
                    placeholder="Sub Station"
                    value={values.subStation}
                    options={options.substation}
                    onChange={handleChange("subStation")}
                    error={errors.subStation}
                />
            </div>
        </Card.Body>
    );
}

export default SearchForPostings;

// import React, { useEffect, useState } from "react";
// import Card from "react-bootstrap/Card";
// import Form from "react-bootstrap/Form";
// import {
//     getRegion,
//     getCircle,
//     getDivision,
//     getSubDivision,
//     getDC,
//     getSubstationByDivision,
//     getFeederBySubstation,
// } from "../../../Services/Auth";

// function SelectBox({
//     title,
//     value,
//     options,
//     onChange,
//     placeholder,
//     error,
//     inputRef,
// }) {
//     return (
//         <div className="col">
//             <Card className="shadow-sm">
//                 <Card.Header>{title}</Card.Header>
//                 <Card.Body>
//                     <Form.Select
//                         ref={inputRef}
//                         value={value}
//                         onChange={onChange}
//                         style={{ borderColor: error ? "red" : undefined }}
//                     >
//                         <option value="" disabled>{`-- Select ${placeholder} --`}</option>
//                         {options.length === 0 ? (
//                             <option disabled value="">
//                                 No data found
//                             </option>
//                         ) : (
//                             options.map((item, index) => (
//                                 <option key={item.id || index} value={item.id}>
//                                     {item.name}
//                                 </option>
//                             ))
//                         )}
//                     </Form.Select>
//                     {error && <div className="text-danger mt-1">{error}</div>}
//                 </Card.Body>
//             </Card>
//         </div>
//     );
// }

// function SearchForPostings({
//     values,
//     setValues,
//     errors = {},
//     refs = {},
//     feederListBySubstation,
// }) {
//     const [options, setOptions] = useState({
//         region: [],
//         circle: [],
//         division: [],
//         subDivision: [],
//         dc: [],
//         substation: [],
//     });

//     const handleChange = (key) => async (e) => {
//         const newValue = e.target.value;

//         const resetFields = {
//             region: {
//                 circle: "",
//                 division: "",
//                 subDivision: "",
//                 dc: "",
//                 subStation: "",
//             },
//             circle: { division: "", subDivision: "", dc: "", subStation: "" },
//             division: { subDivision: "", dc: "", subStation: "" },
//             subDivision: { dc: "", subStation: "" },
//             dc: {},
//         };

//         setValues((prev) => ({
//             ...prev,
//             [key]: newValue,
//             ...(resetFields[key] || {}),
//         }));

//         if (key !== "subStation" && typeof feederListBySubstation === "function") {
//             feederListBySubstation([]);
//         }
//         //   When DC changes, fetch user data and pass to parent
//         if (
//             key === "subStation" &&
//             newValue &&
//             typeof feederListBySubstation === "function"
//         ) {
//             try {
//                 // Call first API
//                 const response = await getFeederBySubstation(newValue);
//                 console.log("res", response);

//                 const feederList = response?.data || [];
//                 feederListBySubstation(feederList);
//             } catch (err) {
//                 console.error("Error fetching user details for DC:", err);
//                 feederListBySubstation([]);
//             }
//         }
//     };

//     const fetchAndSet = async (fetchFunc, setterKey, mapper) => {
//         try {
//             const res = await fetchFunc();
//             const list = res?.data?.list || [];
//             setOptions((prev) => ({
//                 ...prev,
//                 [setterKey]: list.map(mapper),
//             }));
//         } catch (err) {
//             console.error(`Error fetching ${setterKey}:`, err);
//             setOptions((prev) => ({
//                 ...prev,
//                 [setterKey]: [],
//             }));
//         }
//     };

//     useEffect(() => {
//         fetchAndSet(getRegion, "region", (item) => ({
//             id: item.regionId,
//             name: item.name,
//         }));
//     }, []);

//     useEffect(() => {
//         if (values.region)
//             fetchAndSet(
//                 () => getCircle(values.region),
//                 "circle",
//                 (item) => ({
//                     id: item.circleId,
//                     name: item.name,
//                 })
//             );
//     }, [values.region]);

//     useEffect(() => {
//         if (values.circle)
//             fetchAndSet(
//                 () => getDivision(values.circle),
//                 "division",
//                 (item) => ({
//                     id: item.divisionId,
//                     name: item.name,
//                 })
//             );
//     }, [values.circle]);

//     useEffect(() => {
//         if (values.division) {
//             fetchAndSet(
//                 () => getSubDivision(values.division),
//                 "subDivision",
//                 (item) => ({
//                     id: item.subdivisionId,
//                     name: item.name,
//                 })
//             );

//             fetchAndSet(
//                 () => getSubstationByDivision(values.division),
//                 "substation",
//                 (item) => ({
//                     id: item.substationId,
//                     name: item.name,
//                 })
//             );
//         }
//     }, [values.division]);

//     useEffect(() => {
//         if (values.subDivision)
//             fetchAndSet(
//                 () => getDC(values.subDivision),
//                 "dc",
//                 (item) => ({
//                     id: item.dcId,
//                     name: item.name,
//                 })
//             );
//     }, [values.subDivision]);

//     return (
//         <Card.Body>
//             <div className="row row-cols-1 row-cols-md-3 g-3">
//                 <SelectBox
//                     title="*Region"
//                     placeholder="Region"
//                     value={values.region}
//                     options={options.region}
//                     onChange={handleChange("region")}
//                     error={errors.region}
//                     inputRef={refs.region}
//                 />
//                 <SelectBox
//                     title="Circle"
//                     placeholder="Circle"
//                     value={values.circle}
//                     options={options.circle}
//                     onChange={handleChange("circle")}
//                     error={errors.circle}
//                 />
//                 <SelectBox
//                     title="Division"
//                     placeholder="Division"
//                     value={values.division}
//                     options={options.division}
//                     onChange={handleChange("division")}
//                     error={errors.division}
//                 />
//             </div>

//             <div className="row row-cols-1 row-cols-md-3 g-3 mt-3">
//                 <SelectBox
//                     title="Sub-Division"
//                     placeholder="Sub Division"
//                     value={values.subDivision}
//                     options={options.subDivision}
//                     onChange={handleChange("subDivision")}
//                     error={errors.subDivision}
//                 />
//                 <SelectBox
//                     title="DC"
//                     placeholder="DC"
//                     value={values.dc}
//                     options={options.dc}
//                     onChange={handleChange("dc")}
//                     error={errors.dc}
//                 />
//                 <SelectBox
//                     title="Sub-Station"
//                     placeholder="Sub Station"
//                     value={values.subStation}
//                     options={options.substation}
//                     onChange={handleChange("subStation")}
//                     error={errors.subStation}
//                 />
//             </div>
//         </Card.Body>
//     );
// }

// export default SearchForPostings;
