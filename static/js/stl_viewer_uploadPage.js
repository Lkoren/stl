$(document).ready(function() {
	var mycanvas = document.getElementById('upload_canvas');
	var viewer = new JSC3D.Viewer(mycanvas)
	var handle_file_select = function(e) {
		e.stopPropagation()
		e.preventDefault()
		var theScene
		var stl_loader
		var f = e.target.files[0]
		var reader = new FileReader()
		var ext = f.name.split(".")[1]

		setup_viewer()
		function setup_viewer() {
			viewer.setParameter('InitRotationX', 20);
			viewer.setParameter('InitRotationY', 20);
			viewer.setParameter('InitRotationZ', 0);
			viewer.setParameter('ModelColor', '#CAA618');
			viewer.setParameter('BackgroundColor1', '#FFFFFF');
			viewer.setParameter('BackgroundColor2', '#383840');
			viewer.setParameter('RenderMode', "flat");
		}

		reader.onload = (function(file) {
			return function(e) {
				theScene = new JSC3D.Scene
		    	stl_loader = new JSC3D.StlLoader()
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
