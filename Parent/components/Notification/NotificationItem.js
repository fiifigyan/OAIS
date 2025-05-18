import React, { memo } from 'react';
import { Animated } from 'react-native';
import { 
  View, 
  Text, 
  List, 
  Icon,
  HStack,
  VStack,
  useTheme
} from '@expo/ui/swift-ui';
import { Swipeable } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

const NotificationItem = ({ item, onPress, onDelete }) => {
  const theme = useTheme();
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ 
        transform: [{ scale }],
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 16,
      }}>
        <View 
          backgroundColor="destructive" 
          borderRadius="medium"
          padding="small"
          onPress={() => onDelete(item.id)}
        >
          <Icon name="trash" size={20} color="white" />
        </View>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      <List.Item 
        onPress={() => onPress(item.id)}
        backgroundColor={item.read ? 'background' : 'highlight'}
      >
        <HStack alignItems="center" space="small">
          <Icon 
            name={item.read ? 'email-open' : 'email'} 
            size={20} 
            color={item.read ? 'secondary' : 'primary'} 
          />
          
          <VStack flex={1}>
            <Text 
              fontWeight={item.read ? 'normal' : 'bold'}
              color={item.read ? 'secondary' : 'default'}
            >
              {item.title}
            </Text>
            <Text 
              numberOfLines={2} 
              color={item.read ? 'secondary' : 'default'}
            >
              {item.body}
            </Text>
          </VStack>
          
          <Text color="secondary" fontSize="small">
            {formatTime(item.timestamp)}
          </Text>
        </HStack>
      </List.Item>
    </Swipeable>
  );
};

NotificationItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    read: PropTypes.bool.isRequired,
    timestamp: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default memo(NotificationItem);