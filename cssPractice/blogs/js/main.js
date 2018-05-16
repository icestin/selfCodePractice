(function(){
     console.log("func")
     var sidebar = $('#sidebar'),
         mask = $('.mask'),
         backBtn = $('.back-to-top'),
         sidebar_trigger = $('#sidebar_trigger');
 

         function show (e) {
            console.log("click");
            mask.fadeIn();
            sidebar.css(
                {"right": 0}
            )            
        }
        function hide (){
            mask.fadeOut();
            sidebar.css(
                {"right":-200}
            )
        }
        
         sidebar_trigger.on('click',show);
         mask.on('click', hide);
         backBtn.on('click', function(){
             console.log("bbb");
             $('html, body').animate({
                 scrollTop: 0
             }, 800)
         });

         $(window).on('scroll', function() {
            if($(window).scrollTop() > $(window).height())
                backBtn.fadeIn();
            else 
                backBtn.fadeOut();
         });

         $(window).trigger('scroll');



})()