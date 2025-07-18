import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { apiService } from '../../services/api';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface SellerSponsorshipsProps {
  navigation: any;
}

export const SellerSponsorships: React.FC<SellerSponsorshipsProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSponsorships();
      setSponsorships(response.sponsorships || []);
    } catch (error) {
      console.error('Failed to fetch sponsorships:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'ACTIVE': return 'info';
      case 'EXPIRED': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return 'time';
      case 'APPROVED': return 'checkmark-circle';
      case 'REJECTED': return 'close-circle';
      case 'ACTIVE': return 'checkmark-done-circle';
      case 'EXPIRED': return 'time-outline';
      default: return 'ellipse';
    }
  };

  if (loading && sponsorships.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <StyledSafeAreaView className="flex-1">
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        className="flex-1"
      >
        {/* Header */}
        <StyledView className="flex-row items-center justify-between px-4 py-6">
          <StyledView>
            <StyledText className="text-white text-2xl font-bold">
              Sponsorships
            </StyledText>
            <StyledText className="text-white/80 mt-1">
              Partner with companies
            </StyledText>
          </StyledView>
          <LiquidButton
            title=""
            variant="glass"
            size="sm"
            onPress={() => navigation.navigate('ApplySponsorship')}
          >
            <Ionicons name="add" size={20} color="white" />
          </LiquidButton>
        </StyledView>

        <StyledScrollView
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchSponsorships} />
          }
        >
          {sponsorships.length === 0 ? (
            <LiquidGlassCard>
              <LiquidGlassContent className="items-center py-12">
                <Ionicons name="heart" size={64} color="rgba(255,255,255,0.6)" />
                <StyledText className="text-white text-lg text-center mt-4">
                  No Sponsorships Yet
                </StyledText>
                <StyledText className="text-white/70 text-center mt-2">
                  Apply for sponsorships from companies
                </StyledText>
                <LiquidButton
                  title="Apply for Sponsorship"
                  variant="glass"
                  onPress={() => navigation.navigate('ApplySponsorship')}
                  className="mt-4"
                />
              </LiquidGlassContent>
            </LiquidGlassCard>
          ) : (
            sponsorships.map((sponsorship) => {
              const StatusIcon = getStatusIcon(sponsorship.status);
              return (
                <LiquidGlassCard key={sponsorship.id} className="mb-4">
                  <LiquidGlassHeader>
                    <StyledView className="flex-row justify-between items-start">
                      <StyledView>
                        <StyledText className="text-white font-semibold text-lg">
                          {sponsorship.company.name}
                        </StyledText>
                        <StyledText className="text-white/70 text-sm">
                          ${sponsorship.amount.toFixed(2)} sponsorship
                        </StyledText>
                        <StyledText className="text-white/70 text-sm">
                          Applied {new Date(sponsorship.createdAt).toLocaleDateString()}
                        </StyledText>
                      </StyledView>
                      <StyledView className="items-end">
                        <Badge variant={getStatusColor(sponsorship.status)}>
                          <StatusIcon size={12} color="currentColor" />
                          <StyledText className="ml-1">
                            {sponsorship.status}
                          </StyledText>
                        </Badge>
                      </StyledView>
                    </StyledView>
                  </LiquidGlassHeader>

                  <LiquidGlassContent>
                    {/* Description */}
                    <StyledView className="mb-4">
                      <StyledText className="text-white/80 font-medium mb-1">
                        Description
                      </StyledText>
                      <StyledText className="text-white text-sm">
                        {sponsorship.description}
                      </StyledText>
                    </StyledView>

                    {/* Terms */}
                    {sponsorship.terms && (
                      <StyledView className="mb-4">
                        <StyledText className="text-white/80 font-medium mb-1">
                          Terms
                        </StyledText>
                        <StyledText className="text-white text-sm">
                          {sponsorship.terms}
                        </StyledText>
                      </StyledView>
                    )}

                    {/* Duration */}
                    {sponsorship.duration && (
                      <StyledView className="mb-4">
                        <StyledText className="text-white/80 font-medium mb-1">
                          Duration
                        </StyledText>
                        <StyledText className="text-white text-sm">
                          {sponsorship.duration} months
                        </StyledText>
                      </StyledView>
                    )}

                    {/* Benefits */}
                    {sponsorship.benefits && sponsorship.benefits.length > 0 && (
                      <StyledView className="mb-4">
                        <StyledText className="text-white/80 font-medium mb-1">
                          Benefits
                        </StyledText>
                        {sponsorship.benefits.map((benefit: string, index: number) => (
                          <StyledView key={index} className="flex-row items-center py-1">
                            <Ionicons name="checkmark" size={16} color="rgba(255,255,255,0.8)" />
                            <StyledText className="text-white text-sm ml-2">
                              {benefit}
                            </StyledText>
                          </StyledView>
                        ))}
                      </StyledView>
                    )}

                    {/* Status Information */}
                    <StyledView className="bg-white/10 rounded-xl p-3">
                      <StyledView className="flex-row items-center">
                        <StatusIcon size={20} color="rgba(255,255,255,0.8)" />
                        <StyledText className="text-white font-medium ml-2">
                          {sponsorship.status === 'PENDING' && 'Under Review'}
                          {sponsorship.status === 'APPROVED' && 'Approved - Awaiting Activation'}
                          {sponsorship.status === 'ACTIVE' && 'Active Partnership'}
                          {sponsorship.status === 'REJECTED' && 'Application Rejected'}
                          {sponsorship.status === 'EXPIRED' && 'Partnership Expired'}
                        </StyledText>
                      </StyledView>
                      
                      {sponsorship.status === 'ACTIVE' && sponsorship.endDate && (
                        <StyledText className="text-white/70 text-sm mt-2">
                          Expires: {new Date(sponsorship.endDate).toLocaleDateString()}
                        </StyledText>
                      )}
                    </StyledView>
                  </LiquidGlassContent>
                </LiquidGlassCard>
              );
            })
          )}
        </StyledScrollView>
      </LinearGradient>
    </StyledSafeAreaView>
  );
};