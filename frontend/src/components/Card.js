import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = React.useContext(CurrentUserContext);

  function handleClick() {
    onCardClick(card);
  } 

  function handleLikeClick() {
    onCardLike(card);
  } 

  function handleDeleteClick() {
    onCardDelete(card);
  }

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `image-card__remove-button ${isOwn ? 'image-card__remove-button_visible' : 'image-card__remove-button_hidden'}`
  ); 

  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = (
    `image-card__love-button ${isLiked ? 'image-card__love-button_active' : 'image-card__love-button_disabled'}`
  ); 

  return (
  <div className="image-card">
    <div className="image-card__image" style={{ backgroundImage: `url(${card.link})` }} onClick={handleClick}></div>
    <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick} aria-label="remove an image"></button>
    <div className="image-card__name-container">
      <h2 className="image-card__name">{card.name}</h2>
      <div className="image-card__love-button-container">
        <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick} aria-label="Like an image"></button>
        <p className="image-card__love-count">{card.likes.length}</p>
      </div>
    </div>
  </div>
  );
}

export default Card;
