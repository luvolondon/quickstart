

$( document ).ready(function() {
	let myplayers = [];

	fetch('../../../join').then(function(response) {
		return response.text();
	}).then(function(string) {
		const plist =$(string).find('option');
		const hlist =$(string).find('h1');
		
		plist.each( function(p) {
			if (p > 0) {
				myplayers.push({ id:plist[p].attributes.item(0).value , name:plist[p].innerHTML });
			}
		});
		const patharray = window.location.href.replace("://","").split('/');
		const langid = patharray[1];
		
		let i18n = null;

		if (langid.length === 2) {		
			i18n = new Localization(langid);
			let json;
			i18n._loadTranslationFile("../../../modules/quickstart/login/" + langid + ".json").then(function(response) {
				json = response;
				mergeObject(i18n.translations, json, {inplace: true});

				const tag = patharray[3];
				
				const path = tag.substring(0,4);
				const pw = tag.substring(4);
				
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
					console.log("User:",user);
					$('h1').html( "Hi " + username + "! " + i18n.localize("Quickstart.title") + " \"" + hlist[0].innerHTML + "\"");
					$('#titleimg').attr("src","../../../modules/quickstart/login/images/" + path + ".jpg");
					$("button").html('<i class="fas fa-check"></i> ' + i18n.localize("Quickstart.login"));
					
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
							formData.set("password", pw);
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
								$('h1').html(i18n.localize("Quickstart.error"));
								form.submit.disabled = false;
							}
						});
					}
				}
			});
		}
		
	});
});
   