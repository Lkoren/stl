$(document).ready(function() {
	/*
	var stl_loader = new JSC3D.StlLoader()
	stl_loader.onload = function(scene) {
		viewer.replaceScene(scene)
	}

	stl_loader.loadFromUrl('/temp/temp.stl')
	*/



	var mycanvas = document.getElementById('results-canvas');
	var viewer = new JSC3D.Viewer(mycanvas);
	//var stlpath = mycanvas.getAttribute('stlpath');
	viewer.setParameter('SceneUrl', '/static/stl/temp.stl');
   	viewer.setParameter('InitRotationX', 20);
	viewer.setParameter('InitRotationY', 20);
	viewer.setParameter('InitRotationZ', 0);
	viewer.setParameter('ModelColor', '#CAA618');
	viewer.setParameter('BackgroundColor1', '#FFFFFF');
	viewer.setParameter('BackgroundColor2', '#383840');
	//viewer.setParameter('RenderMode', mycanvas.getAttribute('rmode'));
	viewer.setParameter('RenderMode', "flat");
	viewer.init();
	viewer.update();



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


	/*
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


	if (window.File) {
		document.getElementById('file_select').addEventListener('change', handle_file_select, false)
	}
	*/
})



