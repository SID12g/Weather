import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import {Fontisto} from '@expo/vector-icons'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const API_KEY = "5714a6b876fd361829a7400da51df5ad"
const icons = {
  "Clouds": "cloudy",
  "Clear" : "day-sunny",
  "Snow":"snow",
  "Rain":"rain"
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(true)
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false)
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)

    const json = await response.json()
    // console.log(json.list)
    setDays(json.list)
  }
  useEffect(() => {
    getWeather();
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length == 0 ?
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
          </View>
          : days.map((day, index) => <View style={styles.day}>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={60} color="black" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinytext}>{day.weather[0].description}</Text>
          </View>)}
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato"
  },
  city: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 48,
    fontWeight: "500"
  },
  weather: {

  },
  day: {
    width: windowWidth,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 128,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinytext: {
    fontSize: 30
  }
})
