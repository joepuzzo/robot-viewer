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
      </ul>
    </nav>
  );
};
