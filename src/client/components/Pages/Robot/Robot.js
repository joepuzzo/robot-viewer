import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import Graphic from '@spectrum-icons/workflow/Graphic';
import useSimulateController from '../../../hooks/useSimulateController';
import { useFormApi, useFormState } from 'informed';
import useApp from '../../../hooks/useApp';
import { Arm } from '../../3D/Arm';
import { Canvas } from '@react-three/fiber';
import { round } from '../../../../lib/round';
import NumberInput from '../../Informed/NumberInput';
import Switch from '../../Informed/Switch';
import RadioGroup from '../../Informed/RadioGroup';
import {
  ActionButton,
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Text,
  Well,
} from '@adobe/react-spectrum';
import useRobotController from '../../../hooks/useRobotController';
import useRobotKinematics from '../../../hooks/useRobotKinematics';
import useSimulateState from '../../../hooks/useSimulateState';
import { useOverFlowHidden } from '../../../hooks/useOverflowHidden';
import { getXYZ, getZXZ } from '../../../utils/getEulers';
// import { URDFRobot } from '../../3D/URDFRobot';

const DEG45 = Math.PI / 4;

const Control = ({ controlRef, virtualCam }) => {
  const { values } = useFormState();
  const formApi = useFormApi();
  const { updateRobot, setBallRef } = useRobotController();
  const { config, dataOpen } = useApp();

  console.log('RENDER ROBOT PAGE');

  const { zeroPosition } = config;

  const robotUpdate = () => {
    const { goToX, goToY, goToZ, orientation } = formApi.getFormState().values;

    // get rotations from orientation
    const [r1, r2, r3] = getZXZ(orientation);

    // Update the robot
    updateRobot(goToX, goToY, goToZ, r1, r2, r3);
  };

  const reset = () => {
    formApi.reset();
    // formApi.setTheseValues({
    //   x: zeroPosition[0],
    //   y: zeroPosition[1],
    //   z: zeroPosition[2],
    //   r1: 0,
    //   r2: 0,
    //   r3: 0,
    // });

    // Get pos
    const { x, y, z, r1, r2, r3 } = formApi.getFormState().values;

    setBallRef.current([x, y, z, r1, r2, r3]);

    controlRef.current.reset();
  };

  const skeleton = () => {
    formApi.setTheseValues({
      x: zeroPosition[0],
      y: zeroPosition[1],
      z: zeroPosition[2],
      r1: 0,
      r2: 0,
      r3: 0,
      mainGrid: false,
      jointGrid: true,
      hide: false,
      showCylinder: true,
      showArrows: true,
      showLinks: false,
      hideNegatives: true,
      showLines: true,
    });

    // Get pos
    const { x, y, z, r1, r2, r3 } = formApi.getFormState().values;

    // Update the robot
    updateRobot(x, y, z, r1, r2, r3);

    virtualCam.current.position.set(70, 80, 70);
    controlRef.current.target.set(0, 50, 0);
  };

  return (
    <>
      <Flex
        direction="row"
        width={600}
        justifyContent="space-between"
        alignItems="end"
        gap="size-100"
      >
        <ActionButton type="button" onPress={reset} minWidth="70px">
          Reset
        </ActionButton>
        <ActionButton title="Skeleton" onPress={() => skeleton()}>
          <Graphic />
        </ActionButton>
        <NumberInput
          name="goToX"
          label={`X: ${round(values.x, 100)}`}
          step={0.1}
          initialValue={40}
          maxWidth="100px"
        />
        <NumberInput
          name="goToY"
          label={`Y: ${round(values.y, 100)}`}
          step={0.1}
          initialValue={0}
          maxWidth="100px"
        />
        <NumberInput
          name="goToZ"
          label={`Z: ${round(values.z, 100)}`}
          step={0.1}
          initialValue={10}
          maxWidth="100px"
        />
        <div className="icon-orange">
          <ActionButton
            title="Go"
            aria-label="Go"
            type="button"
            onPress={robotUpdate}
            minWidth="50px"
          >
            Go
          </ActionButton>
        </div>
        <Switch name="animate" label="Animate" initialValue />
      </Flex>
      <br />
      <RadioGroup
        initialValue="-z"
        orientation="horizontal"
        name="orientation"
        aria-label="Select Oriantaion"
        options={[
          { label: 'X', value: 'x' },
          { label: '-X', value: '-x' },
          { label: 'Y', value: 'y' },
          { label: '-Y', value: '-y' },
          { label: 'Z', value: 'z' },
          { label: '-Z', value: '-z' },
        ]}
      />
    </>
  );
};

