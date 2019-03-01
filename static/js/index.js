/*
 name: todolist
 purpose: keep a list of todo item
 version: 1.0
 author: George Louis
 date: 3/12/2018
*/
window.onload = function() {
	//variables
	var form = document.getElementById("form");
	var input = document.getElementById("input");
	var btn = document.getElementById("btn");
	var list = document.getElementById("list");	
	var id = 1;
	// listItem = {item: "todo item", checked: flase}
	var liItem = "";
	var todoList = [];

	//button event listener
	btn.addEventListener("click", addTodoItem);

	//list event listener
	list.addEventListener("click", boxChecked);

	//event listener for clear list
	//btnClr.addEventListener("click", clearList);

	if(localStorage.length <= 0) {
		//btnClr.style.display = "none"; //hide clear btn	
		console.log("button");
	}

	displayList();

	//add todo item to list
	function addTodoItem() {
		if(input.value === "") {
			alert("You must enter some value!");
		}
		else {
			if(list.style.borderTop === "") {
				console.log("here!")
				list.style.borderTop = "2px solid white";
				//btnClr.style.display = "inline";
			}
			var text = input.value;	
			$.ajax({
				url: '/todo',
				type: 'post',
				data: JSON.stringify({
					text: text
				}),
				headers: {
					"Content-Type": "application/json",
					'Accept': 'application/json'
				},
				success: function(data) {										
					var item = `<li id="li-${data[0]['_id']}">${data[0].text}<input id="${data[0]['_id']}" class="checkboxes" type="checkbox"></li>`;
					list.insertAdjacentHTML('beforeend', item);	
					//liItem = {item: text, checked: false};
					//todoList.push(liItem);
					//form.reset();
				}
			});
		}
	}

	//adding string through style to list itme
	function boxChecked(event) {
		const element = event.target;
		console.log(element)
		if(element.type === "checkbox") {
			// call the put API
			$.ajax({
				url: '/todo',
				type: 'put',
				data: JSON.stringify({
					id: element.id,
					status: 'DONE'
				}),
				headers: {
					"Content-Type": "application/json",
					'Accept': 'application/json'
				},
				success: function(data) {
					element.parentNode.style.textDecoration = "line-through";						
					element.id.checked = element.checked.toString();					
				}
			});
		}
	}

	//adding data to local storage
	function addToLocalStorage() {
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem("todoList", JSON.stringify(todoList));
		}
		else {
			alert("browser doesn't support local storage!");
		}
	}

	//display all todo list
	function displayList() {
		list.style.borderTop = "2px solid white";
		console.log('here');
		$.get('/todo', function(data) {
			console.log(data.length)
			if(data.length !== 0) {
				data.forEach(function(element) {
					console.log(element)
					var text = element.text;
					var item = `<li id="li-${element['_id']}">${text}<input id="${element['_id']}" class="checkboxes" type="checkbox"></li>`;
					list.insertAdjacentHTML("beforeend", item);
					//if we got a checked box, then style
					if(element.status.toUpperCase() === 'DONE') {
						var li = document.getElementById("li-"+element['_id']);
						li.style.textDecoration = "line-through";
						li.childNodes[1].checked = true;
					}
				});
			}
		});
	}
}