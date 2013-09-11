
var prev_printers = get_num("#enum_printers")
var printer_data = {"p": []}

$(document).ready(function(){
    //need to cache the Printer names/options passed from the server into the local data structure.
    $.getJSON("/printer_list", function(data){
        var printer_list = JSON.parse(data.replace(/'/g, '"'))
        printer_list.forEach(function(printer_obj) {
            for (printer_name in printer_obj) {
                printer_options = printer_obj[printer_name]
                var p = {}
                p[printer_name] = []
                printer_options.forEach(function(option_obj) {
                    for (service_name in option_obj) {         
                        s = {}               
                        s[service_name] = option_obj[service_name]
                        p[printer_name].push(s)
                    }
                })
                printer_data.p.push(p)
            }        
        })
    })
})


////Define the printers available: eg, Makerbot1, Makerbot2, Form1, Zcorpt
function make_name_field(id) { //the field which names each type of printer: Makerbot1, Makerbot2, Form1, Form2, Zcorp, etc..    
    var str = "<li><input type='text' id='printer_"+id+"' maxlength='80'><input class='define_options' onclick='show_printer_option("+id+")' type='button' value='Define options'>"
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
var show_printer_option = function(id, name, cost)  { //ToDo: refactor. Remove code that adds custom ids to text/num input elements?
    var name
    var option_name = (name === undefined ?  '' : name)
    var option_cost = (cost === undefined ? '0.00' : cost)
    if (id) {        
        var n = "#printer_" + id  
        name = $(n).val()          
        $("#printer_options").prepend("<div class='printer_name'>")
        $(".printer_name").text("Options for: " + name)
    }

    id = id || ($("#printer_options").find("li").size() + 1) //can be called externally or recursively. This is for recursive calls. 
    disable_define_buttons()
    var target = $("#printer_options").find("ul")       
    var insert_string = "<li><label>Service name: <input type='text' value = '"+option_name+"' id='option_"+id+"_name' required></label> \
    <input type='number' id='option_"+id+"_cost' pattern='[0-9]+\.[0-9]+' value='"+option_cost+"' min='0.0' step='0.01'><label>Cost per CC</label>"
    if (get_list_size("#printer_options") < 1) {
        insert_string += "<input type='button' value='+' onclick='show_printer_option()'>\
        <input type='button' value='-' onclick='remove_printer_option()'> <input type='button' id='cache_settings_button' onclick='cache_printer_options()'> </li>"
    }    
    target.append(insert_string)    
    if (get_list_size("#printer_options") === 1) {
        $("#cache_settings_button").attr("value", 'Submit options for ' + name)
    }
    populate_printer_options(name)
}
function populate_printer_options(printer_name) {
    printer_data.p.forEach(function(p) {
        if (printer_name in p) {
            var first_item = $("#printer_options li")
            var printer_options_array = p[printer_name]
            for (var i = 0; i < printer_options_array.length; i++) {
                var option = printer_options_array[i]
                for (option_name in option) {
                    console.log(option_name, ": ", option[option_name])
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
    })
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
/*
function cache_printer_options(name){ //Builds a local object that represents the available printers and 
    var p = {}
    var name = name | get_printer_name //the server passes the data it stores as part of the "current printers" div. Store that, and check for new printers def locally.
    function get_printer_name() {
        return $(".printer_name").text().split(":")[1].trim()
    }

}*/
function cache_printer_options(){  //ToDo: refactor this + document init code to be DRY.
    var name = $(".printer_name").text().split(":")[1].trim()
    var e = printer_exists(name)
    console.log(e)
    if(e) {delete(e)}
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
datastruct:
printers = {
    "printers": [ {"makerbot": [{"draft quality": 2.00}, {"medium quality": 4.00}, {"high quality": 6.00}]},
      {"form1": [{"draft quality": 5.00}, {"high quality": "10.00"}]}
    ]
} 
*/
