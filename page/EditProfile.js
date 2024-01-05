import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  ref,
  onValue,
  get,
  child,
  getDatabase,
  set,
  update,
} from 'firebase/database'
import { db, auth, storage } from '../firebase'
import * as ImagePicker from 'expo-image-picker'
import { ref as raf1, uploadBytesResumable } from 'firebase/storage'
import { useNavigation } from '@react-navigation/native'

function EditProfile() {
  const [userData, setUserData] = useState(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  const handleImagePicker = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      if (!response.cancelled) {
        const { uri } = response
        const filename = uri.substring(uri.lastIndexOf('/') + 1)
        const storageRef = raf1(storage, `/profile/${filename}`)
        await uploadBytesResumable(storageRef, uri, {
          contentType: 'image/jpeg',
        })
        setImage(uri)
        console.log('File uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading file: ', error)
    }
  }

  useEffect(() => {
    setLoading(true)
    const currentUser = auth.currentUser
    if (currentUser) {
      const userId = currentUser.uid
      const menuRef = ref(db, 'users/' + userId)
      onValue(menuRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setUserData(data)
          setUsername(data.username)
          setBio(data.bio)
          setImage(data.image)
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
    }
  }, [])
  console.log(userData)

  return (
    <View>
      <Text>image</Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          height: 100,
          borderColor: '#CCC',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleImagePicker}
      >
        {image === '' ? (
          <Icon name="plus" size={30} color="#CCC" />
        ) : (
          <ImageBackground
            source={{ uri: image }}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          ></ImageBackground>
        )}
      </TouchableOpacity>
      <Text>username</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        onChangeText={(username) => setUsername(username)}
        value={username}
      />
      <Text>bio</Text>
      <TextInput
        style={styles.input}
        placeholder="bio"
        onChangeText={(bio) => setBio(bio)}
        value={bio}
      />
      <TouchableOpacity
        style={{
          borderWidth: 1,
          height: 40,
          borderColor: '#CCC',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          const currentUser = auth.currentUser
          if (currentUser) {
            const userId = currentUser.uid
            const menuRef = ref(db, 'users/' + userId)
            update(menuRef, {
              username,
              bio,
              image,
            }
            )
            navigation.navigate('Profile')
          }
        }}
      >
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 15,
    height: 33,
  },
  inputDeskripsi: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 15,
    height: 100,
  },
  inputBahan: {
    flex: 2.5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 15,
    height: 30,
  },
  inputTakaran: {
    flex: 0.25,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginBottom: 0,
    marginLeft: 5,
    height: 33,
    justifyContent: 'center',
  },
  inputNumber: {
    flex: 0.5,
    width: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 8,
    marginLeft: 5,
    height: 33,
    justifyContent: 'center',
  },
})

export default EditProfile
