function PopupWithForm({children, isOpen, onClose, onSubmit, name, title, buttonText}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_visible' : ''}`}>
      <div className="popup__container">
        <button type="button" className="popup__close-button" onClick={onClose} aria-label="Close popup" />
        <h2 className="popup__title">{title}</h2>
        <form onSubmit={onSubmit} className="popup__form" name={name}>
          {children}
          <button type="submit" className="popup__save-button" aria-label="Submit">{buttonText}</button>
        </form>
      </div> 
    </div>
  );
}

export default PopupWithForm;