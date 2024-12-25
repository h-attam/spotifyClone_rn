import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'

export default function SongItem() {
  return (
    <View>
      <Pressable>
        <Image source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKt1unDjleka81_C2UdvKUFRPvac5YVziLiw&s'}} style={{width:50, height:50}}/>
      </Pressable>
    </View>
  )
}