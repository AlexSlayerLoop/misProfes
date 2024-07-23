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