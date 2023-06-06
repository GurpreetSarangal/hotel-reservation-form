$("#show-details").on("click", () =>{
    $("#booking-details").removeClass("hidden");
    $("#booking-details").parent().parent().removeClass("col-sm-5");
    $("#booking-details").parent().parent().addClass("col-sm-6");

    $("#trip-overview").addClass("hidden");
   
    $("#gallery1").addClass("hidden");
    $("#gallery2").removeClass("hidden");
    $("#hide-details").removeClass("hidden");
    
});

$("#hide-details").on("click", ()=> {
    $("#booking-details").addClass("hidden");
    $("#booking-details").parent().parent().removeClass("col-sm-6");
    $("#booking-details").parent().parent().addClass("col-sm-5");

    $("#trip-overview").removeClass("hidden");

    $("#hide-details").addClass("hidden");
   
    $("#gallery1").removeClass("hidden");
    

    $("#gallery2").addClass("hidden");
    
    
});

$("#confirm").on("click", ()=>{
    alert("Your reservation has been recorded!")
});


$(document).ready(function() {
    load()

    function load(){
        fill_overview()
    }

    function fill_overview(){
        arrival_date = String(window.localStorage.getItem("arrival-date")).split('T')[0];
        departure_date = String(window.localStorage.getItem("departure-date")).split('T')[0];

        months = ["",'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        a_date = Number(arrival_date.split('-')[2]);
        d_date = Number(departure_date.split('-')[2]);

        a_mon = Number(arrival_date.split('-')[1]);
        d_mon = Number(departure_date.split('-')[1]);

        if(a_mon == d_mon){
            
            $("#dates-overview").text(a_date+" - "+d_date+" "+months[a_mon]);

        }
        else{
            text = a_date+" "+months[a_mon]+" - "+d_date+" "+months[d_mon];
            $("#dates-overview").text(text);
        }
        
        no_of_guests = window.localStorage.getItem("guests");
        $("#guests-overview").html(no_of_guests+" guest(s)");

        // $("#guests-overview").html("test")

        rooms = window.localStorage.getItem("rooms")

    }

})
