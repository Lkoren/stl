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
		var f = e.target.files[0]
		console.log("file : ", f)
		var ext = f.name.split(".")[1]
		var data
		if (ext.toLowerCase() != "stl") {
			alert("That doesn't appear to be an STL file.");
		} else {
				data = {}
				data.data = "test test"
				data._xsrf = getCookie("_xsrf")
				$.ajax({
					type: "POST",
					url: "preview",
					data: data,
					enctype: 'multipart/form-data',
					//dataType: 'binary',
					//mimeType: 'text/plain; charset=x-user-defined',
					success: function() { preview(data) }
				})
			}
		}

		function preview(data) {
			console.log("success: ", data)
		}

		function getCookie(name) {
		    var c = document.cookie.match("\\b" + name + "=([^;]*)\\b");
		    return c ? c[1] : undefined;
		}

	/*
	if (window.File) {
		document.getElementById('file_select').addEventListener('change', handle_file_select, false)
	}
	*/
})



