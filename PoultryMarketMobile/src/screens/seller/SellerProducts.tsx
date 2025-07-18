import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { useProductStore } from '../../stores/productStore';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface SellerProductsProps {
  navigation: any;
}

export const SellerProducts: React.FC<SellerProductsProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { products, loading, fetchProducts } = useProductStore();
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadSellerProducts();
    }
  }, [user]);

  const loadSellerProducts = async () => {
    try {
      await fetchProducts();
      // Filter products for this seller
      const filtered = products.filter(product => product.seller.id === user?.id);
      setSellerProducts(filtered);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EGGS': return 'warning';
      case 'CHICKEN_MEAT': return 'error';
      default: return 'default';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: 'error', text: 'Out of Stock' };
    if (stock < 10) return { variant: 'warning', text: 'Low Stock' };
    return { variant: 'success', text: 'In Stock' };
  };

  if (loading && sellerProducts.length === 0) {
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
              Farm Products
            </StyledText>
            <StyledText className="text-white/80 mt-1">
              Manage your eggs & meat
            </StyledText>
          </StyledView>
          <LiquidButton
            title=""
            variant="glass"
            size="sm"
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Ionicons name="add" size={20} color="white" />
          </LiquidButton>
        </StyledView>

        <StyledScrollView
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadSellerProducts} />
          }
        >
          {sellerProducts.length === 0 ? (
            <LiquidGlassCard>
              <LiquidGlassContent className="items-center py-12">
                <Ionicons name="cube" size={64} color="rgba(255,255,255,0.6)" />
                <StyledText className="text-white text-lg text-center mt-4">
                  No Products Yet
                </StyledText>
                <StyledText className="text-white/70 text-center mt-2">
                  Start by adding your first farm product
                </StyledText>
                <LiquidButton
                  title="Add Product"
                  variant="glass"
                  onPress={() => navigation.navigate('AddProduct')}
                  className="mt-4"
                />
              </LiquidGlassContent>
            </LiquidGlassCard>
          ) : (
            <StyledView className="space-y-4">
              {sellerProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <LiquidGlassCard key={product.id}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                    >
                      <LiquidGlassContent>
                        <StyledView className="flex-row justify-between items-start mb-3">
                          <StyledView className="flex-1">
                            <StyledText className="text-white text-lg font-semibold">
                              {product.name}
                            </StyledText>
                            <StyledText className="text-white/70 text-sm mt-1">
                              {product.description}
                            </StyledText>
                          </StyledView>
                          <Badge variant={getTypeColor(product.type)} size="sm">
                            {product.type.replace('_', ' ')}
                          </Badge>
                        </StyledView>

                        <StyledView className="flex-row justify-between items-center mb-3">
                          <StyledText className="text-white text-2xl font-bold">
                            ${product.price.toFixed(2)}
                          </StyledText>
                          <Badge variant={stockStatus.variant} size="sm">
                            {stockStatus.text}
                          </Badge>
                        </StyledView>

                        <StyledView className="flex-row justify-between items-center">
                          <StyledText className="text-white/80 text-sm">
                            Stock: {product.stock} units
                          </StyledText>
                          <StyledView className="flex-row space-x-2">
                            <LiquidButton
                              title="Edit"
                              variant="outline"
                              size="sm"
                              onPress={() => navigation.navigate('EditProduct', { productId: product.id })}
                            />
                            <TouchableOpacity className="p-2">
                              <Ionicons name="ellipsis-vertical" size={16} color="rgba(255,255,255,0.8)" />
                            </TouchableOpacity>
                          </StyledView>
                        </StyledView>
                      </LiquidGlassContent>
                    </TouchableOpacity>
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