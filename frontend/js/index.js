const fetchProfesores = async function() {
    try {
        const response = await fetch('http://localhost:8000/profesores/');
        if (!response.ok) {
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
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

const fetchProfesoresByMateria = async function(claveMateria){
    try{
        const response = await fetch(`http://localhost:8000/materias_profesores/${claveMateria}`);
        if(!response.ok){
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }   
        const data = await response.json();
        return data;    
    } catch(error){
        console.error(error);
    } 
};

const fetchProfesor = async function(profesorId) {
    try{
        const response = await fetch(`http://localhost:8000/profesores/${profesorId}`);
        if(!response.ok){
            throw new Error('Respuesta de red incorrecta.Estado: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
    }
};

const loadProfesoresTable = function(profesores){
    const tableBody = document.querySelector('.profesor-table tbody');
    profesores.forEach(profesor => {
        const row = document.createElement('tr');
        
        const apellidosTd = document.createElement('td');
        apellidosTd.textContent = profesor.apellidos;
        row.appendChild(apellidosTd);

        const nombresTd = document.createElement('td');
        nombresTd.textContent = profesor.nombres;
        row.appendChild(nombresTd);

        const promedioTd = document.createElement('td');
        promedioTd.textContent = profesor.promedio;
        row.appendChild(promedioTd);

        const calificarTd = document.createElement('td');
        const link = document.createElement('a');
        link.href = "recomendaciones.html?profesor_id=" + profesor.id + 
        "&profesor_apellidos=" + profesor.apellidos.replace(' ', '_') + 
        "&profesor_nombres=" + profesor.nombres.replace(' ', '_');

        link.textContent = 'Calificar';
        link.classList.add('calificar-link');
        calificarTd.appendChild(link);
        row.appendChild(calificarTd);

        tableBody.appendChild(row);
    });
};

const resetProfesorTable = function(){
    const tableBody = document.querySelector('.profesor-table tbody');
    tableBody.innerHTML = '';
};

const updateProfesoresTable = async function(claveMateria){
    resetProfesorTable();
    let profesores;
    if(claveMateria){
        profesores = [];
        const profesoresMateria = await fetchProfesoresByMateria(claveMateria);
        for(const profesorMateria of profesoresMateria){
            const profesor = await fetchProfesor(profesorMateria.id_profesor);
            profesores.push(profesor);
        }
    } else {
        profesores = await fetchProfesores();
    }
    loadProfesoresTable(profesores);
};

const filterResults = function(query) {
    const rows = document.querySelectorAll('.profesor-table tbody tr');
    rows.forEach(row => {
        const apellidos = row.cells[0].textContent.toLowerCase();
        const nombres = row.cells[1].textContent.toLowerCase();
        if(apellidos.includes(query) || nombres.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};

document.addEventListener('DOMContentLoaded', async function() {
    const materias = await fetchMaterias();
    const selectMateriaInput = document.querySelector('#materia');
    if(materias){
        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.clave;
            option.textContent = materia.nombre;
            selectMateriaInput.appendChild(option);
        });
    }

    selectMateriaInput.addEventListener('change', async function(){
        await updateProfesoresTable(selectMateriaInput.value);
    });

    await updateProfesoresTable(selectMateriaInput.value);
  
    document.getElementById('search-input').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterResults(query);
    });
});