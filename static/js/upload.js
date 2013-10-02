$(document).ready(function() {
	$(".upload_button").click(validate_upload)
	function validate_upload() {
		console.log("validate stub")
	}
	$("input:radio[name='file_or_url']").click(function(){
		var file_or_url = $("input:radio[name='file_or_url']:checked").val()
		if (file_or_url === "file") {
			$(".url_field").prop('disabled', true)
			$("#file_select").prop('disabled', false)
		} else {		
			$(".url_field").prop('disabled', false)
			$("#file_select").prop('disabled', true)		
		}
	})
})


