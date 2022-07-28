import React, { useEffect, useRef } from 'react';
import { Flex } from '@adobe/react-spectrum';
import Contrast from '@spectrum-icons/workflow/Contrast';
import { ActionButton } from '@adobe/react-spectrum';

import Switch from '../Informed/Switch';
import InputSlider from '../Informed/InputSlider';
import Form from '../Informed/Form';
import { Button } from '@adobe/react-spectrum';
import { inverse } from '../../../lib/inverse';

// Hooks
import useApp from '../../hooks/useApp';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';

import { useFormApi } from 'informed';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';

const triggers = ['x', 'y', 'z', 'r1', 'r2', 'r3'];

export const Nav = () => {
  const { toggleColorScheme, navOpen, closeNav, setConfig, control } = useApp();

  const navRef = useRef();

  const formApi = useFormApi();

  useOutsideAlerter(() => closeNav(), navRef);

  const onValueChange =
    (name) =>
    ({ value }) => {
      setConfig((prev) => {
        const newConfig = { ...prev };
        newConfig[name] = value;
        console.log('SETTING', name, 'to', value, 'wtf', triggers.includes(name));

        if (triggers.includes(name)) {
          // Get pos
          const { x, y, z, r1, r2, r3, base, v0, v1, v2, v3, v4, v5 } =
            formApi.getFormState().values;
          const pos = [x, y, z];

          // We give in degrees so turn into rads
          const ro1 = toRadians(r1);
          const ro2 = toRadians(r2);
          const ro3 = toRadians(r3);

          console.log('Getting angles for', pos);
          const angles = inverse(x, y, z, ro1, ro2, ro3, {
            a1: base + 0.5 + v0 + 1.5, // base + 2.5
            a2: v1 + 2, // 3
            a3: v2 + 1.5, // 2.5
            a4: v3 + 1.5, // 2.5
            a5: v4 + 1, // 2.5
            a6: v5 + 1.5, // 2
          });

          console.log('Setting angles to', angles);

          if (!angles.find((a) => isNaN(a))) {
            formApi.setTheseValues({
              j0: toDeg(angles[0]),
              j1: toDeg(angles[1]),
              j2: toDeg(angles[2]),
              j3: toDeg(angles[3]),
              j4: toDeg(angles[4]),
              j5: toDeg(angles[5]),
            });

            // // Update ball pos
            // if (control.setBall.current) {
            //   control.setBall.current([x, y, z, r1, r2, r3]);
            // }
          }
        }

        return newConfig;
      });
    };

  return (
    <nav className={navOpen ? 'sidenav sidenav-visible' : 'sidenav'} ref={navRef}>
      <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-100">
        <h1>Robot Viewer</h1>
        <ActionButton aria-label="Switch Theme" onClick={() => toggleColorScheme()}>
          <Contrast.default />
        </ActionButton>
      </Flex>
      <ul className="spectrum-SideNav">
        <InputSlider
          name="x"
          onNativeChange={onValueChange('x')}
          label="X"
          type="number"
          minValue={-10}
          maxValue={10}
          step={0.1}
        />
        <InputSlider
          name="y"
          onNativeChange={onValueChange('y')}
          label="Y"
          type="number"
          minValue={-10}
          maxValue={10}
          step={0.1}
        />
        <InputSlider
          name="z"
          onNativeChange={onValueChange('z')}
          label="Z"
          type="number"
          minValue={-15}
          maxValue={15}
          step={0.1}
        />
        <InputSlider
          name="r1"
          onNativeChange={onValueChange('r1')}
          label="R1"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="r2"
          onNativeChange={onValueChange('r2')}
          label="R2"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="r3"
          onNativeChange={onValueChange('r3')}
          label="R3"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="j0"
          // onValueChange={onValueChange('v5')}
          label="J0"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="j1"
          // onValueChange={onValueChange('j1')}
          label="J1"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="j2"
          // onValueChange={onValueChange('j2')}
          label="J2"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="j3"
          // onValueChange={onValueChange('j3')}
          label="J3"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="j4"
          // onValueChange={onValueChange('j4')}
          label="J4"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="j5"
          // onValueChange={onValueChange('j5')}
          label="J5"
          type="number"
          minValue={-180}
          maxValue={180}
          step={1}
        />
        <InputSlider
          name="base"
          // onValueChange={onValueChange('base')}
          label="Base"
          type="number"
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v0"
          // onValueChange={onValueChange('v0')}
          label="V0"
          type="number"
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v1"
          // onValueChange={onValueChange('v1')}
          label="V1"
          type="number"
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v2"
          // onValueChange={onValueChange('v2')}
          label="V2"
          type="number"
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v3"
          // onValueChange={onValueChange('v3')}
          label="V3"
          type="number"
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v4"
          // onValueChange={onValueChange('v4')}
          label="V4"
          type="number"
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v5"
          // onValueChange={onValueChange('v4')}
          label="V5"
          type="number"
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="gridSize"
          initialValue={10}
          // onValueChange={onValueChange('v4')}
          label="Grid Size"
          type="number"
          minValue={0}
          maxValue={40}
          step={1}
        />
        <br />
        <Switch name="mainGrid" label="Main Grid" initialValue={true} />
        <br />
        <Switch name="jointGrid" label="Joint Grids" />
      </ul>
    </nav>
  );
};
