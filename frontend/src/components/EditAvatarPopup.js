import React from "react";
import PopupWithForm from './PopupWithForm';


function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const inputRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      link: inputRef.current.value
    });
  }

  return (
    <PopupWithForm isOpen={isOpen}  onClose={onClose} onSubmit={handleSubmit} name="edit-profile-image" title="Change profile picture" buttonText="Save">
          <input  ref={inputRef} type="url" name="link" className="popup__input popup__input_type_profile-img-link" id="profile-img-link-input" placeholder="Enter new link" required/>
          <span className="popup__error profile-img-link-input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;