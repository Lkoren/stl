(function($) { //http://stackoverflow.com/questions/4702000/toggle-input-disabled-attribute-using-jquery
    $.fn.toggleDisabled = function(){
        return this.each(function(){
            this.disabled = !this.disabled;
        });
    };
})(jQuery);

var prev_printers = get_num("#enum_printers")

function disable_define_buttons() {
   $(".define_options").each(function() { $(this).attr("disabled", true)}) 
}
function enable_define_buttons() {
    $(".define_options").each(function() { $(this).attr("disabled", false)})    
}

var add_printer_option = function(id)  {
    if (id) {        
        var n = "#printer_" + id  
        var name = $(n).val()                
        //$("#printer_options").prepend("<div class='printer_name' id='"+name+"'>Options for: " + name + "</div>")
        //$("#printer_options").prepend("<div class='printer_name' id='"+name+"'>")
        $("#printer_options").prepend("<div class='printer_name'>")
        $(".printer_name").text("Options for: " + name)

    }
    id = id || ($("#printer_options").find("li").size() + 1) //can be called externally or recursively. This is for recursive calls. 
    disable_define_buttons()
    var target = $("#printer_options").find("ul")       
    var insert_string = "<li><label>Service name: <input type='text' id='option_"+id+"_name'></label> \
    <input type='number' id='option_"+id+"_cost' value='0.00'min='0.0' step='0.01'><label>Cost per CC</label>"
    if (get_list_size("#printer_options") < 1) {
        insert_string += "<input type='button' value='+' onclick='add_printer_option()'>\
        <input type='button' value='-' onclick='remove_printer_option()'> <input type='button' id='cache_settings_button' onclick='cache_printer_options()'> </li>"
    }    
    target.append(insert_string)    
    $("#cache_settings_button").attr("value", 'Submit options for ' + name)
}

function remove_printer_option() {
    if (get_list_size("#printer_options") > 1) {
        $("#printer_options").find("li:last").remove()
    }
}
function cache_printer_options(){
    $(".printer_name").remove()
    $("#printer_options li").remove()
    enable_define_buttons()
    console.log("cache stub")
}


function make_name_field(id) { //the field which names each type of printer: Makerbot1, Makerbot2, Form1, Form2, Zcorp, etc..    
    var str = "<li><input type='text' id='printer_"+id+"'><input class='define_options' onclick='add_printer_option("+id+")' type='button' value='Define options'>"
    $("#printers").find("ol").append(str)
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



