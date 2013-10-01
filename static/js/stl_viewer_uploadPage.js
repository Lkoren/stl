$(document).ready(function() {

	var handle_file_select = function(e) {
		e.stopPropagation()
		e.preventDefault()
		var f = e.target.files[0]
		var reader = new FileReader()


		var mycanvas = document.getElementById('upload_canvas');
		var viewer = new JSC3D.Viewer(mycanvas);
		var theScene = new JSC3D.Scene
		//var stlpath = mycanvas.getAttribute('stlpath');
		//viewer.setParameter('SceneUrl', f.name);
	   	viewer.setParameter('InitRotationX', 20);
		viewer.setParameter('InitRotationY', 20);
		viewer.setParameter('InitRotationZ', 0);
		viewer.setParameter('ModelColor', '#CAA618');
		viewer.setParameter('BackgroundColor1', '#FFFFFF');
		viewer.setParameter('BackgroundColor2', '#383840');
		//viewer.setParameter('RenderMode', mycanvas.getAttribute('rmode'));
		viewer.setParameter('RenderMode', "flat");

		var stl_loader = new JSC3D.StlLoader()
	  	/*
	  	stl_loader.onload = function(scene) {
	  		console.log("stl_loader onload")
	    	viewer.replaceScene(scene)
			viewer.init();
			viewer.update();
	  	}*/

	  	var onModelLoaded = function(scene) {
		    var meshes = scene.getChildren()
		    theScene.addChild(meshes[0])
	      	viewer.replaceScene(theScene)
		}

		reader.onload = (function(file) {
			return function(e) {
				console.log("file data is: ", e.target.result)
		    	var loader = new JSC3D.StlLoader
		    	//loader.onload = onModelLoaded
		    	stl_loader.parseStl(theScene, e.target.result)
				var meshes = theScene.getChildren()
			    theScene.addChild(meshes[0])
		      	viewer.init()
		      	viewer.replaceScene(theScene)
		      	viewer.update()

		    	/*viewer.replaceScene(scene)
				viewer.init();
				viewer.update();
				stl_loader.parseStl(scene, e.target.result)*/
			}
		})(f)

		reader.readAsText(f)
		console.log("file : ", f)
		var ext = f.name.split(".")[1]
		var data

		if (ext.toLowerCase() != "stl") {
			alert("That doesn't appear to be an STL file.");
		} else {


			/*
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
			*/

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



