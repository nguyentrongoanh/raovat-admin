import { useFormikContext, useField } from 'formik';
import Select from 'react-select';
import { useId, useState } from 'react';
import { stateCityMap } from '@/data/cities';
import { CategorySubcategoryMap } from '@/data/categories';

const ModernSelectInput = ({ label, icon, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue, setFieldTouched, values } = useFormikContext();
  const [isFocused, setIsFocused] = useState(false);

  const categories = Object.keys(CategorySubcategoryMap).map(category => ({
    label: category,
    value: category,
  }));

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
    setIsFocused(false);
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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(8px)',
      borderColor: meta.touched && meta.error ? '#FCA5A5' : state.isFocused ? '#6366F1' : '#D1D5DB',
      boxShadow: state.isFocused ? (meta.touched && meta.error ? '0 0 0 1px #EF4444' : '0 0 0 1px #6366F1') : 'none',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: state.isFocused ? '#6366F1' : '#9CA3AF',
      },
    }),
    menu: provided => ({
      ...provided,
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#6366F1' : state.isFocused ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      padding: '0.75rem 1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: provided => ({
      ...provided,
      color: '#4F46E5',
      fontWeight: 500,
    }),
    multiValueRemove: provided => ({
      ...provided,
      color: '#4F46E5',
      '&:hover': {
        backgroundColor: '#EF4444',
        color: 'white',
      },
    }),
    placeholder: provided => ({
      ...provided,
      color: '#9CA3AF',
    }),
    singleValue: provided => ({
      ...provided,
      color: '#374151',
    }),
  };

  return (
    <div className='mb-3'>
      <label className={`block text-sm font-medium transition-all duration-200 mb-1 ${meta.touched && meta.error ? 'text-red-500' : isFocused ? 'text-indigo-600' : 'text-gray-700'}`} htmlFor={props.id || props.name}>
        {label}
      </label>

      <div className='relative'>
        {icon && <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none z-10'>{icon}</div>}

        <Select
          options={options}
          {...field}
          {...props}
          onChange={handleOnSelect}
          value={getSelectValue()}
          noOptionsMessage={() => (props.name === 'city' ? 'Vui lòng chọn tiểu bang trước' : props.name === 'subcategory' ? 'Vui lòng chọn danh mục trước' : 'Không có lựa chọn')}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setFieldTouched(field.name, true);
            setIsFocused(false);
          }}
          isMulti={props.name === 'city' || props.name === 'subcategory'}
          instanceId={useId()}
          styles={customStyles}
          className={icon ? 'pl-7' : ''}
        />

        {meta.touched && meta.error && (
          <div className='absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 text-red-500' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
            </svg>
          </div>
        )}
      </div>

      {meta.touched && meta.error ? <div className='mt-0.5 text-xs text-red-500 animate-fadeIn'>{meta.error}</div> : props.hint ? <div className='mt-0.5 text-xs text-gray-500 h-4'>{props.hint}</div> : null}
    </div>
  );
};

export default ModernSelectInput;
