import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { apiService } from '../../services/api';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface SellerAnalyticsProps {
  navigation: any;
}

export const SellerAnalytics: React.FC<SellerAnalyticsProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnalytics({ period });
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { label: '7 Days', value: '7' },
    { label: '30 Days', value: '30' },
    { label: '90 Days', value: '90' },
    { label: '1 Year', value: '365' },
  ];

  if (loading && !analytics) {
    return <LoadingSpinner />;
  }

  return (
    <StyledSafeAreaView className="flex-1">
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        className="flex-1"
      >
        {/* Header */}
        <StyledView className="px-4 py-6">
          <StyledText className="text-white text-2xl font-bold">
            Farm Analytics
          </StyledText>
          <StyledText className="text-white/80 mt-1">
            Track your farm performance
          </StyledText>
        </StyledView>

        <StyledScrollView
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchAnalytics} />
          }
        >
          {/* Period Selector */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassContent>
              <StyledText className="text-white font-medium mb-3">
                Time Period
              </StyledText>
              <StyledView className="flex-row flex-wrap gap-2">
                {periodOptions.map((option) => (
                  <StyledView
                    key={option.value}
                    className={`px-4 py-2 rounded-full ${
                      period === option.value ? 'bg-white/30' : 'bg-white/10'
                    }`}
                    onTouchEnd={() => setPeriod(option.value)}
                  >
                    <StyledText className="text-white text-sm">
                      {option.label}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Key Metrics */}
          <StyledView className="mb-6">
            <StyledView className="flex-row space-x-4 mb-4">
              <LiquidGlassCard className="flex-1">
                <LiquidGlassContent className="items-center py-4">
                  <Ionicons name="trending-up" size={32} color="rgba(255,255,255,0.8)" />
                  <StyledText className="text-white text-2xl font-bold mt-2">
                    ${analytics?.totalSales?.toFixed(2) || '0.00'}
                  </StyledText>
                  <StyledText className="text-white/70 text-sm">
                    Total Sales
                  </StyledText>
                </LiquidGlassContent>
              </LiquidGlassCard>

              <LiquidGlassCard className="flex-1">
                <LiquidGlassContent className="items-center py-4">
                  <Ionicons name="receipt" size={32} color="rgba(255,255,255,0.8)" />
                  <StyledText className="text-white text-2xl font-bold mt-2">
                    {analytics?.orderCount || 0}
                  </StyledText>
                  <StyledText className="text-white/70 text-sm">
                    Orders
                  </StyledText>
                </LiquidGlassContent>
              </LiquidGlassCard>
            </StyledView>

            <StyledView className="flex-row space-x-4">
              <LiquidGlassCard className="flex-1">
                <LiquidGlassContent className="items-center py-4">
                  <Ionicons name="cube" size={32} color="rgba(255,255,255,0.8)" />
                  <StyledText className="text-white text-2xl font-bold mt-2">
                    {analytics?.productCount || 0}
                  </StyledText>
                  <StyledText className="text-white/70 text-sm">
                    Products
                  </StyledText>
                </LiquidGlassContent>
              </LiquidGlassCard>

              <LiquidGlassCard className="flex-1">
                <LiquidGlassContent className="items-center py-4">
                  <Ionicons name="star" size={32} color="rgba(255,255,255,0.8)" />
                  <StyledText className="text-white text-2xl font-bold mt-2">
                    4.8
                  </StyledText>
                  <StyledText className="text-white/70 text-sm">
                    Rating
                  </StyledText>
                </LiquidGlassContent>
              </LiquidGlassCard>
            </StyledView>
          </StyledView>

          {/* Top Products */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledText className="text-white text-lg font-semibold">
                Best Selling Products
              </StyledText>
            </LiquidGlassHeader>
            <LiquidGlassContent>
              {analytics?.topProducts?.length > 0 ? (
                analytics.topProducts.map((product: any, index: number) => (
                  <StyledView key={index} className="flex-row justify-between items-center py-3 border-b border-white/10 last:border-b-0">
                    <StyledView>
                      <StyledText className="text-white font-medium">
                        {product.name}
                      </StyledText>
                      <StyledText className="text-white/70 text-sm">
                        ${product.price?.toFixed(2)} each
                      </StyledText>
                    </StyledView>
                    <StyledView className="items-end">
                      <StyledText className="text-white font-bold">
                        {product.totalSold} sold
                      </StyledText>
                      <StyledText className="text-white/70 text-sm">
                        ${((product.price || 0) * (product.totalSold || 0)).toFixed(2)}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                ))
              ) : (
                <StyledView className="items-center py-8">
                  <Ionicons name="bar-chart" size={48} color="rgba(255,255,255,0.6)" />
                  <StyledText className="text-white/70 text-center mt-2">
                    No sales data available
                  </StyledText>
                </StyledView>
              )}
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Farm Performance */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledText className="text-white text-lg font-semibold">
                Farm Performance
              </StyledText>
            </LiquidGlassHeader>
            <LiquidGlassContent>
              <StyledView className="flex-row justify-between items-center mb-4">
                <StyledView>
                  <StyledText className="text-white/80 text-sm">
                    Fulfillment Rate
                  </StyledText>
                  <StyledText className="text-white text-lg font-bold">
                    {analytics?.fulfillmentRate || 95}%
                  </StyledText>
                </StyledView>
                <StyledView className="items-end">
                  <StyledText className="text-white/80 text-sm">
                    Average Order Value
                  </StyledText>
                  <StyledText className="text-white text-lg font-bold">
                    ${((analytics?.totalSales || 0) / Math.max(analytics?.orderCount || 1, 1)).toFixed(2)}
                  </StyledText>
                </StyledView>
              </StyledView>

              <StyledView className="bg-white/10 rounded-xl p-3">
                <StyledText className="text-white/80 text-sm mb-2">
                  Growth Insights
                </StyledText>
                <StyledView className="flex-row items-center">
                  <Ionicons name="trending-up" size={16} color="#10b981" />
                  <StyledText className="text-white text-sm ml-2">
                    +12% increase in sales this period
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row items-center mt-1">
                  <Ionicons name="people" size={16} color="#3b82f6" />
                  <StyledText className="text-white text-sm ml-2">
                    +5% new customers this month
                  </StyledText>
                </StyledView>
              </StyledView>
            </LiquidGlassContent>
          </LiquidGlassCard>
        </StyledScrollView>
      </LinearGradient>
    </StyledSafeAreaView>
  );
};