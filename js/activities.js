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
		const form = document.querySelector('#activities-form');
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
		const buttons = document.querySelectorAll('.activities .remove');
		buttons.forEach(button => {
			button.addEventListener('mouseenter', (e) => e.target.classList.add('btn-danger'));
			button.addEventListener('mouseleave', (e) => e.target.classList.remove('btn-danger'));
			button.addEventListener('click', this.deleteActivity.bind(this));
		})
	}

	handleClick(e) {
		if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'SPAN') {
			this.toggleForm();
		}
	}

	toggleForm() {
		let form = document.querySelector('.activities-form');
		let button = document.querySelector('#activities #toggle')
		if (this.formVisible) {
			this.formHeight = form.clientHeight;
		}
		toggleForm(form, button, this);
		this.formVisible = !this.formVisible;
	}

	resetForm() {
		let form = document.querySelector('.activities-form').reset();
	}

	getActivities() {
		let dateString = this.date.toLocaleDateString().replace(/-/g, '/');
		let url = `api/index.php/activities/${dateString}`;
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
		const form = document.forms['activities-form'];
		let dateString = this.date.toLocaleDateString();
		const data = new FormData(form);
		data.append('date', dateString);
		const request = new XMLHttpRequest();
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

	deleteActivity(e) {
		let target = e.target;
		const targetID = target.id != '' ? target.id : target.parentNode.id;
		this.activities = this.activities.filter(activity => {
			return activity.id != targetID;
		})
		const request = new XMLHttpRequest();
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
		const header = document.querySelector('#activity-date-display');
		header.innerHTML = this.date.toDateString() === new Date().toDateString() ? 'idag' : this.date.toLocaleDateString();
		const list = document.querySelector('#activities');
		const listItems = this.activities.map(activity => {
			return `<li class="list-group-item activity">
						<div class="header">
							${activity.title}
							<button id="${activity.id}" class="btn btn-default remove pull-right">
								<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
							</button>
							<br />
							<span class="label label-default">${activity.time.slice(0, 5)}</span>
						</div>
						<hr />
						<div>
							${activity.description.replace(/\n/g, '<br/>')}
						</div>
					</li>`;
		})
		list.innerHTML = listItems.join('');

		let listItem = document.createElement('li');
		listItem.className = 'list-group-item';

		let button = document.createElement('button');
		button.className = 'btn btn-primary';
		button.id = 'toggle';
		button.addEventListener('click', this.handleClick.bind(this));
		button.innerHTML = '<span class="glyphicon glyphicon-plus pull-right" aria-hidden="true"></span>';

		listItem.appendChild(button);
		list.appendChild(listItem);
	}
}