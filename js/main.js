window.onload = function() {
	var cal = new Calendar(new Date(), switchDay);
	var shoppinglist = new Shoppinglist();
	var activities = new Activities(cal.date, updateCalendar.bind(cal));

	cal.init();
	shoppinglist.init();
	activities.init();

	function switchDay(year, month, day) {
		activities.setDate(new Date(year, month, day));
		activities.getActivities();
		if (activities.formVisible) {
			activities.toggleForm();
		}
	}
}

function toggleForm(form, button, parent) {
	var buttonIcon = button.firstChild;
	button.classList.toggle('btn-primary');
	button.classList.toggle('btn-danger');
	buttonIcon.classList.toggle('glyphicon-plus');
	buttonIcon.classList.toggle('glyphicon-minus');
	if (form.style.height !== '0px') {
		form.style.height = '0px';
		form.style.padding = 0;
	}
	else {
		form.style.height = parent.formHeight + 'px';
		form.style.padding = '5px';
	}
}

function updateCalendar() {
	// 'this' is bound to calendar
	this.getActivities();
}