import React, { useState, useEffect } from 'react'
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { auth } from '../firebase'
import { ref, get, child, onValue, set } from 'firebase/database'

import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const imageWidth = width / 3 // Assuming you want 3 images per row

const renderImageItem = ({ item }) => (
  <Image style={styles.image} source={{ uri: item }} resizeMode="cover" />
)

function Profile() {
  const [userData, setUserData] = useState({
    username: '',
    image: '',
    followers: [],
    following: [],
    bio: '',
  })
  const [loadingUserData, setLoadingUserData] = useState(true)
  const [data, setData] = useState([])
  const [post, setPost] = useState(0)
  const [loadingImages, setLoadingImages] = useState(true)

  const currentUser = auth.currentUser
  const navigation = useNavigation()

  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      navigation.navigate('login')
    }
  }, [currentUser, navigation])

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      const userId = currentUser.uid
      const recipeRef = ref(db, 'Recipe/')
      onValue(recipeRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const dataArray = Object.values(data)
          const filteredData = dataArray.filter(
            (item) => item.userupload === userId
          )
          setData(filteredData)
        }
        setLoadingImages(false)
      })

      console.log(data.length)
      setPost(data.length)
      const menuRef = ref(db, 'users/' + userId)
      onValue(menuRef, (snapshot) => {
        const userData = snapshot.val()
        if (userData) {
          setUserData(userData)
        }
        setLoadingUserData(false)
      })
    }
  }, [currentUser])

  useEffect(() => {
    console.log(data.length)
    setPost(data.length)
  }, [data])

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      const userId = currentUser.uid
      const menuRef = ref(db, 'users/' + userId)
      onValue(menuRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setUserData(data)
        }
        setLoadingUserData(false)
      })
    }
  }, [currentUser])

  const handleItem = (item) => {
    navigation.navigate('Recipe', { item }) // Pass the selected recipe as a parameter
  }

  const handleLogout = () => {
    auth.signOut()
    navigation.navigate('login')
  }

  const handleEditProfile = () => {
    navigation.navigate('EditProfile')
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerColumn1}>
          <Image
            style={styles.profileImage}
            source={{ uri: userData.image }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.headerColumn2}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.nameText}>{userData.username}</Text>
            <TouchableOpacity onPress={() => handleFollow()}>
              <Text style={styles.loqoutButton}> follow</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.statsText}>
            {`${post} posts ${userData.followers} followers ${userData.following} following`}
          </Text>
          <Text style={styles.additionalText}>{userData.bio}</Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 16,
            }}
          >
            <TouchableOpacity onPress={handleEditProfile}>
              <Text style={styles.loqoutButton}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleLogout()
              }}
            >
              <Text style={styles.loqoutButton}>Logout </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItem(item)}>
            <Image
              source={{ uri: item.imageLink }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        ListHeaderComponent={renderHeader}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerColumn1: {
    flex: 1,
    alignItems: 'center',
  },
  loqoutButton: {
    marginTop: 8,
    color: '#777',
    fontWeight: 'bold',
    borderBlockColor: '#777',
  },
  headerColumn2: {
    flex: 2,
    marginLeft: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsText: {
    marginTop: 8,
    color: '#555',
  },
  additionalText: {
    marginTop: 8,
    color: '#777',
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    margin: 2, // Adjust the margin as needed
  },
})

export default Profile
