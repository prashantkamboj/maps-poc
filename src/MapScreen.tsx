import React, { useEffect, useState } from 'react';
import { View, Text, Button} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const MapScreen = () => {
  const [region, setRegion] = useState<Region>();
  const [address, setAddress] = useState('');

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        fetchAddress(latitude, longitude);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const fetchAddress = async (latitude: number, longitude: number) => {
    const apiKey = 'Api key goes here';
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      console.log('google Response', JSON.stringify(response?.data));
      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {region && (
        <>
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        //   onRegionChange={(nRegion) => setRegion(nRegion)}
        >
          <Marker draggable coordinate={region} flat onDragEnd={(e) => setRegion({...e.nativeEvent.coordinate, latitudeDelta: 0.01, longitudeDelta: 0.01})} />
        </MapView>
        <View style={{ position:'absolute',  justifyContent: 'center', alignItems: 'center', left: 0,bottom: 0, top: 0, right: 0, zIndex: 2}}>
            <View style={{width: 10, height: 10, backgroundColor: 'red'}} />
        </View>
        </>
      )}
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>Address: {address || ''}</Text>
        <Button title="Confirm Address"  onPress={() => console.log('Address confirmed:', address)} color={'black'}/>
      </View>
    </View>
  );
};

export default MapScreen;
