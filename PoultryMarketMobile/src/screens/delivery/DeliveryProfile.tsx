import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { apiService } from '../../services/api';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface DeliveryProfileProps {
  navigation: any;
}

export const DeliveryProfile: React.FC<DeliveryProfileProps> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    vehicleType: '',
    licenseNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await apiService.getProfile();
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        vehicleType: profileData.vehicleType || '',
        licenseNumber: profileData.licenseNumber || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiService.updateProfile(formData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (loading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <StyledSafeAreaView className="flex-1">
      <LinearGradient
        colors={['#3b82f6', '#2563eb', '#1d4ed8']}
        className="flex-1"
      >
        {/* Header */}
        <StyledView className="px-4 py-6">
          <StyledText className="text-white text-2xl font-bold">
            Delivery Profile
          </StyledText>
          <StyledText className="text-white/80 mt-1">
            Manage your delivery agent information
          </StyledText>
        </StyledView>

        <StyledScrollView className="flex-1 px-4">
          {/* Profile Information */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledView className="flex-row justify-between items-center">
                <StyledText className="text-white text-lg font-semibold">
                  Personal Information
                </StyledText>
                {!isEditing && (
                  <LiquidButton
                    title="Edit"
                    variant="glass"
                    size="sm"
                    onPress={() => setIsEditing(true)}
                  />
                )}
              </StyledView>
            </LiquidGlassHeader>

            <LiquidGlassContent>
              {isEditing ? (
                <StyledView className="space-y-4">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChangeText={(value) => setFormData({ ...formData, name: value })}
                    placeholder="Enter your full name"
                  />
                  
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChangeText={(value) => setFormData({ ...formData, phone: value })}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                  
                  <Input
                    label="Location"
                    value={formData.location}
                    onChangeText={(value) => setFormData({ ...formData, location: value })}
                    placeholder="Enter your location"
                  />
                  
                  <Input
                    label="Vehicle Type"
                    value={formData.vehicleType}
                    onChangeText={(value) => setFormData({ ...formData, vehicleType: value })}
                    placeholder="e.g., Motorcycle, Car, Bicycle"
                  />
                  
                  <Input
                    label="License Number"
                    value={formData.licenseNumber}
                    onChangeText={(value) => setFormData({ ...formData, licenseNumber: value })}
                    placeholder="Enter your license number"
                  />

                  <StyledView className="flex-row space-x-3 mt-6">
                    <LiquidButton
                      title="Save"
                      variant="glass"
                      onPress={handleSave}
                      loading={loading}
                      className="flex-1"
                    />
                    <LiquidButton
                      title="Cancel"
                      variant="outline"
                      onPress={() => setIsEditing(false)}
                      className="flex-1"
                    />
                  </StyledView>
                </StyledView>
              ) : (
                <StyledView className="space-y-4">
                  <StyledView className="flex-row items-center">
                    <Ionicons name="person" size={20} color="rgba(255,255,255,0.8)" />
                    <StyledView className="ml-3">
                      <StyledText className="text-white/80 text-sm">Name</StyledText>
                      <StyledText className="text-white font-medium">{profile?.name}</StyledText>
                    </StyledView>
                  </StyledView>

                  <StyledView className="flex-row items-center">
                    <Ionicons name="mail" size={20} color="rgba(255,255,255,0.8)" />
                    <StyledView className="ml-3">
                      <StyledText className="text-white/80 text-sm">Email</StyledText>
                      <StyledText className="text-white font-medium">{profile?.email}</StyledText>
                    </StyledView>
                  </StyledView>

                  {profile?.phone && (
                    <StyledView className="flex-row items-center">
                      <Ionicons name="call" size={20} color="rgba(255,255,255,0.8)" />
                      <StyledView className="ml-3">
                        <StyledText className="text-white/80 text-sm">Phone</StyledText>
                        <StyledText className="text-white font-medium">{profile.phone}</StyledText>
                      </StyledView>
                    </StyledView>
                  )}

                  {profile?.location && (
                    <StyledView className="flex-row items-center">
                      <Ionicons name="location" size={20} color="rgba(255,255,255,0.8)" />
                      <StyledView className="ml-3">
                        <StyledText className="text-white/80 text-sm">Location</StyledText>
                        <StyledText className="text-white font-medium">{profile.location}</StyledText>
                      </StyledView>
                    </StyledView>
                  )}
                </StyledView>
              )}
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Delivery Stats */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledText className="text-white text-lg font-semibold">
                Delivery Statistics
              </StyledText>
            </LiquidGlassHeader>
            <LiquidGlassContent>
              <StyledView className="flex-row justify-between items-center mb-4">
                <StyledView className="items-center">
                  <StyledText className="text-white text-2xl font-bold">0</StyledText>
                  <StyledText className="text-white/70 text-sm">Total Deliveries</StyledText>
                </StyledView>
                <StyledView className="items-center">
                  <StyledText className="text-white text-2xl font-bold">0</StyledText>
                  <StyledText className="text-white/70 text-sm">This Month</StyledText>
                </StyledView>
                <StyledView className="items-center">
                  <StyledText className="text-white text-2xl font-bold">0%</StyledText>
                  <StyledText className="text-white/70 text-sm">Success Rate</StyledText>
                </StyledView>
              </StyledView>

              <StyledView className="bg-white/10 rounded-xl p-3">
                <StyledText className="text-white/80 text-sm text-center">
                  Start making deliveries to see your statistics here
                </StyledText>
              </StyledView>
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Account Actions */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledText className="text-white text-lg font-semibold">
                Account Actions
              </StyledText>
            </LiquidGlassHeader>
            <LiquidGlassContent>
              <StyledView className="space-y-3">
                <LiquidButton
                  title="Change Password"
                  variant="outline"
                  onPress={() => {/* Navigate to change password */}}
                  className="w-full"
                >
                  <Ionicons name="lock-closed" size={20} color="white" />
                </LiquidButton>
                
                <LiquidButton
                  title="Logout"
                  variant="outline"
                  onPress={handleLogout}
                  className="w-full"
                >
                  <Ionicons name="log-out" size={20} color="white" />
                </LiquidButton>
              </StyledView>
            </LiquidGlassContent>
          </LiquidGlassCard>
        </StyledScrollView>
      </LinearGradient>
    </StyledSafeAreaView>
  );
};