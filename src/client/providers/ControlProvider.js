import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider } from 'informed';

// Hooks
import { inverse } from 'kinematics-js';
// import { inverse } from '../../lib/inverse';
import { toRadians } from '../../lib/toRadians';
import { toDeg } from '../../lib/toDeg';
import useApp from '../hooks/useApp';

const ControlProvider = ({ children }) => {
  const { config } = useApp();

  const formApiRef = useRef();

  const initialValues = useMemo(() => {
    console.log('NEW INITIAL VALUES', config);
    // We give in degrees so turn into rads
    const ro1 = toRadians(config.r1);
    const ro2 = toRadians(config.r2);
    const ro3 = toRadians(config.r3);

    console.log('Initial getting angles for', [config.x, config.y, config.z, ro1, ro2, ro3]);

    const angles = inverse(config.x, config.y, config.z, ro1, ro2, ro3, {
      base: config.base,
      v1: config.v0,
      v2: config.v1,
      v3: config.v2,
      v4: config.v3,
      v5: config.v4,
      v6: config.v5 + config.endEffector,
      flip: config.flip,
      x0: config.x0,
      y0: config.y0,
    });

    return {
      ...config,
      j0: toDeg(angles[0]),
      j1: toDeg(angles[1]),
      j2: toDeg(angles[2]),
      j3: toDeg(angles[3]),
      j4: toDeg(angles[4]),
      j5: toDeg(angles[5]),
    };
  }, [config]);

  useEffect(() => {
    formApiRef.current.reset();
  }, [initialValues]);

  return (
    <FormProvider formApiRef={formApiRef} initialValues={initialValues} name="robot">
      {children}
    </FormProvider>
  );
};

export default ControlProvider;
