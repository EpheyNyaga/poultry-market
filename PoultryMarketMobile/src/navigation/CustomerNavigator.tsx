import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { CustomerDashboard } from '../screens/customer/CustomerDashboard';
import { ProductsScreen } from '../screens/customer/ProductsScreen';
import { ProductDetailScreen } from '../screens/customer/ProductDetailScreen';
import { CartScreen } from '../screens/customer/CartScreen';
import { CheckoutScreen } from '../screens/customer/CheckoutScreen';
import { OrdersScreen } from '../screens/customer/OrdersScreen';
import { DeliveriesScreen } from '../screens/customer/DeliveriesScreen';
import { ApplicationsScreen } from '../screens/customer/ApplicationsScreen';
import { ApplicationDetailScreen } from '../screens/customer/ApplicationDetailScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { StoreScreen } from '../screens/store/StoreScreen';
import { FloatingTabBar } from '../components/ui/FloatingTabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProductsList" component={ProductsScreen} />
    <Stack.Screen name="Product" component={ProductDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="Store" component={StoreScreen} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrdersList" component={OrdersScreen} />
    <Stack.Screen name="Deliveries" component={DeliveriesScreen} />
  </Stack.Navigator>
);

const ApplicationsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ApplicationsList" component={ApplicationsScreen} />
    <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
  </Stack.Navigator>
);

export const CustomerNavigator: React.FC = () => {
  const tabs = [
    { name: 'Dashboard', icon: 'home', label: 'Home' },
    { name: 'Products', icon: 'storefront', label: 'Shop' },
    { name: 'Orders', icon: 'receipt', label: 'Orders' },
    { name: 'Applications', icon: 'document-text', label: 'Apply' },
    { name: 'Profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={CustomerDashboard} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Applications" component={ApplicationsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};