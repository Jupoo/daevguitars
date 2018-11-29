$(document).ready( function() {
	var elem_header = $('.page-header');
	var h_hght = elem_header.outerHeight(); // высота шапки

	$(window).resize(function(){
		h_hght = elem_header.outerHeight(); // высота шапки
	});


    //Фиксированное меню
    headerfix();
    $(function(){
        $(window).scroll(function(){
            headerfix();
        });
    });
    function headerfix() {
        var top = $(this).scrollTop();
        var h_mainbl = $('.main').outerHeight(); // высота верхнего блока
        if(top > h_mainbl) {
            elem_header.find('.js-page-header').addClass("fixed");
        } else {
            elem_header.find('.js-page-header').removeClass("fixed");
        }
    }

	
	//Плавная прокрутка до якоря
	$(document).on('click', 'a.ancLinks', function () {
		var elementClick = $(this).attr("href");
		ancLinks(elementClick);
		
		if($(this).hasClass("ancLinks--win"))
			$(".js-menu-adaptive-close").click();
			
		return false;
	});
	
	function ancLinks(elementClick) {
		var destination = $(elementClick).offset().top - h_hght;//минус высота шапки
		$("html:not(:animated),body:not(:animated)").animate({scrollTop: destination},500);
		return false;
	}

	//-----------Мобильное меню---------------//
	$(document).on("click", ".js-menu-adaptive-btn, .js-menu-adaptive-close", function (e) {
		if($("body").hasClass("overflow-no")) {
			$(".js-menu-adaptive-list").fadeOut(0);
			$(".js-menu-adaptive-close").css("right","0px");
			$("body").removeClass("overflow-no").css("padding-right","0px");
			$(".page-header").css("padding-right","0px");
		} else {
			$(".js-menu-adaptive-list").fadeIn(400);
			//$(this).closest(".js-menu-adaptive-wrap").find(".js-menu-adaptive-list").slideToggle("100", function () {
				$("body").addClass("overflow-no").css("padding-right",scrollbarWidth());
				$(".page-header").css("padding-right",scrollbarWidth());
				$(".js-menu-adaptive-close").css("right",scrollbarWidth());
			//});
		}
		e.preventDefault();
	});

	//Отзывы слайдер
	$('.js-responsive-reviews').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 2,
		slidesToScroll: 2,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true
				}
			}
			// You can unslick at a given breakpoint now by adding:
			// settings: "unslick"
			// instead of a settings object
		]
	});
});


//************ Модальные окна BEGIN *******************//
$(document).ready( function() {
    //Генерация подложки для модального окна
    $("body").prepend("<div class='modal-shadow'></div>");

    //Инициализация окна
    $(".modal-window").each(function() {
        var win = $(this);
        win.find(".modal-window__body").prepend("<a href='' class='closemodal'><span class='icon--cancel'></span></a>");
        win.addClass("js-window");
        modalresizer();
    });

    //Открытие окна
    $(document).on("click", ".openmodal", function (e) {
        e.preventDefault();
        var btn = $(this);
        var modal_id = btn.attr("data-id");
        openmodalContent(modal_id, btn);
    });

    //Закрытие модального окна
    $("body").on("click", ".closemodal, .modal-shadow", function(event) {
		$(".modal-window, .modal-shadow").animate({
			opacity: 0
		}, 500, function() {
			$(".modal-window, .modal-shadow").removeClass("js-active");

			$("body").removeClass("overflow-no").css("padding-right","0px");
			$(".page-header").css("padding-right","0px");
		});
		event.preventDefault();
    });

    if ($(".modal-window").length) {
        $(document).click(function (e) {
            if ($(e.target).closest(".modal-window").length) {
                if ($(e.target).closest(".modal-window__body").length) {
                    return;
                }
                else {
                    $(e.target).find(".closemodal").click();
                }
            }
            e.stopPropagation();
        });
    }

    //Функция отложенного конечного действия
    var waitForFinalEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
                clearTimeout (timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();
    //При ресайзе окна
    $(window).resize(function () {
        modalresizer();
    });

    $(".modal-window").bind( 'DOMSubtreeModified',function(){ // отслеживаем изменение содержимого окна
        modalresizer();
    });
});

//Выводим нужный контент
function openmodalContent(modal_id, btn) {
	if(modal_id === "modal-product") {
        var win = $("#" + modal_id);
        win.find(".modal-window__title").text("");
        win.find(".modal-window__product-img").html("");
        win.find(".modal-window__product-prices").html("");

		var wrap_product = btn.closest(".js-product");
		var title_product = wrap_product.find(".js-product-name").text();
		var img_product = wrap_product.find(".js-product-img").html();
		var price_product = wrap_product.find(".js-product-pricelist").html();

        win.find(".modal-window__title").text(title_product);
        win.find(".modal-window__product-img").html(img_product);
        win.find(".modal-window__product-prices").html(price_product);
	}
	openmodal(modal_id);
}

//Открытие окна
function openmodal(artic) {
    $("#" + artic).addClass("js-active");
    $("#" + artic).animate({
        opacity: 1
    }, 500);
    $(".modal-shadow").addClass("js-active");
    $(".modal-shadow").animate({
        opacity: 0.5
    }, 500);
    modalresizer();
}

//Делаем окно адаптивным
function modalresizer() {
    $(".modal-window").each(function() {
        var el_win = $(this);
        el_win.css({"height" : "auto" });
        if(el_win.hasClass("js-active")) {
            if(el_win.outerHeight() >= $(window).height()) {
                $("body").addClass("overflow-no").css("padding-right",scrollbarWidth());
                $(".page-header").css("padding-right",scrollbarWidth());
                el_win.css({"top" : 0, "height" : "100%" });
            } else {
                $("body").removeClass("overflow-no").css("padding-right","0px");
                $(".page-header").css("padding-right","0px");

                el_win.removeClass("js-window-absolut");
                var getheight = $(window).height();
                var getmodalheight = el_win.innerHeight();
                var gtx = getheight - getmodalheight;
                gtx = gtx / 2;
                el_win.css({"top" : gtx, "height" : "auto" });
            }
        }
    });
}
//************ Модальные окна END *******************//

//узнаем ширину полосы прокрутки
function scrollbarWidth() {
	var block = $('<div>').css({'height':'50px','width':'50px'}),
		indicator = $('<div>').css({'height':'200px'});

	$('body').append(block.append(indicator));
	var w1 = $('div', block).innerWidth();
	block.css('overflow-y', 'scroll');
	var w2 = $('div', block).innerWidth();
	$(block).remove();
	return (w1 - w2);
}