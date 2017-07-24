class Activities {
	constructor(date, updateCalendar) {
		this.updateCalendar = updateCalendar;
		this.date = date;
		this.day;
		this.month;
		this.year;
		this.activities = [];
		this.formVisible = true;
		this.formHeight;
	}

	init() {
		this.setDate(this.date);
		this.render();
		this.addFormListeners();
		this.toggleForm();
		this.getActivities();
	}

	addFormListeners() {
		var form = document.querySelector('#activities-form');
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.setActivity.bind(this);
			this.setActivity();
			this.toggleForm();
			this.resetForm();
		});
		form.addEventListener('transitionend', (e) => {
			if (e.target.style.height !== '0px') {
				e.target.style.height = 'auto';
			}
		})
	}

	addListeners() {
		var editButtons = document.querySelectorAll('.activities .edit');
		editButtons.forEach(button => {
			button.addEventListener('mouseenter', (e) => e.target.classList.add('btn-primary'));
			button.addEventListener('mouseleave', (e) => e.target.classList.remove('btn-primary'));
			button.addEventListener('click', this.editActivity.bind(this));
		})

		var removeButtons = document.querySelectorAll('.activities .remove');
		removeButtons.forEach(button => {
			button.addEventListener('mouseenter', (e) => e.target.classList.add('btn-danger'));
			button.addEventListener('mouseleave', (e) => e.target.classList.remove('btn-danger'));
			button.addEventListener('click', this.deleteActivity.bind(this));
		})

		var saveButtons = document.querySelectorAll('.activities .save');
		if (saveButtons) {
			saveButtons.forEach(button => {
				button.addEventListener('mouseenter', (e) => e.target.classList.add('btn-success'));
				button.addEventListener('mouseleave', (e) => e.target.classList.remove('btn-success'));
				button.addEventListener('click', this.saveEdit.bind(this));
			})
		}

		var cancelButtons = document.querySelectorAll('.activities .cancel');
		if (cancelButtons) {
			cancelButtons.forEach(button => {
				button.addEventListener('mouseenter', (e) => e.target.classList.add('btn-danger'));
				button.addEventListener('mouseleave', (e) => e.target.classList.remove('btn-danger'));
				button.addEventListener('click', this.cancelEdit.bind(this));
			})
		}
	}

	handleClick(e) {
		if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'SPAN') {
			this.toggleForm();
		}
	}

	toggleForm() {
		var form = document.querySelector('.activities-form');
		var button = document.querySelector('#activities #toggle')
		if (this.formVisible) {
			this.formHeight = form.clientHeight;
		}
		toggleForm(form, button, this);
		this.formVisible = !this.formVisible;
	}

	resetForm() {
		var form = document.querySelector('.activities-form').reset();
	}

	getActivities() {
		var dateString = this.date.toLocaleDateString().replace(/-/g, '/');
		var url = `api/index.php/activities/${dateString}`;
		fetch(url)
			.then(response => response.json())
			.then(response => {
				this.activities = response.data;
				this.render();
				this.addListeners();
				this.updateCalendar();
			})
	}

	setActivity() {
		var form = document.forms['activities-form'];
		var dateString = this.date.toLocaleDateString();
		var data = new FormData(form);
		data.append('date', dateString);
		var request = new XMLHttpRequest();
		request.open('POST', 'api/index.php/activities', true);
		request.onreadystatechange = () => {
			if (request.status === 201 && request.readyState === XMLHttpRequest.DONE) {
				this.getActivities();

			}
			if (request.status === 400) {
				console.log(request.responseText)
			}
		}
		request.send(data);
	}

	editActivity(e) {
		var target = e.target;
		var targetID = target.id != '' ? target.id : target.parentNode.id;

		var element = document.querySelector(`#activity${targetID}`);

		var header = element.querySelector('h2');
		var input = element.querySelector('input');
		var text = element.querySelector('p');
		var buttons = element.querySelector('.buttons');

		header.contentEditable = true;
		input.type = 'date';
		text.contentEditable = true;
		header.classList.add('editing');
		input.classList.add('editing');
		text.classList.add('editing');

		buttons.innerHTML = `
			<button id="${targetID}" class="btn btn-default save">
				<span class="glyphicon glyphicon-save" aria- hidden="true"></span> Spara
			</button>
			<button id="${targetID}" class="btn btn-default cancel">
				<span class="glyphicon glyphicon-cancel" aria-hidden="true"></span> Avbryt
			</button>
		`;
		console.log(this.activities);
		this.addListeners();
	}

	saveEdit(e) {
		var target = e.target;
		var targetID = target.id != '' ? target.id : target.parentNode.id;

		var element = document.querySelector(`#activity${targetID}`);

		var header = element.querySelector('h2');
		var input = element.querySelector('input');
		var text = element.querySelector('p');

		var editedActivity = this.activities.find(activity => activity.id === targetID);
		editedActivity.title = header.innerHTML;
		editedActivity.date = input.value;
		editedActivity.description = text.innerHTML;

		var data = new FormData();

		data.append('title', header.innerHTML);
		data.append('date', input.value);
		data.append('description', text.innerHTML);
		data.append('id', editedActivity.id);

		var request = new XMLHttpRequest();
		request.open('PUT', `api/index.php/activities/${editedActivity.id}`, true);
		request.onreadystatechange = () => {
			if (request.status === 200 && request.readyState === XMLHttpRequest.DONE) {
				this.getActivities();
				console.log(request.responseText);
			}
			if (request.status === 400) {
				console.log(request.responseText)
			}
		}
		request.send(JSON.stringify(editedActivity));
	}

	cancelEdit(e) {
		var target = e.target;
		var targetID = target.id != '' ? target.id : target.parentNode.id;

		var element = document.querySelector(`#activity${targetID}`);

		var header = element.querySelector('h2');
		var input = element.querySelector('input');
		var text = element.querySelector('p');
		var buttons = element.querySelector('.buttons');

		header.contentEditable = false;
		input.type = 'hidden';
		text.contentEditable = false;
		header.classList.remove('editing');
		input.classList.remove('editing');
		text.classList.remove('editing');

		buttons.innerHTML = `
			<button id="${targetID}" class="btn btn-default edit">
				<span class="glyphicon glyphicon-edit" aria- hidden="true"></span> Ändra
			</button>
			<button id="${targetID}" class="btn btn-default remove">
				<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Ta bort
			</button>
		`;
		console.log('cancel');

		this.addListeners();
	}

	deleteActivity(e) {
		var target = e.target;
		var targetID = target.id != '' ? target.id : target.parentNode.id;
		this.activities = this.activities.filter(activity => {
			return activity.id != targetID;
		})
		var request = new XMLHttpRequest();
		request.open('DELETE', 'api/index.php/activities/' + targetID, true);
		request.onreadystatechange = () => {
			if (request.status === 200 && request.readyState === XMLHttpRequest.DONE) {
				this.getActivities();
			}
		}
		request.send();
		this.render();
	}

	setDate(date) {
		this.date = date;
		this.day = date.getDate();
		this.month = date.getMonth() + 1; // Months numbered 1-12 for SQL purposes
		this.year = date.getFullYear();
	}

	render() {
		var header = document.querySelector('#activity-date-display');
		header.innerHTML = this.date.toDateString() === new Date().toDateString() ? 'idag' : this.date.toLocaleDateString();
		var list = document.querySelector('#activities');
		var listItems = this.activities.map(activity => {
			return `<li class="list-group-item activity" id="activity${activity.id}">
						<h2 class="header">${activity.title}</h2>
						<input class="date-input" type="hidden" value="${activity.date}" />
						<p>
							${activity.description.replace(/\n/g, '<br/>')}
						</p>
						<div class="buttons">
							<button id="${activity.id}" class="btn btn-default edit">
								<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Ändra
							</button>
							<button id="${activity.id}" class="btn btn-default remove">
								<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Ta bort
							</button>
						</div>
					</li>`;
		})
		list.innerHTML = listItems.join('');

		var listItem = document.createElement('li');
		listItem.className = 'list-group-item';

		var button = document.createElement('button');
		button.className = 'btn btn-primary';
		button.id = 'toggle';
		button.addEventListener('click', this.handleClick.bind(this));
		button.innerHTML = '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>';

		listItem.appendChild(button);
		list.appendChild(listItem);
	}
}