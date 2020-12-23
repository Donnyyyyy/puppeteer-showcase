const logicOne = async () => {
  const buttonOne = document.querySelector('#button1');

  buttonOne.addEventListener('click', async () => {
    let redirectUrl = 'https://example.com/default/url/';
    try {
        const response = await fetch('/api/some/endpoint/?with=params');
        redirectUrl = await response.json();
    } catch (exc) {
        console.log(exc);
    }

    window.location = redirectUrl;
  });
};


logicOne();


const logicTwo = async () => {
  const buttonTwo = document.querySelector('#button2');

  buttonTwo.addEventListener('click', async () => {
    console.log('Hello from main.js!');
  });
};


logicTwo();
