import React, { useState } from 'react';
import { Content, ContextualHelp, Flex, Heading, Text } from '@adobe/react-spectrum';

export function Info() {
  let [state, setState] = useState(false);

  return (
    <Flex alignItems="center" gap="size-100">
      <ContextualHelp variant="info" onOpenChange={(isOpen) => setState(isOpen)}>
        <Heading>Frame Rules</Heading>
        <Content>
          <br />
          <Text>
            The Z axis must be the axis of rotation for a revolute joint, or direction of motion if
            you have prismatic joint.
          </Text>
          <br />
          <br />
          <Text>
            The X axis must be perpendicular both to its own Z axis and the Z axis of the frame
            before it
          </Text>
          <br />
          <br />
          <Text>All frames must follow the right hand rule</Text>
          <img
            src="static/hand-axis.png"
            alt="Right Hand Rule"
            width="100%"
            style={{ borderRadius: '5px' }}
          />
          <br />
          <br />
          <Text>Each X axis must intersect the Z axis of the frame before it</Text>
        </Content>
      </ContextualHelp>
      <Text>Frame Rules</Text>
    </Flex>
  );
}
