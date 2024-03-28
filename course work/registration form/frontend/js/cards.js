function sendDataToServer(cardType) {
    const selectElement = document.querySelector(`.${cardType}.back-face select`);
    const quantityInput = document.querySelector(`.${cardType}.back-face input[type="number"]`);
    const addressInput = document.querySelector(`.${cardType}.back-face input[type="text"]`);
  
    if (!selectElement || !quantityInput || !addressInput) {
      console.error(`Required elements for ${cardType} not found`);
      return;
    }
  
    const selectedOption = selectElement.value;
    const selectedQuantity = quantityInput.value;
    const enteredAddress = addressInput.value;
  
    const data = {
      type: cardType,
      option: selectedOption,
      quantity: selectedQuantity,
      address: enteredAddress
    };
  
    fetch('/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data saved successfully:', data);
        alert("Data saved successfully!");

        
        // Optionally, perform additional actions after successful data save
      })
      .catch(error => {
        console.error('There was a problem saving the data:', error);
        // Handle errors if necessary
      });
  }

