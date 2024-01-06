import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  ScrollView,
  Image,
  BackHandler,
} from 'react-native'
import { ref, orderByChild, equalTo, onValue } from 'firebase/database'
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'

function Recipe({ route }) {
  const navigation = useNavigation()
  const selectedRecipe = route.params // Convert to string
  console.log(selectedRecipe)
  const judul = selectedRecipe.item.judul
  const descripsi = selectedRecipe.item.descripsi
  const time = selectedRecipe.item.time
  const porsi = selectedRecipe.item.porsi
  const ingredient = selectedRecipe.item.ingredient
  const alat = selectedRecipe.item.alat
  const step = selectedRecipe.item.step
  const image = selectedRecipe.item.imageLink

  const handleback = () => {
    navigation.goBack()
    return true
  }

  const handleReview = () => {
    navigation.navigate('Review', { selectedRecipe })
  }
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
          borderRadius: 50,
        }}
        onPress={() => handleback()}
      >
        <Icon name="arrow-left" size={20} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <ImageBackground
          source={require('../assets/images/ayam.png')}
          style={styles.bgtop}
        >
          <View style={styles.head}>
            <Text style={styles.masakan}>
              {judul.length > 20 ? judul.substring(0, 20) + '...' : judul}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <ImageBackground
                  source={require('../assets/images/masak.png')}
                  style={styles.masak}
                ></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleReview()}
              >
                <ImageBackground
                  source={require('../assets/images/review.png')}
                  onPress={() => handleReview()}
                  style={styles.masak}
                ></ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.ingredientText}>
            {descripsi} x {time} menit x {porsi} orang
          </Text>
        </ImageBackground>
      </View>
      <View style={styles.isi}>
        <Text style={styles.subhead}>Bahan</Text>
        <Text style={styles.subsubhead}>
          {' '}
          {ingredient.length} Bahan baku assdas
        </Text>
        {ingredient.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
          >
            <Text>{ingredient[index].ingredient}</Text>
            {ingredient[index].unit === 'Secukupnya' ? (
              <Text> {ingredient[index].unit} </Text>
            ) : (
              <Text>
                {ingredient[index].takaran} {ingredient[index].unit}{' '}
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.subhead}>Alat</Text>
        <Text style={styles.subsubhead}>
          {' '}
          {alat.length} Alat yang diperlukan
        </Text>
        {alat.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
          >
            <Text>{alat[index].name}</Text>
          </View>
        ))}
        <Text style={styles.subhead}>Langkah - langkah</Text>
        <Text style={styles.subsubhead}> {step.length} tahap pembuatan</Text>
        {step.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
          >
            <Text>{step[index].step}</Text>
          </View>
        ))}
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
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    marginLeft: 10,
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
