import { fetchData } from './requests.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const profesorId = urlParams.get('profesor_id');
const profesorApellidos = urlParams.get('profesor_apellidos')
const profesorNombres = urlParams.get('profesor_nombres')

document.addEventListener('DOMContentLoaded', async function() {
    const calificarLink = document.querySelector('.calificar-profesor');
    calificarLink.href = "calificar.html?profesor_id=" + profesorId + 
            "&profesor_apellidos=" + profesorApellidos.replace(' ', '_') + 
            "&profesor_nombres=" + profesorNombres.replace(' ', '_');

    document.querySelector('#profesor-nombre').textContent = profesorApellidos.replace('_', ' ') + ', ' + profesorNombres.replace('_', ' ');

    const profesor = await fetchData('http://localhost:8000/profesores', profesorId);
    document.querySelector('.calidad-general .grade').textContent = profesor.promedio === 'None' ? '' : profesor.promedio;
    document.querySelector('.dificultad .grade').textContent = profesor.facilidad === 'None' ? '' : profesor.facilidad;
    
    const recomendacionesIds = [];

    const recomendaciones = await fetchData('http://localhost:8000/recomendaciones', profesorId);
    for (const recomendacion of recomendaciones) {
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

        const materiaTd = document.createElement('td');
        const materia = await fetchData('http://localhost:8000/materias', recomendacion.clave_materia);
        materiaTd.textContent = materia.nombre;
        row.appendChild(materiaTd);

        document.querySelector('.reviews-table tbody').appendChild(row);

        recomendacionesIds.push(recomendacion.id);
    }
    
    if (recomendacionesIds) {
        const etiquetasCount = new Map();
        for(const recomendacionId of recomendacionesIds) {
            const etiquetasRecomendaciones = await fetchData('http://localhost:8000/etiquetas_recomendaciones', recomendacionId);
            for(const etiquetaRecomendacion of etiquetasRecomendaciones) {
                if (etiquetasCount.has(etiquetaRecomendacion.id_etiqueta)) {
                    etiquetasCount.set(etiquetaRecomendacion.id_etiqueta, etiquetasCount.get(etiquetaRecomendacion.id_etiqueta) + 1);
                } else {
                    etiquetasCount.set(etiquetaRecomendacion.id_etiqueta, 1);
                }
            }
        }
        
        for(const [etiquetaId, count] of etiquetasCount) {
            const etiqueta = await fetchData('http://localhost:8000/etiquetas', etiquetaId);

            const etiquetaDiv = document.createElement('div');
            etiquetaDiv.classList.add('etiqueta');

            const descripcionSpan = document.createElement('span');
            descripcionSpan.textContent = etiqueta.descripcion;
            descripcionSpan.classList.add('descripcion');
            etiquetaDiv.appendChild(descripcionSpan);

            const contadorSpan = document.createElement('span');
            contadorSpan.textContent = '(' + count + ')';
            contadorSpan.classList.add('contador');
            etiquetaDiv.appendChild(contadorSpan);

            document.querySelector('#etiquetas-container').appendChild(etiquetaDiv);
        }
    }
});