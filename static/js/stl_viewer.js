$(document).ready(function() {	
	var handle_file_select = function(e) {
		var reader
		e.stopPropagation()
		e.preventDefault()		
		f = e.target.files[0]	
		console.log(f)
		ext = f.name.split(".")[1]
		if (ext != "stl") {
			alert("That doesn't appear to be an STL file.");
		
		} else {
			reader = new FileReader()
			reader.onload(function (file) {
				var stl_loader = new JSC3D.StlLoader()
				stl_loader.onload = function(scene) {
			    	viewer.replaceScene(scene);
			  	};
				stl_loader.loadFromUrl(f.name)
			})			
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



