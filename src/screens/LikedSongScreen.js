import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

export default function LikedSongScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [searchedTracks, setSearchedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    const options = {
      method: 'GET',
      url: 'https://shazam.p.rapidapi.com/search',
      params: {
        term: searchText,
        locale: 'tr-TR',
        offset: '0',
        limit: '5',
      },
      headers: {
        'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY',
        'x-rapidapi-host': 'shazam.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(options);
      setSearchedTracks(response.data.tracks.hits || []);
    } catch (error) {
      alert('Error fetching songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = track => {
    setSelectedTrack(track);
    setModalVisible(true);
  };

  return (
    <LinearGradient colors={['#614385', '#516395']} style={{flex: 1}}>
      <ScrollView style={{flex: 1, marginTop: 50}}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{marginHorizontal: 10}}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <View style={{marginHorizontal: 10, marginTop: 10}}>
          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={20} color="white" />
            <TextInput
              placeholder="Find in liked songs"
              placeholderTextColor="white"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>

        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Text style={styles.title}>Liked Songs</Text>
          <Text style={styles.subtitle}>{searchedTracks.length} songs</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="gray"
            style={{marginTop: 20}}
          />
        ) : searchedTracks.length > 0 ? (
          <FlatList
            data={searchedTracks}
            keyExtractor={item => item.track.key}
            renderItem={({item}) => (
              <Pressable onPress={() => handlePlay(item)}>
                <View style={styles.trackContainer}>
                  <Image
                    source={{
                      uri:
                        item.track.images?.coverart ||
                        'https://via.placeholder.com/150',
                    }}
                    style={styles.albumCover}
                  />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackName}>
                      {item.track.title || 'Unknown Title'}
                    </Text>
                    <Text style={styles.albumName}>
                      {item.track.subtitle || 'Unknown Subtitle'}
                    </Text>
                  </View>
                  <Entypo name="controller-play" size={24} color="white" />
                </View>
              </Pressable>
            )}
          />
        ) : (
          <Text style={styles.noResults}>
            No results found. Try a different search.
          </Text>
        )}
      </ScrollView>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection="down" //modal ın hangi yöne kaydırılacağını belirlemek için
        style={{margin: 0}}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {selectedTrack?.track?.title || 'Unknown Song'}
          </Text>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#42275a',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: 'white',
    marginTop: 5,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#42275a',
    borderRadius: 8,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  trackName: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  albumName: {
    fontSize: 12,
    color: 'gray',
  },
  noResults: {
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#5072a7',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
