class Calendar {
	constructor(date, switchDate) {
		this.date = date,
		this.switchDate = switchDate,
		this.year = date.getFullYear(),
		this.month = date.getMonth(),
		this.day = date.getUTCDate(),
		this.selectedDay = this.day,
		this.activities = [];
		this.days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'],
		this.months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December']
		this.hasScrolled = false;
	}

	init() {
		this.getActivities();
		this.addListeners();
		this.renderWeekDays();
		this.renderMonth();
		this.renderYear();
	}

	addListeners() {
		var monthDisplay = document.querySelector('.month-display');
		var controlButtons = document.querySelectorAll('.calendar-heading button');
		controlButtons.forEach(button => button.addEventListener('click', (e) => {
			e.stopPropagation();
			if (e.currentTarget.firstElementChild.classList.contains('glyphicon-chevron-left')) {
				this.changeMonth(-1);
			}
			else if (e.currentTarget.firstElementChild.classList.contains('glyphicon-chevron-right')) {
				this.changeMonth(1);
			}
		}))
		var newActivity = document.querySelector('.new-activity');
		monthDisplay.addEventListener('click', this.handleClick.bind(this));
	}

	changeDay(day) {
		this.selectedDay = Number(day);
		this.renderDays();
	}

	changeMonth(diff) {
		this.setDate(new Date(this.year, (this.month + diff), this.day));
	}

	setDate(date) {
		this
		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.day = date.getUTCDate();
		this.getActivities();
		this.renderMonth();
		this.renderYear();
	}

	getDaysOfMonth(month) {
		var nextMonth = month + 1;
		return new Date(this.year, nextMonth, 0).getDate();
	}

	getActivities() {
		var month = this.month + 1;
		var month = month > 9 ? month: '0' + month; //Leading zeros for the sake of SQL
		var dateString = `${this.year}/${month}`;
		fetch(`api/index.php/activities/${dateString}`)
			.then(response => response.json())
			.then(response => {
				this.activities = response.data;
				this.renderDays();
			})
	}

	getFirstDayNumberOfMonth(month) {
		var year = this.date.getFullYear();
		var day = new Date(year, month, 1).getUTCDay();
		return day;
	}

	handleClick(e) {
		if (e.target.classList.contains('day') &&
			!e.target.classList.contains('inactive')) {
			this.changeDay(e.target.innerText);
			this.switchDate(this.year, this.month, this.selectedDay);
		} else if (e.target.parentNode.classList.contains('day') &&
			!e.target.parentNode.classList.contains('inactive')) {
			this.changeDay(e.target.parentNode.innerText);
			this.switchDate(this.year, this.month, this.selectedDay);
		}
	}

	handleScroll(e) {
		if (!this.hasScrolled) {
			this.hasScrolled = true;
			if (e.deltaY > 5) {
				this.changeMonth(1);
			}
			else if (e.deltaY < -5) {
				this.changeMonth(-1);
			}
			setTimeout(() => {
				this.hasScrolled = false;
			}, 500);
		}
	}

	renderWeekDays() {
		var weekDays = document.querySelector('.weekdays');
		var days = [];
		this.days.forEach(day => {
			var shortDay = day.slice(0, 3);
			days.push(`<div class="weekday">${shortDay}</div>`);
		})
		weekDays.innerHTML = days.join('');
	}

	renderDays() {
		var calendar = document.querySelector('#month-display');
		var daysOfMonth = this.getDaysOfMonth(this.month);
		var startDay = this.getFirstDayNumberOfMonth(this.month);
		var days = [];
		// if the month starts in the middle of the week
		if (startDay > 0) {
			var daysOfLastMonth = this.getDaysOfMonth(this.date.getMonth() + 1);
			for (var i = 0; i < startDay; i++) {
				days.push(`<div class="day inactive">${daysOfLastMonth - i}</div>`)
			}
			// Reverses array so the numbers are in <ascen></ascen>ding order
			days.reverse();
		}
		for (var i = 1; i <= daysOfMonth; i++) {
			var classes = 'day';
			var content = i;
			var today = new Date();
			if (i === today.getDate() && this.month === today.getMonth() && this.year === today.getFullYear()) {
				classes += ' today';
			}
			if (i === this.selectedDay) {
				classes += ' selected';
			}
			this.activities.forEach(activity => {
				if (activity.date === new Date(this.year, this.month, i).toLocaleDateString()) {
					classes += ' has-activity';
					content += `<div class="calendar-activity"></div>`;
				}
			})
			days.push(`<div class="${classes}">${content}</div>`);
		}
		// fills the days array so the calendar is filled completely
		for (var i = 1; days.length < 42; i++) {
			days.push(`<div class="day inactive">${i}</div>`);
		}
		calendar.innerHTML = days.join('');
	}

	renderMonth() {
		document.querySelector('#month').innerHTML = this.months[this.month];
	}

	renderYear() {
		document.querySelector('#year').innerHTML = this.year;
	}
}