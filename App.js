import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeScreen from './page/Home'
import SignupScreen from './page/Signup'
import AddRecipeScreen from './page/AddRecipe'
import LoginScreen from './page/Login'
import RecipeScreen from './page/Recipe'
import ProfileScreen from './page/Profile'
import EditProfile from './page/EditProfile'
import { auth } from './firebase'

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
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
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
        name="login"
        component={LoginScreen}
        options={{
          tabBarLabel: 'login',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
function NotLoginTabs() {
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
        name="login"
        component={LoginScreen}
        options={{
          tabBarLabel: 'login',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false) // Consider your authentication state management here

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userLoggedIn ? (
          <View>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Recipe" component={RecipeScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
          </View>
        ) : (
          <Stack.Screen name="Main1" component={NotLoginTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
