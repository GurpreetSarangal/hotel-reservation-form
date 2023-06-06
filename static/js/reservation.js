$(document).ready(function() {  
    $("#reservation-form").validate({
        rules:{
                FirstName: "required",
                LastName: "required",
                Email:{
                    required: true,
                    email: true,
                },
                
                Phone: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                },
                Street: "required",
                // street_address_2: "required",
                City: "required",
                State: "required",
                PostalCode: "required",
                CheckIn: {
                    required: true,
                },
                
                CheckOut: {
                    required: true,
                },
                
                NoOfGuests: {
                    required: true,
                    number: true,
                    min: 1,
                },
        },
        errorElement: "span",
        errorClass: "error fail-alert",
        validClass: "valid success-alert",

        highlight: function(element, errorClass, validClass) {
        $(element).addClass(errorClass).removeClass(validClass);
        $(element.form).find("label[for=" + element.id + "]")
        .addClass(errorClass);
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
            .removeClass(errorClass);
        },
        submitHandler: function() { 
            var arrival_date = document.getElementById("arrival-date").value;
            var departure_date = document.getElementById("departure-date").value;
            var validator = $("#reservation-form").validate();

            if (valid_dates(validator, arrival_date, departure_date) == true ){
                save_to_local();
                document.location = "http://127.0.0.1:5500/confirm.html";
                // form.submit();
                console.log("approved")
            }
            
        },
    });
});

function save_to_local(){
    
    window.localStorage.setItem("first-name", String($("#first-name").val()));
    window.localStorage.setItem("last-name", String($("#last-name").val()));
    window.localStorage.setItem("email", String($("#email").val()));
    window.localStorage.setItem("Phone", String($("#Phone").val()));
    window.localStorage.setItem("stree-address-1", String($("#stree-address-1").val()));
    window.localStorage.setItem("city", String($("#city").val()));
    window.localStorage.setItem("province", String($("#province").val()));
    window.localStorage.setItem("country", String($("#country").val()));
    window.localStorage.setItem("postal-code", String($("#postal-code").val()));
    window.localStorage.setItem("arrival-date", String($("#arrival-date").val()));
    window.localStorage.setItem("departure-date", String($("#departure-date").val()));
    window.localStorage.setItem("guests", String($("#guests").val()));
    window.localStorage.setItem("special-request", String($("#special-request").val()));

    if($("#manual-mode-toggle").is(':checked')){

        rooms = []
        allRoomTypes = ["-","Single Room", "Double Room", "Queen-Bed Room", "King-Bed Room", "Hollywood Twin Room", "Cabana", "Suite", "Presidential Suite"]

        for(i=1; i<=8; i++){
            isSelected = $("#select-200"+String(i)).val()
            if(isSelected){
                room = {
                    "name" : allRoomTypes[i],
                    "rate" : $("rate200"+String(i)).val(),
                    "number" : $("no-of-200"+String(i)).val()
                }
                rooms.push(room)
            }
        }
        window.localStorage.setItem("rooms", JSON.stringify(rooms));
        window.localStorage.setItem("mode", "manual")
    }
    else{
        window.localStorage.setItem("mode", "auto")
        room = {
            'name': $("#type-of-room").val()
        }
        
    }

    window.localStorage.setItem("total-amount", String($("#total-amount").val()));
    window.localStorage.setItem("number-of-rooms", String($("#number-of-rooms").val()));
    window.localStorage.setItem("stay-days", String($("#stay-days").val()));
    window.localStorage.setItem("special-price-days", String($("#special-price-days").val()));

}

