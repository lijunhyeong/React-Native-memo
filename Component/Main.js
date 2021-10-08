import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';

import { SafeAreaView, StyleSheet, View, Text, 
  TextInput, TouchableOpacity, FlatList, Alert, Modal
} from 'react-native';
import ICON from "react-native-vector-icons/MaterialIcons";


// Color 기본 값
// primary, white 키 명칭 임의로 지정
const COLORS = {primary: '#1f145c', white:'#fff'};

const Main  = ({navigation}) => {
    
  // useState: 상태 변화 및 유지
  // const [<상태 값 저장 변수>, <상태 값 갱신 함수>] =  useState(<상태 초기 값>);

  // 글 입력
  const [textInput, setTextInput] = useState('');
  // 목록 저장 배열
  const [todos, setTodos] = useState([]);

  // 수정창
  const [isModalVisible, setisModalVisible] = useState(false);
  // 해당 데이터가 변경시에 FlatList가 리렌더링되는 속성
  const [isRender, setisRender] = useState(false)
  // 수정 입력
  const [inputText, setinputText] = useState();
  // 수정할 id, text 가져오기
  const [editItem, seteditItem] = useState();  
  

  // Hook API중 하나로 이벤트 처리 기능을 한다.
  // useEffect는 페이지가 처음 렌더링 되면 무조건 한 번 실행됨.
  useEffect(()=>{
    getTodosFromUserDevice();
  }, []);

  // 컴포넌트가 업데이트 될 때마다 useEffect 안의 콜백함수가 실행된다.
  useEffect(()=> {
    saveTodoToUserDevice(todos);
  }, [todos]);

  // 저장 목록 가져오기
  // AsyncStorage는 React Native에 내장된 기본 데이터 저장소(로컬 데이터 저장소)로, 간단한 키-값쌍 데이터를 저장해 관리할 수 있다.
  // todo
  const getTodosFromUserDevice = async () => {
    try{
      // 'todos' 불러오기
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null){
        // JSON.parse: string 객체를 JSON 객체로 변환시켜준다.
        setTodos(JSON.parse(todos));
      }
    }catch(error){
      console.log(error);
    }
  };
  // 기기에 저장
  const saveTodoToUserDevice = async todos =>{
    try {
      // JSON.stringify란? stringify 메소드는 json 객체를 String 객체로 변환시킴
      const stringifyTodos = JSON.stringify(todos); 
      // stringifyTodos을 'todos'에 저장
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (e) {
      // saving error
      console.log(e);
    }
  }

  // 추가
  const addTodo = () => {
    if(textInput == ""){
      Alert.alert("!!", "글자를 입력해주세요 :)");
    }else{
      console.log(textInput);
      const newTodo = {
        id:Math.random(),
        task: textInput,
        completed: false,
      };
      // ... 펼침연산자: 배열 복제 가능
      // ...todos를 통해 기존 배열에 newTodo를 추가해서 새로운 배열 생성
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  // 할 일 완료
  const markTodoComplete = todoId => {
    // map(): 각 배열의 요소를 돌면서 인자로 전달된 함수를 사용하여 새로운 결과를 새로운 배열에 담아 반환한다.
    const newTodos = todos.map((item)=>{
      if(item.id == todoId){
        return{...item, completed: true};
      }
      return item;
    });
      setTodos(newTodos);
  };

  // 삭제
  const deleteTodo = todoId => {
    // filter(): 주어진 함수의 테스트를 통과하는 모든 요소를 모아 새로운 배열로 반환한다.
    const newTodos = todos.filter(item => item.id != todoId);
    setTodos(newTodos);
  };

  // 해당 리스트 아이템의 id와 text 가져오기.
  const onPressItem = todo =>{
    setisModalVisible(true);
    // text 가져오기
    setinputText(todo.task);
    // id 가져오기
    seteditItem(todo.id)
  }

  // 수정
  const handleEditItem = editItem =>{
    const newTodos = todos.map(item => {
      if(item.id == editItem){
        item.task = inputText
        return item;
      }
      return item;
    })
    setTodos(newTodos);
    setisRender(!isRender);
  }

  // 수정 완료 버튼
  const onPressSaveEdit = () =>{
    handleEditItem(editItem); // 입력 텍스트를 데이터에 저장
    setisModalVisible(false); // modal 닫기
  }

  // 리스트 아이템(랜더 아이템을 받아옴)
  const ListItem = ({todo}) => {
    return( 
        <View style={styles.listItem}>
          <View style={{flex:1}}>
              <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: COLORS.primary,
                    textDecorationLine: todo?.completed ? 'line-through' : 'none',
                  }}>
                  {todo?.task}
                </Text>
          </View>

          { !todo?.completed && (
            <TouchableOpacity 
              style={[styles.actionIcon]} 
              onPress={()=>markTodoComplete(todo?.id)}>
              <ICON name="done" size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionIcon, {backgroundColor:'skyblue'}]} 
            onPress={()=> onPressItem(todo)}>
            <ICON name="edit" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionIcon, {backgroundColor:'red'}]} 
            onPress={()=>deleteTodo(todo?.id)}>
            <ICON name="delete" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      );
  };

  // 전체 삭제
  const clearTodos = () => {
    Alert.alert("알림", "모두 삭제하시겠습니까?", [
      {
        text: '네',
        onPress: () => setTodos([]),
      },
      {
        text: '아니요',
      }
    ])
  };
  
  // SafeAreaView는 시계 및 시간 등이 나오는 영역을 피하게 뷰를 지정
  // renderItem: 화면에 어떻게 리스트가 보여지는지 설정
  // onChangeText: 오직 text만을 반환한다.
  return(
    <SafeAreaView style={{flex:1, backgroundColor: COLORS.white}} >
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>메모장</Text>
        <ICON name="delete" size={25} color="red" onPress={clearTodos} />
      </View>

      <TouchableOpacity 
        style={{justifyContent:'center', alignItems:'center', backgroundColor: COLORS.primary}}
        onPress={()=> {navigation.navigate('NewPage')}}>
        <Text style={{color:COLORS.white, fontSize:20}}>내비게이션 화면 이동</Text>
      </TouchableOpacity>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding:20, paddingBottom:100}}
        data={todos} 
        renderItem={({item}) => <ListItem todo={item} /> } 
        keyExtractor={(item) => item.id.toString()}
        extraData={isRender}
      />

      <View style={styles.footer}> 
        <View style={styles.inputContainer}> 
          <TextInput 
            placeholder="글을 입력해주세요" 
            value={textInput}
            onChangeText={(text)=>setTextInput(text)}
            multiline={true} 
          />
        </View>
      <TouchableOpacity onPress={addTodo}>
        <View style={styles.iconContainer}>
          <ICON name="add" color={COLORS.white} size={30}/>
        </View>
      </TouchableOpacity> 
      </View>

      <Modal
        style={{flex:1, backgroundColor: COLORS.white}}
        animationType='fade'
        visible={isModalVisible}
        onRequestClose={()=>setisModalVisible(false)}
      >
        <View style={styles.header} >
          <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>수정하기</Text>
        </View>

        <View style={{alignItems:'center', justifyContent:'center'}}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text)=> setinputText(text)}
            defaultValue={inputText}
            editable={true}
            multiline={true}
          />
          <TouchableOpacity
            onPress={()=> onPressSaveEdit()}  
            style={styles.touchableSave}
          >
            <Text style={{color: COLORS.white, fontSize: 25, marginVertical:20}}>Save</Text>
          </TouchableOpacity>
        </View>
        
      </Modal>



    </SafeAreaView>
  );


};

const styles = StyleSheet.create({
  actionIcon:{
    height:25,
    width:25,
    backgroundColor: 'green',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:5,
    borderRadius: 3,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  header:{
    padding:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  footer:{
    position:'absolute',
    bottom:0,
    color:COLORS.white,
    width: '100%',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal: 20,
  },
  inputContainer:{
    backgroundColor: COLORS.white,
    elevation: 40,    // 그림자
    flex: 1,
    height: 50,
    marginVertical:20,
    marginRight:20,
    marginLeft:20,
    borderRadius:30,
    paddingHorizontal:20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput:{
    width: '90%',
    height: '70%',
    borderColor: 'grey',
    borderWidth: 1,
    fontSize: 25,  
  },
  touchableSave:{
    backgroundColor:'skyblue',
    width: '100%',
    alignItems:'center',
    marginTop: 20,
  }
});

export default Main;
