import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Recipe } from './Recipe';
import Input from '../../Informed/Input';
import Select from '../../Informed/Select';
import { useFieldState, useFormApi } from 'informed';
import { usetPost } from '../../../hooks/usePost';

import { Flex, Button, ActionButton } from '@adobe/react-spectrum';
import { useGet } from '../../../hooks/useGet';
import ListBoxInput from '../../Informed/Listbox';
import { Waypoints } from '../../Nav/Waypoints';

export const Cookbook = () => {
  const formApi = useFormApi();

  const [{ data: allWaypoints, loading: getLoading, error: getError }, getWaypoints] = useGet();

  useEffect(() => {
    getWaypoints({ url: `/waypoints/all` });
  }, []);

  const [{ error: postError, loading: postLoading }, postWaypoints] = usetPost({
    headers: { ContentType: 'application/json' },
  });

  const [{ data: allRecipes, loading: loadingRecipes }, getRecipes] = useGet();
  useEffect(() => {
    getRecipes({ url: `/recipes/all` });
  }, []);

  const [{}, postRecipes] = usetPost({
    headers: { ContentType: 'application/json' },
    onComplete: () => {
      getRecipes({ url: `/recipes/all` });
    },
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
    const newActionName = formApi.getFormState().values.filename;
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
  }, [allWaypoints]);

  const { value: selectedAction } = useFieldState('selectedAction');
  const { value: listToShow } = useFieldState('listToShow');
  const { value: selectedRecipe } = useFieldState('selectedRecipe');

  return (
    <div style={{ width: '100%' }}>
      <Flex direction="row" gap="size-600">
        {listToShow === 'actions' && (
          <Flex direction="column">
            <h3>Add New Action</h3>
            <Flex direction="row" alignItems="end" gap="size-100">
              <Input
                name="filename"
                label="Action Name"
                placeholder="New Action Name"
                autocomplete="off"
              />
              <ActionButton type="button" minWidth="100px" onPress={addAction}>
                Add Action
              </ActionButton>
            </Flex>
            <h3>Select Existing Action</h3>
            <ListBoxInput
              label="Action"
              name="selectedAction"
              defaultValue="na"
              options={[{ value: 'na', label: 'Example' }, ...actionOptions]}
            />
          </Flex>
        )}
        {listToShow === 'recipes' && (
          <Flex direction="column" gap="size-100">
            <h3>Create Recipe</h3>
            <Flex direction="row" alignItems="end" gap="size-100">
              <Input
                name="recipeName"
                label="Recipe Name"
                placeholder="New Recipe Name"
                autocomplete="off"
              />
              <ActionButton
                type="button"
                minWidth="100px"
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
            <h3>Select Existing Recipe</h3>
            {loadingRecipes ? null : (
              <ListBoxInput
                label="Recipe"
                name="selectedRecipe"
                defaultValue={recipeOptions[0]?.value}
                options={[...recipeOptions]}
              />
            )}
          </Flex>
        )}
        <Flex direction="column" UNSAFE_style={{ width: '100%' }}>
          {listToShow === 'actions' && selectedAction && (
            <Waypoints currentWaypoints={allWaypoints?.[selectedAction]} column />
          )}
          {listToShow === 'recipes' && selectedRecipe && (
            <Recipe
              recipe={allRecipes?.[selectedRecipe]}
              allActions={Object.keys(allWaypoints || {})}
            />
          )}
        </Flex>
      </Flex>
    </div>
  );
};
