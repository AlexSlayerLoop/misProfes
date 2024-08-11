import { postData } from "./requests.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#profesor-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const nombres = document.querySelector('#nombres').value;
        const apellidos = document.querySelector('#apellidos').value;
        const profesor = {
            apellidos: apellidos,
            nombres: nombres
        }
        
        await postData('http://localhost:8000/profesores', profesor);

        window.location.href = 'index.html'

    });
});