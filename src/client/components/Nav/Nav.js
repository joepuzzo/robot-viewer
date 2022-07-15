import React, { useRef } from 'react';
import { Flex } from '@adobe/react-spectrum';
import Contrast from '@spectrum-icons/workflow/Contrast';
import { ActionButton } from '@adobe/react-spectrum';

import Input from '../Informed/Input';
import InputSlider from '../Informed/InputSlider';
import Form from '../Informed/Form';
import { Button } from '@adobe/react-spectrum';

// Hooks
import useApp from '../../hooks/useApp';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';

export const Nav = () => {
  const { toggleColorScheme, navOpen, closeNav, setConfig } = useApp();

  const navRef = useRef();
  const triggerElem = useRef();

  useOutsideAlerter(() => closeNav(), navRef);

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
          name="base"
          label="Base"
          type="number"
          initialValue={1}
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v0"
          label="V0"
          type="number"
          initialValue={1}
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v1"
          label="V1"
          type="number"
          initialValue={1}
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v2"
          label="V2"
          type="number"
          initialValue={1}
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v3"
          label="V3"
          type="number"
          initialValue={1}
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="v4"
          label="V4"
          type="number"
          initialValue={1}
          minValue={0}
          maxValue={5}
          step={0.01}
        />
        <InputSlider
          name="j0"
          label="J0"
          type="number"
          initialValue={2}
          minValue={-Math.PI / 2}
          maxValue={Math.PI / 2}
          step={0.01}
        />
        <InputSlider
          name="j1"
          label="J1"
          type="number"
          initialValue={1}
          minValue={-Math.PI / 2}
          maxValue={Math.PI / 2}
          step={0.01}
        />
        <InputSlider
          name="j2"
          label="J2"
          type="number"
          initialValue={0.5}
          minValue={-Math.PI / 2}
          maxValue={Math.PI / 2}
          step={0.01}
        />
        <InputSlider
          name="j3"
          label="J3"
          type="number"
          initialValue={0.5}
          minValue={-Math.PI / 2}
          maxValue={Math.PI / 2}
          step={0.01}
        />
        <InputSlider
          name="j4"
          label="J4"
          type="number"
          initialValue={-1}
          minValue={-Math.PI / 2}
          maxValue={Math.PI / 2}
          step={0.01}
        />
      </ul>
    </nav>
  );
};
