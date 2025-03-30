import { Dimensions, StyleSheet, View, Image } from 'react-native';
import React, { useCallback } from 'react';
import Carousel from 'react-native-reanimated-carousel';

export default function AppCarousel() {
    const width = Dimensions.get('window').width;
    
    const list = [
        {
            id: '1',
            title: 'First Item',
            color: '#26292E',
            img: require('../assets/images/Altos-Odyssey.jpeg')
        },
        {
            id: '2',
            title: 'Second Item',
            color: '#899F9C',
            img: require('../assets/images/event-updates.png')
        },
        {
            id: '3',
            title: 'Third Item',
            color: '#B3C680',
            img: require('../assets/images/asphalt-9.jpeg')
        },
        {
            id: '4',
            title: 'Fourth Item',
            color: '#5C6265',
            img: require('../assets/images/battlefield-2042.webp')
        },
        {
            id: '5',
            title: 'Fifth Item',
            color: '#F5D399',
            img: require('../assets/images/genshin-impact.jpeg')
        }
    ];

    const renderItem = useCallback(({ item }) => (
        <View style={styles.carouselItem}>
            <Image 
                source={item.img} 
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    ), []);
    
    return (
        <View style={styles.container}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                data={list}
                autoPlay={true}
                pagingEnabled={true}
                autoPlayInterval={3000}
                scrollAnimationDuration={5000}
                renderItem={renderItem}  
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselItem: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});