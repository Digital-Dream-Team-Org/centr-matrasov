(function ($) {
  $(document).ready(function () {
    // $("[data-badge]").each(function () {
    //   const badgeValue = $(this).data("badge");
    //   $(this).addClass("has-badge");
    //   $(this).append(`<span class="has-badge__item">${badgeValue}</span>`);
    // });
    if ($("body").width() <= "576") {
      if ($(document).scrollTop() >= 300) {
        $(".main-header__top").addClass("fixed");
      } else {
        $(".main-header__top").removeClass("fixed");
      }
    }
    $(document).on("scroll", function () {
      if ($("body").width() <= "576") {
        if ($(document).scrollTop() >= 300) {
          $(".main-header__top").addClass("fixed");
        } else {
          $(".main-header__top").removeClass("fixed");
        }
      }
    });

    $(".categories-panel a").each(function () {
      $(this)[0].ondragstart = function () {
        return false;
      };
    });
    $(".categories-panel").each(function () {
      let $self = $(this);
      let panStart = null;
      let categoryPan = new Hammer($self[0]);

      categoryPan.on("panstart", function ($event) {
        panStart = $event.center.x;
      });
      categoryPan.on("panend", function ($event) {
        panStart = null;
      });

      categoryPan.on("pan", function ($event) {
        const walk = ($event.center.x - panStart) * 0.08; //scroll-fast
        $self.scrollLeft($self.scrollLeft() - walk);
      });
    });
  });
})(jQuery);
