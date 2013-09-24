$(document).ready(function() {	
	/*
	jQuery.ajaxSetup({
	    accepts: {
	        binary: "text/plain; charset=x-user-defined"
	    },
	    contents: {

	    },
	    converters: {
	        "text binary": true // Nothing to convert
	    }
	});*/

	var success = function(data) {
		console.log(data)
	}

	var handle_file_select = function(e) {
		e.stopPropagation()
		e.preventDefault()		
		f = e.target.files[0]			
		ext = f.name.split(".")[1]
		if (ext.toLowerCase() != "stl") {
			alert("That doesn't appear to be an STL file.");
		
		} else {
				$.ajax({
					type: "POST",
					url: "/preview",
					data: f,
					dataType: 'binary',
					mimeType: 'text/plain; charset=x-user-defined',
					success: preview
				})
			}
		}
	if (window.File) {
		document.getElementById('file_select').addEventListener('change', handle_file_select, false)
	}
})



