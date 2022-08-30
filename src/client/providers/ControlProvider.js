import React, { useCallback, useMemo } from 'react';
import { FormProvider } from 'informed';

// Hooks
import { inverse } from '../../lib/inverse';
import { toRadians } from '../../lib/toRadians';
import { toDeg } from '../../lib/toDeg';
import useApp from '../hooks/useApp';

const ControlProvider = ({ children }) => {
  const { config } = useApp();

  const initialValues = useMemo(() => {
    // We give in degrees so turn into rads
    const ro1 = toRadians(config.r1);
    const ro2 = toRadians(config.r2);
    const ro3 = toRadians(config.r3);

    console.log('Initial getting angles for', [config.x, config.y, config.z, ro1, ro2, ro3]);

    const angles = inverse(config.x, config.y, config.z, ro1, ro2, ro3, {
      a1: config.base + config.v0,
      a2: config.v1,
      a3: config.v2,
      a4: config.v3,
      a5: config.v4,
      a6: config.v5,
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
  }, []);

  return (
    <FormProvider initialValues={initialValues} name="robot">
      {children}
    </FormProvider>
  );
};

export default ControlProvider;
