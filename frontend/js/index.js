import { fetchData } from "./requests.js";

document.addEventListener('DOMContentLoaded', async function() {
    const selectMateriaInput = document.querySelector('#materia');
    
    const materias = await fetchData('http://localhost:8000/materias')

    materias.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.clave;
        option.textContent = materia.nombre;
        selectMateriaInput.appendChild(option);
    });

    selectMateriaInput.addEventListener('change', async function(){
        await updateProfesoresTable(selectMateriaInput.value);
    });

    await updateProfesoresTable(selectMateriaInput.value);
  
    document.getElementById('search-input').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterResults(query);
    });
});

const updateProfesoresTable = async function(claveMateria){
    resetProfesorTable();
    let profesores;
    if(claveMateria){
        profesores = [];
        const profesoresMateria =  await fetchData('http://localhost:8000/materias_profesores', claveMateria);
        for(const profesorMateria of profesoresMateria){
            const profesor = await fetchData('http://localhost:8000/profesores', profesorMateria.id_profesor);
            profesores.push(profesor);
        }
    } else {
        profesores = await fetchData('http://localhost:8000/profesores');
    }
    loadProfesoresTable(profesores);
};

const resetProfesorTable = function(){
    const tableBody = document.querySelector('.profesor-table tbody');
    tableBody.innerHTML = '';
};

const loadProfesoresTable = function(profesores){
    const tableBody = document.querySelector('.profesor-table tbody');
    profesores.forEach(profesor => {
        const row = document.createElement('tr');
        
        const nombreProfesorTd = document.createElement('td');

        const linkParaCalificar = document.createElement('a');
        linkParaCalificar.innerHTML = profesor.apellidos + ' ' + profesor.nombres;
        linkParaCalificar.classList.add('calificar-link')
        linkParaCalificar.href = 'recomendaciones.html?profesor_id=' + profesor.id + 
        '&profesor_apellidos=' + profesor.apellidos.replace(' ', '_') + 
        '&profesor_nombres=' + profesor.nombres.replace(' ', '_');
        nombreProfesorTd.appendChild(linkParaCalificar);
        
        row.appendChild(nombreProfesorTd);

        const promedioTd = document.createElement('td');
        promedioTd.textContent = profesor.promedio;
        row.appendChild(promedioTd);

        tableBody.appendChild(row);
    });
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