import React from 'react';
import { Flex } from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';

import { ActionButton } from '@adobe/react-spectrum';

import Switch from '../Informed/Switch';
import InputSlider from '../Informed/InputSlider';

import { inverse } from '../../../lib/inverse';

// Hooks
import useApp from '../../hooks/useApp';

import { useFormApi } from 'informed';
import { toRadians } from '../../../lib/toRadians';
import { toDeg } from '../../../lib/toDeg';
import { Waypoints } from './Waypoints';

const triggers = ['x', 'y', 'z', 'r1', 'r2', 'r3'];

export const RobotNav = () => {
  const { toggleColorScheme, extraOpen, toggleExtra, setConfig, config } = useApp();

  const { rangej0, rangej1, rangej2, rangej3, rangej4, rangej5 } = config;

  const formApi = useFormApi();

  const updateRobot = () => {
    // Get pos
    const { x, y, z, r1, r2, r3, base, v0, v1, v2, v3, v4, v5, x0 } = formApi.getFormState().values;
    const pos = [x, y, z];

    // We give in degrees so turn into rads
    const ro1 = toRadians(r1);
    const ro2 = toRadians(r2);
    const ro3 = toRadians(r3);

    console.log('Getting angles for', pos);
    const angles = inverse(x, y, z, ro1, ro2, ro3, {
      // a1: base + 0.5 + v0 + 1.5, // 4
      // a2: v1 + 2, // 3
      // a3: v2 + 1.5, // 2.5
      // a4: v3 + 1.5, // 2.5
      // a5: v4 + 1, // 2.5
      // a6: v5 + 1.5, // 2.5
      a1: base + v0,
      a2: v1,
      a3: v2,
      a4: v3,
      a5: v4,
      a6: v5,
      x0,
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
  };

  const resetRobot = () => {
    formApi.reset();
    formApi.setTheseValues({
      x: 0,
      y: 0,
      z: 16.5,
      r1: 0,
      r2: 0,
      r3: 0,
    });

    updateRobot();
  };

  const onValueChange =
    (name) =>
    ({ value }) => {
      setConfig((prev) => {
        const newConfig = { ...prev };
        newConfig[name] = value;
        console.log('SETTING', name, 'to', value, 'wtf', triggers.includes(name));

        if (triggers.includes(name)) {
          updateRobot();
        }

        return newConfig;
      });
    };

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Robot Viewer</h1>
        {/* <ActionButton
          title="Switch Theme"
          aria-label="Switch Theme"
          onClick={() => toggleColorScheme()}
        >
          <Contrast.default />
        </ActionButton> */}
        <ActionButton title="Reset Robot" aria-label="Reset Robot" onClick={() => resetRobot()}>
          <Refresh.default />
        </ActionButton>
        <ActionButton
          title="Open Waypoints"
          aria-label="Open Waypoints"
          onClick={() => toggleExtra()}
        >
          <ChevronRight.default />
        </ActionButton>
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <InputSlider
              name="x"
              onNativeChange={onValueChange('x')}
              label="X"
              type="number"
              minValue={-10}
              maxValue={10}
              step={0.1}
              // hideStepper
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
              minValue={-16.5}
              maxValue={16.5}
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
              label="J0"
              type="number"
              minValue={rangej0[0]}
              maxValue={rangej0[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j1"
              label="J1"
              type="number"
              minValue={rangej1[0]}
              maxValue={rangej1[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j2"
              label="J2"
              type="number"
              minValue={rangej2[0]}
              maxValue={rangej2[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j3"
              label="J3"
              type="number"
              minValue={rangej3[0]}
              maxValue={rangej3[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j4"
              label="J4"
              type="number"
              minValue={rangej4[0]}
              maxValue={rangej4[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="j5"
              label="J5"
              type="number"
              minValue={rangej5[0]}
              maxValue={rangej5[1]}
              validateOn="change"
              showErrorIfError
              // minValue={-180}
              // maxValue={180}
              step={1}
            />
            <InputSlider
              name="base"
              label="Base"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="black"
            />
            <InputSlider
              name="x0"
              label="X0"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="black"
            />
            <InputSlider
              name="v0"
              label="V0"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="red"
            />
            <InputSlider
              name="v1"
              label="V1"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="green"
            />
            <InputSlider
              name="v2"
              label="V2"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="blue"
            />
            <InputSlider
              name="v3"
              label="V3"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="orange"
            />
            <InputSlider
              name="v4"
              label="V4"
              type="number"
              minValue={0}
              maxValue={5}
              step={0.01}
              trackGradient="purple"
            />
            <InputSlider name="v5" label="V5" type="number" minValue={0} maxValue={5} step={0.01} />
            <InputSlider
              name="gridSize"
              initialValue={10}
              label="Grid Size"
              type="number"
              minValue={0}
              maxValue={30}
              step={2}
            />
            <br />
            <Switch name="mainGrid" label="Main Grid" initialValue={true} />
            <br />
            <Switch name="jointGrid" label="Joint Grids" />
            <br />
            <Switch name="hide" label="Hide Robot" />
            <br />
            <Switch name="linkColor" label="Show Link Color" />
            <br />
            <Switch name="hideNegatives" label="Hide Nagatives" />
          </ul>
        </div>
        <div className={extraOpen ? 'sidenav-extra sidenav-extra-visible' : 'sidenav-extra'}>
          <Waypoints />
        </div>
      </Flex>
    </>
  );
};
