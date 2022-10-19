import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Waypoints } from './Waypoints';
import { Recipe } from './Recipe';
import Input from '../../Informed/Input';
import Select from '../../Informed/Select';
import { useFieldState, useFormApi } from 'informed';
import { usetPost } from '../../../hooks/usePost';

import { Flex, Button, ActionButton } from '@adobe/react-spectrum';
import { useGet } from '../../../hooks/useGet';
import ListBoxInput from '../../Informed/Listbox';

export const Cookbook = () => {
  const formApi = useFormApi();

  const [{ data: allWaypoints, loading: getLoading, error: getError }, getWaypoints] = useGet();

  useEffect(() => {
    getWaypoints({ url: `/waypoints/all` });
  }, []);

  const [{ error: postError, loading: postLoading }, postWaypoints] = usetPost({
    headers: { ContentType: 'application/json' },
  });

  const [{ data: allRecipes }, getRecipes] = useGet();
  const loadRecipes = useEffect(() => {
    getRecipes({ url: `/recipes/all` });
  }, []);

  const [{}, postRecipes] = usetPost({
    headers: { ContentType: 'application/json' },
  });

  const actionOptions = useMemo(() => {
    if (allWaypoints) {
      return Object.keys(allWaypoints).map((name) => {
        return {
          value: name,
          label: name,
        };
      });
    }
    return [];
  }, [allWaypoints]);

  const recipeOptions = useMemo(() => {
    if (allRecipes) {
      return Object.keys(allRecipes).map((name) => {
        return {
          value: name,
          label: name,
        };
      });
    }
    return [];
  }, [allRecipes]);

  const addAction = useCallback(() => {
    const newActionName = formApi.getFormState().values.actionName;
    const defaultNewAction = [
      {
        x: 30,
        y: 20,
        z: 10,
        orientation: '-z',
      },
    ];
    if (!allWaypoints[newActionName]) {
      allWaypoints[newActionName] = defaultNewAction;
      postWaypoints({ payload: defaultNewAction, url: `/waypoints/save/${newActionName}` });
    }
  }, []);

  const { value: selectedAction } = useFieldState('selectedAction');
  const { value: listToShow } = useFieldState('listToShow');
  const { value: selectedRecipe } = useFieldState('selectedRecipe');

  return (
    <>
      <Flex direction="row" justifyContent="space-between" UNSAFE_style={{ width: '100%' }}>
        {listToShow === 'actions' && (
          <Flex direction="column">
            <Flex direction="row" alignItems="end" gap="size-100">
              <Input
                name="actionName"
                label="Action Name"
                placeholder="New Action Name"
                autocomplete="off"
              />
              <ActionButton type="button" minWidth="100" onPress={addAction}>
                Add Action
              </ActionButton>
            </Flex>
            <ListBoxInput
              label="Action"
              name="selectedAction"
              defaultValue="na"
              options={[{ value: 'na', label: '- Example -' }, ...actionOptions]}
            />
          </Flex>
        )}
        {listToShow === 'recipes' && (
          <Flex direction="column" gap="size-100">
            <Flex direction="row" alignItems="end" gap="size-100">
              <Input
                name="recipeName"
                label="Recipe Name"
                placeholder="New Recipe Name"
                autocomplete="off"
              />
              <ActionButton
                type="button"
                minWidth="100"
                onPress={() => {
                  const newRecipeName = formApi.getFormState().values.recipeName;
                  if (!allRecipes?.[newRecipeName]) {
                    allRecipes[newRecipeName] = [];
                    postRecipes({ payload: [], url: `/recipes/save/${newRecipeName}` });
                  }
                }}
              >
                Add Recipe
              </ActionButton>
            </Flex>
            <ListBoxInput
              label="Recipe"
              name="selectedRecipe"
              defaultValue="na"
              options={[...recipeOptions]}
            />
          </Flex>
        )}
        <Flex direction="column">
          {listToShow === 'actions' && selectedAction && (
            <Waypoints data={allWaypoints?.[selectedAction]} actionName={selectedAction} />
          )}
          {listToShow === 'recipes' && selectedRecipe && (
            <Recipe
              recipe={allRecipes?.[selectedRecipe]}
              allActions={Object.keys(allWaypoints || {})}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};
