function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type_card-view ${card ? 'popup_visible' : ''}`}>
      <div className="popup__container popup__card-container">
        <img src={card ? card.link : '#'} alt={card ? card.name : '#'} className="popup__image"/>
        <button type="button" className="popup__close-button" onClick={onClose} aria-label="Close popup"/>
        <p className="popup__card-title">{card ? card.name : ''}</p>
      </div> 
    </div>
  );
}

export default ImagePopup;