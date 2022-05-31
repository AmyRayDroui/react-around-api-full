import React from "react";
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.description);
  }, [currentUser, isOpen]); 


  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      info: description,
    });
  }


  return (
    <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} name="edit-profile" title="Edit profile" buttonText="Save">
          <input type="text" value={name} onChange={handleNameChange} name="name" className="popup__input popup__input_type_name" id="name-input" required minLength="2" maxLength="40"/>
          <span className="popup__error name-input-error"></span>
          <input type="text" value={description} onChange={handleDescriptionChange} name="info" className="popup__input popup__input_type_info" id="info-input" required minLength="2" maxLength="200"/>
          <span className="popup__error info-input-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;