

let myplayers = [];
$( document ).ready(function() {
	fetch('/join').then(function(response) {
		return response.text();
	}).then(function(string) {
	const plist =$(string).find('option');
	const hlist =$(string).find('h1');
	
	plist.each( function(p) {
		if (p > 0) {
			myplayers.push({ id:plist[p].attributes.item(0).value , name:plist[p].innerHTML });
		}
	});

	const path = window.location.href.split('/')[3].split('?')[1];
	console.log("Player" , path);
	const forms = document.querySelectorAll("form");
	let user = null;
	let username = "";
	myplayers.forEach( function(u) {
	  if (u.id.substring(0,4) === path) {
			 user = u.id; 
			 username = u.name;
		}  
	});
	if (user) { 
	$('h1').html( "Hey " + username + "! Welcome at \"" + hlist[0].innerHTML + "\"");
		$('#titleimg').attr("src","modules/quickstart/images/" + path + ".jpg");
		for ( let form of forms ) {
		  form.submit.disabled = false;
		  form.addEventListener("submit", async event => {
			event.preventDefault();

			// Disable the button and collect form data
			const form = event.target;
			form.submit.disabled = true;
			const formData = new FormData(form);
			formData.set("action", form.submit.dataset.action);
			formData.set("userid", user);
			formData.set("password", "");
			// Submit a POST request to the server
			const response = await fetch("/join", {
			  method: "POST",
			  body: formData
			}).then(r => r.json());
			// Redirect on success
			if ( response.status === "success" ) {
				
			  setTimeout(() => window.location.href = response.redirect, 500 );
			}

			// Notify on failure
			else if ( response.status === "failed" ) {
			  form.submit.disabled = false;
			}
		  });
		}
	}
	});
});
   