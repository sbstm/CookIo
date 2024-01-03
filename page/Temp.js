import React, { useState, useEffect } from 'react'
import { set, ref, onValue, push } from 'firebase/database'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from 'react-native'
import { db, storage } from '../firebase'
import {
  ref as raf1,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'

function writeMenuData(title, descripsi, imageUrl) {
  const menuRef = ref(db, 'menu')

  const newMenuRef = push(menuRef)
  set(newMenuRef, {
    title: title,
    descripsi: descripsi,
    imageUrl: imageUrl,
  })
    .then(() => {
      console.log('Data menu berhasil disimpan ke Firebase Realtime Database')
    })
    .catch((error) => {
      console.error('Gagal menyimpan data menu:', error)
    })
}

function Temp() {
  const [title, setTitle] = useState('')
  const [descripsi, setDescripsi] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [image, setImage] = useState(null)
  const [menuData, setMenuData] = useState(null)

  const uploadFile = async () => {
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
        const storageRef = raf1(storage, `/images/${filename}`)
        await uploadBytesResumable(storageRef, uri, {
          contentType: 'image/jpeg',
        })
        console.log('File uploaded successfully!')
        setImageUrl(uri)
        setImage(uri) // Set the selected image URI to display
      }
    } catch (error) {
      console.error('Error uploading file: ', error)
    }
  }

  useEffect(() => {
    const menuRef = ref(db, 'menu/')

    // Mengambil data dari Firebase Realtime Database
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Memisahkan data menjadi array untuk ditampilkan
        const dataArray = Object.values(data)
        setMenuData(dataArray)
      }
    })
  }, [])

  const handleSimpan = () => {
    if (title !== '' && descripsi !== '' && imageUrl !== '') {
      writeMenuData(title, descripsi, imageUrl)
      setTitle('')
      setImageUrl('')
      setDescripsi('')
    } else {
      alert('Data tidak boleh kosong')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={descripsi}
          onChangeText={(text) => setDescripsi(text)}
        />
        <TouchableOpacity style={styles.button} onPress={uploadFile}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSimpan}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>

        {menuData &&
          menuData.map((item, index) => (
            <View key={index}>
              <Text>Title: {item.title}</Text>
              <Text>Description: {item.descripsi}</Text>
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 200, height: 200 }}
              />
            </View>
          ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default Temp
