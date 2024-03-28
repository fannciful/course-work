document.addEventListener('DOMContentLoaded', function() {
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const username = document.getElementById('username');
  
    deleteAccountButton.addEventListener('click', async function() {
      const enteredUsername = username.value.trim();
  
      try {
        const response = await fetch(`/delete-account/${enteredUsername}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Account deleted:', result);
          alert("Account deleted!");
          // Handle successful account deletion, such as displaying a message
        } else {
          const error = await response.json();
          console.error('Error:', error);
          alert("Error!");
          // Handle error, show error message, etc.
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    // Other logic or event listeners can be added as needed
  });
  