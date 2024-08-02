const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const profesorId = urlParams.get('profesor_id');
const profesorApellidos = urlParams.get('profesor_apellidos')
const profesorNombres = urlParams.get('profesor_nombres')

const postReview = async function(review){
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    };
    try{
        const response = await fetch(`http://localhost:8000/profesor/${profesorId}/recomendacion`, options);
        if(!response.ok){
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
};

const fetchEtiquetas = async function(){
    try{
        const response = await fetch('http://localhost:8000/etiquetas/');
        if(!response.ok){
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
    }
};

const postEtiquetasRecomendaciones = async function(etiquetas, recomendacionId){
    for(const etiqueta of etiquetas){
        try{
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_etiqueta: Number(etiqueta),
                    id_recomendacion: Number(recomendacionId)
                })
            };
            const response = await fetch(`http://localhost:8000/etiquetas_recomendaciones/`, options);
            if(!response.ok){
                throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
            }
        } catch(error){
            console.log(error);
        }
    }
};

const fetchMaterias = async function(){
    try{
        const response = await fetch('http://localhost:8000/materias');
        if(!response.ok){
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error){
        console.error(error);
    }
};

const postMateriaProfesor = async function(materiaId, profesorId){
    try{
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clave_materia: materiaId,
                id_profesor: Number(profesorId)
            })
        };
        const response = await fetch('http://localhost:8000/materias_profesores/', options);
        if(!response.ok){
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
    } catch(error){
        console.log(error);
    }

};

const existsMateriaProfesor = async function(claveMateria, profesorId){
    try{
        const response = await fetch(`http://localhost:8000/materias_profesores/exists/${claveMateria}/${profesorId}`);
        if(!response.ok){
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
};

document.addEventListener('DOMContentLoaded', async function(){
    //Agregar link para volver a la página de recomendaciones
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = "recomendaciones.html?profesor_id=" + profesorId+ 
                "&profesor_apellidos=" + profesorApellidos + 
                "&profesor_nombres=" + profesorNombres;
    link.textContent = 'Volver';
    link.classList.add('volver');
    li.appendChild(link);
    document.querySelector('nav ul').appendChild(li);

    //Mostrar el nombre del profesor que se esta calificando
    document.querySelector('.form-container h2').textContent = 'Calificar a ' + 
    profesorApellidos.replace('_', ' ') + ', ' + 
    profesorNombres.replace('_', ' ');

    // Agregar materias al input tipo select para seleccionar la materia que el
    // profesor impartio al usuario que lo esta calificando
    const materias = await fetchMaterias();
    if(materias){
        const selectMateriaInput = document.querySelector('#materia');
        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.clave;
            option.textContent = materia.nombre;
            selectMateriaInput.appendChild(option);
        });
    }

    //Mostrar las etiquetas
    const etiquetas = await fetchEtiquetas();
    if(etiquetas) {
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
    }
    
    const form = document.querySelector('#calificar-profesor-form');
    form.addEventListener('submit', async function(event){
        event.preventDefault();
        
        const comentarios = document.querySelector('#comentarios').value;
        const calificaion = document.querySelector('#calificacion').value;
        const facilidad = document.querySelector('#facilidad').value;
        const review = {
            comentario: comentarios,
            calificacion: calificaion,
            facilidad: facilidad
        };
        
        let response;
        let recomendacionId;

        try{
            response = await postReview(review);
            recomendacionId = response.id;
        } catch(error){
            console.log(error);
        }
        
        const etiquetasSeleccionadas = [];
        document.querySelectorAll('.etiqueta-checkbox:checked').forEach(etiqueta => {
            etiquetasSeleccionadas.push(etiqueta.id);
        });

        if(etiquetasSeleccionadas){
            try{
                recomendacionId = response.id;
                response = await postEtiquetasRecomendaciones(etiquetasSeleccionadas, recomendacionId);
            } catch(error){
                console.log(error);
            }
        }

        const materiaSeleccionada = document.querySelector('#materia').value;
        const registroExiste = await existsMateriaProfesor(materiaSeleccionada, profesorId);
        if(!registroExiste){
            response = await postMateriaProfesor(materiaSeleccionada, profesorId);
        }

        window.location.href = "recomendaciones.html?profesor_id=" + profesorId+ 
                        "&profesor_apellidos=" + profesorApellidos + 
                        "&profesor_nombres=" + profesorNombres;
    });
});