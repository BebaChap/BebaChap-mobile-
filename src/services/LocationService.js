import * as location from 'expo-location';

export const requestlocationpermission = async () => {
  const { status } = await location.requestforegroundpermissionsasync();
  if (status!== 'granted') {
    throw new error('ruhusa ya location imekataliwa');
  }
  return true;
};

export const getcurrentlocation = async () => {
  await requestlocationpermission();
  const location = await location.getcurrentpositionasync({
    accuracy: location.accuracy.high
  });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };
};

export const watchdriverlocation = (callback) => {
  return location.watchpositionasync(
    {
      accuracy: location.accuracy.bestfornavigation,
      timeinterval: 5000,
      distanceinterval: 10
    },
    callback
  );
};

export const getaddressfromcoords = async (lat, lng) => {
  try {
    const [address] = await location.reversegeocodeasync({ latitude: lat, longitude: lng });
    return `${address.street}, ${address.city}`;
  } catch (e) {
    return 'haijulikani';
  }
};