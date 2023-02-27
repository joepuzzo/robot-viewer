import React, { Suspense, useEffect, useRef } from 'react';
import { useFormApi, useFormState } from 'informed';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Grid from '../../3D/Grid';
import { Canvas } from '@react-three/fiber';
import { ActionButton, Flex } from '@adobe/react-spectrum';
import useApp from '../../../hooks/useApp';
import { Joint } from '../../3D/Joint';
import { If } from '../../Shared/If';

const Control = ({ controlRef, virtualCam }) => {
  const reset = () => {
    virtualCam.current.position.set(70, 80, 70);
    controlRef.current.target.set(0, 20, 0);
  };

  return (
    <>
      <Flex direction="row" width={600} justifyContent="center" alignItems="center" gap="size-100">
        <ActionButton type="button" onPress={reset} minWidth="100px">
          Reset View
        </ActionButton>
      </Flex>
    </>
  );
};

export const Builder = () => {
  const controlRef = useRef();
  const virtualCam = useRef();

  const { orbitEnabled } = useApp();

  const { values, errors } = useFormState();
  const formApi = useFormApi();

  const frames = values?.frames || [];
  const frameErrors = errors?.frames || [];

  const position = [values?.cameraX, values?.cameraY, values?.cameraZ];
  const cameraZoom = values?.cameraZoom;

  const { mainGrid, gridSize, base } = values;

  // This will zoom out and re pos the camera view when we add frames
  useEffect(() => {
    if (frames && controlRef.current) {
      // Set new camera target
      controlRef.current.target.set(0, frames.length * 15, 0);
      // Zoom out
      formApi.setValue('cameraZoom', 6 / frames.length);
    }
  }, [frames, frames?.length]);

  return (
    <>
      {/* <Control controlRef={controlRef} virtualCam={virtualCam} /> */}
      <Canvas>
        <PerspectiveCamera
          ref={virtualCam}
          makeDefault={true}
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          far={10000}
          near={0.5}
          position={position}
          zoom={cameraZoom}
        />
        <OrbitControls
          enabled={orbitEnabled}
          ref={controlRef}
          target={[5, frames.length * 10, 0]}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Suspense fallback={null}>
          <group rotation={[Math.PI * -0.5, 0, 0]} position={[0, 0, 0]}>
            {mainGrid ? <Grid size={gridSize} showArrows shift /> : null}
            {/* {frames ? frames.map((v, i) => <Joint index={i} value={v} key={`joint-${i}`} />) : null} */}
            <If condition={frames}>
              <Joint
                index={0}
                value={frames[0]}
                error={frameErrors[0]}
                frames={frames.slice(1, frames.length)}
                frameErrors={frameErrors.slice(1, frameErrors.length)}
                values={values}
                base={base}
              />
            </If>
          </group>
        </Suspense>
      </Canvas>
    </>
  );
};
