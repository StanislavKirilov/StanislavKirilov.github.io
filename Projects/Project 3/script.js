 $('.nav-link').click(function(){
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
      });

       if ($(window).width() < 992) {
    $('.collapseItem').click(function(){
        $('#navbarCollapse').collapse('toggle');
      });
    }




      $(document).ready(function(){
        $("input").focus(function(){
          $(this).css("background-color", "#cccccc");
      });
        $("input").blur(function(){
          $(this).css("background-color", "#ffffff");
      });
    });
	
	$('.footerLinks').mouseover(function(){
    $(this).removeClass('text-light');
  });
  $('.footerLinks').mouseout(function(){
    $(this).addClass('text-light');
  });