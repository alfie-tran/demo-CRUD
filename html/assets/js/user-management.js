document.querySelector('#editUserModal').addEventListener('shown.bs.modal', () => {
	document.querySelector('#firstNameEdit').focus();
});

document.querySelector('#addUserModal').addEventListener('shown.bs.modal', () => {
	document.querySelector('#firstName').focus();
});

document.querySelectorAll('.delete-btn').forEach(btnConfirm => {
	btnConfirm.addEventListener('click', e => {
		const options = {
			title: 'Are you sure?',
			type: 'danger',
			btnOkText: 'Yes',
			btnCancelText: 'No',
			onConfirm: () => {
				console.log('Confirm');
				deleteUser(e.target.dataset.id, e.target.dataset.page);
			},
			onCancel: () => {
				console.log('Cancel');
			},
		};
		const {
			el,
			content,
			options: confirmedOptions,
		} = bs5dialog.confirm('Do you really want to delete this user?', options);
	});
});

document.querySelectorAll('ul.pagination li').forEach(item => {
	item.classList.add('page-item');
});
document.querySelector('ul.pagination li:first-child').classList.add('prev');
document.querySelector('ul.pagination li:last-child').classList.add('next');
document.querySelectorAll('ul.pagination li a').forEach(item => {
	item.classList.add('page-link');
});

async function addUser(e) {
	e.preventDefault(); //ngăn ko cho form tự submit
	let formData = new FormData(e.target);
	let data = Object.fromEntries(formData.entries());
	try {
		let res = await fetch('/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (res.status == 200) {
			location.href = '/users';
		} else {
			let message = await res.text();
			throw new Error(message);
		}
	} catch (error) {
		e.target.querySelector('#errorMessage').innerText = 'Can not add new user!';
		console.error(error);
	}
}

function showEditFormData(editBtn) {
	document.querySelector('#firstNameEdit').value = editBtn.dataset.firstName;
	document.querySelector('#lastNameEdit').value = editBtn.dataset.lastName;
	document.querySelector('#usernameEdit').value = editBtn.dataset.username;
	document.querySelector('#mobileEdit').value = editBtn.dataset.mobile;
	document.querySelector('#isAdminEdit').checked = editBtn.dataset.isAdmin ? true : false;
	document.querySelector('#id').value = editBtn.dataset.id;
}

async function updateUser(e) {
	e.preventDefault();
	let formData = new FormData(e.target);
	let data = Object.fromEntries(formData.entries());
	try {
		let res = await fetch('/users', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (res.status == 200) {
			location.reload();
		} else {
			let message = await res.text();
			throw new Error(message);
		}
	} catch (error) {
		document.querySelector('#errorMessageEdit').innerText = 'Can not update user!';
		console.error(error);
	}
}

async function deleteUser(id, page) {
	try {
		let res = await fetch(`/users/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (res.status == 200) {
			if (page > 1 && document.querySelector('tbody').children.length == 1) {
				document.querySelector('ul li.prev a').click();
			} else {
				location.reload();
			}
		} else {
			let errMessage = await res.text();
			throw new Error(errMessage);
		}
	} catch (error) {
		console.error(error);
		// alert('Can not delete user!');
		let toast = new bootstrap.Toast(document.querySelector('#liveToast'));
		document.querySelector('.toast-body').innerText = 'Can not delete user!';
		toast.show();
	}
}
