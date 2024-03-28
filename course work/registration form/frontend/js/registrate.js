//очікування завершення завантаження DOM перед початком виконанням скрипту
document.addEventListener('DOMContentLoaded', function() {
    //отримання посилань на форму та її елементи
    const form = document.getElementById('form');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const password2 = document.getElementById('password2');
    const errorElements = document.querySelectorAll('.error');
    const radioButtons = document.querySelectorAll('input[name="role"]');

    let selectedRole = 'military';  //задання початкового значення для обраної ролі

    //додавання обробника події на радіокнопки для зміни обраної ролі
    radioButtons.forEach(button => {
        button.addEventListener('change', function() {
            selectedRole = this.value;
        });
    });

    //обробка події відправки форми
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        // очищення попередніх помилок
        errorElements.forEach(error => error.innerText = '');

        // валідація полів форми
        if (username.value.trim() === '') {
            displayError(username, 'Username is required'); //відображення помилки для імені користувача
            return;
        }

        if (email.value.trim() === '') {
            displayError(email, 'Email is required');  //відображення помилки для електронної пошти
            return;
        } else if (!isValidEmail(email.value.trim())) {
            displayError(email, 'Please enter a valid email address');//відображення помилки для неправильного формату електронної пошти
            return;
        }

        if (password.value === '') {
            displayError(password, 'Password is required'); //відображення помилки для пароля
            return;
        }

        if (password2.value === '') {
            displayError(password2, 'Please confirm your password'); // Відображення помилки для підтвердження пароля
            return;
        } else if (password.value !== password2.value) {
            displayError(password2, 'Passwords do not match'); // Відображення помилки для невідповідності паролів
            return;
        }

        if (selectedRole === '') {
            displayError(document.querySelector('.input-control:last-of-type .error'), 'Please select a role'); // Відображення помилки для вибору ролі
            return;
        }

        // Якщо всі дані пройшли валідацію, форма відправляється на сервер
        const formData = {
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value,
            role: selectedRole
        };

        try {
            // Відправлення даних на сервер методом POST через fetch
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Перенаправлення користувача на відповідну сторінку залежно від обраної ролі
                if (selectedRole === 'military') {
                    window.location.href = '/cards.html'; // Redirect military user to cards.html
                } else if (selectedRole === 'volunteer') {
                    window.location.href = '/requirements.html'; // Redirect volunteer user to requirements.html
                }
            } else {
                // Виведення помилок, отриманих від сервера
                const errors = await response.json();
                displayServerErrors(errors);
            }
        } catch (error) {
            console.error('Error:', error); // Виведення помилки у випадку невдачі відправлення запиту
        }
    });

    // Функція для відображення помилок поруч з полями вводу
    function displayError(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.innerText = message;
    }

    // Функція для перевірки правильності формату електронної пошти
    function isValidEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    // Функція для відображення помилок, отриманих від сервера
    function displayServerErrors(errors) {
        for (const field in errors) {
            const errorElement = document.querySelector(`#${field} + .error`);
            if (errorElement) {
                errorElement.innerText = errors[field];
            }
        }
    }
});