function Info() {
  let [state, setState] = React.useState(false);

  return (
    <Flex alignItems="center" gap="size-100">
      <ContextualHelp variant="info" onOpenChange={(isOpen) => setState(isOpen)}>
        <Heading>How to control the arm</Heading>
        <Content>
          <Text>
            Use the arrow keys to control the X and Y position of the ball. Up and down will change
            the Y, Left and write will change the X. To move the Z axis hold the space key and use
            the up and down arrows.
          </Text>
          <br />
          <br />
          <Text>
            You can also use the sliders on the left panel to control each joint individually.
          </Text>
          <br />
          <br />
          <Text>
            To rotate the euler angles ( change orientation of the end effector ), use the a,s,d,w
            keys.
          </Text>
          <br />
          <br />
          <Text>
            In addition you can plug in a gamepad controller and use the joysticks to move the arm.
          </Text>
        </Content>
      </ContextualHelp>
      <Text>How to control the arm</Text>
    </Flex>
  );
}

export const Robot = () => {
  const { config, orbitEnabled, toggleOrbital, orbitControl, cameraControl, dataOpen } = useApp();

  const { values, errors, initialValues } = useFormState();
  const formApi = useFormApi();
  const simulateController = useSimulateController();
  const robotController = useRobotController();
  const { endPosition } = useRobotKinematics();
  const simulateState = useSimulateState();

  const { j0, j1, j2, j3, j4, j5, v0, v1, v2, v3, v4, v5 } = values;

  const angles = [j0, j1, j2, j3, j4, j5];

  const { units } = config;

  const controlRef = useRef();
  const virtualCam = useRef();

  orbitControl.current = controlRef;
  cameraControl.current = virtualCam;

  // When a vertex length changes update the appropriate frame
  const frames = useMemo(() => {
    const frms = initialValues.frames;
    for (let i = 1; i < frms.length; i++) {
      const frame = frms[i];
      // Get length to next frame and along what axis
      let v = frame.x;
      let along = 'x';
      if (Math.abs(frame.y) > Math.abs(v)) {
        v = frame.y;
        along = 'y';
      }
      if (Math.abs(frame.z) > Math.abs(v)) {
        v = frame.z;
        along = 'z';
      }
      // Update that value to equal the vertex value
      if (values[`v${i - 1}`]) {
        frame[along] = v < 0 ? -values[`v${i - 1}`] : values[`v${i - 1}`];
      }
    }

    return frms;
  }, [v0, v1, v2, v3, v4, v5]);

  return (
    <>
      <div className="robot-info angles" style={{ width: '560px' }}>
        {angles.map((a, i) => (
          <div key={`angle-${i}`}>
            <strong>{`J${i + 1}: `}</strong>
            {`${round(a, 100)}°`}
          </div>
        ))}
      </div>

      {/* Reminder .. I use endPosition because this shows FORWARD kinematics not the set values */}
      <div className="robot-info location" style={{ width: '270px' }}>
        <div>
          <strong>X: </strong>
          {round(endPosition.x, 1000)} {units}
        </div>
        <div>
          <strong>Y: </strong>
          {round(endPosition.y, 1000)} {units}
        </div>
        <div>
          <strong>Z: </strong>
          {round(endPosition.z, 1000)} {units}
        </div>
        {/* <div>
          <strong>R1: </strong>
          {round(values.r1, 1000)}
        </div>
        <div>
          <strong>R2: </strong>
          {round(values.r2, 1000)}
        </div>
        <div>
          <strong>R3: </strong>
          {round(values.r3, 1000)}
        </div> */}
      </div>

      <Control controlRef={controlRef} virtualCam={virtualCam} />
      <br />
      {/* WIDTH {window.innerWidth} / HEIGHT {window.innerHeight} */}
      <Info />
      <Canvas>
        <PerspectiveCamera
          ref={virtualCam}
          makeDefault={true}
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          far={10000}
          near={0.1}
          position={[70, 80, 70]}
          zoom={window.innerWidth < 780 || dataOpen ? 1 : 1.4}
        />
        <OrbitControls enabled={orbitEnabled} ref={controlRef} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Arm
            simulateController={simulateController}
            simulateState={simulateState}
            robotController={robotController}
            config={config}
            values={values}
            errors={errors}
            formApi={formApi}
            toggleOrbital={toggleOrbital}
            frames={frames}
          />
          {/* <URDFRobot /> */}
        </Suspense>
      </Canvas>
    </>
  );
};
