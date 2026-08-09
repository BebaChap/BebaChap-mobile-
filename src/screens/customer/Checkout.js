import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function Checkout({ navigation, route }) {
  const { cartItems = [], total = 0, restaurant, serviceType = 'restaurant' } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedNetwork, setSelectedNetwork] = useState('M-Pesa');
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  // MPYA - Namba na Jina
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [address] = useState('Tabata, Dar es Salaam');

  const networks = [
    { id: 'mpesa', name: 'M-Pesa', color: '#ED1C24', icon: 'M', prefix: '74,75,76' },
    { id: 'tigopesa', name: 'Tigo Pesa', color: '#0026FF', icon: 'T', prefix: '71,65,67' },
    { id: 'airtel', name: 'Airtel Money', color: '#FF0000', icon: 'A', prefix: '68,69,78' },
    { id: 'halopesa', name: 'HaloPesa', color: '#FF8C00', icon: 'H', prefix: '62' },
    { id: 'azampesa', name: 'AzamPesa', color: '#8B0000', icon: 'A', prefix: '41' },
  ];

  // Auto-detect jina baada ya kuandika namba 10
  useEffect(() => {
    if (phoneNumber.length >= 10 && paymentMethod === 'mobile') {
      setIsVerifying(true);
      // HAPA UTAWEKA API YA KUTHIBITISHA JINA - KWA SASA TUNA SIMULATE
      const timer = setTimeout(() => {
        // Simulate fetching name from network
        if (phoneNumber.startsWith('0')) {
          setAccountName('JUMA MKAPA'); // Hapa utaweka response ya API
        }
        setIsVerifying(false);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setAccountName('');
    }
  }, [phoneNumber]);

  const deliveryFee = restaurant?.deliveryFee === 'Free'? 0 : 3000;
  const grandTotal = total + deliveryFee;

  const getPaymentLabel = () => {
    if (paymentMethod === 'cash') return 'Cash';
    if (paymentMethod === 'wallet') return 'Pochi';
    return selectedNetwork;
  };

  const handlePlaceOrder = () => {
    // VALIDATION MPYA
    if (paymentMethod === 'mobile') {
      if (phoneNumber.length < 10) {
        Alert.alert("Kosa", "Weka namba sahihi ya simu (mf: 0712345678)");
        return;
      }
      if (!accountName) {
        Alert.alert("Kosa", "Subiri jina lithibitishwe kwanza");
        return;
      }
    }

    // DATA ITakayokwenda Backend - Imeunganishwa kwa huduma zote
    const orderPayload = {
      serviceType, // 'usafiri', 'duka', 'gereji', 'restaurant'
      restaurant,
      items: cartItems,
      total,
      deliveryFee,
      grandTotal,
      address,
      deliveryNotes,
      payment: {
        method: paymentMethod,
        network: paymentMethod === 'mobile'? selectedNetwork : null,
        phoneNumber: paymentMethod === 'mobile'? phoneNumber : null,
        accountName: paymentMethod === 'mobile'? accountName : null,
      },
      timestamp: new Date().toISOString()
    };

    console.log('ORDER PAYLOAD:', orderPayload);

    Alert.alert(
      "Thibitisha Oda",
      `Unalipa TZS ${grandTotal.toLocaleString()} kwa ${getPaymentLabel()}\n${paymentMethod === 'mobile'? `Namba: ${phoneNumber}\nJina: ${accountName}` : ''}`,
      [
        { text: "Ghairi", style: "cancel" },
        {
          text: "Lipa Sasa",
          onPress: () => {
            Alert.alert("Hongera! 🎉", `Oda yako imepokelewa.\nMalipo kwa ${getPaymentLabel()} - ${accountName || ''}`, [
              { text: "Sawa", onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }) }
            ]);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('payment')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t('delivery_address')}</Text>
          </View>
          <Text style={styles.addressText}>📍 {address}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('order_summary')}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Jumla ya Chakula</Text>
            <Text style={styles.value}>TZS {total.toLocaleString() || '12,000'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('delivery_fee')}</Text>
            <Text style={[styles.value, { color: deliveryFee === 0? '#22c55e' : '#000' }]}>{deliveryFee === 0? 'FREE' : `TZS ${deliveryFee.toLocaleString()}`}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>{t('total')}</Text>
            <Text style={styles.totalValue}>TZS {grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('payment_method')}</Text>

          <TouchableOpacity style={[styles.payOption, paymentMethod === 'cash' && styles.payActive]} onPress={() => { setPaymentMethod('cash'); setShowNetworkDropdown(false); }}>
            <Ionicons name="cash-outline" size={22} color={paymentMethod === 'cash'? COLORS.primary : '#999'} />
            <Text style={styles.payText}>{t('pay_cash_driver')}</Text>
            {paymentMethod === 'cash' && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.payOption, paymentMethod === 'mobile' && styles.payActive]} onPress={() => { setPaymentMethod('mobile'); setShowNetworkDropdown(!showNetworkDropdown); }}>
            <View style={[styles.networkBadge, { backgroundColor: networks.find(n => n.name === selectedNetwork)?.color }]}>
              <Text style={styles.badgeText}>{networks.find(n => n.name === selectedNetwork)?.icon}</Text>
            </View>
            <Text style={styles.payText}>Mitandao - {selectedNetwork}</Text>
            <Ionicons name={showNetworkDropdown? "chevron-up" : "chevron-down"} size={20} color="#999" />
          </TouchableOpacity>

          {showNetworkDropdown && (
            <View style={styles.dropdown}>
              {networks.map((net) => (
                <TouchableOpacity key={net.id} style={[styles.dropdownItem, selectedNetwork === net.name && styles.dropdownActive]} onPress={() => setSelectedNetwork(net.name)}>
                  <View style={[styles.networkBadge, { backgroundColor: net.color }]}><Text style={styles.badgeText}>{net.icon}</Text></View>
                  <View style={{flex:1}}><Text style={styles.dropdownText}>{net.name}</Text><Text style={styles.prefixText}>{net.prefix}</Text></View>
                  {selectedNetwork === net.name && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* INPUT MPYA - INATOKA BAADA YA KUCHAGUA MTANDAO */}
          {paymentMethod === 'mobile' && (
            <View style={styles.mobileInputs}>
              <Text style={styles.inputLabel}>Namba ya {selectedNetwork}</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.prefix}>+255</Text>
                <TextInput
                  placeholder="712 345 678"
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={(t) => setPhoneNumber(t.replace(/[^0-9]/g, ''))}
                  maxLength={10}
                />
                {isVerifying && <Ionicons name="hourglass-outline" size={18} color={COLORS.primary} />}
              </View>

              <Text style={styles.inputLabel}>Jina linalotokea</Text>
              <View style={[styles.nameBox, accountName && styles.nameBoxSuccess]}>
                <Ionicons name={accountName? "person" : "person-outline"} size={18} color={accountName? "#22c55e" : "#999"} />
                <Text style={[styles.nameText,!accountName && {color:'#999'}]}>
                  {isVerifying? "Inathibitisha..." : accountName || "Jina litaonekana hapa baada ya kuweka namba"}
                </Text>
                {accountName && <Ionicons name="checkmark-circle" size={18} color="#22c55e" />}
              </View>
              <Text style={styles.hintText}>Hakikisha jina linalotokea ni sahihi kabla ya kulipa</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.payOption, paymentMethod === 'wallet' && styles.payActive]} onPress={() => { setPaymentMethod('wallet'); setShowNetworkDropdown(false); }}>
            <Ionicons name="wallet-outline" size={22} color={paymentMethod === 'wallet'? COLORS.primary : '#999'} />
            <Text style={styles.payText}>{t('wallet')}</Text>
            {paymentMethod === 'wallet' && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Maelekezo (Si lazima)</Text>
          <TextInput placeholder="Mf: Piga simu ukifika..." style={styles.input} value={deliveryNotes} onChangeText={setDeliveryNotes} multiline />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.orderBtn, paymentMethod === 'mobile' &&!accountName && { backgroundColor: '#ccc' }]}
          onPress={handlePlaceOrder}
          disabled={paymentMethod === 'mobile' &&!accountName && phoneNumber.length > 0}
        >
          <Text style={styles.orderBtnText}>
            Thibitisha Oda • TZS {grandTotal.toLocaleString()} {paymentMethod === 'mobile' && accountName? `- ${accountName}` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#fff' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f2f2f7', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { flex: 1, padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { flex: 1, fontWeight: '700', fontSize: 15 },
  addressText: { fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  label: { color: '#777' },
  value: { fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginTop: 15 },
  totalLabel: { fontWeight: '800', fontSize: 16 },
  totalValue: { fontWeight: '800', fontSize: 16, color: COLORS.primary },
  payOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1.5, borderColor: '#eee', borderRadius: 14, marginTop: 10 },
  payActive: { borderColor: COLORS.primary, backgroundColor: '#f0f7ff' },
  payText: { flex: 1, fontWeight: '600' },
  networkBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  dropdown: { backgroundColor: '#f9f9fb', borderRadius: 14, marginTop: 10, padding: 6, borderWidth: 1, borderColor: '#eee' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10 },
  dropdownActive: { backgroundColor: '#eef5ff' },
  dropdownText: { fontWeight: '600', fontSize: 14 },
  prefixText: { fontSize: 11, color: '#888' },
  mobileInputs: { marginTop: 12, backgroundColor: '#f8faff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#dbeafe' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#444', marginTop: 10, marginBottom: 6 },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#ddd', paddingHorizontal: 12, height: 50 },
  prefix: { fontWeight: '700', marginRight: 8, color: '#333' },
  phoneInput: { flex: 1, fontSize: 16, fontWeight: '600' },
  nameBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#ddd', padding: 14, minHeight: 50 },
  nameBoxSuccess: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  nameText: { flex: 1, fontWeight: '700', fontSize: 14 },
  hintText: { fontSize: 11, color: '#888', marginTop: 6, fontStyle: 'italic' },
  input: { backgroundColor: '#f2f2f7', borderRadius: 12, padding: 12, marginTop: 10, minHeight: 70, textAlignVertical: 'top' },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 15, paddingBottom: 30, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 20 },
  orderBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 16, alignItems: 'center' },
  orderBtnText: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
});