function valid_dates(validator, arrival_date, departure_date=""){

    if (departure_date === ""){
        return
    }
    
    var arrival = {
        year : Number( arrival_date.split("-")[0]),
        month: Number( arrival_date.split("-")[1]),
        date : Number( arrival_date.split("-")[2].split("T")[0]),
    };
    // console.table(arrival);
    var departure = {
        year : Number( departure_date.split("-")[0]),
        month: Number( departure_date.split("-")[1]),
        date : Number( departure_date.split("-")[2].split("T")[0]),
    };
    // console.table(departure);
    var today = new Date();
    if( arrival["year"] < today.getFullYear() || departure["year"] < today.getFullYear()){
        
        validator.showErrors({
            CheckIn: "Invalid Arrival or Departure year",
            CheckOut: "Invalid Arrival or Departure year",
        });
    }
    else if(
        ( arrival["year"] == today.getFullYear() || departure["year"] == today.getFullYear()) 
        && 
        ( arrival["month"] < today.getMonth() +1 || departure["month"] < today.getMonth() +1) )
    {
        validator.showErrors({
            CheckIn: "Invalid Arrival or Departure month",
            CheckOut: "Invalid Arrival or Departure month",
        });
    }
    else if((
        ( arrival["year"] == today.getFullYear() || departure["year"] == today.getFullYear()) 
        && 
        ( arrival["month"] == today.getMonth() +1 || departure["month"] == today.getMonth() +1) )
        &&
        ( arrival["date"] < today.getDate() || departure["date"] < today.getDate()))
        {
            validator.showErrors({
                CheckIn: "Invalid Arrival or Departure dates",
                CheckOut: "Invalid Arrival or Departure dates",
            });
    }


     else if ( arrival["year"] > departure["year"]){
        validator.showErrors({
            CheckIn: "Invalid Arrival or Departure year",
            CheckOut: "Invalid Arrival or Departure year",
        });
        return false;
    }
    else if( arrival["month"] > departure["month"] && arrival["year"] == arrival["year"] ){
        validator.showErrors({
            CheckIn: "Invalid Arrival or Departure month",
            CheckOut: "Invalid Arrival or Departure month",
        });
        return false;
    }
    else if( arrival["date"] > departure["date"] && arrival["year"] == arrival["year"] && arrival["month"] == arrival["month"]){
        validator.showErrors({
            CheckIn: "Invalid Arrival or Departure dates",
            CheckOut: "Invalid Arrival or Departure dates",
        });
        return false;
    }
    else if( arrival["date"] == departure["date"] && arrival["month"] == departure["month"] && arrival["year"] == departure["year"]){
        return valid_time(validator);
    }
    else{
        return true;
    }
}

function valid_time(validator){

    var arrival_time = (document.getElementById("arrival-date").value).split("T")[1];
    var departure_time = (document.getElementById("departure-date").value).split("T")[1];
    arrival = {
        hour : Number(arrival_time.split(":")[0]),
        minutes : Number( arrival_time.split(":")[1]),
    };
    departure = {
        hour : Number( departure_time.split(":")[0]),
        minutes : Number( departure_time.split(":")[1]),
    };

    if (arrival["hour"] > departure["hour"]){
        validator.showErrors({
            CheckIn: "Invalid Arrival or Departure time",
            CheckOut: "Invalid Arrival or Departure time",
        });
        return false;
    }
    else if(arrival["minutes"] > departure["minutes"] && arrival["hour"] == departure["hour"]){
        validator.showErrors({
            CheckIn: "Invalid Arrival or Departure time",
            CheckOut: "Invalid Arrival or Departure time",
        });
        return false;
    }
    else{
        return true;
    }
}

// -----------------------
// event listners start

$("#type-of-room").on("change", (e) =>{ 
    var element = $("#type-of-room");
    // console.log(element);
    // console.log(element.val());
    update_gallery(element);
    update_info_about_room();
    auto_update_total();
});

$("#arrival-date").on("change", (e) => {
    
    var validator = $("#reservation-form").validate();
    if(valid_dates(validator,
        $("#arrival-date").val(),
        $("#departure-date").val()) ){

            update_info_about_room();
            update_stay_days();
            if($("#manual-mode-toggle").is(':checked')){
                manual_update_total();
            }
            else{
                auto_update_total();
            }

    }
    
});

