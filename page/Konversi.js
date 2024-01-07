import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'

export default function ConversionApp() {
  const [unitType1, setUnitType1] = useState('Grams')
  const [unitType2, setUnitType2] = useState('Grams')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState('')
  const navigation = useNavigation()

  const exchangeUnits = () => {
    // Tukar nilai unitType1 dan unitType2
    const temp = unitType1
    setUnitType1(unitType2)
    setUnitType2(temp)
  }

  const convertUnits = () => {
    let specificResult = ''

    if (unitType1 === 'Grams') {
      const grams = parseFloat(amount)
      if (unitType2 === 'Sdm') {
        const Sdm = grams / 15
        specificResult = `Sdm: ${Sdm.toFixed(2)}`
      } else if (unitType2 === 'Sdt') {
        const Sdt = grams / 5
        specificResult = `Sdt: ${Sdt.toFixed(2)}`
      }
    } else if (unitType1 === 'Liters') {
      const liters = parseFloat(amount)
      if (unitType2 === 'Gelas') {
        const glasses = liters * 4
        specificResult = `Gelas: ${glasses.toFixed(2)}`
      } else if (unitType2 === 'Sdm') {
        const Sdm = liters * 16
        specificResult = `Sdm: ${Sdm.toFixed(2)}`
      } else if (unitType2 === 'Sdt') {
        const Sdt = liters * 48
        specificResult = `Sdt: ${Sdt.toFixed(2)}`
      } else if (unitType2 === 'Grams') {
        const grams = liters * 1000
        specificResult = `Gram: ${grams.toFixed(2)}`
      }
    } else if (unitType1 === 'Sdm') {
      const Sdm = parseFloat(amount)
      if (unitType2 === 'Sdt') {
        const Sdt = Sdm * 3
        specificResult = `Sdt: ${Sdt.toFixed(2)}`
      } else if (unitType2 === 'Grams') {
        const grams = Sdm * 15
        specificResult = `Gram: ${grams.toFixed(2)}`
      }
    } else if (unitType1 === 'Sdt') {
      const Sdt = parseFloat(amount)
      if (unitType2 === 'Sdm') {
        const Sdm = Sdt / 3
        specificResult = `Sdm: ${Sdm.toFixed(2)}`
      } else if (unitType2 === 'Grams') {
        const grams = Sdt * 5
        specificResult = `Gram: ${grams.toFixed(2)}`
      }
    } else if (unitType1 === 'Gelas') {
      const glasses = parseFloat(amount)
      if (unitType2 === 'Liters') {
        const liters = glasses * 0.25
        specificResult = `Liter: ${liters.toFixed(2)}`
      }
    }

    setResult(specificResult)
  }
  const handleback = () => {
    navigation.goBack()
    return true
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: '20' }}>
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
      <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
        <Picker
          style={{
            flex: 1,
            marginRight: 5,
            borderColor: '#FBD532',
            borderRadius: 10,
            color: '#CCC',
          }}
          selectedValue={unitType1}
          onValueChange={(itemValue) => setUnitType1(itemValue)}
        >
          <Picker.Item label="Grams" value="Grams" />
          <Picker.Item label="Liters" value="Liters" />
          <Picker.Item label="Sdm" value="Sdm" />
          <Picker.Item label="Sdt" value="Sdt" />
          <Picker.Item label="Gelas" value="Gelas" />
        </Picker>

        <TouchableOpacity
          style={{
            padding: 10,
            alignItems: 'center',
            borderRadius: 5,
            marginTop: 10,
          }}
          onPress={exchangeUnits}
        >
          {/* Menggunakan ikon panah di dalam tombol */}
          <Icon name="exchange" size={20} color="#FBD532" />
        </TouchableOpacity>

        <Picker
          style={{
            flex: 1,
            marginLeft: 5,
            borderColor: '#FBD532',
            borderRadius: 10,
            color: '#CCC',
          }}
          selectedValue={unitType2}
          onValueChange={(itemValue) => setUnitType2(itemValue)}
        >
          <Picker.Item label="Grams" value="Grams" />
          <Picker.Item label="Liters" value="Liters" />
          <Picker.Item label="Sdm" value="Sdm" />
          <Picker.Item label="Sdt" value="Sdt" />
          <Picker.Item label="Gelas" value="Gelas" />
        </Picker>

        <TextInput
          style={{
            flex: 0.5,
            marginLeft: 10,
            borderWidth: 1,
            borderColor: '#FBD532',
            borderRadius: 10,
            textAlign: 'center',
          }}
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={{
            padding: 10,
            alignItems: 'center',
            borderRadius: 5,
            marginTop: 10,
          }}
          onPress={convertUnits}
        >
          {/* Menggunakan ikon panah di dalam tombol */}
          <Icon name="arrow-right" size={20} color="#FBD532" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={{ textAlign: 'center' }}>{result}</Text>
      </View>
    </View>
  )
}
