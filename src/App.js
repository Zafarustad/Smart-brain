import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForn';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const app = new Clarifai.App({
  apiKey: 'cc22ed09b3f64e8194c71d9d3cae3a9c'
 });


const particlesParams = {
  "particles": {
    "number": {
        "value": 50
    },
    "size": {
        "value": 3
    },
},
"interactivity": {
    "events": {
        "onhover": {
            "enable": true,
            "mode": "repulse"
        }
   }
}
}

const initialState =  {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:{
    id: '',
    name: '',
    email: '',
    entries: '',
    joined: '' 
  }
}
class App extends Component {
  constructor(){
    super()
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined 
    }})
  }

calculateFaceLocation = (data) =>{
  const  clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height),
  }
}

faceBox = (box) => {
  this.setState({box});
}

  onEventChange = (event) =>{
    this.setState({input : event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {  
      if(response) {
        fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
        id: this.state.user.id,
        
      })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, {entries: count}))
    })
  }
      this.faceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err))
}

onRouteChange = (route) =>{
  if(route==='signout'){
    this.setState(initialState)
  }
  else if(route==='home'){
     this.setState({isSignedIn: true})
  }
  this.setState({route: route})
}
  
  render() {
    const { imageUrl, box, isSignedIn, route } = this.state;
      return (
      <div className="App">
         <Particles className="particles"
                params={particlesParams} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ? <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm 
          onEventChange={this.onEventChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div> 
        : (
          route==='signin'
        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
        }
      </div>
    );
  }
}

export default App;


    