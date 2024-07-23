const postProfesor = async function(profesor) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profesor)
    };
    try {
        const response = await fetch('http://localhost:8000/profesores/', options);
        if (!response.ok) {
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

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
        
        await postProfesor(profesor);
        window.location.href = 'index.html'

    });
});