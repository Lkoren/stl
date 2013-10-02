$(document).ready(function() {
	var handle_file_select = function(e) {
		e.stopPropagation()
		e.preventDefault()
		var viewer
		var theScene
		var f = e.target.files[0]
		var reader = new FileReader()
		var ext = f.name.split(".")[1]
		var mycanvas = document.getElementById('upload_canvas');
		var stl_loader = new JSC3D.StlLoader()

		function init_viewer() {
			viewer = new JSC3D.Viewer(mycanvas);
			viewer.setParameter('InitRotationX', 20);
			viewer.setParameter('InitRotationY', 20);
			viewer.setParameter('InitRotationZ', 0);
			viewer.setParameter('ModelColor', '#CAA618');
			viewer.setParameter('BackgroundColor1', '#FFFFFF');
			viewer.setParameter('BackgroundColor2', '#383840');
			viewer.setParameter('RenderMode', "flat");
		}

		function init_scene() {
			theScene = new JSC3D.Scene
			if (!(theScene.isEmpty)) {
				console.log(theScene)
			}
		}

		reader.onload = (function(file) {
			return function(e) {
				console.log("old scene: ", theScene)
				init_viewer()
				init_scene()
		    	stl_loader.parseStl(theScene, e.target.result)
		      	viewer.init()
		      	viewer.replaceScene(theScene)
		      	viewer.update()
			}
		})(f)

		if (ext.toLowerCase() != "stl") {
			alert("That doesn't appear to be an STL file.");
		} else {
			reader.readAsBinaryString(f)
			}
		}


	if (window.File) {
		document.getElementById('file_select').addEventListener('change', handle_file_select, false)
	}
})
