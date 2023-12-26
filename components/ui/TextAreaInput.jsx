import { useField } from 'formik';

const TextAreaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className='mb-2'>
      <label className='text-regular' htmlFor={props.id || props.name}>
        <strong>{label}</strong>
      </label>
      <textarea
        {...field}
        {...props}
        rows={4}
        className='block w-full border rounded-sm p-2 border-gray-400'
        value={field.value}
      />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextAreaInput;
