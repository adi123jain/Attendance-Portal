import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import {
  getRegion,
  getCircle,
  getDivision,
  getSubDivision,
  getDC,
} from '../../../Services/Auth';

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
            value={value}
            onChange={onChange}
            style={{ borderColor: error ? 'red' : undefined }}
            disabled={disabled}
          >
            <option value="" disabled>
              {`-- select ${placeholder} --`}
            </option>
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

function SearchBar({ values, setValues, errors = {}, refs = {} }) {
  const [regionOptions, setRegionOptions] = useState([]);
  const [circleOptions, setCircleOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [subDivisionOptions, setSubDivisionOptions] = useState([]);
  const [dcOptions, setDcOptions] = useState([]);

  const handleChange = (key) => (e) => {
    const newValue = e.target.value;

    const resetMap = {
      region: {
        circle: '',
        division: '',
        subDivision: '',
        dc: '',
      },
      circle: { division: '', subDivision: '', dc: '' },
      division: { subDivision: '', dc: '' },
      subDivision: { dc: '' },
    };

    setValues((prev) => ({
      ...prev,
      [key]: newValue,
      ...(resetMap[key] || {}),
    }));
  };

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

        const empCode = sessionStorage.getItem('empCode');
        if (empCode === '89427825') {
          const defaultRegion = formattedList.find((item) => item.id === 2);
          if (defaultRegion) {
            setValues((prev) => ({
              ...prev,
              region: defaultRegion.id,
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    fetchRegionData();
  }, [setValues]);

  useEffect(() => {
    if (!values.region) return;
    const fetchCircleData = async () => {
      try {
        const res = await getCircle(values.region);
        const list = res?.data?.list || [];
        setCircleOptions(
          list.map((item) => ({ id: item.circleId, name: item.name })),
        );
      } catch (err) {
        console.error('Error fetching circles:', err);
      }
    };
    fetchCircleData();
  }, [values.region]);

  useEffect(() => {
    if (!values.circle) return;
    const fetchDivisionData = async () => {
      try {
        const res = await getDivision(values.circle);
        const list = res?.data?.list || [];
        setDivisionOptions(
          list.map((item) => ({ id: item.divisionId, name: item.name })),
        );
      } catch (err) {
        console.error('Error fetching divisions:', err);
      }
    };
    fetchDivisionData();
  }, [values.circle]);

  useEffect(() => {
    if (!values.division) return;
    const fetchSubDivisionData = async () => {
      try {
        const res = await getSubDivision(values.division);
        const list = res?.data?.list || [];
        setSubDivisionOptions(
          list.map((item) => ({ id: item.subdivisionId, name: item.name })),
        );
      } catch (err) {
        console.error('Error fetching sub-divisions:', err);
      }
    };
    fetchSubDivisionData();
  }, [values.division]);

  useEffect(() => {
    if (!values.subDivision) return;
    const fetchDC = async () => {
      try {
        const res = await getDC(values.subDivision);
        const list = res?.data?.list || [];
        setDcOptions(list.map((item) => ({ id: item.dcId, name: item.name })));
      } catch (err) {
        console.error("Error fetching DC's:", err);
      }
    };
    fetchDC();
  }, [values.subDivision]);

  const sessionEmpCode = sessionStorage.getItem('empCode');
  const isDisabled = sessionEmpCode === '89427825';

  return (
    <Card.Body>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        <SelectBox
          title="*Region"
          placeholder="Region"
          value={values.region}
          options={regionOptions}
          onChange={handleChange('region')}
          error={errors.region}
          inputRef={refs.region}
          disabled={isDisabled}
        />
        <SelectBox
          title="Circle"
          placeholder="Circle"
          value={values.circle}
          options={circleOptions}
          onChange={handleChange('circle')}
          error={errors.circle}
          disabled={isDisabled}
        />
        <SelectBox
          title="Division"
          placeholder="Division"
          value={values.division}
          options={divisionOptions}
          onChange={handleChange('division')}
          error={errors.division}
          disabled={isDisabled}
        />
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-3 mt-4">
        <SelectBox
          title="Sub-Division"
          placeholder="Sub Division"
          value={values.subDivision}
          options={subDivisionOptions}
          onChange={handleChange('subDivision')}
          error={errors.subDivision}
          disabled={isDisabled}
        />
        <SelectBox
          title="DC"
          placeholder="DC"
          value={values.dc}
          options={dcOptions}
          onChange={handleChange('dc')}
          error={errors.dc}
          disabled={isDisabled}
        />
      </div>
    </Card.Body>
  );
}

export default SearchBar;
