import { View, Text, StyleSheet } from 'react-native';

export default function NotificationScreen({ route }) {
  const { title, body, data } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Details</Text>
      <Text>Title: {title}</Text>
      <Text>Body: {body}</Text>
      <Text>Data: {JSON.stringify(data)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});