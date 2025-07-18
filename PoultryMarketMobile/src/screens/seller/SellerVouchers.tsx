import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { useVoucherStore } from '../../stores/voucherStore';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface SellerVouchersProps {
  navigation: any;
}

export const SellerVouchers: React.FC<SellerVouchersProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { vouchers, loading, fetchVouchers, deleteVoucher } = useVoucherStore();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDeleteVoucher = (voucherId: string) => {
    Alert.alert(
      'Delete Voucher',
      'Are you sure you want to delete this voucher?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVoucher(voucherId);
              Alert.alert('Success', 'Voucher deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const getVoucherStatus = (voucher: any) => {
    const now = new Date();
    const validUntil = new Date(voucher.validUntil);
    const isExpired = now > validUntil;
    const isMaxedOut = voucher.usedCount >= voucher.maxUses;

    if (!voucher.isActive) return { variant: 'default', text: 'Inactive' };
    if (isExpired) return { variant: 'error', text: 'Expired' };
    if (isMaxedOut) return { variant: 'warning', text: 'Max Uses Reached' };
    return { variant: 'success', text: 'Active' };
  };

  if (loading && vouchers.length === 0) {
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
              Farm Discounts
            </StyledText>
            <StyledText className="text-white/80 mt-1">
              Manage promotional codes
            </StyledText>
          </StyledView>
          <LiquidButton
            title=""
            variant="glass"
            size="sm"
            onPress={() => navigation.navigate('CreateVoucher')}
          >
            <Ionicons name="add" size={20} color="white" />
          </LiquidButton>
        </StyledView>

        <StyledScrollView
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchVouchers} />
          }
        >
          {vouchers.length === 0 ? (
            <LiquidGlassCard>
              <LiquidGlassContent className="items-center py-12">
                <Ionicons name="ticket" size={64} color="rgba(255,255,255,0.6)" />
                <StyledText className="text-white text-lg text-center mt-4">
                  No Discount Codes
                </StyledText>
                <StyledText className="text-white/70 text-center mt-2">
                  Create your first promotional voucher
                </StyledText>
                <LiquidButton
                  title="Create Voucher"
                  variant="glass"
                  onPress={() => navigation.navigate('CreateVoucher')}
                  className="mt-4"
                />
              </LiquidGlassContent>
            </LiquidGlassCard>
          ) : (
            <StyledView className="space-y-4">
              {vouchers.map((voucher) => {
                const status = getVoucherStatus(voucher);
                return (
                  <LiquidGlassCard key={voucher.id}>
                    <LiquidGlassHeader>
                      <StyledView className="flex-row justify-between items-start">
                        <StyledView>
                          <StyledText className="text-white text-lg font-bold">
                            {voucher.code}
                          </StyledText>
                          <StyledText className="text-white/70 text-sm">
                            {voucher.type === 'percentage' ? `${voucher.discount}% off` : `$${voucher.discount} off`}
                          </StyledText>
                        </StyledView>
                        <Badge variant={status.variant}>
                          {status.text}
                        </Badge>
                      </StyledView>
                    </LiquidGlassHeader>

                    <LiquidGlassContent>
                      <StyledView className="flex-row justify-between items-center mb-3">
                        <StyledView>
                          <StyledText className="text-white/80 text-sm">
                            Usage
                          </StyledText>
                          <StyledText className="text-white font-medium">
                            {voucher.usedCount} / {voucher.maxUses}
                          </StyledText>
                        </StyledView>
                        <StyledView className="items-end">
                          <StyledText className="text-white/80 text-sm">
                            Valid Until
                          </StyledText>
                          <StyledText className="text-white font-medium">
                            {new Date(voucher.validUntil).toLocaleDateString()}
                          </StyledText>
                        </StyledView>
                      </StyledView>

                      <StyledView className="flex-row space-x-2">
                        <LiquidButton
                          title="Edit"
                          variant="outline"
                          size="sm"
                          onPress={() => navigation.navigate('EditVoucher', { voucherId: voucher.id })}
                          className="flex-1"
                        />
                        <LiquidButton
                          title="Delete"
                          variant="outline"
                          size="sm"
                          onPress={() => handleDeleteVoucher(voucher.id)}
                          className="flex-1"
                        />
                      </StyledView>
                    </LiquidGlassContent>
                  </LiquidGlassCard>
                );
              })}
            </StyledView>
          )}
        </StyledScrollView>
      </LinearGradient>
    </StyledSafeAreaView>
  );
};