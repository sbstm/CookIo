import React, { useEffect, useState } from 'react'
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
const RecipeReview = ({ route }) => {
  const selectedRecipe = route.params // Convert to string
  const [data, setData] = useState([])
  const [dataUser, setDataUser] = useState([])
  const currentUser = auth.currentUser
  const [like, setLike] = useState(false)

  const resepid = selectedRecipe.selectedRecipe.item.resepid

  const namaresep = selectedRecipe.selectedRecipe.item.judul
  const gambar = selectedRecipe.selectedRecipe.item.imageLink
  const descripsi = selectedRecipe.selectedRecipe.item.descripsi

  const handleLike = () => {
    setLike(!like)
  }

  useEffect(() => {
    const recipeRef = ref(db, 'Review/')
    onValue(recipeRef, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      if (data) {
        const dataArray = Object.values(data)
        const filteredData = dataArray.filter(
          (item) => item.recipeid === resepid
        )
        setData(filteredData)
        console.log(filteredData)
      }
    })
  }, [])

  const handleReview = () => {
    navigation.navigate('AddReview', { selectedRecipe })
  }

  return (
    <ScrollView>
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
                <View>
                  <Text>Description: {item.description}</Text>
                  <Text>Rating: {item.rating}</Text>
                  {/* Add more fields as needed */}
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

export default RecipeReview
