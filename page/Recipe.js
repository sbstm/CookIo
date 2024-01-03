import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

function Recipe({ route }) {
  const { Recipes } = route.params
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ImageBackground
          source={require('../assets/images/ayam.png')}
          style={styles.bgtop}
        >
          <View style={styles.head}>
            <Text style={styles.masakan}>
              {recipes.judul.length > 20
                ? recipes.judul.substring(0, 20) + '...'
                : recipes.judul}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Link href="/login" asChild>
                  <ImageBackground
                    source={require('../assets/images/masak.png')}
                    style={styles.masak}
                  ></ImageBackground>
                </Link>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <ImageBackground
                  source={require('../assets/images/review.png')}
                  style={styles.masak}
                ></ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.ingredientText}>
            {recipes.jenis.join(', ')} x {recipes.time} x {recipes.porsi}
          </Text>
        </ImageBackground>
      </View>
      <View style={styles.isi}>
        <Text style={styles.subhead}>Bahan</Text>
        <Text style={styles.subsubhead}>
          {' '}
          {recipes.bahan.length} Bahan baku
        </Text>
        <FlatList
          data={recipes.bahan.map((item, index) => ({
            bahan: item,
            ukuran: recipes.ukuranbahan[index],
            key: index.toString(),
          }))}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 16 }}>{item.bahan}</Text>
              <Text style={{ fontSize: 16, color: 'gray' }}>{item.ukuran}</Text>
            </View>
          )}
        />
        <Text style={styles.subhead}>Alat</Text>
        <Text style={styles.subsubhead}>
          {' '}
          {recipes.alat.length} Alat yang diperlukan
        </Text>
        <FlatList
          data={recipes.alat}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </View>
          )}
        />

        <Text style={styles.subhead}>Langkah - langkah</Text>

        <Text style={styles.subsubhead}>
          {' '}
          {recipes.steps.length} tahap pembuatan
        </Text>
        <FlatList
          data={recipes.steps}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignSelf: 'stretch', // Kontainer mengikuti tinggi konten
  },
  subhead: {
    fontFamily: 'Segoe UI',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    padding: 10,
  },
  subsubhead: {
    fontFamily: 'Segoe UI',
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: 10,
    marginTop: -15,
    marginBottom: 10,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  masakan: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Segoe UI',
    alignContent: 'flex-start',
    width: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    bottom: 0,
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
    borderRadius: 50,
  },
  masak: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  isi: {
    backgroundColor: 'white',
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    top: 0,
    borderRadius: 25,
  },
  ingredientText: {
    fontSize: 10,
    width: 280,
    color: 'white',
    textAlign: 'left',
  },
  bgtop: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    borderRadius: 25,
    marginBottom: -50,
  },
})
export default Recipe
