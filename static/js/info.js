async function info(){
	const user = document.getElementById('info-user');
	try {
		const response = await fetch('/info', {
			method: 'GET',
			mode: 'same-origin',
			cache: 'no-cache',
			headers: {
				"Content-Type": "application/json"
			}
		});
		const { firstname, lastname } = await response.json();
		user.innerHTML = '[' + firstname + ' ' + lastname + ']';
	} catch(error) {
		alert('Something Went wrong. Contact with your System Administrator.');
	}
}
info();