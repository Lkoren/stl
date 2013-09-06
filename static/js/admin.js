
var prev_printers = get_num("#enum_printers")
var printer_data = {"p": []}

////Define the printers available: eg, Makerbot1, Makerbot2, Form1, Zcorpt
function make_name_field(id) { //the field which names each type of printer: Makerbot1, Makerbot2, Form1, Form2, Zcorp, etc..    
    var str = "<li><input type='text' id='printer_"+id+"'><input class='define_options' onclick='add_printer_option("+id+")' type='button' value='Define options'>"
    $("#printers").find("ol").append(str)
    str = "#p" + id + "_options"
    var options = $(str)
}
function remove_name_field() {        
    if (get_list_size("#printers") > 1) {
        $("#printers").find("li:last").remove()
    }
}
////User interaction with the Printer Options area, eg, defining services offered by Makerbot1: low, med, hi quality @ x,y,z price.
function disable_define_buttons() {
   $(".define_options").each(function() { $(this).attr("disabled", true)}) 
   $("#printers input[type='text'").each(function() { $(this).attr("disabled", true)}) 
   $("#enum_printers").attr("disabled", true)

}
function enable_define_buttons() {
    $(".define_options").each(function() { $(this).attr("disabled", false)})    
    $("#printers input[type='text'").each(function() { $(this).attr("disabled", false)})    
    $("#enum_printers").attr("disabled", false)
}
var add_printer_option = function(id)  { //ToDo: refactor. Remove code that adds custom ids to text/num input elements?
    if (id) {        
        var n = "#printer_" + id  
        var name = $(n).val()                
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
    if (get_list_size("#printer_options") === 1) {
        $("#cache_settings_button").attr("value", 'Submit options for ' + name)
    }
}
function remove_printer_option() {
    if (get_list_size("#printer_options") > 1) {
        $("#printer_options").find("li:last").remove()
    }
}
function clear_printer_options(){ //user hits 'submit options', the fields need to go away
    $(".printer_name").remove()
    $("#printer_options li").remove()
    enable_define_buttons()    
}
function cache_printer_options(){ 
    var name = $(".printer_name").text().split(":")[1].trim()
    var p ={}
    p[name] = []
    $("#printer_options li").each(function(){
        var o = {}
        var service_name = $(this).find("input[type='text']").val()
        o[service_name] = $(this).find("input[type='number']").val()
        p[name].push(o)
    })
    printer_data.p.push(p)
    console.log(printer_data)
    clear_printer_options()
}
////Utility functions
function update_form() {
    var printers = $("#enum_printers").val()        
    if (printers != get_list_size("#printers")) {    
        printers > $("#printers").find("li").size() ? make_name_field(printers) : remove_name_field()
    }
    prev_printers = printers        
}
function get_num(id){ //ToDo: only called once, remove.
    return $(id).val()
}
function get_list_size(id) {
    return $(id).find("li").size()
}
function submit_json(url, data, callback){
    data.xsrf = get_cookie("_xsrf")
    console.log(jQuery.param(data))
    /*
    $.ajax({
        type: "POST",
        url: url,
        data: jQuery.param(data),
        dataType: "json",
        success: callback

    })*/
}
function getCookie(name) {
    var c = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return c ? c[1] : undefined;
}
jQuery.postJSON = function(url, d, callback) {
    var data = {}
    data.data = d
    data._xsrf = getCookie("_xsrf")
    console.log("hi: ", data)
    jQuery.ajax({
        url: url,
        data: jQuery.param(data),
        dataType: "json",
        type: "POST",
        success: callback
    });
}
////
$("#enum_printers").bind("mouseup keyup change", update_form)
update_form()


////
/*
datastruct:
printers = {
    "printers": [ {"makerbot": [{"draft quality": 2.00}, {"medium quality": 4.00}, {"high quality": 6.00}]},
      {"form1": [{"draft quality": 5.00}, {"high quality": "10.00"}]}
    ]
} 
*/