$("#departure-date").on("change", (e) => {
    var validator = $("#reservation-form").validate();
    if(valid_dates(validator,
        $("#arrival-date").val(),
        $("#departure-date").val()) )
    {
            update_info_about_room();
            update_stay_days();
            if($("#manual-mode-toggle").is(':checked')){
                manual_update_total();
            }
            else{
                auto_update_total();
            }

    }
    
});

$("#guests").on("change", (e) => {
    if($("#manual-mode-toggle").is(':checked')){
        manual_update_total();
    }
    else{
        auto_update_total();
    }
});


$("#manual-selection-on").on("click", () => {
    hide_auto_selection();
    show_manual_selection_table();
    $("#manual-mode-toggle").prop("checked", true);

    $("#manual-selection-off").on("click", ()=>{
        $("#manual-mode-toggle").prop("checked", false);

        hide_manual_selection_table();

        show_auto_selection();
        auto_update_total();
    });
    
});

for (var i=1 ; i<=8; i++){
    $("#select-200"+String(i) ).on("change", enable_inputs);
    $("#select-200"+String(i) ).on("change", manual_update_total);

    $("#no-of-200"+String(i)).on("change", manual_update_total);
}


// ------------------------

// utility functions start

function update_gallery(em){
    // console.log(em);
    if($("#manual-mode-toggle").is(':checked')){
        // console.log("manual mode is checked");
        return
    }
    $("#gallery").children().addClass("hidden");
    $("#"+em.val() ).removeClass("hidden");
}

function auto_update_total(){
    var arrival_date = $("#arrival-date").val();
    var departure_date = $("#departure-date").val();
    
    // Todo: if no arrival date is given take weekdays as 1 and weekend as 0
    if (arrival_date == "" || departure_date == ""){
        return
    }
    var d0 = new Date(arrival_date);
    var d1 = new Date(departure_date);

    var days = Number( $("#stay-days").val() );
    var weekends = countWeekendDays(d0, d1);
    var workdays = days - weekends;

    var normal_price = Number ( $("#room-rate").val() );
    var number_of_guests = Number ( $("#guests").val() );
    var capacity_of_room = Number ( $("#capacity").val() );

    
    var number_of_rooms = Math.ceil(number_of_guests / capacity_of_room);
    
    // console.log("days", days);
    // console.log("weekends", weekends);
    // console.log("normal price", normal_price);
    // console.log("guests ", number_of_guests);
    // console.log("rooms ", number_of_rooms);
    

    var total = Math.round((normal_price * workdays * number_of_rooms) + ((normal_price + (normal_price * 0.15)) * weekends * number_of_rooms));
    
    // console.log("total ", total);
    // console.log("weekdays price",(normal_price * workdays * number_of_rooms) );
    // console.log("weekend price ", ((normal_price + (normal_price/100) * 15) * weekends * number_of_rooms));

    $("#total-amount").val(total);
    $("#number-of-rooms").val(number_of_rooms);

}

function update_stay_days(){
    var arrival_date = $("#arrival-date").val();
    var departure_date = $("#departure-date").val();
    if (arrival_date == "" || departure_date == ""){
        return
    }
    var d0 = new Date(arrival_date);
    var d1 = new Date(departure_date);

    var ndays = 1 + Math.round((d1.getTime()-d0.getTime())/(24*3600*1000));
    // console.log(ndays);
    $("#stay-days").val(ndays);

    var weekends = countWeekendDays(d0, d1);
    $("#special-price-days").val(weekends);
}

function countWeekendDays( d0, d1 )
{
  var ndays = 1 + Math.round((d1.getTime()-d0.getTime())/(24*3600*1000));
  var nsaturdays = Math.floor( (d0.getDay()+ndays) / 7 );
  return 2*nsaturdays + (d0.getDay()==0) - (d1.getDay()==6);
}

