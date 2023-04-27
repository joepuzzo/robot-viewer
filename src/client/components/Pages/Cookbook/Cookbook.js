import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Recipe } from './Recipe';
import Input from '../../Informed/Input';
import Select from '../../Informed/Select';
import { useFieldState, useFormApi } from 'informed';
import { usetPost } from '../../../hooks/usePost';

import { Flex, ActionButton, Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import { useGet } from '../../../hooks/useGet';
import ListBoxInput from '../../Informed/Listbox';
import { Waypoints } from '../../Nav/Waypoints';
import { If } from '../../Shared/If';

/* -------------------------- Actions -------------------------- */
const Actions = ({ allWaypoints, getWaypoints }) => {
  const formApi = useFormApi();

  const { value: selectedAction } = useFieldState('selectedAction');

  const [{ error: postError, loading: postLoading }, postWaypoints] = usetPost({
    headers: { ContentType: 'application/json' },
    onComplete: () => {
      getWaypoints({ url: `/waypoints/all` });
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

  return (
    <Flex direction="row" gap="size-600">
      <Flex direction="column">
        <h3>Add New Action</h3>
        <Flex direction="row" alignItems="end" gap="size-100">
          <Input name="filename" label="Action Name" autocomplete="off" />
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
      <Flex direction="column" UNSAFE_style={{ width: '100%' }}>
        <If condition={selectedAction}>
          <Waypoints currentWaypoints={allWaypoints?.[selectedAction]} column />
        </If>
      </Flex>
    </Flex>
  );
};

/* -------------------------- Recipies -------------------------- */
const Recipies = ({ allWaypoints }) => {
  const formApi = useFormApi();

  const { value: selectedRecipe } = useFieldState('selectedRecipe');

  const [{ data: allRecipes, loading, error }, getRecipes] = useGet();
  useEffect(() => {
    getRecipes({ url: `/recipes/all` });
  }, []);

  const [{}, postRecipes] = usetPost({
    headers: { ContentType: 'application/json' },
    onComplete: () => {
      getRecipes({ url: `/recipes/all` });
    },
  });

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

  return (
    <Flex direction="row" gap="size-600">
      <Flex direction="column" gap="size-100">
        <h3>Create Recipe</h3>
        <Flex direction="row" alignItems="end" gap="size-100">
          <Input name="recipeName" label="Recipe Name" autocomplete="off" />
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
        <If condition={recipeOptions}>
          <ListBoxInput
            label="Recipe"
            name="selectedRecipe"
            defaultValue={recipeOptions[0]?.value}
            options={[...recipeOptions]}
          />
        </If>
      </Flex>
      <Flex direction="column" UNSAFE_style={{ width: '100%' }}>
        <If condition={allRecipes?.[selectedRecipe]}>
          <Recipe
            recipe={allRecipes?.[selectedRecipe]}
            allActions={Object.keys(allWaypoints || {})}
          />
        </If>
      </Flex>
    </Flex>
  );
};

/* -------------------------- Cookbook -------------------------- */

export const Cookbook = () => {
  const [{ data: allWaypoints, loading, error }, getWaypoints] = useGet();

  useEffect(() => {
    getWaypoints({ url: `/waypoints/all` });
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Tabs aria-label="Waypoints And Recipies">
        <TabList>
          <Item key="actions">Actions</Item>
          <Item key="recipies">Recipies</Item>
        </TabList>
        <TabPanels>
          <Item key="actions">
            <Actions allWaypoints={allWaypoints} getWaypoints={getWaypoints} />
          </Item>
          <Item key="recipies">
            <Recipies allWaypoints={allWaypoints} />
          </Item>
        </TabPanels>
      </Tabs>
    </div>
  );
};
