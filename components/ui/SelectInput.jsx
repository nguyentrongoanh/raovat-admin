import { useFormikContext, useField } from 'formik';
import Select from 'react-select';
import { useId } from 'react';
import { stateCityMap } from '@/data/cities';
import { CategorySubcategoryMap } from '@/data/categories';
import removeVietnameseTones from '@/lib/transform';

const SelectInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue, setFieldTouched, values } = useFormikContext();

  const categories = Object.keys(CategorySubcategoryMap).map(category => ({
    label: category,
    value: category,
  }));

  // const subCategories =
  //   CategorySubcategoryMap[values.category]?.map(subCategory => ({
  //     label: subCategory,
  //     value: removeVietnameseTones(subCategory).toLowerCase(),
  //   })) || [];

  const subCategories =
    CategorySubcategoryMap[values.category]?.map(subCategory => ({
      label: subCategory,
      value: subCategory,
    })) || [];

  const states = Object.keys(stateCityMap).map(state => ({
    label: state,
    value: state,
  }));

  const cities = stateCityMap[values.state]?.map(city => ({ label: city, value: city })) || [];

  const handleOnSelect = option => {
    let value;

    if (props.name === 'state' || props.name === 'category') {
      value = option.value;
    } else if (props.name === 'city' || props.name === 'subcategory') {
      value = option.map(item => item.value);
    }

    setFieldValue(field.name, value);
  };

  let options;

  // Condition to render options based on the name of the field
  if (props.name === 'state') {
    options = states;
  } else if (props.name === 'city') {
    options = cities;
  } else if (props.name === 'category') {
    options = categories;
  } else if (props.name === 'subcategory') {
    options = subCategories;
  }

  // Function to determine the correct value for the Select component
  const getSelectValue = () => {
    const isMulti = props.name === 'city' || props.name === 'subcategory';

    if (isMulti) {
      // For multi-select fields, we need to find all matching options
      if (Array.isArray(field.value)) {
        return field.value.map(val => options.find(option => option.value === val) || { label: val, value: val });
      }
      return [];
    } else {
      // For single-select fields
      return options.find(option => option.value === field.value) || null;
    }
  };

  return (
    <div className='flex-1'>
      <label className='text-regular' htmlFor={props.id || props.name}>
        <strong>{label}</strong>
      </label>
      <Select
        options={options}
        {...field}
        {...props}
        onChange={handleOnSelect}
        value={getSelectValue()}
        noOptionsMessage={() => (props.name === 'city' ? 'Vui lòng chọn tiểu bang trước' : props.name === 'subcategory' ? 'Vui lòng chọn danh mục trước' : 'Không có lựa chọn')}
        onBlur={() => {
          setFieldTouched(field.name, true);
        }}
        isMulti={props.name === 'city' || props.name === 'subcategory'}
        instanceId={useId()}
      />
      {meta.touched && meta.error ? <div className='error'>{meta.error}</div> : null}
    </div>
  );
};

export default SelectInput;
