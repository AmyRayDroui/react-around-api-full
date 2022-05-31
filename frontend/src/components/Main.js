import React from 'react';
import Card from './Card.js';
import api from '../utils/api.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext';


function Main({cards, onCardLike, onCardDelete, onEditAvatarClick, onEditProfileClick, onAddPlaceClick, onCardClick}) {
  

  const currentUser = React.useContext(CurrentUserContext);



  return (
    <main className="content">
    <section className="profile">
      <div className="profile__image-container">
        <img id="profile-image" src={currentUser.avatar} alt={`${currentUser.name}'s avatar`} className="profile__image"/>
        <button className="profile__image-overlay" onClick={onEditAvatarClick} />
      </div>
      <div className="profile__container profile__overflow-element">
        <h1 className="profile__name profile__overflow-element">{currentUser.name}</h1>
        <button type="button" className="profile__button profile__button_type_edit" onClick={onEditProfileClick} aria-label="Edit profile" />
      </div>
      <p className="profile__info profile__overflow-element">{currentUser.description}</p>
      <button type="button" className="profile__button profile__button_type_add-image" onClick={onAddPlaceClick} aria-label="Add image" />
    </section>
    <section className="images-container">
      {
        cards.map((cardElement) => 
        (
          <Card card={cardElement} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} key={cardElement._id}/>
        ))
      }
    </section>
    </main>
  );
}

export default Main;