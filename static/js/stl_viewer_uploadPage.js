$(document).ready(function() {

	var handle_file_select = function(e) {
		e.stopPropagation()
		e.preventDefault()
		var f = e.target.files[0]
		var reader = new FileReader()
		var mycanvas = document.getElementById('upload_canvas');
		var viewer = new JSC3D.Viewer(mycanvas);
		var theScene = new JSC3D.Scene

	   	viewer.setParameter('InitRotationX', 20);
		viewer.setParameter('InitRotationY', 20);
		viewer.setParameter('InitRotationZ', 0);
		viewer.setParameter('ModelColor', '#CAA618');
		viewer.setParameter('BackgroundColor1', '#FFFFFF');
		viewer.setParameter('BackgroundColor2', '#383840');
		viewer.setParameter('RenderMode', "flat");

		var stl_loader = new JSC3D.StlLoader()
	  	var onModelLoaded = function(scene) {
		    var meshes = scene.getChildren()
		    theScene.addChild(meshes[0])
	      	viewer.replaceScene(theScene)
		}

		reader.onload = (function(file) {
			return function(e) {
				console.log("file data is: ", e.target.result)
		    	var loader = new JSC3D.StlLoader
		    	stl_loader.parseStl(theScene, e.target.result)
				var meshes = theScene.getChildren()
			    theScene.addChild(meshes[0])
		      	viewer.init()
		      	viewer.replaceScene(theScene)
		      	viewer.update()
			}
		})(f)

		reader.readAsText(f)
		console.log("file : ", f)
		var ext = f.name.split(".")[1]
		var data

		if (ext.toLowerCase() != "stl") {
			alert("That doesn't appear to be an STL file.");
		} else {

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
})



