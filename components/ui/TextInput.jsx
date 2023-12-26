import { useField, useFormikContext } from 'formik';

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { values } = useFormikContext();

  console.log(values);

  return (
    <div className='mb-2'>
      <label className='text-regular' htmlFor={props.id || props.name}>
        <strong>{label}</strong>
      </label>
      <input
        {...field}
        {...props}
        className='block w-full border rounded-sm p-2 border-gray-400'
        value={values[props.name]}
      />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextInput;
