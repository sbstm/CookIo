import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5' // Menggunakan FontAwesome5 untuk ikon
import { useNavigation } from '@react-navigation/native'

const TimerApp = ({ isVisible, closeModal, navigateBack }) => {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isActive, setIsActive] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    let interval

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const { hours, minutes, seconds } = prevTime

          if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(interval)
            setIsActive(false)
            return prevTime
          }

          let newHours = hours
          let newMinutes = minutes
          let newSeconds = seconds

          if (seconds === 0) {
            if (minutes === 0) {
              newHours -= 1
              newMinutes = 59
            } else {
              newMinutes -= 1
            }
            newSeconds = 59
          } else {
            newSeconds -= 1
          }

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds }
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, time])

  const handleStartStop = () => {
    setIsActive((prevIsActive) => !prevIsActive)
  }

  const handleReset = () => {
    setTime({ hours: 0, minutes: 0, seconds: 0 })
    setIsActive(false)
  }

  const handlback = () => {
    navigation.goBack()
    return true
  }

  const externalCloseButton = (
    <TouchableOpacity style={styles.externalCloseButton} onPress={handlback}>
      <Icon name="times" size={20} color="#000" />
    </TouchableOpacity>
  )

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={() => closeModal()}
    >
      <View style={styles.modalContainer}>
        {externalCloseButton}
        <View style={styles.timerContainer}>
          <View style={styles.timerInputContainer}>
            {['hours', 'minutes', 'seconds'].map((unit) => (
              <TextInput
                key={unit}
                style={styles.timerInput}
                placeholder="00"
                keyboardType="numeric"
                value={String(time[unit]).padStart(2, '0')}
                onChangeText={(text) =>
                  setTime((prevTime) => ({
                    ...prevTime,
                    [unit]: parseInt(text) || 0,
                  }))
                }
              />
            ))}
          </View>
          <Text style={styles.timerText}>
            {Object.entries(time)
              .map(([unit, value]) => String(value).padStart(2, '0'))
              .join(':')}
          </Text>
          <View style={styles.playButtonContainer}>
            <TouchableOpacity onPress={handleStartStop}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Icon
                    name={isActive ? 'pause' : 'play'}
                    size={30}
                    color="#f39c12"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  timerContainer: {
    width: 300,
    borderRadius: 15,
    backgroundColor: '#FFF', // Ubah menjadi putih
    padding: 20,
    alignItems: 'center',
  },
  externalCloseButton: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    padding: 7,
  },
  timerInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timerInput: {
    width: '30%',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 4,
    borderColor: '#FBD532',
    textAlign: 'center',
    fontSize: 13,
    color: '#A0A0A0',
    leadingTrim: 'both',
    textEdge: 'cap',
    fontFamily: 'Obitron',
    fontStyle: 'normal',
    fontWeight: '400',
    alignItems: 'center', // Tambahkan baris ini
  },

  timerText: {
    fontSize: 48, // Ukuran font yang lebih besar
    marginBottom: 20,
    color: '#000', // Ubah menjadi hitam
    fontFamily: 'Obitron',
    fontWeight: '300', // Mengurangi ketebalan font
  },
  playButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f39c12', // Warna oranye
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF', // Warna putih
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default TimerApp
