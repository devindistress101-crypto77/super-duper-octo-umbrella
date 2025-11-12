document.getElementById("runBtn").addEventListener("click", async () => {
  const list = document.getElementById("urlList").value
    .split("\n")
    .map(u => u.trim())
    .filter(Boolean);

  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = ""; // clear old results

  for (const url of list) {
    const row = tableBody.insertRow();
    row.insertCell().innerText = url;
    const statusCell = row.insertCell();
    const messageCell = row.insertCell();
    statusCell.innerText = "Checking...";

    try {
      const response = await fetch(`/api/check?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      statusCell.innerText = data.status;
      messageCell.innerText = data.message || "";
      row.style.color = data.status === "reachable" ? "green" :
                        data.status === "blocked" ? "red" :
                        "gray";
    } catch (err) {
      statusCell.innerText = "error";
      messageCell.innerText = err.message;
      row.style.color = "gray";
    }
  }
});
