import { useState } from 'react';

export const useField = (type) => {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const reset = () => {
        setValue('');
    };

    // Exclude the reset function from the returned object
    const fieldProps = {
        type,
        value,
        onChange,
    };

    return {
        ...fieldProps,
        reset, // Include the reset function separately
    };
};