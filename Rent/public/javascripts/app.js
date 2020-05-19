setTimeout(function(){
    $('.loader_bg').fadeToggle();
},1000);

function menuBarClick(x) {
    if($(".cross").hasClass("change")){
        $("header").css({"background-color" : "black", "color":"white", "height":"auto", "overflow":"hidden"});
        $(".nav-header a").css({"color":"white"});
        $(".mobile-nav-item").css({"display":"none"});
        $("body").css({"overflow":"scroll"});
     }
   else{  
       $("body").css({"overflow":"hidden"})
        $("header").css({"background-color" : "white", "color":"black", "height":"100%",  "overflow-y":"scroll"});
       $(".nav-header a").css({"color":"black"});
       $(".mobile-nav-item").css({"display":"block"});}
    $(".mobile-nav-item a").css({"color":"black", "display":"block"});
    x.classList.toggle("change");

    $("#mobileid").toggleClass("mobile");

}


