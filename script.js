$(document).ready(function () {
  $(window).scroll(function () {
    // sticky navbar on scroll script
    if (this.scrollY > 20) {
      $(".navbar").addClass("sticky");
    } else {
      $(".navbar").removeClass("sticky");
    }

    // scroll-up button show/hide script
    if (this.scrollY > 500) {
      $(".scroll-up-btn").addClass("show");
    } else {
      $(".scroll-up-btn").removeClass("show");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
  particlesJS("particles-js", {
    particles: {
      number: { value: 100 },
      size: { value: 3 },
      move: { speed: 2 },
      color: { value: "#ffffff" },
      line_linked: { color: "#ffffff" }
    }
  });
});
  
  window.addEventListener("scroll", function () {
  document.querySelector(".scroll-arrow").style.display = 
    window.scrollY > 50 ? "none" : "block";
});

  // slide-up script
  $(".scroll-up-btn").click(function () {
    $("html").animate({ scrollTop: 0 });

    $("html").css("scrollBehavior", "auto");
  });

  $(".navbar .menu li a").click(function () {
    $("html").css("scrollBehavior", "smooth");
  });

  // toggle menu/navbar script
  $(".menu-btn").click(function () {
    $(".navbar .menu").toggleClass("active");
    $(".menu-btn i").toggleClass("active");
  });

  // owl carousel script
  $(".carousel").owlCarousel({
    margin: 20,
    loop: true,
    autoplay: true,
    autoplayTimeOut: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      600: {
        items: 2,
        nav: false,
      },
      1000: {
        items: 3,
        nav: false,
      },
    },
  });

 
emailjs.init("9ikn3t9V_OwCkCodC");

$("form").submit(function (event) {
  event.preventDefault();  

  $("input[name='reply_to']").val($("input[name='from_email']").val());

  emailjs.sendForm("service_brq095l", "template_sn27fo7", this)  
    .then(function(response) {
      console.log("Success", response);
      alert("Message sent successfully!");
      
      $("form")[0].reset();
    }, function(error) {
      console.log("Error", error);
      alert("Failed to send message. Please try again.");
    });
  });

});
