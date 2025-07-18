import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Share, Alert } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../stores/authStore';
import { LiquidGlassCard, LiquidGlassContent, LiquidGlassHeader } from '../../components/ui/LiquidGlassCard';
import { LiquidButton } from '../../components/ui/LiquidButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

interface CompanyQRCodeProps {
  navigation: any;
}

export const CompanyQRCode: React.FC<CompanyQRCodeProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      // In a real app, you'd call an API to generate the QR code
      // For now, we'll simulate it
      const storeUrl = `https://poultrymarket.com/store/${user?.dashboardSlug}`;
      
      // Simulate QR code generation
      setTimeout(() => {
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(storeUrl)}`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const storeUrl = `https://poultrymarket.com/store/${user?.dashboardSlug}`;
      await Share.share({
        message: `Check out ${user?.name} on PoultryMarket! ${storeUrl}`,
        url: storeUrl,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const copyToClipboard = async () => {
    const storeUrl = `https://poultrymarket.com/store/${user?.dashboardSlug}`;
    // In React Native, you'd use Clipboard API
    Alert.alert('Copied!', 'Store URL copied to clipboard');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <StyledSafeAreaView className="flex-1">
      <LinearGradient
        colors={['#1e40af', '#1d4ed8', '#1e3a8a']}
        className="flex-1"
      >
        {/* Header */}
        <StyledView className="px-4 py-6">
          <StyledText className="text-white text-2xl font-bold">
            QR Code
          </StyledText>
          <StyledText className="text-white/80 mt-1">
            Share your company store
          </StyledText>
        </StyledView>

        <StyledScrollView className="flex-1 px-4">
          {/* QR Code Display */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledText className="text-white text-lg font-semibold text-center">
                Company Store QR Code
              </StyledText>
            </LiquidGlassHeader>
            <LiquidGlassContent className="items-center">
              {qrCodeUrl ? (
                <StyledView className="items-center">
                  <StyledView className="bg-white p-4 rounded-2xl mb-4">
                    <img
                      source={{ uri: qrCodeUrl }}
                      style={{ width: 250, height: 250 }}
                      resizeMode="contain"
                    />
                  </StyledView>
                  <StyledText className="text-white/80 text-center text-sm">
                    Scan this QR code to visit your company store
                  </StyledText>
                </StyledView>
              ) : (
                <StyledView className="items-center py-8">
                  <Ionicons name="qr-code" size={64} color="rgba(255,255,255,0.6)" />
                  <StyledText className="text-white/70 text-center mt-2">
                    Failed to generate QR code
                  </StyledText>
                  <LiquidButton
                    title="Retry"
                    variant="glass"
                    onPress={generateQRCode}
                    className="mt-4"
                  />
                </StyledView>
              )}
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Store Information */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledText className="text-white text-lg font-semibold">
                Store Information
              </StyledText>
            </LiquidGlassHeader>
            <LiquidGlassContent>
              <StyledView className="space-y-3">
                <StyledView className="flex-row items-center">
                  <Ionicons name="storefront" size={20} color="rgba(255,255,255,0.8)" />
                  <StyledText className="text-white ml-3">
                    {user?.name}
                  </StyledText>
                </StyledView>
                
                <StyledView className="flex-row items-center">
                  <Ionicons name="link" size={20} color="rgba(255,255,255,0.8)" />
                  <StyledText className="text-white ml-3 flex-1">
                    /store/{user?.dashboardSlug}
                  </StyledText>
                </StyledView>
                
                <StyledView className="flex-row items-center">
                  <Ionicons name="business" size={20} color="rgba(255,255,255,0.8)" />
                  <StyledText className="text-white ml-3">
                    Company Store
                  </StyledText>
                </StyledView>
              </StyledView>
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Actions */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassContent>
              <StyledView className="space-y-3">
                <LiquidButton
                  title="Share Store"
                  variant="glass"
                  onPress={handleShare}
                  className="w-full"
                >
                  <Ionicons name="share" size={20} color="white" />
                </LiquidButton>
                
                <LiquidButton
                  title="Copy Store URL"
                  variant="outline"
                  onPress={copyToClipboard}
                  className="w-full"
                >
                  <Ionicons name="copy" size={20} color="white" />
                </LiquidButton>
                
                <LiquidButton
                  title="View Store"
                  variant="outline"
                  onPress={() => navigation.navigate('Store', { slug: user?.dashboardSlug })}
                  className="w-full"
                >
                  <Ionicons name="eye" size={20} color="white" />
                </LiquidButton>
              </StyledView>
            </LiquidGlassContent>
          </LiquidGlassCard>

          {/* Usage Tips */}
          <LiquidGlassCard className="mb-6">
            <LiquidGlassHeader>
              <StyledText className="text-white text-lg font-semibold">
                How to Use
              </StyledText>
            </LiquidGlassHeader>
            <LiquidGlassContent>
              <StyledView className="space-y-3">
                <StyledView className="flex-row items-start">
                  <StyledView className="w-6 h-6 bg-white/20 rounded-full items-center justify-center mr-3 mt-0.5">
                    <StyledText className="text-white text-xs font-bold">1</StyledText>
                  </StyledView>
                  <StyledText className="text-white/80 text-sm flex-1">
                    Print or display this QR code at your physical location
                  </StyledText>
                </StyledView>
                
                <StyledView className="flex-row items-start">
                  <StyledView className="w-6 h-6 bg-white/20 rounded-full items-center justify-center mr-3 mt-0.5">
                    <StyledText className="text-white text-xs font-bold">2</StyledText>
                  </StyledView>
                  <StyledText className="text-white/80 text-sm flex-1">
                    Customers can scan to visit your online store
                  </StyledText>
                </StyledView>
                
                <StyledView className="flex-row items-start">
                  <StyledView className="w-6 h-6 bg-white/20 rounded-full items-center justify-center mr-3 mt-0.5">
                    <StyledText className="text-white text-xs font-bold">3</StyledText>
                  </StyledView>
                  <StyledText className="text-white/80 text-sm flex-1">
                    Share on social media or business cards
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