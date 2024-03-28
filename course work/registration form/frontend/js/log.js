// Очікування завершення завантаження DOM перед виконанням скрипту
document.addEventListener('DOMContentLoaded', function() {
  // Отримання посилань на форму та її елементи
  const form = document.getElementById('form');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const errorElements = document.querySelectorAll('.error'); // Отримання всіх елементів для відображення помилок
  const radioButtons = document.querySelectorAll('input[name="role"]'); // Отримання всіх радіокнопок ролі
  
  let selectedRole = 'military'; // Задання початкового значення для обраної ролі
  
  // Додавання обробника події на радіокнопки для зміни обраної ролі
  radioButtons.forEach(button => {
    button.addEventListener('change', function() {
      selectedRole = this.value;
    });
  });

  // Обробка події відправки форми
  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Заборона стандартної відправки форми
    errorElements.forEach(error => error.innerText = ''); // Очищення попередніх помилок
    
    // Формування об'єкта даних зі значеннями полів форми
    const formData = {
      username: username.value.trim(),
      password: password.value,
      role: selectedRole
    };

    try {
      // Відправлення даних на сервер методом POST через fetch
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) { 
        if (selectedRole === 'military') { 
            window.location.href = '/cards.html'; // Redirect military user to cards.html 
        } else if (selectedRole === 'volunteer') { 
            window.location.href = '/requirements.html'; // Redirect volunteer user to requirements.html 
        } 
    } else { 
        const errors = await response.json(); 
        displayServerErrors(errors); 
    } 
} catch (error) { 
    console.error('Error:', error); 
} 

  });

  // Helper functions (displayError, displayServerErrors, isValidEmail) can remain the same
});