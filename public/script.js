document.getElementById("searchButton").addEventListener("click", function() {
    let query = document.getElementById("searchBox").value.trim();
    if (query) {
        // Mostrar barra de carga
        let loadingContainer = document.getElementById("loadingContainer");
        let progressBar = document.getElementById("progressBar");
        let percentage = document.getElementById("percentage");
        loadingContainer.style.display = 'block';
        let progress = 0;

        // Simular progreso de carga
        const interval = setInterval(function() {
            if (progress < 90) {
                progress += 10;
                progressBar.style.width = progress + '%';
                percentage.textContent = progress + '%';
            }
        }, 100);

        // Obtener los resultados
        fetch(`/buscar?q=${query}`)
            .then(response => response.json())
            .then(data => {
                clearInterval(interval);
                progressBar.style.width = '100%';
                percentage.textContent = '100%';
                setTimeout(() => loadingContainer.style.display = 'none', 500);

                // Mostrar resultados
                let resultsDiv = document.getElementById("results");
                resultsDiv.innerHTML = "";
                data.forEach(item => {
                    let div = document.createElement("div");
                    div.className = "result";
                    div.innerHTML = `<strong>${item.name}</strong> 
                                     <button onclick="window.open('${item.url}', '_blank')">Descargar</button>`;
                    resultsDiv.appendChild(div);
                });
            })
            .catch(error => {
                loadingContainer.style.display = 'none';
                alert("Error en la búsqueda. Intenta nuevamente.");
            });
    } else {
        alert("Por favor ingresa un término de búsqueda.");
    }
});
