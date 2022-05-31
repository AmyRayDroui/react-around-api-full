import React from "react";
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({isOpen, onClose, onAddPlaceSubmit}) {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) { 
    e.preventDefault();
    onAddPlaceSubmit({
      name,
      link
    });
  }

  return (
    <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} name="add-card" title="New place" buttonText="Create">
          <input type="text" name="name" value={name} onChange={handleNameChange} className="popup__input popup__input_type_card-name" id="card-name-input" placeholder="Card name" required maxLength="30"/>
          <span className="popup__error card-name-input-error"></span>
          <input type="url" name="link" value={link} onChange={handleLinkChange} className="popup__input popup__input_type_card-link" id="card-link-input" placeholder="Card link" required/>
          <span className="popup__error card-link-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;