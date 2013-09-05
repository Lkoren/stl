(function($) { //http://stackoverflow.com/questions/4702000/toggle-input-disabled-attribute-using-jquery
    $.fn.toggleDisabled = function(){
        return this.each(function(){
            this.disabled = !this.disabled;
        });
    };
})(jQuery);

var prev_printers = get_num("#enum_printers")

function toggle_define_buttons() { //buttons which open the Define Printer Options section
    $(".define_options").each(function() { $(this).toggleDisabled()})
}

var define_printer_option = function(id)  {
    id = id || ($("#printer_options").find("li").size() + 1) //can be called externally or recursively. This is for recursive calls. 
    toggle_define_buttons()
    var target = $("#printer_options").find("ul")       
    var insert_string = "<li><label>Service name: <input type='text' id='option_"+id+"_name'></label> \
    <input type='number' id='option_"+id+"_cost' min='0.0' step='0.01'><label>Cost</label> \
    <input type='button' value='+' onclick='define_printer_option()'><input type='button' value='-' onclick='remove_option()'> </li>"
    target.append(insert_string)    
}

function add_option() {
    
}



function make_name_field(id) { //the field which names each type of printer: Makerbot1, Makerbot2, Form1, Form2, Zcorp, etc..
    //var str = "<li><input type='text' id='printer_" + id + "'><input type='number' value = '1' min = '1' id='p" + id + "_options' ><label>No. of options"     
    //var str = "<li><input type='text' id='printer_"+id+"'><input onClick='add_printer_option("+id+");' type='button' value='+'></input><input onClick='remove_printer_option("+id+")' type='button' value='-'></input>"
    var str = "<li><input type='text' id='printer_"+id+"'><input class='define_options' onclick='define_printer_option("+id+")' type='button' value='Define options'>"
    $("#printers").find("ol").append(str)
    //$("#printer_" + id).bind("change", create_printer_options)
    str = "#p" + id + "_options"
    var options = $(str)
    options.bind("change", update_printer_options_list)
}

function remove_name_field() {        
    if (get_list_size("#printers") > 1) {
        $("#printers").find("li:last").remove()
    }
}

function update_form() {
    var printers = $("#enum_printers").val()        
    if (printers != get_list_size("#printers")) {    
        printers > $("#printers").find("li").size() ? make_name_field(printers) : remove_name_field()
    }
    prev_printers = printers        
}
/*
function create_printer_options() {
    console.log("printer options")
}*/

function update_printer_options_list(){
    console.log("hi!")

    var target = $("#printer_options").find("ul")       
    /*
    for (var i = 0; i < get_num(o); i++) {
        var insert_string = "<li><label>Service name: <input type='text' id='option_"+i+"_name'></label><input type='number' id='option_"+i+"_cost'><label>Cost</label></li>"
        target.append(insert_string)
    }
    */
    //get_list_size()
}

$("#enum_printers").bind("mouseup keyup change", update_form)

function get_num(id){
    return $(id).val()
}
function get_list_size(id) {
    return $(id).find("li").size()
}

update_form()



