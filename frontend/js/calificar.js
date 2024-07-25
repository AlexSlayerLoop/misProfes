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

    //Mostrar las etiquetas
    const etiquetas = await fetchEtiquetas();
    if(etiquetas) {
        const etiquetasContainer = document.querySelector('#etiquetas-container');
        etiquetas.forEach(etiqueta => {
            const label = document.createElement('label');
            label.textContent = etiqueta.descripcion;
            const input = document.createElement('input');
            input.type = 'checkbox';
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
        try{
            const response = await postReview(review);
            if(response){
                window.location.href = "recomendaciones.html?profesor_id=" + profesorId+ 
                "&profesor_apellidos=" + profesorApellidos + 
                "&profesor_nombres=" + profesorNombres;
            }
        } catch(error){
            console.log(error);
        }
    });
});