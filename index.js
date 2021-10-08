/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './App';                       // App.js파일 가져오기
 import {name as appName} from './app.json';    // 앱 프로젝트 파일 명
 
 // AppRegistry 는 App 의 루트 Component 를 지정하여, 어플리케이션 시작을 등록하는 API 이다.
 // registerComponent에 앱 프로젝트 파일 명과  App 컴포넌트를 등록해서 첫 진입점을 설정한다. 
 AppRegistry.registerComponent(appName, () => App);
 