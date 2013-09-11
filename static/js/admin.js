
var prev_printers = get_num("#enum_printers")
var printer_data
/*
new structure:
printers = {
    "foo": [{"option_name":"option_cost"}, ...],
    "bar": [{"option_name":"option_cost"}, ...], 
    .
    .
    .
}*/

$(document).ready(function() {
    $.getJSON("/printer_list", function(data){
        console.log()
        console.log(data.replace(/'/g, '"'))
        printer_data = JSON.parse(data.replace(/'/g, '"'))
        console.log(printer_data)
    })
})

////Printer_data CRUD & util funcs:
function set_printer(name, settings) {
    printer_data[name] = settings
    return printer_data
}
function remove_printer(name) {
    delete(printer_data[name])
    return printer_data
}
var printer_exists = function(name) {
    return (name in printer_data)
}


////Define the printers available: eg, Makerbot1, Makerbot2, Form1, Zcorpt
function make_name_field(id) { //the field which names each type of printer: Makerbot1, Makerbot2, Form1, Form2, Zcorp, etc..    
    console.log("hi!")
    var str = "<li><input type='text' id='printer_"+id+"' maxlength='80'/> \
    <input class='define_options' onclick='show_printer_option("+id+")' type='button' value='Define options'/> \
    <input type='button' id='remove_printer_button' value='-' onclick='remove_printer_row("+id+")' />"
    $("#printers").find("ol").append(str)
    str = "#p" + id + "_options"
    var options = $(str)
}
function remove_name_field() {        
    if (get_list_size("#printers") > 1) {
        $("#printers").find("li:last").remove()
    }
}
function remove_printer_row(row){
    var printer_name = $("#printers li:nth-child("+row+")").find("input[type=text]").val()
    if (printer_name in printer_data) remove_printer(printer_name)
    $("#printers li:nth-child("+row+")").remove()   
    $("#enum_printers").val($("#enum_printers").val()-1)
}
////User interaction with the Printer Options area, eg, defining services offered by Makerbot1: low, med, hi quality @ x,y,z price.
function enable_controls(enabled) {
    var controls = [$("#enum_printers")[0], $("#submit_button")[0]]    
    build_control_list(".define_options")
    build_control_list("#printers input[type='text']")
    function build_control_list(target) {
        $(target).each(function() { controls.push($(this)[0])
        })
    }
    function set_all_controls(enabled) {
        controls.forEach(function(node) {
            !(enabled) ? node.setAttribute('disabled', true) : node.removeAttribute('disabled')            
        })
    }
    set_all_controls(enabled)
}

var show_printer_option = function(id, name, cost)  { //ToDo: refactor. Remove code that adds custom ids to text/num input elements?
    var printer_name, option_name, option_cost

    name === undefined ? option_name = '' : option_name = name
    cost === undefined ? option_cost = '0.00' : option_cost = cost
    if (id) {        
        var n = "#printer_" + id  
        printer_name = $(n).val()          
        $("#printer_options").prepend("<div class='printer_name'>")
        $(".printer_name").text("Options for: " + printer_name)
    }
    id = id || ($("#printer_options").find("li").size() + 1) //can be called externally or recursively. This is for recursive calls. 
    enable_controls(false)
    var target = $("#printer_options").find("ul")    
    var insert_string = "<li><label>Service name: <input type='text' value = '"+option_name+"' id='option_"+id+"_name' required></label> \
    <input type='number' id='option_"+id+"_cost' pattern='[0-9]+\.[0-9]+' value='"+option_cost+"' min='0.0' step='0.01'><label>Cost per CC</label>"
    insert_string += "<input type='button' value='Remove option' onclick='remove_printer_option('"+id+"')'>"
    if (get_list_size("#printer_options") < 1) {
        show_option_header_buttons($("#printer_options p"), printer_name)   
    }    
    target.append(insert_string)    
    populate_printer_options(printer_name)
}

function show_option_header_buttons(target, name) {    
    var insert_string = "<input type='button' value='Add option' onclick='show_printer_option()'>"
    insert_string += "<input type='button' id='cache_settings_button' onclick='cache_printer_options()'> </li>"
    target.append("<div id = 'option_buttons'>")
    $("#option_buttons").append(insert_string)
    $("#cache_settings_button").attr("value", 'Submit options for ' + name)
}
function remove_option_header_buttons() {
    $("#option_buttons").remove()
}


function populate_printer_options(printer) {
    if (printer in printer_data) {
        var first_item = $("#printer_options li")
        var printer_options_array = printer_data[printer]
        for (var i = 0; i < printer_options_array.length; i++) {
        var option = printer_options_array[i]   
        for (option_name in option) {
            if (i === 0) { //the first row is created by the "define options button. Insert vals seperately."
                var target = $("#printer_options ul").find("li:first")
                target.find("input[type=text]").val(option_name)
                target.find("input[type=number]").val(option[option_name])
                } else { 
                    show_printer_option(null, option_name, option[option_name])
                }
            }
        }                
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
    enable_controls(true)
}

function cache_printer_options(){  //ToDo: refactor this + document init code to be DRY.
    var name = $(".printer_name").text().split(":")[1].trim()
    if (name in printer_data) delete(printer_data[name])
    var options = []
    $("#printer_options li").each(function(){
        var option = {}
        var option_name = $(this).find("input[type='text']").val()
        var option_cost = $(this).find("input[type='number']").val()
        option[option_name] = option_cost
        options.push(option)
    })
    set_printer(name, options)
    clear_printer_options()
    remove_option_header_buttons()
  
}

////Utility functions
function printer_exists(name) {
    printer_data.p.forEach(function(p) {
        if (name in p) {
            console.log(p)
            return p
        }
    })
    return null
}
function process_form() {
    submit_json("/admin", printer_data, function(msg){alert(msg["result"])})

}
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
function submit_json(url, d, callback){
    var data = {}
    data.data = JSON.stringify(d)
    data._xsrf = getCookie("_xsrf")
    console.log(data)
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "json",
        success: callback

    })
}
function getCookie(name) {
    var c = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return c ? c[1] : undefined;
}
////
$("#enum_printers").bind("mouseup keyup change", update_form)
update_form()


////
/*
new structure:
printers = {
    "foo": [{"option_name":"option_cost"}, ...],
    "bar": [{"option_name":"option_cost"}, ...], 
    .
    .
    .
}
printers = {
    "foo": [{"high quality":24.63}, {"med quality":2.63}, {"low quality":0.63}],
    "bar": [{"high quality":4.63}, {"med quality":1.63}, {"low quality": 0.32}], 
    "baz": [{"quux quality": 246.3}, {"zzz+++ quality": 35.2}]
}

datastruct:
printers = {
    "printers": [ {"makerbot": [{"draft quality": 2.00}, {"medium quality": 4.00}, {"high quality": 6.00}]},
      {"form1": [{"draft quality": 5.00}, {"high quality": "10.00"}]}
    ]
} 
*/
