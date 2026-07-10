import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const Splash = () => {
  const auth = useAuth();
  const checkUser = auth?.checkUser || (() => {});

  useEffect(() => {
    // Splash inakaa 2sec halafu AuthContext inaamua kupeleka wapi
    const timer = setTimeout(() => {
      checkUser();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Weka logo yako hapa: <Image source={require('../../assets/icons/logo.png')} style={styles.logoImg} /> */}
      <Text style={styles.logo}>RideSuperApp</Text>
      <ActivityIndicator size="large" color="#007aff" style={styles.loader} />
      <Text style={styles.text}>Inapakia...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#007aff', marginBottom: 20 },
  logoImg: { width: 120, height: 120, marginBottom: 20 },
  loader: { marginTop: 20 },
  text: { marginTop: 10, color: '#666' },
});

export default Splash;