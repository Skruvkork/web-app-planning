class Shoppinglist {
	constructor() {
		this.items = [];
		this.formVisible = true;
		this.formHeight;
	}

	init() {
		this.getItems();
		this.render();
		this.addListeners();
		this.toggleForm();
	}

	handleClick(e) {
		if (e.target.nodeName === 'SPAN' || e.target.nodeName === 'BUTTON') {
			this.toggleForm();
		}
	}

	addListeners() {
		let form = document.querySelector('#shoppinglist-form');
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.addItem.bind(this);
			this.addItem();
			this.toggleForm();
			this.resetForm();
		});
		form.addEventListener('transitionend', (e) => {
			if (e.target.style.height !== '0px') {
				e.target.style.height = 'auto';
			}
		})
	}

	//// FORM MANIPULATION

	toggleForm() {
		let form = document.querySelector('.shoppinglist-form');
		let button = document.querySelector('#shopping-list #toggle')
		if (this.formVisible) {
			this.formHeight = form.clientHeight;
		}
		toggleForm(form, button, this);
		this.formVisible = !this.formVisible;
	}

	resetForm() {
		let form = document.querySelector('.shoppinglist-form').reset();
	}

	//// END FORM MANIPULATION


	//// GET, POST DELETE

	getItems() {
		const request = new XMLHttpRequest(),
			method = 'GET',
			url = 'api/index.php/shoppinglist';
		request.open(method, url, true);
		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				const response = JSON.parse(request.responseText);
				this.items = response.data;
				this.render();
			}
		}
		request.send();
	}

	addItem() {
		const form = document.forms['shoppinglist-form'];
		const data = new FormData(form);
		const request = new XMLHttpRequest();
		request.open('POST', 'api/index.php/shoppinglist', true);
		request.onreadystatechange = () => {
			if (request.status === 201 && request.readyState === XMLHttpRequest.DONE) {
				this.getItems();
			}
		}
		request.send(data);
	}

	removeItem(e) {
		const eventID = e.target.id != '' ? e.target.id : e.target.parentNode.id;
		this.items = this.items.filter(item => {
			return item.id != eventID;
		})
		const request = new XMLHttpRequest();
		request.open('DELETE', 'api/index.php/shoppinglist/' + eventID, true);
		request.send();
		this.render();
	}

	//// END GET, POST, DELETE

	render() {
		const list = document.querySelector('#shopping-list');
		const app = this;
		list.innerHTML = '';
		this.items.forEach(item => {
			// <li class="list-group-item">${item.title}</li>
			let listItem = document.createElement('li');
			listItem.className = 'list-group-item';
			listItem.innerHTML = `${item.title} <em>Tillagd ${item.date_added}</em>`;

			// <span class="pull-right"></span>
			let span = document.createElement('span');
			span.className = 'pull-right';

			// <button class="btn btn-default" id="${item.id}" onclick="this.removeItem"></button>
			let button = document.createElement('button');
			button.className = 'btn btn-default';
			button.id = item.id
			button.addEventListener('click', this.removeItem.bind(this), false);
			button.addEventListener('mouseenter', (e)=> {
				e.target.classList.add('btn-danger');
			});
			button.addEventListener('mouseleave', (e)=> {
				e.target.classList.remove('btn-danger');
			});

			// <span class="glyphicon glyphicon-remove pull-right" aria-hidden="true"></span>
			let icon = document.createElement('span');
			icon.className = 'glyphicon glyphicon-remove pull-right';
			icon.attributes.ariaHidden = true;

			button.appendChild(icon);
			span.appendChild(button);
			listItem.appendChild(span);

			/*
			<li class="list-group-item">
				${item.title}
				<span class="pull-right">
					<button class="btn btn-default" id="${item.id}" onclick="this.removeItem">
						<span class="glyphicon glyphicon-remove pull-right"
						aria-hidden="true"></span>
					</button>
				</span>
			</li>
			*/

			list.appendChild(listItem);
		})

		// Create the last row with button to create new entries
		let listItem = document.createElement('li');
		listItem.className = 'list-group-item';

		let button = document.createElement('button');
		button.id = 'toggle';
		button.className = 'btn btn-primary';
		button.addEventListener('click', this.handleClick.bind(this));

		let icon = document.createElement('span');
		icon.className = 'glyphicon glyphicon-plus pull-right';
		icon.attributes.ariaHidden = true;

		button.appendChild(icon);
		listItem.appendChild(button);
		list.appendChild(listItem);
	}
}