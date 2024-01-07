import { useEffect, useState } from 'react'
import * as React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native'
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

const Review = ({ route }) => {
  const selectedRecipe = route.params // Convert to string
  const [data, setData] = useState([])
  const [dataUser, setDataUser] = useState([])
  const currentUser = auth.currentUser
  const [like, setLike] = useState(false)
  const navigation = useNavigation()

  const resepid = selectedRecipe.selectedRecipe.item.resepid.toString()
  console.log(resepid)

  const namaresep = selectedRecipe.selectedRecipe.item.judul
  const gambar = selectedRecipe.selectedRecipe.item.imageLink
  const descripsi = selectedRecipe.selectedRecipe.item.descripsi

  const handleLike = () => {
    setLike(!like)
  }

  const handleback = () => {
    navigation.goBack()
    return true
  }
  useEffect(() => {
    const recipeRef = ref(getDatabase(), 'Review/')
    onValue(recipeRef, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      if (data) {
        const dataArray = Object.values(data)
        console.log(dataArray)
        const filteredData = dataArray.filter((item) =>
          item.recipeid.toString().includes(resepid)
        )
        console.log(filteredData)
        setData(filteredData)
      }
    })
  }, [resepid])

  const handleReview = () => {
    navigation.navigate('AddReview', { resepid })
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

  return (
    <ScrollView>
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.avatar} source={{ uri: 'user_avatar_url' }} />
          <Text style={styles.username}>{/* User's username */}</Text>
        </View>
        <Image style={styles.postImage} source={{ uri: gambar }} />
        <View style={styles.footer}>
          <Text style={styles.postTitle}>{namaresep}</Text>
          <Text style={styles.postDescription}>{descripsi}</Text>
        </View>
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike()}
          >
            {like ? (
              <Icon name="heart" size={20} color="red" />
            ) : (
              <Icon name="heart-o" size={20} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReview()}
          >
            <Icon name="comment-o" size={20} color="black" />
            <Text style={styles.actionText}>Review Resep</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.postTitle}>Review</Text>
          <View>
            <FlatList
              data={Object.values(data)}
              keyExtractor={(item) => item.recipeid}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 15,
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Image style={styles.avatar} source={item.imageLink} />
                      <Text style={styles.username}>{item.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      {renderRatingIcons(item.rating)}
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  footer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 16,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'end',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
})

export default Review
