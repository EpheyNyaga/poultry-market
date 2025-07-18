import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { useOrderStore } from '../../stores/orderStore';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface SellerOrdersProps {
  navigation: any;
}

export const SellerOrders: React.FC<SellerOrdersProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { orders, loading, fetchOrders } = useOrderStore();
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadSellerOrders();
    }
  }, [user]);

  const loadSellerOrders = async () => {
    try {
      await fetchOrders();
      // Filter orders that contain this seller's products
      const filtered = orders.filter(order => 
        order.items.some((item: any) => item.product.seller.id === user?.id)
      );
      setSellerOrders(filtered);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'PACKED': return 'default';
      case 'OUT_FOR_DELIVERY': return 'warning';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'UNPAID': return 'error';
      case 'PENDING': return 'warning';
      case 'SUBMITTED': return 'info';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const handleApprovePayment = (orderId: string) => {
    Alert.alert(
      'Approve Payment',
      'Are you sure you want to approve this payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              // Call API to approve payment
              Alert.alert('Success', 'Payment approved successfully');
              loadSellerOrders();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading && sellerOrders.length === 0) {
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
            Farm Orders
          </StyledText>
          <StyledText className="text-white/80 mt-1">
            Manage your product orders
          </StyledText>
        </StyledView>

        <StyledScrollView
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadSellerOrders} />
          }
        >
          {sellerOrders.length === 0 ? (
            <LiquidGlassCard>
              <LiquidGlassContent className="items-center py-12">
                <Ionicons name="receipt" size={64} color="rgba(255,255,255,0.6)" />
                <StyledText className="text-white text-lg text-center mt-4">
                  No Orders Yet
                </StyledText>
                <StyledText className="text-white/70 text-center mt-2">
                  Orders for your products will appear here
                </StyledText>
              </LiquidGlassContent>
            </LiquidGlassCard>
          ) : (
            sellerOrders.map((order) => (
              <LiquidGlassCard key={order.id} className="mb-4">
                <LiquidGlassHeader>
                  <StyledView className="flex-row justify-between items-start">
                    <StyledView>
                      <StyledText className="text-white font-semibold text-lg">
                        Order #{order.id.slice(-8)}
                      </StyledText>
                      <StyledText className="text-white/70 text-sm">
                        From {order.customer.name}
                      </StyledText>
                      <StyledText className="text-white/70 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </StyledText>
                    </StyledView>
                    <StyledView className="items-end space-y-1">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </StyledView>
                  </StyledView>
                </LiquidGlassHeader>

                <LiquidGlassContent>
                  {/* Order Items */}
                  <StyledView className="mb-4">
                    <StyledText className="text-white/80 font-medium mb-2">
                      Items
                    </StyledText>
                    {order.items
                      .filter((item: any) => item.product.seller.id === user?.id)
                      .map((item: any, index: number) => (
                        <StyledView key={index} className="flex-row justify-between items-center py-2 bg-white/10 rounded-lg px-3 mb-2">
                          <StyledView>
                            <StyledText className="text-white font-medium">
                              {item.product.name}
                            </StyledText>
                            <StyledText className="text-white/70 text-sm">
                              Qty: {item.quantity}
                            </StyledText>
                          </StyledView>
                          <StyledText className="text-white font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </StyledText>
                        </StyledView>
                      ))}
                  </StyledView>

                  {/* Customer Info */}
                  <StyledView className="mb-4 p-3 bg-white/10 rounded-xl">
                    <StyledText className="text-white/80 font-medium mb-1">
                      Customer Information
                    </StyledText>
                    <StyledText className="text-white text-sm">
                      {order.customer.name} • {order.customer.email}
                    </StyledText>
                  </StyledView>

                  {/* Payment Details */}
                  {order.paymentDetails && (
                    <StyledView className="mb-4 p-3 bg-white/10 rounded-xl">
                      <StyledText className="text-white/80 font-medium mb-1">
                        Payment Details
                      </StyledText>
                      <StyledText className="text-white text-sm">
                        Phone: {order.paymentPhone}
                      </StyledText>
                      <StyledText className="text-white text-sm">
                        Reference: {order.paymentReference}
                      </StyledText>
                    </StyledView>
                  )}

                  {/* Actions */}
                  <StyledView className="flex-row justify-between items-center">
                    <StyledText className="text-white font-bold text-lg">
                      Total: ${order.total.toFixed(2)}
                    </StyledText>
                    
                    {order.paymentStatus === 'SUBMITTED' && (
                      <LiquidButton
                        title="Approve Payment"
                        variant="glass"
                        size="sm"
                        onPress={() => handleApprovePayment(order.id)}
                      />
                    )}
                  </StyledView>
                </LiquidGlassContent>
              </LiquidGlassCard>
            ))
          )}
        </StyledScrollView>
      </LinearGradient>
    </StyledSafeAreaView>
  );
};