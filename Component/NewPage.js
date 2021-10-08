import React, {useState} from 'react';
import {
    View, Text, SafeAreaView, TouchableOpacity, TextInput,
    StyleSheet, StatusBar
} from 'react-native';


const NewPage  = ({navigation}) => {

  return (
      <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center' }}>

      <View>      
        <Text style={{fontSize:20}}> 새로운 페이지를 꾸며주세요 </Text>  
      </View>

      </SafeAreaView>
  );

}



export default NewPage;