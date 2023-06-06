import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from 'react-navigation/native';
import { createBottomTabNavigator } from 'react-navigation/bottom-tabs';

function HealthGoalsScreen() {
  return (
    <View style={styles.text}>
      <Text>Health Goals!</Text>
    </View>
  );
}

function FoodDatabaseScreen() {
  return (
    <View style={styles.text}>
      <Text>Food Database!</Text>
    </View>
  );
}

function MealPlanningScreen() {
  return (
    <View style={styles.text}>
      <Text>Meal Planning!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  }
})

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Health Goals" component={HealthGoalsScreen} />
        <Tab.Screen name="Food Database" component={FoodDatabaseScreen} />
        <Tab.Screen name="Meal Planning" component={MealPlanningScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
