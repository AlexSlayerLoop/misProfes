const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const profesorId = urlParams.get('profesor_id');
const profesorApellidos = urlParams.get('profesor_apellidos')
const profesorNombres = urlParams.get('profesor_nombres')

const fetchRecomendaciones = async function(profesorId) {
    try {
        const response = await fetch('http://localhost:8000/profesor/' + profesorId + '/recomendaciones');
        if (!response.ok) {
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const fetchProfesor = async function(profesorId) {
    try {
        const response = await fetch('http://localhost:8000/profesores/' + profesorId)
        if (!response.ok) {
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    //Crear boton para calificar al profesor
    const calificarLink = document.createElement('a');
    calificarLink.href = "calificar.html?profesor_id=" + profesorId + 
            "&profesor_apellidos=" + profesorApellidos.replace(' ', '_') + 
            "&profesor_nombres=" + profesorNombres.replace(' ', '_');
    calificarLink.textContent = 'Calificar';
    calificarLink.classList.add('calificar-profesor');
    const li = document.createElement('li');
    li.appendChild(calificarLink);
    document.querySelector('nav ul').appendChild(li);

    //Mostrar el nombre del profesor
    document.querySelector('#profesor-nombre').textContent = profesorApellidos.replace('_', ' ') + ', ' + profesorNombres.replace('_', ' ');

    //Mostrar las metricas del profesor
    const profesor = await fetchProfesor(profesorId);
    if(profesor) {
        document.querySelector('.calidad-general .grade').textContent = profesor.promedio === 'None' ? '' : profesor.promedio;
        document.querySelector('.dificultad .grade').textContent = profesor.facilidad === 'None' ? '' : profesor.facilidad;
    }
    
    const recomendaciones = await fetchRecomendaciones(profesorId);
    if(recomendaciones) {
        const tableBody = document.querySelector('.reviews-table tbody');
        recomendaciones.forEach((recomendacion) => {
            const row = document.createElement('tr');

            const comentarioTd = document.createElement('td');
            comentarioTd.textContent = recomendacion.comentario;
            row.appendChild(comentarioTd);

            const calificacionTd = document.createElement('td');
            calificacionTd.textContent = recomendacion.calificacion;
            row.appendChild(calificacionTd);

            const facilidadTd = document.createElement('td');
            facilidadTd.textContent = recomendacion.facilidad;
            row.appendChild(facilidadTd);

            tableBody.appendChild(row);
        });
    }
});