function update_info_about_room(){
    var selected_room = $("#type-of-room").val();
    var roomID = $("#room-id");
    var rate = $("#room-rate");
    var capacity = $("#capacity");
    if (selected_room == "single"){
        roomID.val(2001);
        rate.val(100);
        capacity.val(1);
    }
    else if(selected_room == "double"){
        roomID.val(2002);
        rate.val(149);
        capacity.val(2);
    }
    else if(selected_room == "queen"){
        roomID.val(2003);
        rate.val(160);
        capacity.val(2);
    }
    else if(selected_room == "king"){
        roomID.val(2004);
        rate.val(180);
        capacity.val(2);
    }
    else if(selected_room == "hollywood"){
        roomID.val(2005);
        rate.val(180);
        capacity.val(2);
    }
    else if(selected_room == "cabana"){
        roomID.val(2006);
        rate.val(349);
        capacity.val(4);
    }
    else if(selected_room == "suite"){
        roomID.val(2007);
        rate.val(399);
        capacity.val(3);
    }
    else if(selected_room == "presidential"){
        roomID.val(2008);
        rate.val(999);
        capacity.val(1);
    }
}

function show_auto_selection(){
    $("#vr-1").children().removeClass("hidden");
    // $("#vr-1").hide();
    $("#vr-1").css({
        "height" : "300px",
        "display" : "flex",
    });

    // $("#gallery-container").removeClass("hidden");
    // $("#type-of-room").parent().show();
    // $("#number-of-rooms").show();
    $(".auto-select").show()

    $("#room-details-and-price").removeClass("col-sm-12");
    $("#room-details-and-price").addClass("col-sm-6");
}

function hide_auto_selection(){
    $("#vr-1").children().addClass("hidden");
    // $("#vr-1").hide();
    $("#vr-1").css({
        "height" : "0px",
        "display" : "none",
    });

    // $("#gallery-container").addClass("hidden");
    // $("#type-of-room").parent().hide();
    // $("#number-of-rooms").hide();

    $(".auto-select").hide();

    $("#room-details-and-price").removeClass("col-sm-6");
    $("#room-details-and-price").addClass("col-sm-12");
   
    
}

function show_manual_selection_table(){
    $("#manual-selection-panel").removeClass("hidden");
}

function hide_manual_selection_table(){
    $("#manual-selection-panel").addClass("hidden");
}


function manual_update_total(e){
    var total =0, total_rooms =0;
    console.log(e);
    for(var room_id = 2001; room_id<=2008; room_id++){
        
        if( $("#manual-mode-toggle").is(':checked') && 
            $("#select-"+room_id).is(":checked"))
        {

            var rate = Number( $("#rate"+room_id).val());
            var number_of_rooms = Number( $("#no-of-"+room_id).val() ) ;
            var number_of_days = Number( $("#stay-days").val() );
            var weekend = Number( $("#special-price-days").val()) ;
            var weekdays = number_of_days - weekend;
    
            var this_room_cost = (rate * weekdays * number_of_rooms) + ((rate +(rate * 0.15)) * weekend * number_of_rooms)

            console.log("room - id ->", room_id, " cost -> ", this_room_cost, " Rate -> ", rate, " Weekdays-> ", weekdays, " Weekends-> ", weekend, " Number of rooms-> ", number_of_rooms);
            total = total + this_room_cost;
            total_rooms = total_rooms + number_of_rooms;
        }
    }
    $("#total-amount").val(Math.round(total));
    $("#number-of-rooms").val(total_rooms);
}


function enable_inputs(e){
    console.log(e.target.id)
    var button_id = e.target.id;
    var room_id = button_id.split("-")[1]
    var input_id = "no-of-" + room_id;

    if( $("#" + button_id ).is(":checked") ){
        $("#" + input_id).prop("readonly", false);
        // console.log("false ,","#select-200"+String(i))
    }
    else{
        $("#"+input_id).prop("readonly", true);
        // console.log("true ,","#select-200"+String(i));

    }
}