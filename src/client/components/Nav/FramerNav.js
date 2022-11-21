import React, { useCallback, useMemo, useRef } from 'react';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import Home from '@spectrum-icons/workflow/Home';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import useApp from '../../hooks/useApp';
import Select from '../Informed/Select';
import { Debug, useFieldState, useFormApi } from 'informed';
import useRobotMeta from '../../hooks/useRobotMeta';
import InputSlider from '../Informed/InputSlider';
import useRobotController from '../../hooks/useRobotController';
import { RobotType } from '../Shared/RobotType';

export const FramerNav = () => {
  return (
    <>
      <Flex direction="row" alignItems="center" gap="size-100">
        <h1>Frame Control</h1>
      </Flex>
      <Flex direction="row" gap="size-500">
        <div className="sidenav-controls">
          <ul className="spectrum-SideNav">
            <InputSlider
              name="yaw"
              label="Yaw(X)"
              type="number"
              minValue={-180}
              maxValue={180}
              defaultValue={0}
              step={1}
            />
            <InputSlider
              name="pitch"
              label="Pitch(Y)"
              type="number"
              minValue={-180}
              maxValue={180}
              defaultValue={0}
              step={1}
            />
            <InputSlider
              name="roll"
              label="Roll(Z)"
              type="number"
              minValue={-180}
              maxValue={180}
              defaultValue={0}
              step={1}
            />
          </ul>
        </div>
      </Flex>
    </>
  );
};
