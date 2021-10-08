import React from 'react';

// 파일 가져오기
import Main from './Component/Main'
import NewPage from './Component/NewPage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// createStackNavigator: 페이지를 Stack에 쌓아두어 이동하는 방법이다
const Stack = createStackNavigator();

const App = () =>{
  // Stack.Screen: 경로 이름과 불러올 컴포넌트를 지정해준다.
  // NavigationContainer 로 감싸져 있기 때문에 Props 로 navigation 객체가 내려온다.
  return(
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown:false
        }} >
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="NewPage" component={NewPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;