import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker'
import { db, storage, auth } from '../firebase'
import {
  ref as raf1,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { set, ref, onValue, push, update } from 'firebase/database'

function writeAddRecipe(
  judul,
  descripsi,
  ingredient,
  stepsRows,
  imageLink,
  alat,
  porsi,
  time,
  userid,
  resepid
) {
  const menuRef = ref(db, 'Recipe')
  const newMenuRef = push(menuRef)
  set(newMenuRef, {
    userupload: userid,
    judul: judul,
    time: time,
    porsi: porsi,
    alat: alat,
    descripsi: descripsi,
    ingredient: ingredient,
    step: stepsRows,
    imageLink: imageLink,
    resepid: resepid,
  })
    .then(() => {
      console.log('Data menu berhasil disimpan ke Firebase Realtime Database')
    })
    .catch((error) => {
      console.error('Gagal menyimpan data menu:', error)
    })
}

const AddRecipe = ({ navigation }) => {
  const [recipeName, setRecipeName] = useState('')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  const [imageLink, setImageLink] = useState('')
  const [porsi, setPorsi] = useState(0)
  const [time, setTime] = useState(0)
  const [alat, setAlat] = useState([{ name: '' }])
  const [ingredientRows, setIngredientRows] = useState([
    { ingredient: '', takaran: 0, unit: 'Grams' },
  ])
  const [stepsRows, setStepsRows] = useState([{ step: '' }])
  const [loading, setLoading] = useState(false)

  const currentUser = auth.currentUser

  const generateRecipeId = () => {
    const timestamp = Date.now().toString(36) // Convert timestamp to base36 string
    const randomString = Math.random().toString(36).substring(2, 7) // Generate random string
    const recipeId = `${timestamp}-${randomString}`
    return recipeId
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  const handleAddRecipe = () => {
    setLoading(true)
    if (
      (!recipeName ||
        !description ||
        ingredientRows.some((item) => !item.ingredient) ||
        stepsRows.some((item) => !item.step) ||
        !imageLink,
      !alat,
      !porsi,
      !time)
    ) {
      alert('Mohon lengkapi formulir!')
      setLoading(false)
    } else {
      const uniqueRecipeId = generateRecipeId()
      writeAddRecipe(
        recipeName,
        description,
        ingredientRows,
        stepsRows,
        imageLink,
        alat,
        porsi,
        time,
        currentUser.uid,
        uniqueRecipeId
      )
      alert('Resep berhasil ditambahkan!')
      setLoading(false)
      navigation.navigate('Profile')
      setRecipeName('')
      setDescription('')
      setInstructions('')
      setImageLink('')
      setPorsi('')
      setTime('')
      setAlat([{ name: '' }])
      setIngredientRows([{ ingredient: '', takaran: 0, unit: 'Grams' }])
      setStepsRows([{ step: '' }])
    }
  }

  const handleAddIngredientRow = () => {
    setIngredientRows((prevRows) => [
      ...prevRows,
      { ingredient: '', takaran: '', unit: 'Grams' },
    ])
  }

  const handleIngredientChange = (index, key, value) => {
    const updatedRows = [...ingredientRows]
    updatedRows[index][key] = value
    setIngredientRows(updatedRows)
  }

  const handleAddStepsRow = () => {
    setStepsRows((prevRows) => [...prevRows, { step: '' }])
  }

  const handleStepsChange = (index, value) => {
    const updatedRows = [...stepsRows]
    updatedRows[index].step = value
    setStepsRows(updatedRows)
  }
  const handleAlatChange = (index, value) => {
    const updatedRows = [...alat]
    updatedRows[index].name = value
    setAlat(updatedRows)
  }
  const handleAddAlatRow = () => {
    setAlat((prevRows) => [...prevRows, { name: '' }])
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
        const storageRef = raf1(storage, `/images/${filename}`)
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

  const renderIngredientRows = () => {
    return ingredientRows.map((item, index) => (
      <View style={{ flexDirection: 'row', marginBottom: 10 }} key={index}>
        <TextInput
          style={styles.inputBahan}
          value={item.ingredient}
          onChangeText={(text) =>
            handleIngredientChange(index, 'ingredient', text)
          }
          placeholder={`${index + 1} .........`}
        />
        <TextInput
          style={styles.inputNumber}
          value={item.takaran}
          onChangeText={(number) =>
            handleIngredientChange(index, 'takaran', number)
          }
          placeholder={''}
        />
        <Picker
          style={styles.inputTakaran}
          selectedValue={item.unit}
          onValueChange={(value) =>
            handleIngredientChange(index, 'unit', value)
          }
        >
          <Picker.Item label="Grams" value="Grams" />
          <Picker.Item label="Liters" value="Liters" />
          <Picker.Item label="Sdm" value="Sdm" />
          <Picker.Item label="Sdt" value="Sdt" />
          <Picker.Item label="Gelas" value="Gelas" />
          <Picker.Item label="Siung" value="Siung" />
          <Picker.Item label="Buah" value="Buah" />
          <Picker.Item label="Secukupnya" value="Secukupnya" />
        </Picker>
      </View>
    ))
  }

  const renderStepsRows = () => {
    return stepsRows.map((item, index) => (
      <View style={{ marginBottom: 10 }} key={index}>
        <TextInput
          style={styles.input}
          value={item.step}
          onChangeText={(text) => handleStepsChange(index, text)}
          placeholder={`${index + 1} .........`}
          multiline
        />
      </View>
    ))
  }
  const alatRows = () => {
    return alat.map((item, index) => (
      <View style={{ marginBottom: 10 }} key={index}>
        <TextInput
          style={styles.input}
          value={item.name}
          onChangeText={(text) => handleAlatChange(index, text)}
          placeholder={`${index + 1} .........`}
          multiline
        />
      </View>
    ))
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        "Masaklah dengan cinta, karena makanan yang disajikan dengan cinta akan
        selalu menjadi hidangan yang tak terlupakan."
      </Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Detail Resep</Text>
        <Text>
          Silahkan mengisi form sesuai dengan requirement yang telah disediakan
        </Text>
        <Text style={styles.label}>Judul Resep</Text>
        <TextInput
          style={styles.input}
          value={recipeName}
          onChangeText={setRecipeName}
          placeholder="Masukkan Nama Resep"
        />
        <Text style={styles.label}>Deskripsi Makanan</Text>
        <TextInput
          style={styles.inputDeskripsi}
          value={description}
          onChangeText={setDescription}
          placeholder="Masukkan Deskripsi Makanan"
          multiline
        />
        <Text style={styles.label}>Porsi Makanan</Text>
        <TextInput
          style={styles.input}
          value={porsi}
          onChangeText={setPorsi}
          placeholder="Masukkan porsi makanan yang mau di buat"
        />
        <Text style={styles.label}>Durasi Memasak</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="Masukkan masukan dalam menit"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>Bahan Baku</Text>
          <TouchableOpacity
            style={{
              padding: 10,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleAddIngredientRow}
          >
            <Icon name="plus" size={10} color="#000" />
          </TouchableOpacity>
        </View>
        {renderIngredientRows()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>Alat Alat</Text>
          <TouchableOpacity
            style={{
              padding: 10,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleAddAlatRow}
          >
            {/* Menggunakan ikon plus di dalam tombol */}
            <Icon name="plus" size={10} color="#000" />
          </TouchableOpacity>
        </View>
        {alatRows()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.label}>Langkah-langkah</Text>
          <TouchableOpacity
            style={{
              padding: 10,
              alignItems: 'center',
              marginTop: 10,
            }}
            onPress={handleAddStepsRow}
          >
            {/* Menggunakan ikon plus di dalam tombol */}
            <Icon name="plus" size={10} color="#000" />
          </TouchableOpacity>
        </View>
        {renderStepsRows()}

        <Text style={styles.label}>Dokumentasi Makanan</Text>
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
          {imageLink === '' ? (
            <Icon name="plus" size={30} color="#CCC" />
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
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleAddRecipe}
            color="#FBD532"
            style={{
              borderWidth: 1,
              paddingHorizontal: 10,
              borderColor: '#CCC',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FBD532',
              width: 100,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#fff' }}>Kirim Resep</Text>
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
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
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

export default AddRecipe
