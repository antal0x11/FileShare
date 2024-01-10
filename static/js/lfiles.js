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
		let cellDelete = row.insertCell(5);

		cellName.innerHTML = item.name;
		cellName.setAttribute('belongs', item.author);
		cellAuthor.innerHTML = item.author;
		cellDate.innerHTML = item.date;
		cellLastUpdate.innerHTML = item.lastUpdate;
		cellSize.innerHTML = item.size;

		const deleteIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		deleteIcon.setAttribute("width","20");
		deleteIcon.setAttribute("height","20");
		deleteIcon.setAttribute("fill","none");
		deleteIcon.setAttribute("viewBox","0 0 24 24");
		deleteIcon.setAttribute("stroke-width","1.5");
		deleteIcon.setAttribute("stroke","currentColor");

		const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
		pathElement.setAttribute("stroke-linecap","round");
		pathElement.setAttribute("stroke-linejoin","round");
		pathElement.setAttribute("d","m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0");
		
		deleteIcon.appendChild(pathElement);
		cellDelete.appendChild(deleteIcon);
		cellDelete.setAttribute("filename", item.name);
		cellDelete.setAttribute("belongs", item.author);
		cellDelete.className = 'delete-cell';

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

		cellDelete.addEventListener('click', async (event) => {
			alert("Under Construction File To Delete Operation");
			//TODO
		})


	});
}

fileList();