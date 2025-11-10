<script>
document.getElementById('lookupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const playerId = document.getElementById('playerId').value.trim();
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  resultDiv.innerHTML = '';
  errorDiv.textContent = '';

  if (!playerId) {
    errorDiv.textContent = 'Please enter a player ID.';
    return;
  }

  // Use CORS proxy
  const url = `https://api.allorigins.win/raw?url=` + encodeURIComponent(
    `https://cartii.fit/apisite/inventory/v1/users/${playerId}/assets/collectibles?limit=5000`
  );

  try {
    const resp = await fetch(url);
    const data = await resp.json();

    // Real collectible array:
    const items = data.data;
    if (!items || items.length === 0) {
      resultDiv.innerHTML = `<p>No collectibles found for this player.</p>`;
      return;
    }

    // RAP is stored as recentAveragePrice
    let totalRAP = 0;
    items.forEach(item => {
      if (item.recentAveragePrice != null) {
        totalRAP += Number(item.recentAveragePrice);
      }
    });

    resultDiv.innerHTML = `
      <h2>Player ID: ${playerId}</h2>
      <p>Total RAP: <strong>${totalRAP}</strong></p>
      <p>Collectibles Count: ${items.length}</p>
    `;

  } catch (err) {
    console.error(err);
    errorDiv.textContent = 'Error fetching data: ' + err.message;
  }
});
</script>

