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
    }link.href = "recomendaciones.html?profesor_id=" + profesor.id + "?profesor_apellidos=" + profesor.apellidos.replace(' ', '_')  + "?profesor_nombres=" + profesor.nombres.replace(' ', '_');
};

document.addEventListener('DOMContentLoaded', async function() {
    document.querySelector('#profesor-nombre').textContent = profesorApellidos.replace('_', ' ') + ', ' + profesorNombres.replace('_', ' ');
    const recomendaciones = await fetchRecomendaciones(profesorId);
    if(recomendaciones) {
        recomendaciones.forEach((recomendacion) => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';

            const comentario = document.createElement('p');
            comentario.textContent = recomendacion.comentario;
            reviewDiv.appendChild(comentario);

            const calificacionDiv = document.createElement('div');
            calificacionDiv.className = 'rating';
            const calificacionSpan = document.createElement('span');
            calificacionSpan.textContent = recomendacion.calificacion;
            calificacionDiv.appendChild(calificacionSpan);
            reviewDiv.appendChild(calificacionDiv);

            const reviews = document.querySelector('.reviews');
            reviews.appendChild(reviewDiv);
        });
    }
});