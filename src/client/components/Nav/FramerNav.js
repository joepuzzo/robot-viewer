import React, { useMemo } from 'react';
import { Flex } from '@adobe/react-spectrum';

import Select from '../Informed/Select';
import InputSlider from '../Informed/InputSlider';
import Switch from '../Informed/Switch';
import { useFieldState } from 'informed';

export const FramerNav = () => {
  const { value: type } = useFieldState('eulerType');

  const [label1, label2, label3] = useMemo(() => {
    if (type) {
      // Example: 'xyz'.split('')
      // => [ 'x', 'y', 'z' ]
      return type.split('').map((l) => `Rotation ${l}`);
    }
    return ['Rotation1', 'Rotation2', 'Rotation3'];
  }, [type]);

  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Frame Control</h1>
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <Select
              label="Euler Type"
              name="eulerType"
              defaultValue="xyz"
              options={[
                { value: 'xyz', label: 'XYZ ( Yaw Pitch Roll )' },
                { value: 'zxz', label: 'ZXZ' },
              ]}
            />
            <InputSlider
              name="r1"
              label={label1}
              type="number"
              minValue={-180}
              maxValue={180}
              defaultValue={0}
              step={1}
            />
            <InputSlider
              name="r2"
              label={label2}
              type="number"
              minValue={-180}
              maxValue={180}
              defaultValue={0}
              step={1}
            />
            <InputSlider
              name="r3"
              label={label3}
              type="number"
              minValue={-180}
              maxValue={180}
              defaultValue={0}
              step={1}
            />
            <br />
            <Switch name="axisLabels" label="Axis Labels" initialValue={false} />
            <br />
          </ul>
        </div>
      </Flex>
    </>
  );
};
