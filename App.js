import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeScreen from './page/Home'
import SignupScreen from './page/Signup'
import AddRecipeScreen from './page/AddRecipe'
import LoginScreen from './page/Login'
import RecipeScreen from './page/Recipe'

const Tab = createMaterialBottomTabNavigator()
const Stack = createStackNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#ffffff"
      barStyle={{ backgroundColor: '#FBD532' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{
          tabBarLabel: 'Add Recipe',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={LoginScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Recipe" component={RecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
