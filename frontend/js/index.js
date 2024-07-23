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
            promedioTd.textContent = 'N/A';
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
    }
});