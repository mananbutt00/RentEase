import { View, Text, TextInput } from 'react-native';
import React from 'react';

const InputBox = ({ Title, secureTextEntry=false,value,setValue}) => {
  return (
    <View>
      <Text>{Title}</Text>
      <TextInput
        
      
        maxLength={40}
        secureTextEntry={secureTextEntry} 
        style={{ padding: 5, backgroundColor: 'white' }}
        value={value}
        onChangeText={(text) =>setValue(text)}
      />
    </View>
  );
};

export default InputBox;
