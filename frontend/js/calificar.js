import { fetchData, postData } from "./requests.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const profesorId = urlParams.get('profesor_id');
const profesorApellidos = urlParams.get('profesor_apellidos')
const profesorNombres = urlParams.get('profesor_nombres')

document.addEventListener('DOMContentLoaded', async function(){
    document.querySelector('.volver').href = "recomendaciones.html?profesor_id=" + profesorId+ 
                "&profesor_apellidos=" + profesorApellidos + 
                "&profesor_nombres=" + profesorNombres;
    
    document.querySelector('.form-container h2').textContent = 'Calificar a ' + 
    profesorApellidos.replace('_', ' ') + ', ' + 
    profesorNombres.replace('_', ' ');

    const materias = await fetchData('http://localhost:8000/materias');

    const selectMateriaInput = document.querySelector('#materia');
    materias.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.clave;
        option.textContent = materia.nombre;
        selectMateriaInput.appendChild(option);
    });

    const etiquetas = await fetchData('http://localhost:8000/etiquetas');

    const etiquetasContainer = document.querySelector('#etiquetas-container');
    etiquetas.forEach(etiqueta => {
        const label = document.createElement('label');
        label.textContent = etiqueta.descripcion;
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('etiqueta-checkbox');
        input.id = etiqueta.id;
        label.appendChild(input);
        etiquetasContainer.appendChild(label);
    });

    const form = document.querySelector('#calificar-profesor-form');
    form.addEventListener('submit', async function(event){
        event.preventDefault();
        
        const comentarios = document.querySelector('#comentarios').value;
        const calificaion = document.querySelector('#calificacion').value;
        const facilidad = document.querySelector('#facilidad').value;
        const materiaSeleccionada = document.querySelector('#materia').value;

        const registroExiste = await fetchData('http://localhost:8000/materias_profesores/exists', materiaSeleccionada, profesorId);
        if(!registroExiste){
            const materiaProfesor = {
                clave_materia: materiaSeleccionada,
                id_profesor: profesorId
            };
            await postData('http://localhost:8000/materias_profesores', materiaProfesor);
        }
        
        const review = {
            comentario: comentarios,
            calificacion: calificaion,
            facilidad: facilidad,
            clave_materia: materiaSeleccionada
        };
        
        const response = await postData('http://localhost:8000/recomendaciones', review, profesorId);
        
        const etiquetasSeleccionadas = [];
        document.querySelectorAll('.etiqueta-checkbox:checked').forEach(etiqueta => {
            etiquetasSeleccionadas.push(etiqueta.id);
        });

        if(etiquetasSeleccionadas){
            const recomendacionId = response.id;
            for(const etiqueta of etiquetasSeleccionadas){
                const etiquetasRecomendacion = {
                    id_etiqueta: etiqueta,
                    id_recomendacion: recomendacionId
                };
                await postData('http://localhost:8000/etiquetas_recomendaciones', etiquetasRecomendacion);
            }            
        }

        window.location.href = "recomendaciones.html?profesor_id=" + profesorId+ 
                        "&profesor_apellidos=" + profesorApellidos + 
                        "&profesor_nombres=" + profesorNombres;
    });
});