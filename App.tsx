import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './DashboardScreen';
import HistoryScreen from './HistoryScreen';

// Import an icon library, e.g., Ionicons
import { Ionicons } from '@expo/vector-icons';

interface Expense {
  id: string;
  description: string;
  amount: number;
}

const Tab = createBottomTabNavigator();

function ExpenseTrackerScreen() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = () => {
    if (description.trim() === '' || amount.trim() === '') {
      alert('Please enter both description and amount.');
      return;
    }
    const newExpense: Expense = {
      id: Math.random().toString(),
      description,
      amount: parseFloat(amount),
    };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    setDescription('');
    setAmount('');
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseItemContainer}>
      <Text style={styles.expenseDescription}>{item.description}</Text>
      <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Expense Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyListText}>No expenses yet. Add some!</Text>}
      />
      {/* Pass expenses to HistoryScreen via route params or context if needed, for now, HistoryScreen will manage its own or receive via props */}
    </View>
  );
}

export default function App() {
  // Note: expenses state is now managed within ExpenseTrackerScreen
  // If you need to share expenses between screens, consider using React Context or passing props through navigation
  const [expenses, setExpenses] = useState<Expense[]>([]); // Keep a global expenses state for History for now

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Tracker') {
              iconName = focused ? 'ios-list-circle' : 'ios-list-circle-outline';
            } else if (route.name === 'Dashboard') {
              iconName = focused ? 'ios-pie-chart' : 'ios-pie-chart-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'ios-time' : 'ios-time-outline';
            }
            // You can return any component that you like here!
            return <Ionicons name={iconName as string} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false, // Hide header for all tabs
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Tracker" component={ExpenseTrackerScreen} />
        <Tab.Screen name="History">
          {props => <HistoryScreen {...props} expenses={expenses} />}
        </Tab.Screen>
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 25 : 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
  expenseItemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 3,
  },
  expenseDescription: {
    fontSize: 16,
    color: '#333',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  }
});
