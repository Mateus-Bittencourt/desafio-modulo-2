document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cep = form.CEP.value;
    const latitude = parseFloat(form.Latitude.value);
    const longitude = parseFloat(form.Longitude.value);

    if (cep) {
      await fetchAddress(cep);
    }

    if (latitude && longitude) {
      await fetchWeather(latitude, longitude);
    }
  });

  async function fetchAddress(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error('Erro ao buscar endereço');
      }
      const data = await response.json();
      displayAddress(data);
      showResults();
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  async function fetchWeather(latitude, longitude) {
    console.log(latitude, longitude);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
      if (!response.ok) {
        throw new Error('Erro ao buscar previsão do tempo');
      }
      const data = await response.json();
      displayWeather(data);
      showResults();
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  function displayAddress(data) {
    const addressResultsContent = document.getElementById('address-results-content');
    const tbody = addressResultsContent.querySelector('tbody');
    tbody.innerHTML = `
      <tr>
        <td>${data.logradouro || 'N/A'}</td>
        <td>${data.bairro || 'N/A'}</td>
        <td>${data.localidade || 'N/A'}/${data.uf || 'N/A'}</td>
        <td></td>
      </tr>
    `;
  }

  function displayWeather(data) {
    const weatherResults = document.getElementById('weather-results');
    const temperature = data.hourly.temperature_2m[0];
    weatherResults.innerHTML = `<p>Previsão de tempo de acordo com a região: ${temperature}° C</p>`;
  }

  function showResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    // Rola a página até a div de resultados
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
  }
});
