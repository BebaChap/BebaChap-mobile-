import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Services: undefined;
  Transport: undefined;
  Garage: undefined;
  SpareParts: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Services'>;

export default function ServicesScreen({ navigation }: Props) {
  
  const services = [
    {
      id: 1,
      title: 'Usafiri wa Haraka',
      desc: 'Boda, Bajaji na Gari kwa bei nafuu',
      icon: 'car-sport',
      color: '#007AFF',
      screen: 'Transport'
    },
    {
      id: 2,
      title: 'Gereji Kamili',
      desc: 'Matengenezo ya Magari na Pikipiki',
      icon: 'construct',
      color: '#FF9500',
      screen: 'Garage'
    },
    {
      id: 3,
      title: 'Spare Parts',
      desc: 'Vipuri Original na Used - Bei Nafuu',
      icon: 'cog',
      color: '#34C759',
      screen: 'SpareParts'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Huduma za BebaChap</Text>
        <Text style={styles.headerSubtitle}>Chagua huduma unayohitaji</Text>
      </View>

      <View style={styles.servicesContainer}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.card}
            onPress={() => navigation.navigate(service.screen as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: service.color }]}>
              <Ionicons name={service.icon as any} size={32} color="#fff" />
            </View>
            
            <View style={styles.textBox}>
              <Text style={styles.cardTitle}>{service.title}</Text>
              <Text style={styles.cardDesc}>{service.desc}</Text>
            </View>
            
            <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Ionicons name="call" size={20} color="#13b499" />
        <Text style={styles.footerText}>Msaada: +255 712 345 678</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#13b499',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  servicesContainer: {
    padding: 20,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textBox: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#13b499',
    fontWeight: '600',
    marginLeft: 8,
  },
});