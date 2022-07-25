import React from 'react';
import { useField } from 'informed';
import { Flex, Slider, NumberField } from '@adobe/react-spectrum';

const Input = (props) => {
  const { render, informed, fieldState, fieldApi, userProps, ref } = useField({
    type: 'number',
    ...props,
  });
  const { required } = userProps;
  const { error, showError } = fieldState;
  return render(
    <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-100">
      <NumberField
        ref={ref}
        validationState={!error ? null : 'invalid'}
        errorMessage={showError ? error : undefined}
        isRequired={required}
        {...userProps}
        {...informed}
        onChange={(v) => fieldApi.setValue(v, {})}
        // type={props.type}
        step={props.step}
        type="number"
      />
      <Slider
        maxWidth={120}
        trackGradient={['white', 'rgba(177,141,32,1)']}
        ref={ref}
        validationState={!error ? null : 'invalid'}
        errorMessage={showError ? error : undefined}
        isRequired={required}
        {...userProps}
        {...informed}
        label={' '}
        onChange={(v) => fieldApi.setValue(v, {})}
      />
    </Flex>
  );
};

export default Input;
