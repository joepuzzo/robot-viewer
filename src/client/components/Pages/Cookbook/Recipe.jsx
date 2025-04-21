import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActionButton, Flex, ProgressCircle } from '@adobe/react-spectrum';
import Select from '../../Informed/Select';
import Switch from '../../Informed/Switch';
import { ArrayField, Debug, Relevant, useArrayFieldState, useFormApi } from 'informed';
import useSimulateController from '../../../hooks/useSimulateController';
import useSimulateState from '../../../hooks/useSimulateState';
import { usetPost } from '../../../hooks/usePost';
import { useGet } from '../../../hooks/useGet';

const ArrayButtons = ({ index, add, remove, isDisabled }) => {
  const { fields } = useArrayFieldState();

  if (index === fields.length - 1) {
    return (
      <ActionButton
        onClick={() => {
          add();
        }}
        type="button"
        minWidth={40}
        title="Add Action"
        aria-label="Add Action"
        isDisabled={isDisabled}
      >
        +
      </ActionButton>
    );
  }

  return (
    <ActionButton
      title="Remove Action"
      aria-label="Remove Action"
      type="button"
      onClick={remove}
      minWidth={40}
      isDisabled={isDisabled}
    >
      -
    </ActionButton>
  );
};

export const Recipe = ({ recipe, allActions, getRecipes }) => {
  const { play } = useSimulateController();
  const { simulating } = useSimulateState();
  const formApi = useFormApi();

  const arrayFieldApiRef = useRef();

  useEffect(() => {
    arrayFieldApiRef.current.reset();
  }, [recipe]);

  const [{ error: postError, loading: postLoading }, postRecipe] = usetPost({
    headers: { ContentType: 'application/json' },
    onComplete: () => {
      getRecipes({ url: `/recipes/all` });
    },
  });

  const [{ data, loading: getLoading, error: getError }, getWaypoints] = useGet();

  const loading = postLoading || getLoading;
  const error = postError || getError;

  const save = useCallback(() => {
    const { values } = formApi.getFormState();

    const { recipes, recipeName, selectedRecipe } = values;

    const name = selectedRecipe || recipeName;

    postRecipe({ payload: recipes, url: `/recipes/save/${name}` });
  }, []);

  const load = useCallback(() => {
    const { values } = formApi.getFormState();

    const { recipeName } = values;

    getWaypoints({ url: `/recipes/load/${recipeName}` });
  }, []);

  return (
    <Flex direction="column" gap="size-500">
      <Flex direction="row" gap="size-300">
        <ActionButton type="button" onPress={play} minWidth="100px" isDisabled={loading}>
          Run Recipe
        </ActionButton>
        <ActionButton type="button" onPress={save} minWidth="100px" isDisabled={loading}>
          Save Recipe
        </ActionButton>
        <Switch name="repeat" label="Repeat" initialValue={false} />
      </Flex>
      <ArrayField
        name="recipes"
        initialValue={recipe?.length ? recipe : [{}]}
        arrayFieldApiRef={arrayFieldApiRef}
      >
        {({ add }) => {
          return (
            <Flex direction="column" alignItems="center" gap="size-100">
              <ArrayField.Items>
                {({ remove, name, index }) => (
                  <div className={`recipe}`}>
                    <Flex direction="row" alignItems="end" gap="size-100" width={600}>
                      <Select
                        isDisabled={loading}
                        width={300}
                        defaultValue={(recipe && recipe[index]?.action) || 'Select Action'}
                        name="action"
                        aria-label="Select Action"
                        options={allActions.map((x) => {
                          return { label: x, value: x };
                        })}
                      />
                      <ArrayButtons index={index} add={add} remove={remove} isDisabled={loading} />
                    </Flex>
                  </div>
                )}
              </ArrayField.Items>
            </Flex>
          );
        }}
      </ArrayField>
    </Flex>
  );
};
