import React from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  tabs: TabItem[];
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  state,
  descriptors,
  navigation,
  tabs,
}) => {
  const activeTab = state.routes[state.index].name;

  return (
    <StyledView className="absolute bottom-6 left-4 right-4">
      <BlurView intensity={80} className="rounded-3xl overflow-hidden">
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
          className="flex-row justify-around py-3 px-2"
        >
          {tabs.map((tab) => (
            <StyledTouchableOpacity
              key={tab.name}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[index].key,
                  canPreventDefault: true,
                });

                if (!event.defaultPrevented) {
                  navigation.navigate(state.routes[index].name);
                }
              }}
              className={`
                flex-1 items-center py-2 px-3 rounded-2xl mx-1
                ${activeTab === tab.name ? 'bg-white/20' : ''}
              `}
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={activeTab === tab.name ? '#16a34a' : 'rgba(255,255,255,0.8)'}
              />
              <StyledText
                className={`
                  text-xs mt-1 font-medium
                  ${activeTab === tab.name ? 'text-primary-600' : 'text-white/80'}
                `}
              >
                {tab.label}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </LinearGradient>
      </BlurView>
    </StyledView>
  );
};