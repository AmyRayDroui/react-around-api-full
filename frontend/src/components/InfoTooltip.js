import successIcon from '../images/icons/success_icon.svg'
import deniedIcon from '../images/icons/denied_icon.svg'

function InfoTooltip({ isOpen, onClose, isRegistered }) {
    return(
        <div className={`popup popup_type_tooltip ${isOpen ? 'popup_visible' : ''}`}>
            <div className="popup__container popup__container_type_tooltip">
                <button type="button" className="popup__close-button" onClick={onClose} aria-label="Close popup" />
                {
                    isRegistered ? 
                    <>
                        <img src={successIcon} alt="success" className="popup__icon"></img>
                        <h3 className="popup__title popup__title_type_tooltip">Success! You have now been registered.</h3>
                    </> :
                    <>
                        <img src={deniedIcon} alt="denied" className="popup__icon"></img>
                        <h3 className="popup__title popup__title_type_tooltip">Oops, something went wrong! Please try again.</h3>
                    </>    
                }
            </div>
        </div>
    );
}


export default InfoTooltip;