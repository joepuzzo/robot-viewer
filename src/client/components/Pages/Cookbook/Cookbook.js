import React, {useState, useEffect } from 'react';
import { Waypoints } from './Waypoints';
import {Recipe } from './Recipe';
import Input from '../../Informed/Input';
import { useFormApi } from 'informed';
import { usetPost } from '../../../hooks/usePost';

import {
    Flex,
    Button,
    ActionButton,
  } from '@adobe/react-spectrum';
  import { useGet } from '../../../hooks/useGet';


export const Cookbook = () => {
 const formApi = useFormApi();
 let [listToShow, setListToShow] = React.useState('actions');

 const [selectedAction, setSelectedAction] = useState(null);
 const [{ data: allWaypoints, loading: getLoading, error: getError }, getWaypoints] = useGet();
 const load = useEffect(() => {
    getWaypoints({ url: `/waypoints/all` });
  }, []);
  const [{ error: postError, loading: postLoading }, postWaypoints] = usetPost({
    headers: { ContentType: 'application/json' },
  });

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [{ data: allRecipes}, getRecipes] = useGet();
  const loadRecipes = useEffect(() => {
     getRecipes({ url: `/recipes/all` });
   }, []);
  const [{}, postRecipes] = usetPost({
     headers: { ContentType: 'application/json' },
   });
 

  return (
    <>
      <Flex direction="row" justifyContent="space-evenly" gap="size-2000">

        <Flex direction="column" alignItems="center" gap="size-100">
            <Button variant={listToShow==='actions'?"selected":"primary"} onPress={() => setListToShow('actions')}>Actions</Button>
            <Button variant={listToShow==='recipes'?"selected":"primary"}onPress={() => setListToShow('recipes')}>Recipes</Button>
        </Flex>
        {(listToShow === 'actions') && <Flex direction="column" alignItems="center" gap="size-100">
            <Flex direction="row" alignItems="end" gap="size-100">
            <Input name="actionName" label="Action Name" placeholder="New Action Name" autocomplete="off" />
                <ActionButton type="button" minWidth="100" onPress={()=> {
                    const newActionName = formApi.getFormState().values.actionName;
                    const defaultNewAction = [{
                        x: 30,
                        y: 20,
                        z: 10,
                        orientation: '-z',
                    }]
                    if(!allWaypoints[newActionName]){
                        allWaypoints[newActionName] = defaultNewAction;
                        postWaypoints({ payload: defaultNewAction, url: `/waypoints/save/${newActionName}` });
                    }
                }
                } >
                     Add Action
                </ActionButton>
            </Flex>
            {Object.keys(allWaypoints || {}).map((x) => { return <Button onPress={() => {setSelectedAction(x); formApi.setValue('actionName', x);}} variant={selectedAction===x?"selected":"primary"}>{x}</Button>})}
        </Flex>}
        {(listToShow === 'recipes') && <Flex direction="column" alignItems="center" gap="size-100">
            <Flex direction="row" alignItems="end" gap="size-100">
            <Input name="recipeName" label="Recipe Name" placeholder="New Recipe Name" autocomplete="off" />
                <ActionButton type="button" minWidth="100" onPress={()=> {
                    const newRecipeName = formApi.getFormState().values.recipeName;
                    if(!allRecipes?.[newRecipeName]){
                      allRecipes[newRecipeName] = [];
                        postRecipes({ payload: [], url: `/recipes/save/${newRecipeName}` });
                    }
                }
                } >
                     Add Recipe
                </ActionButton>
            </Flex>
            {Object.keys(allRecipes || {}).map((x) => { return <Button onPress={() => {setSelectedRecipe(x); formApi.setValue('recipeName', x);}} variant={selectedRecipe===x?"selected":"primary"}>{x}</Button>})}
        </Flex>}
        <Flex direction="column" alignItems="center" gap="size-100">
            {(listToShow === 'actions') && selectedAction && <Waypoints data={allWaypoints?.[selectedAction]} actionName={selectedAction}/>}
            {(listToShow === 'recipes') && selectedRecipe && <Recipe recipe={allRecipes?.[selectedRecipe]} allActions={Object.keys(allWaypoints || {})}/>}
        </Flex>
      </Flex>
    </>
  );
};