import React, { useEffect ,useState} from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableHighlight,
  TouchableOpacity, TextInput, Button,
  FlatList, View, Dimensions, Modal, Alert} from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';
const axios = require("axios");

const LOCATION_TRACKING = 'location-tracking';
let locationInfoGlobal = '';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [idName, setIdName] = useState(null);
  const [idIndex, setIdIndex] = useState(null);
  const [badgeMyIndex, setBadgeMyIndex] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [Data, setData] = useState([]);
 
  const startLocationTracking = async () => {
    console.log(`jestem w startlocation`);
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 1,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log('tracking started?', hasStarted);
  };
  const stopLocationTracking = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    const hasStopped = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log('tracking started?', hasStopped);
  };
  useEffect(() => {
    const config = async () => {
      let res = await Permissions.askAsync(Permissions.LOCATION);
      if (res.status !== 'granted') {
        console.log('Permission to access location was denied');
      } else {
        console.log('Permission to access location granted');
      }
    };
    config();
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(`location ${JSON.stringify(location)}`);
    })(); 
  }, []);
  
  // let text = 'Waiting..';
  // let text2;
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  //   text2 = JSON.stringify(locationInfoGlobal);
  // }
  mysetModalVisible = (visible) => {
    setModalVisible(visible);
  };
  renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.textStyle3}>{item.text}</Text>
      <Text style={styles.textStyle3}>{item.text2}</Text>
      <Text style={styles.textStyle3}>{item.text3}</Text>
    </View>
  );
  findCoordinates = async() => {
    console.log("click  odczyt");
    const {status} = await  Permissions.askAsync(Permissions.LOCATION);
    console.log(`status ${status}`);
    if (status != 'granted'){
      console.log('PERMITION NOT GRANTED!');
      setErrorMsg('PERMISION NOT GRANTED');
    }
    const position= await Location.getCurrentPositionAsync({});
    setLocation(position)
    console.log(`locations: ${JSON.stringify(position)}`) 
      const latitude = JSON.stringify(position.coords.latitude);
      const longitude = JSON.stringify(position.coords.longitude);
      const speed = JSON.stringify(position.coords.speed);

      setLatitude(latitude);
      setLongitude(longitude);
      setSpeed(speed);
      setTimestamp(new Date(position.timestamp).toString());
      setBadgeMyIndex ( badgeMyIndex + 1 );
      setData(Data => [...Data, {
        id: Math.random().toString(12).substring(0),
        text: new Date(position.timestamp).toString(),
        color: "red",
        text2: latitude,
        text3: longitude,
      }]);
      console.log(`Data ${JSON.stringify(Data)}`);
      console.log(`latitude ${latitude} longitude ${longitude}`);
      // axios
      //   .get(
      //     `https://busmapa.ct8.pl/saveToDB.php?time=` +
      //       new Date(position.timestamp).toString() +
      //       `&lat=` +
      //       latitude +
      //       `&longitude=` +
      //       longitude +
      //       `&s=` +
      //       speed +
      //       `&idName=` +
      //       this.state.idName +
      //       `&idIndex=` +
      //       this.state.idIndex
      //   )
      //   .then((result) => {
      //     console.log(
      //       "axios success " +
      //         result.data +
      //         " timestamp: " +
      //         new Date(position.timestamp).toString()
      //     );
      //   })
      //   .catch((err) => {
      //     console.log("axios failed " + err);
      //   });
  }

  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      const { locations } = data;
      locationInfoGlobal = locations;
      // console.log('locationInfoGlobal: ', locationInfoGlobal);
      
      let lat = locations[0].coords.latitude;
      let long = locations[0].coords.longitude;
      let timestamp =locations[0].timestamp;
  
      setBadgeMyIndex ( badgeMyIndex + 1 );
      setData(Data => [...Data, {
        id: Math.random().toString(12).substring(0),
        text: new Date(timestamp).toString(),
        color: "red",
        text2: lat,
        text3: long,
      }]);
      // console.log(`Data ${JSON.stringify(Data)}`);
  
      console.log(
        `${new Date(Date.now()).toLocaleString()}: ${lat},${long}, ${timestamp}`
      );
     
      axios
            .get(
              `https://busmapa.ct8.pl/saveToDB.php?time=` +
                timestamp +
                `&lat=` +
                lat +
                `&longitude=` +
                long +
                `&s=0` +
                `&idName=Test` +
                `&idIndex= 1` 
            )
            .then((result) => {
              console.log("axios success " + result.data + " timestamp: " + timestamp);
            })
            .catch((err) => {
              console.log("axios failed " + err);
            });
    }
  });
  
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.centeredView}>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={startLocationTracking}
          style={styles.button}
        >
          <Text style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topButton}
          onPress={stopLocationTracking}
          style={styles.button}
        >
          <Text style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}>Stop</Text>
        </TouchableOpacity>

        {/* <Text >{text}</Text>
        <Text >{text2}</Text> */}
      </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ padding: 10, fontSize: 20 }}>
                    Identyfikator trasy:{" "}
                  </Text>
                  <TextInput
                    style={{ padding: 10, fontSize: 20 }}
                    editable={true}
                    selectionColor={"blue"}
                    underlineColorAndroid={"gray"}
                    placeholder="Wprowadź identyfikator"
                    onSubmitEditing={(event) => {
                      setIdName(event.nativeEvent.text);
                      console.log(`idName: ${event.nativeEvent.text}`);
                    }}
                  ></TextInput>

                  <Text style={{ padding: 10, fontSize: 20 }}>
                    Identyfikator kursu:{" "}
                  </Text>
                  <TextInput
                    style={{ padding: 10, fontSize: 20 }}
                    editable={true}
                    selectionColor={"blue"}
                    underlineColorAndroid={"gray"}
                    placeholder="Wprowadź identyfikator"
                    onSubmitEditing={(event) => {
                      setIdIndex(event.nativeEvent.text);
                      console.log(`idIndex: ${event.nativeEvent.text}`);
                    }}
                  ></TextInput>
                </View>

                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    mysetModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              mysetModalVisible(true);
            }}
          >
            <Text style={styles.textStyle}>Identyfikator trasy</Text>
          </TouchableHighlight>
          <TouchableOpacity
            style={styles.header1}
            onPress={findCoordinates}
          >
            <View style={styles.textStyle2}>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Odczyt GPS
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                Identyfikator trasy:{" "}
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {idName}{" "}
                </Text>
              </Text>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                Identyfikator kursu:{" "}
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {idIndex}{" "}
                </Text>
              </Text>
              <Text>Latitude: {latitude}</Text>
              <Text>Longitude: {longitude}</Text>
              <Text>timestamp: {timestamp}</Text>
              {/* {this.state.error ? <Text>Error: {this.state.error}</Text> : null} */}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.textStyle2}
            onPress={() => {
              setData([]);
              setBadgeMyIndex( 0 );
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                margin: 10,
              }}
            >
              Tabela pozycji GPS ({badgeMyIndex})
            </Text>
          </TouchableOpacity>
          <FlatList
            style={styles.mytabela}
            data={Data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    fontSize: 20,
    width: "100%",
    borderColor: "red",
    marginTop: 30,
  },
  header2: {
    backgroundColor: "#7777",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 110,
    width: "95%",
    paddingTop: 25,
    paddingBottom: 15,
    fontSize: 20,
    borderColor: "red",
    margin: 10,
  },
  mytabela: {
    maxWidth: "100%",
    borderRadius: 30,
    width: 350,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 20,
  },
  header1: {
    backgroundColor: "#2196F3",
    maxWidth: "100%",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 30,
    width: "95%",
    paddingTop: 10,
    paddingBottom: 25,
    fontSize: 20,
    margin: 10,
    color: "white",
  },
  textStyle3: {
    marginVertical: 4,
    fontSize: 10,
    marginLeft: 10,
    color: "white",
  },
  item: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginVertical: 5,
    height: 90,
    borderRadius: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  modalView: {
    margin: 2,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 600,
  },
  topButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    color: "red",
  },
  button:{
    margin:10,
    padding:10,
    flexWrap: 'wrap', 
    flexDirection:'row',
    alignContent:'space-between',
    backgroundColor: "#2196F3",
    borderRadius: 10,
    elevation: 2,
    width:120,
    textAlign:"center",  
  },
  buttonView: {
    marginLeft:20,
    padding:10,
    flexWrap: 'wrap', 
    flexDirection:'row',
    alignItems:"center"

  },
  openButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    width: 350,
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
  },
  textStyle2: {
    color: "white",
    backgroundColor: "#2196F3",
    width: 380,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 30,
    padding: 10,
  },
});
