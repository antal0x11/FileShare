async function listMembers() {
	const userResponse = await fetch('/admin/get_users', {
		method: 'GET',
		mode: 'same-origin',
		cache: 'no-cache',
		headers: {
			"Content-Type": "application/json"
		}
	});

	const userObjects = await userResponse.json();
	const usersTable = document.getElementById('dashboard-table-users');

	if (userResponse.status !== 200) {
		alert('Error while fetching users, contact with your Systems Administrator.');
		return;
	}

	userObjects.users.map(item => {
		let row = usersTable.insertRow(-1);
		let cellFirstName = row.insertCell(0);
		let cellLastName = row.insertCell(1);
		let cellUsername = row.insertCell(2);
		let cellRole = row.insertCell(3);

		cellFirstName.innerHTML = item.firstname;
		cellLastName.innerHTML = item.lastname;
		cellUsername.innerHTML = item.username;
		cellRole.innerHTML = item.role;
	})
}

listMembers();