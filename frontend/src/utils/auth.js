class Auth {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  signup( password, email ) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ password, email }),
    })
      .then(res => this._checkResponse(res));
  }; 

  signin( password, email ) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ password, email }),
    })
      .then(res => this._checkResponse(res));
  };

  checkTokenValidity( jwt ) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${jwt}`
      }
    })
      .then(res => this._checkResponse(res));
  };
}

  const auth = new Auth({
    baseUrl: "https://register.nomoreparties.co",
    headers: {
      "Content-Type": "application/json"
    }
  }); 
  
  export default auth;