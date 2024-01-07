import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker'
import {
  ref,
  onValue,
  get,
  child,
  getDatabase,
  set,
  push,
  update,
} from 'firebase/database'
import { db, auth, storage } from '../firebase'
import { ref as raf1, uploadBytesResumable } from 'firebase/storage'
import { useNavigation } from '@react-navigation/native'

const AddReview = ({ route }) => {
  const selectedRecipe = route.params
  console.log(selectedRecipe)

  const [description, setDescription] = useState('')
  const [imageLink, setImageLink] = useState('')
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const idrecipe = selectedRecipe.resepid
  console.log(idrecipe)

  const handleAddReview = async () => {
    const currentUser = auth.currentUser
    const userId = currentUser.uid
    try {
      const reviewRef = ref(db, 'Review/') // Generate unique key
      const newReviewKey = push(reviewRef)
      const newReview = {
        description: description,
        imageLink: imageLink,
        rating: rating,
        userupload: userId,
        recipeid: idrecipe,
      }
      await set(newReviewKey, newReview)
      console.log('Review berhasil ditambahkan!')
      navigation.navigate('Home')
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }
  const renderRatingIcons = (rating) => {
    const icons = []
    for (let i = 1; i <= 5; i++) {
      icons.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={20}
          color={i <= rating ? '#FBD532' : '#DDD'}
        />
      )
    }
    return icons
  }

  const handleImagePicker = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (!response.cancelled) {
        const { uri } = response
        const filename = uri.substring(uri.lastIndexOf('/') + 1)
        const storageRef = raf1(storage, `/review/${filename}`)
        await uploadBytesResumable(storageRef, uri, {
          contentType: 'image/jpeg',
        })
        setImageLink(uri)
        console.log('File uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading file: ', error)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Icon
            name={i <= rating ? 'star' : 'star-o'}
            size={30}
            color="#FBD532"
          />
        </TouchableOpacity>
      )
    }
    return stars
  }
  const handleback = () => {
    navigation.goBack()
    return true
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text style={styles.heading}>Bagaimana Hasil Masakanmu?</Text>

      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {renderStars()}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Deskripsi Hasil Masakanmu</Text>
        <TextInput
          style={styles.inputDeskripsi}
          value={description}
          onChangeText={setDescription}
          placeholder="Masukkan Deskripsi Masakan"
          multiline
        />

        <Text style={styles.label}>Dokumentasi Masakan</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 100,
            borderColor: '#CCC',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => handleImagePicker()}
          placeholder="Bagikan Hasil Masakanmu"
        >
          {imageLink === '' ? (
            <Icon name="camera" size={30} color="#CCC" />
          ) : (
            <ImageBackground
              source={{ uri: imageLink }}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            ></ImageBackground>
          )}
        </TouchableOpacity>

        <Text style={{ color: 'gray' }}>
          *Pilih format gambar PNG atau jpeg maksimum berukuran 10MB
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderRadius: 50,
          }}
        >
          <TouchableOpacity onPress={() => handleAddReview()} color="#FBD532">
            <Text style={{ color: '#FBD532', fontSize: 16 }}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 40,
  },
  formContainer: {
    width: '90%',
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  inputDeskripsi: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 15,
    height: 100,
  },
})

export default AddReview
