import { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup  from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import auth from '../utils/auth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {
  const history = useHistory();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isRegistered, setRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: '',
    description: '',
    avatar: null,
    id: ''
  });
  const [token, setToken] = useState('');
  api.setToken(token);
  
  useEffect(() => {
    if (localStorage.jwt) {
      auth.checkTokenValidity(localStorage.jwt)
      .then(res => {
        setToken(localStorage.jwt);
        setLoggedIn(true);
        setEmail(res.data.email);
        history.push('/');
      })
      .catch(err => {
        console.log(err);
      }); 
    }
    
    api.getUserInfo()
    .then(userInfo => {
      setCurrentUser({
        name: userInfo.name,
        description: userInfo.about,
        avatar: userInfo.avatar,
        _id: userInfo._id
      });
    })
    .catch((error) => {
      console.log(error);
    });

    api.getInitialCards()
    .then(serverCards => {
      setCards(serverCards);
    })
    .catch((error) => {
      console.log(error);
    });
  },[]);

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }

    document.addEventListener('keydown', closeByEscape)
    
    return () => document.removeEventListener('keydown', closeByEscape)
  }, []);


  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.toggleLike(card._id, !isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((error) => {
      console.log(error);
    });
  } 
  function handleCardDelete(card) {
    api.removeCard(card._id)
    .then(() => {
      setCards(() => cards.filter((c) => {return c._id !== card._id}));
    })
    .catch((error) => {
      console.log(error);
    });
  }


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(data) {
    api.setUserInfo(data)
    .then(userInfo => {
      setCurrentUser({
        name: userInfo.name,
        description: userInfo.about,
        avatar: userInfo.avatar,
        _id: userInfo._id
      });
      closeAllPopups();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function handleUpdateAvatar(data) {
    api.setUserAvatar(data)
    .then(userInfo => {
      setCurrentUser({
        name: userInfo.name,
        description: userInfo.about,
        avatar: userInfo.avatar,
        _id: userInfo._id
      });
      closeAllPopups();
    })
    .catch((error) => {
      console.log(error);
    });
  }


  function handleAddPlaceSubmit(data) {
    api.addNewCard(data)
    .then(newCard => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function changeEmail(event) {
    setEmail(event.target.value);
  }

  function changePassword(event) {
    setPassword(event.target.value);
  }

  function handleRegister(event) {
    event.preventDefault();
    auth.signup(password, email)
      .then((res) => {
        setRegistered(true);
      })
      .catch((err) => {
        console.log(err);
        setRegistered(false);
      })
      .finally(() => setIsInfoTooltipOpen(true));
  }

  function handleLogin(event) {
    event.preventDefault();
    auth.signin(password, email)
    .then((res) => {
      if (res.token) {
        localStorage.setItem('jwt', res.token);
        setToken(res.token);
      }
      setLoggedIn(true);
      history.push('/');
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleLogout() {
    localStorage.removeItem('jwt');
    setToken('');
    setLoggedIn(false);
    setEmail('');
    history.push('/signin');
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__wrapper">
          <Header email={email} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
          <Switch>
            <Route path='/signup'>
              <Register handleRegister={handleRegister} changeEmail={changeEmail} changePassword={changePassword} email={email} password={password}/>
            </Route>
            <Route path='/signin'>
              <Login handleLogin={handleLogin} changeEmail={changeEmail} changePassword={changePassword} email={email} password={password}/>
            </Route>
            <ProtectedRoute path='/' loggedIn={isLoggedIn}>
              <Main 
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onEditAvatarClick={handleEditAvatarClick}
                onCardClick={handleCardClick}
              />
            </ProtectedRoute>
          </Switch>
          <Footer />
        </div>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlaceSubmit={handleAddPlaceSubmit}/>
        <PopupWithForm name="remove-card" title="Are you sure?" buttonText="Yes"/>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isRegistered={isRegistered}/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
