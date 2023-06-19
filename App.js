import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

/********************************************** */
/*               HealthGoalsScreen              */
/*   First tab of the app and the onpening tab  */
/********************************************** */

function HealthGoalsScreen() {
  //Variables declaration
  const [lAge, setAge] = useState('');
  const [lGender, setGender] = useState(null);
  const [lHeight, setHeight] = useState('');
  const [lWeight, setWeight] = useState('');
  const [lActivityLevel, setActivityLevel] = useState(null);
  const [lHealthGoal, setHealthGoal] = useState(null);
  const [lCaloricIntake, setCaloricIntake] = useState(0);
  const [lShowResults, setShowResults] = useState(false);
  // Boolean to check that all fields are filled and have valid values.
  const lIsFormValid =
    lAge !== '' &&
    lGender !== null &&
    lGender !== 'Select your gender' &&
    lHeight !== '' &&
    lWeight !== '' &&
    lActivityLevel !== null &&
    lActivityLevel !== 'Select your activity level' &&
    lHealthGoal !== null &&
    lHealthGoal !== 'Select your health goal';

  // Update a specific variable state with the provided value.
  const handleInputChange = (setter) => (value) => {
    setShowResults(false);
    setter(value);
  };

  // UseEffect function to calculate caloric intake when all form fields are filled
  useEffect(() => {
    if (lIsFormValid) {
      calculateCaloricIntake();
    }
  }, [lAge, lGender, lHeight, lWeight, lActivityLevel, lHealthGoal]);

  // Function to calculate caloric intake
  const calculateCaloricIntake = () => {
    let lBMR = calculateBMR();
    let lActivityFactor = 1.2;
    switch (lActivityLevel) {
      case 'light':
        lActivityFactor = 1.375;
        break;
      case 'moderate':
        lActivityFactor = 1.55;
        break;
      case 'heavy':
        lActivityFactor = 1.725;
        break;
      case 'extra':
        lActivityFactor = 1.9;
        break;
    }
    let lTotalCalories = lBMR * lActivityFactor;
    switch (lHealthGoal) {
      case 'loss':
        lTotalCalories -= 500;
        break;
      case 'gain':
        lTotalCalories += 500;
        break;
    }
    setCaloricIntake(Math.round(lTotalCalories));
  };

  // Function to calculate BMR of the user
  const calculateBMR = () => {
    let lBMR;
    if (lGender === 'male') {
      lBMR = 88.362 + 13.397 * lWeight + 4.799 * lHeight - 5.677 * lAge;
    } else {
      lBMR = 447.593 + 9.247 * lWeight + 3.098 * lHeight - 4.33 * lAge;
    }
    return lBMR;
  };

  return (
    <View style={styles.appContainer}>
      <ScrollView style={styles.healthGoalScrollView} keyboardShouldPersistTaps="handled">
        <Text style={styles.appLabel}>Age:</Text>
        <TextInput
          style={styles.healthGoalInputFieldForm}
          onChangeText={handleInputChange((text) => {
            // Regex to accept only number and no dot or comma or space
            let lAge = text.replace(/[^0-9]/g, '');
            setAge(lAge);
          })}
          value={lAge}
          keyboardType="numeric"
          maxLength={3}
        />

        <Text style={styles.appLabel}>Gender:</Text>
        <Picker
          style={styles.healthGoalPicker}
          selectedValue={lGender}
          prompt="Select your gender"
          onValueChange={(itemValue) => itemValue !== 'default' && setGender(itemValue)}>
          {/* "the slect your activity level" is default to be used as an indicator 
              but can't be selected  */}
          <Picker.Item label="Select your gender" value="default" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>

        <Text style={styles.appLabel}>Height (cm):</Text>
        <TextInput
          style={styles.healthGoalInputFieldForm}
          onChangeText={handleInputChange((text) => {
            let lHeight = text.replace(/[^0-9]/g, '');
            setHeight(lHeight);
          })}
          value={lHeight}
          keyboardType="numeric"
          maxLength={3}
        />

        <Text style={styles.appLabel}>Weight (kg):</Text>
        <TextInput
          style={styles.healthGoalInputFieldForm}
          value={lWeight}
          onChangeText={handleInputChange((text) => {
            let newText = text.replace(/[^0-9\.]/g, '');
            if (newText.split('.').length > 2) {
              return;
            }
            setWeight(newText);
          })}
          keyboardType="numeric"
          maxLength={5}
        />
        <Text style={styles.appLabel}>Activity Level:</Text>
        <Picker
          style={styles.healthGoalPicker}
          selectedValue={lActivityLevel}
          prompt="Select your activity level"
          onValueChange={handleInputChange(
            (itemValue) => itemValue !== 'default' && setActivityLevel(itemValue)
          )}>
          <Picker.Item label="Select your activity level" value="default" />
          <Picker.Item label="Sedentary" value="sedentary" />
          <Picker.Item label="Light Exercise" value="light" />
          <Picker.Item label="Moderate Exercise" value="moderate" />
          <Picker.Item label="Heavy Exercise" value="heavy" />
          <Picker.Item label="Extra Active" value="extra" />
        </Picker>
        <Text style={styles.appLabel}>Health Goal:</Text>
        <Picker
          style={styles.healthGoalPicker}
          selectedValue={lHealthGoal}
          prompt="Select your Health goal"
          onValueChange={handleInputChange(
            (itemValue) => itemValue !== 'default' && setHealthGoal(itemValue)
          )}>
          <Picker.Item label="Select your health goal" value="default" />
          <Picker.Item label="Weight Loss" value="loss" />
          <Picker.Item label="Weight Maintenance" value="maintenance" />
          <Picker.Item label="Weight Gain" value="gain" />
        </Picker>
        <TouchableOpacity
          style={styles.healthGoalButtonFormSubmit}
          onPress={() => {
            if (lIsFormValid) {
              setShowResults(true);
            } else {
              Alert.alert('Invalid form', 'Please make sure all fields are filled');
            }
          }}>
          <Text style={styles.healGoalButtonTextSubmit}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* The following view is shown when the form is valid
       and the user pressed submit*/}
      {lShowResults && (
        <View>
          <Text>Daily Caloric Intake: {lCaloricIntake}</Text>
        </View>
      )}
    </View>
  );
}

