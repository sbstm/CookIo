import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native'
import { ref, onValue } from 'firebase/database'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'

function Home() {
  const [searchText, setSearchText] = useState('')
  const [menuData, setMenuData] = useState([])
  const navigation = useNavigation()

  useEffect(() => {
    const menuRef = ref(db, 'Recipe/')

    // Fetching data from Firebase Realtime Database
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Separating data into an array to display
        const dataArray = Object.values(data)
        setMenuData(dataArray)
      }
    })
  }, [])

  const handleItem = (item) => {
    navigation.navigate('Recipe', { item }) // Pass the selected recipe as a parameter
  }

  const handleSearch = () => {
    const menuRef = ref(db, 'Recipe/')

    // Fetching data from Firebase Realtime Database for search functionality
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Transforming data into an array
        const dataArray = Object.values(data)

        // Filtering the data based on the searchText
        const filteredData = dataArray.filter((item) =>
          item.judul.toLowerCase().includes(searchText.toLowerCase())
        )

        // Updating the menuData state with filtered results
        setMenuData(filteredData)
      }
    })
  }
  if (menuData.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.top}>
            <ImageBackground
              source={require('../assets/images/ayam.png')}
              style={styles.bgtop}
            >
              <Text style={styles.header}>
                YUK CARI RESEP
                <br />
                MASAKAN KAMU HARI INI!
              </Text>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ketik disini"
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
                  <Text style={styles.searchButtonText}>Cari</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
            </ImageBackground>
          </View>
          <View style={styles.recipeItem}>
            <ImageBackground
              source={require('../assets/images/ayam.png')}
              style={styles.recipeBackground}
            >
              <Text style={styles.recipeTitle}>Tidak ada resep</Text>
            </ImageBackground>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.top}>
          <ImageBackground
            source={require('../assets/images/ayam.png')}
            style={styles.bgtop}
          >
            <Text style={styles.header}>
              YUK CARI RESEP
              <br />
              MASAKAN KAMU HARI INI!
            </Text>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Ketik disini"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchButtonText}>Cari</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
          </ImageBackground>
        </View>
        {menuData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recipeItem}
            onPress={() => handleItem(item)}
          >
            <ImageBackground
              source={{ uri: item.imageLink }}
              style={styles.recipeBackground}
            >
              <Text style={styles.recipeTitle}>{item.judul}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    justifyContent: 'center',
  },
  separator: {
    height: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    color: 'white',
    fontFamily: 'Segoe UI',
  },
  top: {
    width: '100%',
    height: 300,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  searchBar: {
    backgroundColor: 'white',
    height: 23,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    top: 0,
    zIndex: 1,
  },
  textInput: {
    height: 23,
    width: 250,
    fontSize: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  recipeItem: {
    flex: 1,
    backgroundColor: 'gray',
    margin: 5,
    height: 80,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  recipeBackground: {
    flex: 1,
    width: '100%',
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 18,
    color: 'white',
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Segoe UI',
  },
  searchButton: {
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'gray',
    fontSize: 16,
  },
})

export default Home
