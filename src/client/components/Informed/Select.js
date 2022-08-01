import React, { useMemo } from 'react';
import { useField } from 'informed';
import { Item, Picker } from '@adobe/react-spectrum';

const Input = (props) => {
  const { render, informed, fieldState, fieldApi, userProps, ref } = useField({
    type: 'text',
    ...props,
  });

  const { required, options: userOptions } = userProps;
  const { error, showError } = fieldState;

  const options = useMemo(() => {
    return userOptions.map((op) => ({ name: op.value }));
  }, []);

  return render(
    <Picker
      ref={ref}
      validationState={!error ? null : 'invalid'}
      errorMessage={showError ? error : undefined}
      isRequired={required}
      {...userProps}
      {...informed}
      selectedKey={fieldState.value}
      items={options}
      onSelectionChange={(v) => fieldApi.setValue(v)}
    >
      {(item) => <Item key={item.name}>{item.name}</Item>}
    </Picker>
  );
};

export default Input;