/********************************************** */
/*               FoodDataBaseScreen             */
/*              Second tab of the app           */
/********************************************** */

function FoodDatabaseScreen() {
  // Use useContext hook to access the MealPlanContext to pass information to other tab
  const { lMealPlan, addMealItem, removeMealItem } = useContext(MealPlanContext);
  const [lSearchQuery, setSearchQuery] = useState('');
  const [lFoods, setFoods] = useState([]);
  const [lModalVisible, setModalVisible] = useState(false);
  const [lSelectedFoodItem, setSelectedFoodItem] = useState(null);
  /* lTempMealSelection is used to store the user's choice temprorarily 
  before adding it to meal plan */
  const [lTempMealSelection, setTempMealSelection] = useState('');
  const [lShowDatePicker, setShowDatePicker] = useState(false);
  const [lSelectedDate, setSelectedDate] = useState(new Date());
  const [lQuantity, setQuantity] = useState(1);

  //Function to change the variable lSearchQuery according to the user's input
  const handleInputChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearch = async () => {
    if (!lSearchQuery || lSearchQuery.trim() === '') {
      Alert.alert('Error', 'Please enter a food to search for');
      return;
    }
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${lSearchQuery}&app_id=97b53550&app_key=6137296166e4305562e36a0538360545`
      );

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const data = await response.json();
      if (data && data.hints && data.hints.length === 0) {
        throw new Error('No foods found');
      }

      // Create a map for storing unique food items
      let foodMap = new Map();

      data.hints.forEach((item) => {
        let { foodId, label, category, nutrients } = item.food;

        let roundedNutrients = {
          ENERC_KCAL: Math.ceil(nutrients.ENERC_KCAL),
          CHOCDF: Math.ceil(nutrients.CHOCDF),
          FAT: Math.ceil(nutrients.FAT),
          FIBTG: Math.ceil(nutrients.FIBTG),
          PROCNT: Math.ceil(nutrients.PROCNT),
        };

        //console.log(foodId);
        let identifier = `${foodId}-${label}-${category}-${roundedNutrients.ENERC_KCAL}-${roundedNutrients.CHOCDF}-${roundedNutrients.FAT}-${roundedNutrients.FIBTG}-${roundedNutrients.PROCNT}`;

        // If this is a new identifier, store the item in the map
        if (!foodMap.has(identifier)) {
          foodMap.set(identifier, { ...item, roundedNutrients });
        }
      });
      let uniqueFoods = Array.from(foodMap.values());

      setFoods(uniqueFoods);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  // Define how each item result will be rendered
  const renderItem = ({ item }) => (
    <View style={styles.databaseCard}>
      <View style={styles.databaseCardContent}>
        <Image source={{ uri: item.food.image }} style={styles.databaseFoodImage} />
        <Text style={styles.databaseFoodTitle}>{item.food.label}</Text>
        <Text>Category: {item.food.category}</Text>
        <Text>Calories: {item.roundedNutrients.ENERC_KCAL} kcal</Text>
        <Text>Carbs: {item.roundedNutrients.CHOCDF} g</Text>
        <Text>Fat: {item.roundedNutrients.FAT} g</Text>
        <Text>Fiber: {item.roundedNutrients.FIBTG} g</Text>
        <Text>Protein: {item.roundedNutrients.PROCNT} g</Text>
        <TouchableOpacity
          style={styles.databaseButtonAddToMealPlan}
          title="Add to Meal Plan"
          onPress={() => addToMealPlan(item)}>
          <Text style={styles.appTextInButtonColor}>Add to Meal Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* Prepare the selected food to be added to the meal plan by storing a 
  unique key and other information */
  const addToMealPlan = (item) => {
    setSelectedFoodItem({
      // Create unique key by concatenating selected food information
      foodId: `${item.food.foodId}-${item.food.label}-${item.food.category}-${item.roundedNutrients.ENERC_KCAL}-${item.roundedNutrients.CHOCDF}-${item.roundedNutrients.FAT}-${item.roundedNutrients.FIBTG}-${item.roundedNutrients.PROCNT}`,
      label: item.food.label,
      category: item.food.category,
      nutrients: item.roundedNutrients.ENERC_KCAL,
      quantity: lQuantity,
    });
    //console.log(item.food.foodId);
    setModalVisible(true);
    setQuantity(1);
    setSelectedDate(new Date());
  };

  // Update lSelectedDate state variable to the selected date
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  // Update lTempMealSelection state variable to the selected meal
  const handleMealSelectionTemp = (itemValue) => {
    setTempMealSelection(itemValue);
  };

  /* Check that a date and meal have been selected, 
  if so, add the selected food to the meal plan */
  const handleConfirmation = () => {
    if (!lSelectedDate || !lTempMealSelection) {
      Alert.alert('Wait', 'Please select a day and a meal first');
    } else {
      let selectedDateString = lSelectedDate.toISOString().split('T')[0];

      // Add the selected food item to the meal plan
      addMealItem(selectedDateString, lTempMealSelection, lSelectedFoodItem, lQuantity);
      //console.log(selectedDateString, lTempMealSelection, lSelectedFoodItem, lQuantity);

      Alert.alert('Success', 'Your food has been successfully added to your meal plan');
      setSelectedFoodItem(null);
      setTempMealSelection('');
      setModalVisible(false);
      setSelectedDate(new Date());
    }
  };

  return (
    <View style={styles.appContainer}>
      <TextInput
        value={lSearchQuery}
        onChangeText={handleInputChange}
        style={styles.input}
        placeholder="Search for a food..."
      />
      <TouchableOpacity style={styles.databaseButtonSearch} onPress={handleSearch}>
        <Text style={styles.appTextInButtonColor}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={lFoods}
        keyExtractor={(item, index) => item.food.foodId + '-' + index}
        renderItem={renderItem}
      />
      <Modal animationType="slide" transparent={true} visible={lModalVisible}>
        <View style={styles.databseModalContainer}>
          <View style={styles.databaseModalContent}>
            <Text style={styles.databaseModalText}>Add to Meal Plan</Text>
            <Text style={styles.databaseModalText}>Select the day and meal for this item:</Text>

            {/* This button shows or hides the date picker */}
            <TouchableOpacity
              style={styles.databaseButtonDate}
              onPress={() => setShowDatePicker(!lShowDatePicker)}>
              <Text
                style={
                  styles.databaseButtonDateTextColor
                }>{`${lSelectedDate.toDateString()}`}</Text>
            </TouchableOpacity>

            {lShowDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={lSelectedDate}
                mode={'date'}
                minimumDate={new Date()}
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            <Picker selectedValue={lTempMealSelection} onValueChange={handleMealSelectionTemp}>
              <Picker.Item label="Select the meal" value={null} enabled={false} />
              <Picker.Item label="Breakfast" value="Breakfast" />
              <Picker.Item label="Lunch" value="Lunch" />
              <Picker.Item label="Snack" value="Snack" />
              <Picker.Item label="Dinner" value="Dinner" />
            </Picker>

            <View>
              <Text style={styles.databaseModalText}>Quantity :</Text>
              <View style={styles.appQuantityContainer}>
                <TextInput
                  style={styles.databaseQuantityInput}
                  value={String(lQuantity)}
                  onChangeText={(text) => {
                    const newQuantity = Number(text);
                    if (!Number.isNaN(newQuantity) && newQuantity > 0) {
                      setQuantity(newQuantity);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />

                {/* These buttons allow users to increment or 
                decrement the quantity of the food */}
                <View style={styles.databaseButtonsContainer}>
                  <TouchableOpacity
                    style={styles.appQuantityButton}
                    onPress={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}>
                    <Text style={styles.appTextInButtonColor}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.appQuantityButton}
                    onPress={() => setQuantity((prevQuantity) => prevQuantity + 1)}>
                    <Text style={styles.appTextInButtonColor}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.databaseButtonActionsContainer}>
              <TouchableOpacity style={styles.databaseButtonConfirm} onPress={handleConfirmation}>
                <Text style={styles.appTextInButtonColor}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.databaseButtonCancel}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.databaseCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/********************************************** */
/*               MealPlanningScreen             */
/*             The last tab of the app          */
/********************************************** */

function MealPlanningScreen() {
  /* Use useContext hook to get the MealPlanContext to 
  display information and modify them if needed */
  const { lMealPlan, addMealItem, removeMealItem, updateMealItem } = useContext(MealPlanContext);
  const [lCurrentDate, setCurrentDate] = useState(new Date());
  const [lModalVisible, setModalVisible] = useState(false);
  const [lItemToDelete, setItemToDelete] = useState(null);
  const lMealOrder = ['Breakfast', 'Lunch', 'Snack', 'Dinner']; // Set the displaying order of meals
  const lNavigation = useNavigation(); // Use to navigate to foodDatabaseScreen
  const lRemoveIcon = require('./assets/bin.png'); //The bin icon for "Remove" button

  // Remove the specific food item from the meal plan
  const handleRemoveItem = (date, mealType, foodItem) => {
    removeMealItem(date, mealType, foodItem);
    setModalVisible(false);
  };

  /* Display the removing Confirmation modal to the user
  Assign the item to the value lItemToDelete */
  const handleOpenModal = (item) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  // Method that crete the meal list
  const createMealList = (selectedDate) => {
    let mealList = {};
    for (let date in lMealPlan) {
      if (date === selectedDate) {
        for (let mealType in lMealPlan[date]) {
          if (!mealList[mealType]) {
            mealList[mealType] = [];
          }
          lMealPlan[date][mealType].forEach((foodItem) => {
            mealList[mealType].push(foodItem);
          });
        }
      }
    }
    return mealList;
  };

  // Handle the change of the displaying date
  const handleDateChange = (offset) => {
    let newDate = new Date(lCurrentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  // Calculate the total calories of the day
  const calculateTotalCalories = (meals) => {
    let totalCalories = 0;
    for (let mealType in meals) {
      meals[mealType].forEach((foodItem) => {
        totalCalories += foodItem.foodItem.nutrients * foodItem.quantity;
      });
    }
    return totalCalories;
  };

  // Call the function to create the meal list
  const lMeals = createMealList(lCurrentDate.toISOString().slice(0, 10));
  const lTtotalCalories = calculateTotalCalories(lMeals);

  return (
    <View style={styles.planningMainMealContainer}>
      <Modal visible={lModalVisible} transparent={true}>
        <View style={styles.planningModalContainer}>
          <View style={styles.planningModalContent}>
            <Text style={styles.planningModalText}>
              Are you sure you want to remove {lItemToDelete?.foodItem.label} from{' '}
              {lItemToDelete?.mealType} ?
            </Text>
            <View style={styles.planningModalButtonContainer}>
              {/* The following button confirms the removal of the food item from the meal */}
              <TouchableOpacity
                style={styles.planningModalButtonConfirm}
                onPress={() =>
                  handleRemoveItem(
                    lItemToDelete.date,
                    lItemToDelete.mealType,
                    lItemToDelete.foodItem
                  )
                }>
                <Text style={styles.planningButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.planningModalButtonCancel}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.planningButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.planningMealDateContainer}>
        <TouchableOpacity
          style={styles.planningButtonChangeDate}
          onPress={() => handleDateChange(-1)}>
          <Text style={styles.appTextInButtonColor}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.planningTextDate}>{lCurrentDate.toDateString()}</Text>
        <TouchableOpacity
          style={styles.planningButtonChangeDate}
          onPress={() => handleDateChange(1)}>
          <Text style={styles.appTextInButtonColor}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <Text>Total Calories: {lTtotalCalories} kcal</Text>
      {/*Display the total calories of the day */}
      <ScrollView>
        {lMealOrder.map((mealType) => {
          const foodItems = lMeals[mealType] || [];
          return (
            //console.log(foodItems.foodId),
            <View key={mealType} style={styles.planningMealContainer}>
              <View style={styles.planningMealTypeContainer}>
                <Text style={styles.planningMealType}>{mealType}</Text>
                <TouchableOpacity
                  style={styles.planningButtonAddFood}
                  onPress={() =>
                    lNavigation.navigate('Food Database', {
                      mealType: mealType,
                      date: lCurrentDate.toISOString().slice(0, 10),
                    })
                  }>
                  <Text style={styles.appTextInButtonColor}> + Add Food</Text>
                </TouchableOpacity>
              </View>
              {/* For each food item, create a card with information and control buttons */}
              {foodItems.map((foodItem) => (
                <View key={foodItem.foodItem.foodId} style={styles.planningFoodContainer}>
                  <Text style={styles.planningTextFoodName}>{foodItem.foodItem.label}</Text>
                  <View style={styles.planningFoodDetailsContainer}>
                    <View>
                      <Text style={styles.planningTextFoodCalories}>
                        Unit calories : {foodItem.foodItem.nutrients} kcal
                      </Text>
                      <View style={styles.appQuantityContainer}>
                        <TouchableOpacity
                          style={[styles.appQuantityButton, { backgroundColor: '#A483E1' }]}
                          onPress={() =>
                            updateMealItem(
                              lCurrentDate.toISOString().slice(0, 10),
                              mealType,
                              foodItem.foodItem,
                              -1
                            )
                          }
                          disabled={foodItem.quantity <= 1}>
                          <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.planningTextFoodQuantity}>
                          Quantity: {foodItem.quantity}
                        </Text>
                        <TouchableOpacity
                          style={[styles.appQuantityButton, { backgroundColor: '#A483E1' }]}
                          onPress={() =>
                            updateMealItem(
                              lCurrentDate.toISOString().slice(0, 10),
                              mealType,
                              foodItem.foodItem,
                              1
                            )
                          }>
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.planningButtonRemoveFood}
                      onPress={() =>
                        handleOpenModal({
                          date: lCurrentDate.toISOString().slice(0, 10),
                          mealType,
                          foodItem: foodItem.foodItem,
                        })
                      }>
                      <Image source={lRemoveIcon} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/********************************************** */
/*            Style of the whole App            */
/********************************************** */

const styles = StyleSheet.create({
  // Styles used for the whole app
  appContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  appLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#212121',
  },
  appQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appQuantityButton: {
    backgroundColor: '#F4D484',
    padding: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Styles used for HealthGoalScreen
  healthGoalScrollView: {
    paddingRight: 10,
  },
  healthGoalInputFieldForm: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 14,
    borderRadius: 10,
  },
  healthGoalPicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  healthGoalButtonFormSubmit: {
    backgroundColor: '#7ED9C4',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 9,
    width: 150,
    justifyContent: 'center',
  },
  healGoalButtonTextSubmit: {
    color: '#47424B',
    fontSize: 14,
    textAlign: 'center',
  },
  // Styles used for FoodDatabasScreen
  databaseCard: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    marginBottom: 30,
    marginTop: 30,
  },
  databaseCardContent: {
    marginTop: 40,
    marginHorizontal: 18,
    marginVertical: 10,
    marginBottom: 20,
  },
  databaseFoodImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    right: 0,
    top: -80,
  },
  databaseFoodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  databaseButtonAddToMealPlan: {
    backgroundColor: '#F4D484',
    borderRadius: 50,
    marginTop: 15,
    marginBottom: 15,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  databaseButtonSearch: {
    backgroundColor: '#F4D484',
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  appTextInButtonColor: {
    color: '#47424B',
  },
  databseModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  databaseModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  databaseModalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  databaseButtonDate: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 200,
    alignSelf: 'center',
    marginBottom: 20,
    marginBottom: 10,
  },
  databaseButtonDateTextColor: {
    color: '#000',
  },
  databaseQuantityInput: {
    borderWidth: 1,
    borderColor: '#000',
    width: 60,
    height: 40,
    textAlign: 'center',
    fontSize: 16,
    alignSelf: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  databaseButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
  databaseButtonActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  databaseButtonConfirm: {
    backgroundColor: '#F4D484',
    borderColor: '#F4D484',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  databaseButtonCancel: {
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  databaseCancelText: {
    color: '#000',
  },
  // Styles used for MealPlanningScreen
  planningMainMealContainer: {
    flex: 1,
    padding: 10,
  },
  planningModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  planningModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  planningModalText: {
    textAlign: 'center',
    fontSize: 17,
  },
  planningModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  planningModalButtonConfirm: {
    backgroundColor: '#A483E1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  planningButtonText: {
    color: '#000000',
    fontSize: 13,
  },
  planningModalButtonCancel: {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  planningMealDateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  planningButtonChangeDate: {
    backgroundColor: '#B8A1E3',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planningTextDate: {
    marginHorizontal: 20,
  },
  planningMealContainer: {
    marginBottom: 10,
  },
  planningMealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  planningMealType: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  planningButtonAddFood: {
    backgroundColor: '#B8A1E3',
    borderRadius: 50,
    width: 120,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  planningFoodContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'black',
  },
  planningTextFoodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planningFoodDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  planningTextFoodCalories: {
    margin: 3,
    fontSize: 15,
  },
  planningTextFoodQuantity: {
    margin: 3,
    fontSize: 14,
  },
  planningButtonRemoveFood: {
    backgroundColor: '#F16262',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
});

// Create a bottom bar naviator
const Tab = createBottomTabNavigator();

// Create the context tht will allow child components to access and modify the meal plan
export const MealPlanContext = React.createContext();

export default function App() {
  // State hook for meal plan with empty object as an initial value
  const [lMealPlan, setLMealPlan] = useState({});

  // Function to add food items to a meal type on a specific date.
  const addMealItem = (date, mealType, foodItem, quantity) => {
    setLMealPlan((prevPlan) => {
      const newPlan = { ...prevPlan };
      if (!newPlan[date]) newPlan[date] = {};
      if (!newPlan[date][mealType]) newPlan[date][mealType] = [];

      //Vérifie si l'aliment existe déjà
      const existingItemIndex = newPlan[date][mealType].findIndex(
        (item) => item.foodItem.foodId === foodItem.foodId
      );
      if (existingItemIndex !== -1) {
        newPlan[date][mealType][existingItemIndex].quantity += quantity;
      } else {
        newPlan[date][mealType].push({ foodItem, quantity });
      }

      return newPlan;
    });
  };

  // Function to remove a food item from a meal type on a specific date.
  const removeMealItem = (date, mealType, foodItem) => {
    setLMealPlan((prevPlan) => {
      const newPlan = { ...prevPlan };

      newPlan[date][mealType] = newPlan[date][mealType].filter(
        (item) => item.foodItem !== foodItem
      );

      return newPlan;
    });
  };

  // Function to update the quantity of a food item in a meal type on a specific date.
  const updateMealItem = (date, mealType, foodItem, quantityChange) => {
    setLMealPlan((prevPlan) => {
      const newPlan = { ...prevPlan };

      // Find the item to modify
      const existingItemIndex = newPlan[date][mealType].findIndex(
        (item) => item.foodItem.foodId === foodItem.foodId
      );

      // Check if the meal exists
      if (existingItemIndex !== -1) {
        newPlan[date][mealType][existingItemIndex].quantity = Math.max(
          1,
          newPlan[date][mealType][existingItemIndex].quantity + quantityChange
        );
      }
      return newPlan;
    });
  };

  // Function to save the meal plan to local storage
  const saveMealPlan = async (mealPlan) => {
    try {
      await AsyncStorage.setItem('@mealPlan', JSON.stringify(mealPlan));
    } catch (e) {
      console.error("can't save data");
    }
  };

  // Function to load the meal plan from the local storage
  const loadMealPlan = async () => {
    try {
      let mealPlan = await AsyncStorage.getItem('@mealPlan');
      if (mealPlan !== null) {
        setLMealPlan(JSON.parse(mealPlan));
      }
    } catch (e) {
      console.error("can't load data");
    }
  };

  // Call the load method when the component is mounted
  useEffect(() => {
    loadMealPlan();
  }, []);

  // Call the save method everytime the meal plan change
  useEffect(() => {
    saveMealPlan(lMealPlan);
  }, [lMealPlan]);

  return (
    <MealPlanContext.Provider value={{ lMealPlan, addMealItem, removeMealItem, updateMealItem }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#706F87',
          }}>
          <Tab.Screen
            name="Health Goals"
            component={HealthGoalsScreen}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require('./goal.png')}
                  style={{ height: size, width: size, tintColor: focused ? '#A1E4C7' : '#706F87' }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Food Database"
            component={FoodDatabaseScreen}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require('./diet.png')}
                  style={{ height: size, width: size, tintColor: focused ? '#F4D484' : '#706F87' }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Meal Planning"
            component={MealPlanningScreen}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require('./calendar.png')}
                  style={{ height: size, width: size, tintColor: focused ? '#A483E1' : '#706F87' }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </MealPlanContext.Provider>
  );
}
