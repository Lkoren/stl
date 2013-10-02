$(document).ready(function() {	
	var handle_file_select = function(e) {
		var reader
		e.stopPropagation()
		e.preventDefault()		
		f = e.target.files[0]			
		ext = f.name.split(".")[1]
		if (ext.toLowerCase() != "stl") {
			alert("That doesn't appear to be an STL file.");
		
		} else {
			reader = new FileReader()
			reader.onload = (function (file) {
				return function(e) {
					//var stl_loader = new JSC3D.StlLoader()
					/*stl_loader.onload = function(scene) {
				    	viewer.replaceScene(scene);
				  	};*/
				  	console.log("Loaded file is: ", file)
				  	console.log("target: ", e)
				  	var canvas = document.getElementById('canvas')
				  	var viewer = new JSC3D.Viewer(canvas)
				  	var stl_path = e.target.result
				  	//var stl_path = "/static/js/square.stl"
				  	viewer.setParameter('SceneUrl', stl_path)
	   				viewer.setParameter('InitRotationX', 20)
					viewer.setParameter('InitRotationY', 20)
					viewer.setParameter('InitRotationZ', 0)			  	
				  	viewer.setParameter('ModelColor', '#CAA618')
				  	viewer.setParameter('BackgroundColor1', '#FFFFFF')
				  	viewer.setParameter('BackgroundColor2', '#383840')
				  	viewer.setParameter('RenderMode', 'flat')
				  	viewer.init()
				  	viewer.update()
					//stl_loader.loadFromUrl(f.name)
				}
			})(f)
			reader.readAsDataURL(f)
		}
	}

	$("#preview").click(preview)
	/*
	$("input:file").change(function() {
		console.log($(this).val())
	}) */
	if (window.File) {
		document.getElementById('file_select').addEventListener('change', handle_file_select, false)
	}
})



