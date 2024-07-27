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
    const profesores = await fetchProfesores();
    if(profesores) {
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

        document.getElementById('search-input').addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterResults(query);
        });
    }
});