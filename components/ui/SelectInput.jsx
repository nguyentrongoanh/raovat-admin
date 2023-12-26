import { useFormikContext, useField } from 'formik';
import Select from 'react-select';
import { useId } from 'react';
import { stateCityMap } from '@/data/cities';
import categories from '@/data/categories.json';
import pricing from '@/data/pricing.json';

const SelectInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue, setFieldTouched, values } = useFormikContext();

  const states = Object.keys(stateCityMap).map(state => ({
    label: state,
    value: state,
  }));

  const cities =
    stateCityMap[values.state]?.map(city => ({ label: city, value: city })) ||
    [];

  let options;

  // Condition to render options based on the name of the field
  if (props.name === 'state') {
    options = states;
  } else if (props.name === 'city') {
    options = cities;
  } else if (props.name === 'category') {
    options = categories;
  } else if (props.name === 'pricing') {
    options = pricing;
  }

  return (
    <div className='flex-1'>
      <label className='text-regular' htmlFor={props.id || props.name}>
        <strong>{label}</strong>
      </label>
      <Select
        options={options}
        {...field}
        {...props}
        onChange={option => {
          setFieldValue(field.name, option.value);
          {
            props.name === 'pricing' && props.onSelect(option.value);
          }
        }}
        value={options.find(option => option.value === field.value)}
        noOptionsMessage={() => 'Vui lòng chọn tiểu bang trước'}
        onBlur={() => {
          setFieldTouched(field.name, true);
        }}
        instanceId={useId()}
      />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default SelectInput;
