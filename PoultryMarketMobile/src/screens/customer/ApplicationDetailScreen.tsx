import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { apiService } from '../../services/api';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface ApplicationDetailScreenProps {
  navigation: any;
}

export const ApplicationDetailScreen: React.FC<ApplicationDetailScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const { applicationId } = route.params as { applicationId: string };
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const applicationData = await apiService.getApplication(applicationId);
      setApplication(applicationData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return 'time';
      case 'APPROVED': return 'checkmark-circle';
      case 'REJECTED': return 'close-circle';
      default: return 'ellipse';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !application) {
    return (
      <StyledSafeAreaView className="flex-1 bg-red-500">
        <StyledView className="flex-1 justify-center items-center p-4">
          <Ionicons name="alert-circle" size={64} color="white" />
          <StyledText className="text-white text-xl font-bold mt-4">
            Application Not Found
          </StyledText>
          <StyledText className="text-white/80 text-center mt-2">
            {error || 'The application you\'re looking for doesn\'t exist.'}
          </StyledText>
          <LiquidButton
            title="Go Back"
            variant="glass"
            onPress={() => navigation.goBack()}
            className="mt-6"
          />
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1">
      <LinearGradient
        colors={['#3b82f6', '#2563eb', '#1d4ed8']}
        className="flex-1"
      >
        {/* Header */}
        <StyledView className="flex-row items-center justify-between px-4 py-4">
          <LiquidButton
            title=""
            variant="glass"
            size="sm"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </LiquidButton>
          <StyledText className="text-white text-lg font-semibold">
            Application Details
          </StyledText>
          <StyledView className="w-10" />
        </StyledView>

        <StyledScrollView className="flex-1 px-4">
          {/* Application Header */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledView className="flex-row justify-between items-start">
                <StyledView>
                  <StyledText className="text-white text-xl font-bold">
                    {application.requestedRole.replace('_', ' ')} Application
                  </StyledText>
                  <StyledText className="text-white/70 text-sm">
                    Submitted {new Date(application.createdAt).toLocaleDateString()}
                  </StyledText>
                </StyledView>
                <StyledView className="items-end">
                  <Badge variant={getStatusColor(application.status)}>
                    <Ionicons 
                      name={getStatusIcon(application.status)} 
                      size={12} 
                      color="currentColor" 
                    />
                    <StyledText className="ml-1">
                      {application.status}
                    </StyledText>
                  </Badge>
                </StyledView>
              </StyledView>
            </LiquidGlassHeader>

            <LiquidGlassContent>
              {/* Business Information */}
              <StyledView className="mb-4">
                <StyledText className="text-white/80 font-medium mb-2">
                  Business Information
                </StyledText>
                <StyledView className="bg-white/10 rounded-xl p-3">
                  <StyledText className="text-white text-sm">
                    <StyledText className="font-medium">Name:</StyledText> {application.businessName}
                  </StyledText>
                  <StyledText className="text-white text-sm mt-1">
                    <StyledText className="font-medium">Type:</StyledText> {application.businessType}
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Description */}
              {application.description && (
                <StyledView className="mb-4">
                  <StyledText className="text-white/80 font-medium mb-2">
                    Description
                  </StyledText>
                  <StyledView className="bg-white/10 rounded-xl p-3">
                    <StyledText className="text-white text-sm">
                      {application.description}
                    </StyledText>
                  </StyledView>
                </StyledView>
              )}

              {/* Documents */}
              {application.documents && application.documents.length > 0 && (
                <StyledView className="mb-4">
                  <StyledText className="text-white/80 font-medium mb-2">
                    Supporting Documents
                  </StyledText>
                  <StyledView className="bg-white/10 rounded-xl p-3">
                    {application.documents.map((doc: string, index: number) => (
                      <StyledView key={index} className="flex-row items-center py-1">
                        <Ionicons name="document" size={16} color="rgba(255,255,255,0.8)" />
                        <StyledText className="text-white text-sm ml-2">
                          Document {index + 1}
                        </StyledText>
                      </StyledView>
                    ))}
                  </StyledView>
                </StyledView>
              )}

              {/* Review Information */}
              {application.reviewedAt && (
                <StyledView className="mb-4">
                  <StyledText className="text-white/80 font-medium mb-2">
                    Review Information
                  </StyledText>
                  <StyledView className="bg-white/10 rounded-xl p-3">
                    <StyledText className="text-white text-sm">
                      <StyledText className="font-medium">Reviewed:</StyledText> {new Date(application.reviewedAt).toLocaleDateString()}
                    </StyledText>
                    {application.reviewNotes && (
                      <StyledText className="text-white text-sm mt-2">
                        <StyledText className="font-medium">Notes:</StyledText> {application.reviewNotes}
                      </StyledText>
                    )}
                  </StyledView>
                </StyledView>
              )}

              {/* Status Information */}
              <StyledView className="bg-white/10 rounded-xl p-3">
                <StyledText className="text-white/80 text-sm mb-2">
                  Application Status
                </StyledText>
                <StyledView className="flex-row items-center">
                  <Ionicons 
                    name={getStatusIcon(application.status)} 
                    size={20} 
                    color="rgba(255,255,255,0.8)" 
                  />
                  <StyledText className="text-white font-medium ml-2">
                    {application.status === 'PENDING' && 'Under Review'}
                    {application.status === 'APPROVED' && 'Approved - Role Updated'}
                    {application.status === 'REJECTED' && 'Application Rejected'}
                  </StyledText>
                </StyledView>
                
                {application.status === 'PENDING' && (
                  <StyledText className="text-white/70 text-sm mt-2">
                    Your application is being reviewed by our team. You'll receive a notification once a decision is made.
                  </StyledText>
                )}
                
                {application.status === 'APPROVED' && (
                  <StyledText className="text-white/70 text-sm mt-2">
                    Congratulations! Your application has been approved and your account role has been updated.
                  </StyledText>
                )}
                
                {application.status === 'REJECTED' && (
                  <StyledText className="text-white/70 text-sm mt-2">
                    Your application was not approved at this time. Please review the feedback and consider reapplying.
                  </StyledText>
                )}
              </StyledView>
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Actions */}
          {application.status === 'REJECTED' && (
            <LiquidGlassCard className="mb-6">
              <LiquidGlassContent>
                <StyledText className="text-white font-medium mb-3 text-center">
                  Want to try again?
                </StyledText>
                <LiquidButton
                  title="Submit New Application"
                  variant="glass"
                  onPress={() => navigation.navigate('Applications')}
                  className="w-full"
                />
              </LiquidGlassContent>
            </LiquidGlassCard>
          )}
        </StyledScrollView>
      </LinearGradient>
    </StyledSafeAreaView>
  );
};