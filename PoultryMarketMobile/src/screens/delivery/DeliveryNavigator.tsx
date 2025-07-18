import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DeliveryDashboard } from './DeliveryDashboard';
import { DeliveryProfile } from './DeliveryProfile';
import { FloatingTabBar } from '../../components/ui/FloatingTabBar';

const Tab = createBottomTabNavigator();

export const DeliveryNavigator: React.FC = () => {
  const tabs = [
    { name: 'Dashboard', icon: 'speedometer', label: 'Dashboard' },
    { name: 'Profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} tabs={tabs} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DeliveryDashboard} />
      <Tab.Screen name="Profile" component={DeliveryProfile} />
    </Tab.Navigator>
  );
};