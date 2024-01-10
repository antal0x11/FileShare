async function fileList() {
	const listResponse = await fetch("/files/list", {
		method: "GET",
		mode: "same-origin",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json"
		}
	});
	const fileObjects = await listResponse.json();
	const tableBody = document.getElementById('table-info');
	fileObjects.files.map(item => {
		let row = tableBody.insertRow(-1);
		row.className = 'body-row';
		let cellName = row.insertCell(0);
		cellName.className = 'name-cell';
		let cellAuthor = row.insertCell(1);
		let cellDate = row.insertCell(2);
		let cellLastUpdate = row.insertCell(3);
		let cellSize = row.insertCell(4);

		cellName.innerHTML = item.name;
		cellName.setAttribute('belongs', item.author);
		cellAuthor.innerHTML = item.author;
		cellDate.innerHTML = item.date;
		cellLastUpdate.innerHTML = item.lastUpdate;
		cellSize.innerHTML = item.size;
		
		cellName.addEventListener('click', async (event) => {
			const fileRequest = event.target.innerText;
			const [firstname,lastname] = event.target.getAttribute('belongs').split(' ');

			const response = await fetch(`/file/${fileRequest}`, {
				method: "POST",
				mode: "same-origin",
				cache: "no-cache",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ 'firstname': firstname, 'lastname': lastname })
			});

			if (response.status !== 200) {
				alert('Contact with your Systems Administrator.');
				let backLogin = document.createElement('a');
				backLogin.setAttribute("href", "/login");
				backLogin.click();
				backLogin.remove();
				return;
			}

			const fileBlob = await response.blob();

			const bUrl = window.URL.createObjectURL(fileBlob);

			let tmpDownloader = document.createElement('a');
			tmpDownloader.setAttribute("href", bUrl);
			tmpDownloader.setAttribute("download", fileRequest);
			tmpDownloader.click();
			tmpDownloader.remove();
		});
	});
}

fileList();