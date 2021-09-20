(function ($) {
  $(document).ready(function () {
    // Compare filter
    // Really loop heavy actions, may be better to move logic on back-end
    $('input[name="compare_type"]').on("change", function () {
      let compareType = $(this).val();
      updateCompareAttributesDisplay(compareType);
    });
    $(".custom-tabs-header__item-link").on("click", function () {
      let compareType = $('input[name="compare_type"]:checked').val();
      if (compareType) {
        updateCompareAttributesDisplay("all");
        setTimeout(() => {
          updateCompareAttributesDisplay(compareType);
        }, 200);
      }
    });

    function updateCompareAttributesDisplay(compareType) {
      if (compareType === "difference") {
        let activeTab = $(".tab-pane.active");
        if (!activeTab.length) {
          console.error("tab is unavailable");
          return;
        }

        let attributes = [
          "compare-attribute--rating",
          "compare-attribute--type",
          "compare-attribute--size",
          "compare-attribute--height",
          "compare-attribute--firmness",
          "compare-attribute--base",
          "compare-attribute--load",
          "compare-attribute--composition",
          "compare-attribute--price",
          "compare-attribute--filler",
          "compare-attribute--weight",
          "compare-attribute--cubature",
          "compare-attribute--packaging",
          "compare-attribute--color",
          "compare-attribute--warranty",
          "compare-attribute--manufacturer",
        ];

        attributes.forEach((attribute) => {
          let $attrs_active = activeTab.find("." + attribute);
          let attrs_array = [];
          $attrs_active.each(function () {
            attrs_array.push($(this).text().trim());
          });

          let uniq = [...new Set(attrs_array)];
          let $atts_global = $("." + attribute); // including sidebar
          if (uniq.length <= 1) $atts_global.addClass("d-none");

          // hide accordion
          if (
            $(".compare-attribute-accordion").find(".compare-attribute")
              .length ===
            $(".compare-attribute-accordion").find(".compare-attribute.d-none")
              .length
          ) {
            $(".compare-attribute-accordion").addClass("d-none");
          }
        });
      } else {
        $(".compare-attribute").removeClass("d-none");
        $(".compare-attribute-accordion").removeClass("d-none");
      }
    }

    // Catalog filter tags
    if ($(".bx-filter").length) {
      $(".bx-filter").each(function () {
        let tags = [];
        const paramsContainers = $(this).find(".bx-filter-parameters-box");
        paramsContainers.each(function () {
          const title = $(this)
            .find(".bx-filter-parameters-box-title")
            .text()
            .trim();

          if ($(this).find(".radio").length) {
            let value = null;
            $(this)
              .find(".radio")
              .each(function () {
                let input = $(this).find('input[type="radio"]');
                let iValue = input
                  .closest(".bx-filter-input-checkbox")
                  .find(".bx-filter-param-text")
                  .attr("title");
                let id = input.attr("id");
                if (input.attr("checked") === "checked" && iValue) {
                  value = iValue;
                  tags.push({
                    title,
                    value,
                    id,
                  });
                }
              });
          }

          if ($(this).find(".checkbox").length) {
            $(this)
              .find(".checkbox")
              .each(function () {
                let input = $(this).find('input[type="checkbox"]');
                let value = null;
                let iValue = input
                  .closest(".bx-filter-input-checkbox")
                  .find(".bx-filter-param-text")
                  .attr("title");
                let id = input.attr("id");

                if (input.attr("checked") === "checked" && iValue) {
                  value = iValue;
                  tags.push({
                    title,
                    value,
                    id,
                  });
                }
              });
          }

          if ($(this).find("input.min-price").length) {
            let input = $(this).find("input.min-price");
            let iValue = input.val();
            let id = input.attr("id");
            if (iValue !== "") {
              tags.push({
                title: "Минимальная цена",
                value: iValue,
                id,
              });
            }
          }
          if ($(this).find("input.max-price").length) {
            let input = $(this).find("input.max-price");
            let iValue = input.val();
            let id = input.attr("id");
            if (iValue !== "") {
              tags.push({
                title: "Максимальная цена",
                value: iValue,
                id,
              });
            }
          }
        });

        if ($(".applied-filters-panel__filters").length) {
          $(".applied-filters-panel__filters").each(function () {
            let container = $(this);
            container.empty();
            tags.forEach(function (tag) {
              container.append(
                `<button class="applied-filters-panel__filters-btn btn btn-outline-black-lines text-black-subtext btn-sm" data-control-id="${tag.id}">
                  <span class="applied-filters-panel__filters-btn-category">
                  ${tag.title}:
                  </span>
                  <span class="applied-filters-panel__filters-btn-value">
                    ${tag.value}
                    <i class="icon-icon_close_2 text-normal"></i>
                  </span>
                </button>`,
              );
            });
            // container.append(
            //   `
            //     <a href="#" class="text-action">Сбросить фильтр</a>
            //   `,
            // );
          });
        }
      });
    }
    $(".applied-filters-panel__filters").each(function () {
      let container = $(this);

      container.append(
        `
          <a href="#" class="text-action applied-filters-panel__filters-reset">Сбросить фильтр</a>
        `,
      );
    });
    $(document).on(
      "click",
      ".applied-filters-panel__filters-reset",
      function (e) {
        const $resetBtn = $("#del_filter");
        if (!$resetBtn.length) {
          console.error("Reset button is unavailable");
          return;
        }

        // Main reset button (hidden for current theme)
        $resetBtn.trigger("click");
      },
    );
    $(document).on(
      "click",
      ".applied-filters-panel__filters-btn",
      function (e) {
        e.preventDefault();
        const id = $(this).data("controlId");
        if (!id || id === "") {
          console.error("Input id is unavailable");
          return;
        }
        const $input = $(`#${id}`);
        if (!$input.length) {
          console.error("Input is unavailable");
          return;
        }
        const $submitBtn = $("#set_filter");
        if (!$submitBtn.length) {
          console.error("Submit button is unavailable");
          return;
        }

        if (
          $input.attr("type") === "checkbox" ||
          $input.attr("type") === "radio"
        ) {
          $input.prop("checked", false);
        } else {
          $input.val("");
        }

        // Main submit button (hidden for current theme)
        $submitBtn.trigger("click");
      },
    );

    // Review page
    // Review Limited characters input (review popup)
    $(".limited-textarea-input").each(function () {
      const limit = $(this).prop("maxlength");
      if (!limit) return;
      $(this)
        .closest(".limited-textarea-input-wrap")
        .find(".limited-textarea-input__limit")
        .html(limit);
    });
    $(".limited-textarea-input").on("input", function (e) {
      let length = $(this).val().length;

      $(this)
        .closest(".limited-textarea-input-wrap")
        .find(".limited-textarea-input__counter")
        .html(length);
    });
    // Review Rating input
    $(".overlay-cdk__content-review-rating-btn").on("click", function () {
      const value = $(this).data("value");
      if (!value) return;
      const $parent = $(this).closest(".review-rating-wrap");
      const $input = $parent.find(".review-rating__input");
      $input.val(value);

      const stars = $parent.find(".overlay-cdk__content-review-rating-btn");
      stars.each(function () {
        let starValue = $(this).data("value");
        if (starValue <= value) {
          $(this).find("i").addClass("active");
        } else {
          $(this).find("i").removeClass("active");
        }
      });
    });
    // Review Upload input
    $(".review-image-upload__upload-btn").on("click", function () {
      const $parent = $(this).closest(".review-image-upload");
      const $input = $parent.find(".review-image-upload__input");
      $input.trigger("click");
    });
    $(".review-image-upload__input").on("change", function () {
      const files = $(this)[0].files;
      if (!files) return;

      const $parent = $(this).closest(".review-image-upload");
      const $previewTarget = $parent.find(".review-image-upload__content");
      $previewTarget.find(".review-image-upload__content-image").remove();

      for (var i = 0; i < files.length; i++) {
        const file = files[i];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          $previewTarget.append(`
            <img
              src="${e.target.result}"
              alt="user image"
              class="review-image-upload__content-image"
            />
          `);
        };
      }
    });

    // Checkout page
    if ($(".checkout-form").length) {
      // Pickup select change

      // Sematic correct interaction on button
      // $(".form-select-group__select-btn").on("click", function () {
      //   $(this).parent().find('input[type="radio"]').prop("checked", true);
      //   let pickup_address = $('input[name="pickup_address"]:checked').val();
      //   // console.log(pickup_address);
      //   $(".form-select-group__select-btn").parent().removeClass("active");
      //   $(this).parent().addClass("active");
      // });
      // Project specific interaction on container
      $(".form-select-group__select").on("click", function (e) {
        $(this).find('input[type="radio"]').prop("checked", true);
        let pickup_address = $('input[name="pickup_address"]:checked').val();
        $(".form-select-group__select").removeClass("active");
        $(this).addClass("active");
      });
      // Prevent event above to trigger (a placed inside form-select-group__select)
      $(".form-select-group__select a").on("click", function (e) {
        e.stopPropagation();
      });

      // Region dropdown
      $(".checkout-form__region-dropdown-btn").each(function (index) {
        if (index === 0) {
          let regId = $(this).data("region-id");
          $(".form-select-group__select").hide();
          $(
            ".form-select-group__select[data-region-id='" + regId + "']",
          ).show();
        }
      });
      $(".checkout-form__region-dropdown-btn").on("click", function (e) {
        e.preventDefault();
        let parent = $(this).closest(".checkout-form__region-dropdown");
        let value = $(this).text().trim();
        let regId = $(this).data("region-id");

        parent.find(".checkout-form__region-dropdown-value").html(value);
        $(".checkout-form__region-input").val(value);

        $('input[name="pickup_address"]').prop("checked", false);
        $(".form-select-group__select-btn").parent().removeClass("active");

        // let pickup_address = $('input[name="pickup_address"]:checked').val();

        $(".form-select-group__select").hide();
        $(".form-select-group__select[data-region-id='" + regId + "']").show();
      });

      // Delivery type radio switch
      if ($('input[name="delivery_type"]').length) {
        let delivery_type = $('input[name="delivery_type"]:checked').val();
        $('input[name="delivery_type"]').on("change", function () {
          delivery_type = $(this).val();

          if (delivery_type === "pickup") {
            $(".checkout-form__delivery-type-hint--1").addClass("d-none");

            $(".checkout-form__delivery-types-tab-pickup").addClass("active");
            $(".checkout-form__delivery-types-tab-address").removeClass(
              "active",
            );
          } else if (delivery_type === "home") {
            $(".checkout-form__delivery-type-hint--1").removeClass("d-none");

            $(".checkout-form__delivery-types-tab-address").addClass("active");
            $(".checkout-form__delivery-types-tab-pickup").removeClass(
              "active",
            );
          }
        });
      }
      // Payment type radio switch
      if ($('input[name="payment_type"]').length) {
        let payment_type = $('input[name="payment_type"]:checked').val();
        $('input[name="payment_type"]').on("change", function () {
          payment_type = $(this).val();

          if (payment_type === "on_delivery") {
            $(".checkout-form__payment-type-hint--1").addClass("d-none");
          } else if (payment_type === "online") {
            $(".checkout-form__payment-type-hint--1").removeClass("d-none");
          }
        });
      }
    }
    // Phone confirmation
    $(".phone-confirmation__phone-group-confirm-btn").on("click", function () {
      let parent = $(this).closest(".phone-confirmation");
      parent.addClass("phone-confirmation--active");
    });
    $(".phone-confirmation__code-group input").on(
      "change textInput input",
      function () {
        let parent = $(this).closest(".phone-confirmation__code-group");
        if ($(this).val() === "") {
          parent.removeClass("phone-confirmation__code-group--active");
        } else {
          parent.addClass("phone-confirmation__code-group--active");
        }
      },
    );

    $(".phone-confirmation__code-group-confirm-btn").on("click", function () {
      let phoneConfirmParent = $(this).closest(".phone-confirmation");
      // reset
      phoneConfirmParent.removeClass(
        "phone-confirmation--success phone-confirmation--invalid",
      );

      // get data
      let phone = phoneConfirmParent
        .find(".phone-confirmation__phone-group input")
        .val();
      let code = phoneConfirmParent
        .find(".phone-confirmation__code-group input")
        .val();

      let payload = { phone, code };

      // Сделать запрос и выставить классы
      // // При успехе
      // phoneConfirmParent.addClass("phone-confirmation--success");
      // // При ошибке
      // phoneConfirmParent.addClass("phone-confirmation--invalid");

      // $.ajax({
      //   url: 'API_URL',
      //   method: 'POST',
      //   dataType: 'json',
      //   data: payload,
      //   success: function(obj) {
      //     console.log(obj);

      //   },
      //   error: function(err) {
      //     console.error(err);
      //   }
      // });
    });

    // Stepper
    $(".stepper-tab").each(function (index) {
      if (index === 0) {
        $(this).addClass("active");
      }
    });
    $(".stepper-header__step").on("click", function (e) {
      if ($(this).hasClass("stepper-header__step--static")) {
        return;
      }
      e.preventDefault();
      let parent = $(this).closest(".stepper");
      let stepperId = parent.attr("id");

      let index = $(this).data("step-index");

      changeStepperStep(stepperId, index);
    });

    $(".stepper__next-btn").on("click", function (e) {
      e.preventDefault();
      let stepperId = $(this).data("stepper-id");

      let stepper = $(`#${stepperId}`);
      if (stepper) {
        let index = -1;
        let steps = stepper.find(".stepper-header__step");

        steps.each(function (ind) {
          if ($(this).hasClass("active")) {
            index = ind + 1;
          }
        });

        if (index !== -1 && index + 1 <= steps.length) {
          changeStepperStep(stepperId, index + 1);
        }

        // Hardcode валидация формы на странице оформления заказа и доставки, нужно рефакторнуть если придется использовать степпер где-то еще повторно, все что выше отвечает за переключения шагов и может остаться без изменений
        if (index === 3) {
          var values = {};
          $.each($("form.checkout-form").serializeArray(), function (i, field) {
            values[field.name] = field.value;
          });
        }
        let pickup_address = $('input[name="pickup_address"]:checked').val();
      }
    });

    $(".stepper__back-btn").on("click", function (e) {
      e.preventDefault();
      let stepperId = $(this).data("stepper-id");

      let stepper = $(`#${stepperId}`);

      if (stepper) {
        let index = -1;
        let steps = stepper.find(".stepper-header__step");

        let staticTabs = [];
        steps.each(function (ind) {
          if ($(this).hasClass("stepper-header__step--static")) {
            staticTabs.push(ind + 1);
          }
          if ($(this).hasClass("active")) {
            index = ind + 1;
          }
        });

        if (index >= 2 && staticTabs.indexOf(index - 1) == -1) {
          changeStepperStep(stepperId, index - 1);
        }
      }
    });

    function changeStepperStep(stepperId, index) {
      const stepper = $(`#${stepperId}`);
      if (!stepper.length) {
        return;
      }
      // tabs
      let tab = stepper.find('.stepper-tab[data-tab-index="' + index + '"]');
      if (tab.length) {
        stepper.find(".stepper-tab").removeClass("active");
        tab.addClass("active");
      }
      // steps
      let step = stepper.find(
        '.stepper-header__step[data-step-index="' + index + '"]',
      );
      if (step.length) {
        stepper.find(".stepper-header__step").removeClass("active");
        step.addClass("active");
      }
    }

    // Hide texts under spoiler on mobile
    $(document).on("click", ".shortened__toggle", function (e) {
      e.preventDefault();
      if (!$(this).parent().find(".to-shorten.shortened").hasClass("active")) {
        $(this).parent().find(".to-shorten.shortened").addClass("active");
        $(this).data("text", $(this).text());
        $(this).html("Скрыть");
      } else {
        $(this).parent().find(".to-shorten.shortened").removeClass("active");
        $(this).html($(this).data("text") || "Читать полностью");
      }
      // $(this).remove();
    });
    // Hide seo texts
    $(".static-seo__toggle").on("click", function (e) {
      e.preventDefault();
      const parent = $(this).closest(".static-seo");
      if (!parent.hasClass("active")) {
        parent.addClass("active");
        $(this).data("text", $(this).text());
        $(this).html("Скрыть");
      } else {
        parent.removeClass("active");
        $(this).html($(this).data("text") || "Читать полностью");
      }
    });

    // Product gallery swiper initialize
    $(".product-media-gallery").each(function () {
      const thumb = $(this).find(".product-media-gallery__thumbs");
      const top = $(this).find(".product-media-gallery__top");

      let galleryThumbs = new Swiper(thumb[0], {
        spaceBetween: 10,
        slidesPerView: 4,
        // freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        // slidesPerGroup: 3,
        on: {
          init: function () {
            if ($(this)[0].slides.length > 4) {
              $(".product-media-gallery__thumbs-arrow-forward-wrap").addClass(
                "active",
              );
            }
          },
          slideChange: function () {
            let slider = $(this)[0];
            if (slider.isEnd) {
              $(
                ".product-media-gallery__thumbs-arrow-forward-wrap",
              ).removeClass("active");
            } else {
              $(".product-media-gallery__thumbs-arrow-forward-wrap").addClass(
                "active",
              );
            }
            if (slider.isBeginning) {
              $(
                ".product-media-gallery__thumbs-arrow-backward-wrap",
              ).removeClass("active");
            } else {
              $(".product-media-gallery__thumbs-arrow-backward-wrap").addClass(
                "active",
              );
            }
          },
        },
      });

      let galleryTop = new Swiper(top[0], {
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
        },
        thumbs: {
          swiper: galleryThumbs,
          autoScrollOffset: 1,
        },
      });
    });

    // Swipe categories on catalog page
    // $(".categories-panel").each(function () {
    //   const cats = new Glider($(this)[0], {
    //     draggable: true,
    //     slidesToShow: "auto",
    //     exactWidth: false,
    //     itemWidth: 50,
    //   });
    // });

    // $(".categories-panel a").each(function () {
    //   $(this)[0].ondragstart = function () {
    //     return false;
    //   };
    // });
    // $(".categories-panel").each(function () {
    //   let $self = $(this);
    //   let panStart = null;
    //   let categoryPan = new Hammer($self[0]);

    //   categoryPan.on("panstart", function ($event) {
    //     panStart = $event.center.x;
    //   });
    //   categoryPan.on("panend", function ($event) {
    //     panStart = null;
    //   });

    //   categoryPan.on("pan", function ($event) {
    //     const walk = ($event.center.x - panStart) * 0.08; //scroll-fast
    //     $self.scrollLeft($self.scrollLeft() - walk);
    //   });
    // });

    $(".categories-panel").each(function () {
      if ($(this).hasClass("swiper-wrapper")) return;

      $(this).wrap('<div class="categories-panel-swiper"></div>');
      $(this).addClass("swiper-wrapper");
      $(this)
        .find("li")
        .each(function () {
          $(this).addClass("swiper-slide");
        });

      let wrapper = $(this).closest(".categories-panel-swiper");

      let swiper = new Swiper(wrapper, {
        freeMode: true,
        slidesPerView: "auto",
        loop: false,
      });
    });

    // Mobile filter popup on catalog page
    $(".applied-filters-panel__mobile-filter-btn").on("click", function (e) {
      e.preventDefault();
      let container = $(".sidebar").parent().parent();
      $(".sidebar").addClass("open");
      $("body").addClass("overflow-hidden");
      container.removeClass("d-none h-100");
      $(".sidebar").prepend(
        '<a class="applied-filters-panel__mobile-close-filter-btn back-btn text-small text-action mbp-40" href="#"><i class="icon-icon_arrows_1"></i> Вернуться назад</a>',
      );
    });
    $(document).on(
      "click",
      ".applied-filters-panel__mobile-close-filter-btn",
      function (e) {
        e.preventDefault();
        let container = $(".sidebar").parent().parent();
        container.addClass("d-none h-100");
        $(".sidebar").removeClass("open");
        $("body").removeClass("overflow-hidden");
        $(".sidebar")
          .find(".applied-filters-panel__mobile-close-filter-btn")
          .remove();
      },
    );

    // Product page reviews bar value
    $(".product-page__reviews-summary-score-bar").each(function () {
      const value = $(this).data("percent-value");
      const percent = Number(value);
      if (percent && !isNaN(percent) && percent >= 0 && percent <= 100) {
        const bar = $(this).find(
          ".product-page__reviews-summary-score-bar-inner",
        );
        bar.css("width", `${percent}%`);
      }
    });

    // Accordion
    $(".accordion").each(function () {
      // Keep open if has opened class
      if ($(this).hasClass("opened")) return;

      $(this).parent().find(".accordion__content").hide();

      // Linked accordion
      if ($(this).hasClass("accordion--linked")) {
        const linkId = $(this).data("linkedId");

        const linkedContent = $(
          ".accordion__linked-content[data-linked-id='" + linkId + "']",
        );
        linkedContent.hide();
      }
    });
    $(".accordion__toggle").on("click", function (e) {
      e.preventDefault();
      let parent = $(this).parent();
      let content = parent.find(".accordion__content");

      // Linked accordion
      if (parent.hasClass("accordion--linked")) {
        const linkId = parent.data("linkedId");

        const linkedContent = $(
          ".accordion__linked-content[data-linked-id='" + linkId + "']",
        );
        // linkedContent.hide();

        if (!parent.hasClass("opened")) {
          linkedContent.slideDown("fast");
        } else {
          linkedContent.slideUp("fast");
        }
      }

      if (!parent.hasClass("opened")) {
        let accordionsWrap = $(this).closest(".accordions-wrap");
        if (accordionsWrap && accordionsWrap.hasClass("accordions-switching")) {
          let accordions = accordionsWrap.find(".accordion");
          accordions.each(function () {
            let inner_parent = $(this).parent();
            let inner_content = $(this).find(".accordion__content");
            inner_parent.removeClass("opened");
            inner_content.slideUp("fast");
          });
        }
        parent.addClass("opened");
        content.slideDown("fast");
      } else {
        parent.removeClass("opened");
        content.slideUp("fast");
      }
    });

    // Interactive map
    $(".interactive-map__pin-btn").on("click", function () {
      let index = Number($(this).data("index"));
      let mapContainer = $(this).closest(".interactive-map");

      if (isNaN(index)) {
        return;
      }

      // pins
      if ($(this).hasClass("active")) {
        mapContainer.find(".interactive-map__pin-btn").removeClass("active");
        mapContainer.find(".interactive-map__panel").hide();

        mapContainer
          .find(".interactive-map__panel--initial")
          .css("display", "flex")
          .hide()
          .fadeIn();

        return;
      }
      mapContainer.find(".interactive-map__pin-btn").removeClass("active");
      $(this).addClass("active");

      // panels
      // mapContainer.find(".interactive-map__panel").removeClass("active");
      mapContainer.find(".interactive-map__panel").hide();
      const panel = mapContainer.find(
        '.interactive-map__panels div[data-index="' + index + '"]',
      );

      panel.css("display", "flex").hide().fadeIn();
    });

    // Clear search form btn
    $(".search-form__clear-btn").on("click", function () {
      const parent = $(this).closest(".search-form");
      parent.find(".search-form__input").val("");

      $(this).addClass("d-none");
    });
    $(".search-form__input").on("input change keypress paste", function () {
      const parent = $(this).closest(".search-form");
      if ($(this).val() === "") {
        parent.find(".search-form__clear-btn").addClass("d-none");
      } else {
        parent.find(".search-form__clear-btn").removeClass("d-none");
      }
    });
    $(".search-form__input").each(function () {
      const parent = $(this).closest(".search-form");
      if ($(this).val() === "") {
        parent.find(".search-form__clear-btn").addClass("d-none");
      } else {
        parent.find(".search-form__clear-btn").removeClass("d-none");
      }
    });

    // Cabinet review short text
    $(".cabinet-review__text-content").each(function () {
      if ($(this).height() > 100 && !$(this).hasClass("shortened")) {
        $(this).addClass("shortened");
        $(
          "<a href='#' class='shortened__toggle d-block'>Показать полный текст комментария</a>",
        ).insertAfter($(this));
      }
    });

    // Cabinet history table
    $(".cabinet-order-card__details-table").each(function () {
      const rows = $(this).find(".cabinet-order-card__details-table-row");

      if (rows.length <= 3) {
        $(this)
          .find(".cabinet-order-card__details-table-btn")
          .addClass("d-none");
      } else {
        rows.each(function (index) {
          if (index > 2) $(this).addClass("d-none");
        });
      }
    });
    $(".cabinet-order-card__details-table-btn").on("click", function (e) {
      e.preventDefault();
      const parent = $(this).closest(".cabinet-order-card__details-table");
      if (!parent.hasClass("expanded")) {
        parent.addClass("expanded");

        const rows = parent.find(".cabinet-order-card__details-table-row");
        rows.each(function (index) {
          if (index > 2) $(this).removeClass("d-none");
        });

        $(this).data("text", $(this).text());
        $(this).html("Свернуть полный список товаров");
      } else {
        parent.removeClass("expanded");

        const rows = parent.find(".cabinet-order-card__details-table-row");
        rows.each(function (index) {
          if (index > 2) $(this).addClass("d-none");
        });

        $(this).html(
          $(this).data("text") || "Развернуть полный список товаров",
        );
      }
    });

    // Compare attribute resize
    if ($(".compare-container").length) {
      let hRating = 0;
      let hType = 0;
      let hSize = 0;
      let hHeight = 0;
      let hFirmness = 0;
      let hBase = 0;
      let hLoad = 0;
      let hComposition = 0;
      let hPrice = 0;
      let hFiller = 0;
      let hWeight = 0;
      let hCubature = 0;
      let hPackaging = 0;
      let hColor = 0;
      let hWarranty = 0;
      let hManufacturer = 0;

      let attributes = [
        "compare-attribute--rating",
        "compare-attribute--type",
        "compare-attribute--size",
        "compare-attribute--height",
        "compare-attribute--firmness",
        "compare-attribute--base",
        "compare-attribute--load",
        "compare-attribute--composition",
        "compare-attribute--price",
        "compare-attribute--filler",
        "compare-attribute--weight",
        "compare-attribute--cubature",
        "compare-attribute--packaging",
        "compare-attribute--color",
        "compare-attribute--warranty",
        "compare-attribute--manufacturer",
      ];

      $(".compare-container").each(function () {
        attributes.forEach((attribute) => {
          $(this)
            .find("." + attribute)
            .each(function () {
              let height = $(this).outerHeight();
              switch (attribute) {
                case "compare-attribute--rating":
                  hRating = hRating < height ? height : hRating;
                  break;
                case "compare-attribute--type":
                  hType = hType < height ? height : hType;
                  break;
                case "compare-attribute--size":
                  hSize = hSize < height ? height : hSize;
                  break;
                case "compare-attribute--height":
                  hHeight = hHeight < height ? height : hHeight;
                  break;
                case "compare-attribute--firmness":
                  hFirmness = hFirmness < height ? height : hFirmness;
                  break;
                case "compare-attribute--base":
                  hBase = hBase < height ? height : hBase;
                  break;
                case "compare-attribute--load":
                  hLoad = hLoad < height ? height : hLoad;
                  break;
                case "compare-attribute--composition":
                  hComposition = hComposition < height ? height : hComposition;
                  break;
                case "compare-attribute--price":
                  hPrice = hPrice < height ? height : hPrice;
                  break;
                case "compare-attribute--filler":
                  hFiller = hFiller < height ? height : hFiller;
                  break;
                case "compare-attribute--weight":
                  hWeight = hWeight < height ? height : hWeight;
                  break;
                case "compare-attribute--cubature":
                  hCubature = hCubature < height ? height : hCubature;
                  break;
                case "compare-attribute--packaging":
                  hPackaging = hPackaging < height ? height : hPackaging;
                  break;
                case "compare-attribute--color":
                  hColor = hColor < height ? height : hColor;
                  break;
                case "compare-attribute--warranty":
                  hWarranty = hWarranty < height ? height : hWarranty;
                  break;
                case "compare-attribute--manufacturer":
                  hManufacturer =
                    hManufacturer < height ? height : hManufacturer;
                  break;

                default:
                  break;
              }
            });

          $("." + attribute).height(hRating);
        });
      });

      $(".compare-attribute--rating").height(hRating);
      $(".compare-attribute--type").height(hType);
      $(".compare-attribute--size").height(hSize);
      $(".compare-attribute--height").height(hHeight);
      $(".compare-attribute--firmness").height(hFirmness);
      $(".compare-attribute--base").height(hBase);
      $(".compare-attribute--load").height(hLoad);
      $(".compare-attribute--composition").height(hComposition);
      $(".compare-attribute--price").height(hPrice);
      $(".compare-attribute--filler").height(hFiller);
      $(".compare-attribute--weight").height(hWeight);
      $(".compare-attribute--cubature").height(hCubature);
      $(".compare-attribute--packaging").height(hPackaging);
      $(".compare-attribute--color").height(hColor);
      $(".compare-attribute--warranty").height(hWarranty);
      $(".compare-attribute--manufacturer").height(hManufacturer);
    }

    // Compare drag to scroll
    if ($(".compare-container-wrap").length) {
      $(".compare-container-wrap").each(function () {
        const $el = $(this);
        const ele = $el[0];
        $el.css("cursor", "grab");

        let pos = { top: 0, left: 0, x: 0, y: 0 };

        const mouseDownHandler = function (e) {
          ele.style.cursor = "grabbing";
          ele.style.userSelect = "none";

          pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
          };

          document.addEventListener("mousemove", mouseMoveHandler);
          document.addEventListener("mouseup", mouseUpHandler);
        };

        const mouseMoveHandler = function (e) {
          // How far the mouse has been moved
          const dx = e.clientX - pos.x;
          const dy = e.clientY - pos.y;

          // Scroll the element
          ele.scrollTop = pos.top - dy;
          ele.scrollLeft = pos.left - dx;
        };

        const mouseUpHandler = function () {
          ele.style.cursor = "grab";
          ele.style.removeProperty("user-select");

          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
        };

        // Attach the handler
        ele.addEventListener("mousedown", mouseDownHandler);
      });
    }

    // Open phone form overlay
    $(".open-phone-form-popup").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("overflow-hidden");
      $("#phoneFormPopupOverlay").addClass("active");
    });

    // Open phone form overlay
    $(".open-custom-mattress-form-popup").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("overflow-hidden");
      $("#customMattressFormPopupOverlay").addClass("active");
    });

    // Open video overlay
    $(".open-video-popup").on("click", function (e) {
      e.preventDefault();
      const link = $(this).attr("href");

      $("body").addClass("overflow-hidden");
      $("#videoPopupOverlay").addClass("active");
      $("#videoPopupOverlay").find("iframe").attr("src", link);

      if ($("body").width() <= "990") {
        // rebuild carousel because overlay doesn't calculate properly
        $("#videoPopupOverlay").find(".mobile-slider").slick("unslick").slick({
          infinite: false,
          dots: false,
          arrows: false,
          slidesToShow: 1.1,
        });
      }
    });

    // Open map overlay
    $(".open-map-popup").on("click", function (e) {
      e.preventDefault();
      const link = $(this).attr("href");

      $("body").addClass("overflow-hidden");
      $("#mapPopupOverlay").addClass("active");
      $("#mapPopupOverlay").find("iframe").attr("src", link);
    });

    // Open review overlay
    $(".open-review-popup").on("click", function (e) {
      e.preventDefault();
      const $overlay = $("#newReviewPopupOverlay");
      if (!$overlay.length) {
        console.error("overlay is unavailable");
        return;
      }

      const $parent = $(this).closest(".review-popup-form-parent");
      if (!$parent.length) {
        console.error("parent is unavailable");
        return;
      }

      const $form = $parent.find(".review-popup-form-wrap").children();

      if (!$form.length) {
        console.error("form is unavailable");
        return;
      }

      const $target = $overlay.find(".overlay-cdk__content-review-container");

      if (!$target.length) {
        console.error("target is unavailable");
        return;
      }

      // Cleat target location
      $target.empty();

      // Clone and paste to target location
      $form.clone(true).appendTo($target);

      $("body").addClass("overflow-hidden");
      $overlay.addClass("active");
    });

    // Open auth overlay
    $(".open-auth-popup").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("overflow-hidden");
      $("#authPopupOverlay").addClass("active");
    });
    // Switch auth mode
    $(".switch-auth-popup__login").on("click", function (e) {
      e.preventDefault();
      $("#authPopupOverlay")
        .find(".overlay-cdk__content-auth")
        .removeClass("active");

      $("#authPopupOverlay")
        .find(".overlay-cdk__content-login")
        .addClass("active");
    });
    $(".switch-auth-popup__registration").on("click", function (e) {
      e.preventDefault();
      $("#authPopupOverlay")
        .find(".overlay-cdk__content-auth")
        .removeClass("active");

      $("#authPopupOverlay")
        .find(".overlay-cdk__content-registration")
        .addClass("active");
    });
    $(".switch-auth-popup__reset-password").on("click", function (e) {
      e.preventDefault();
      $("#authPopupOverlay")
        .find(".overlay-cdk__content-auth")
        .removeClass("active");

      $("#authPopupOverlay")
        .find(".overlay-cdk__content-reset-password")
        .addClass("active");
    });

    // Close overlay on outside click
    $(".overlay-cdk").on("click", function (e) {
      if (e.target !== e.currentTarget) return;
      if ($("#authPopupOverlay").hasClass("active")) {
        $("#authPopupOverlay")
          .find(".overlay-cdk__content-auth")
          .removeClass("active");
        $("#authPopupOverlay")
          .find(".overlay-cdk__content-login")
          .addClass("active");
      }

      $(this).removeClass("active");
      $("body").removeClass("overflow-hidden");
    });

    // Close overlay on button click
    $(".overlay-cdk__close-btn").on("click", function (e) {
      if ($("#authPopupOverlay").hasClass("active")) {
        $("#authPopupOverlay")
          .find(".overlay-cdk__content-auth")
          .removeClass("active");
        $("#authPopupOverlay")
          .find(".overlay-cdk__content-login")
          .addClass("active");
      }

      $(".overlay-cdk").removeClass("active");
      $("body").removeClass("overflow-hidden");
    });

    // Mobile drawer
    $(".drawer-toggler").on("click", function () {
      toggleDrawer();
    });
    let mobileDrawer = $(".mobile-drawer");
    if (mobileDrawer) {
      let mobileDrawerHammer = new Hammer(mobileDrawer[0]);
      mobileDrawerHammer.on("swiperight", function () {
        toggleDrawer();
      });
    }
    function toggleDrawer() {
      if (!$(".mobile-drawer").hasClass("active")) {
        $(".mobile-drawer").addClass("active");
        $("body").addClass("overflow-hidden");
        setTimeout(function () {
          $(".mobile-drawer").addClass("dark");
        }, 250); // synced with css transition time ((~60%)
      } else {
        $(".mobile-drawer").removeClass("active dark");
        $("body").removeClass("overflow-hidden");
      }
    }

    // Close overlay on outside click
    $(".mobile-drawer").on("click", function (e) {
      if (e.target !== e.currentTarget) return;
      toggleDrawer();
    });
    // Close overlay on close click
    $(".mobile-drawer__close-btn").on("click", function () {
      toggleDrawer();
    });

    // Zoom product gallery
    $(document).on(
      "mouseenter",
      ".product-media-gallery__top > .swiper-wrapper > .swiper-slide.swiper-slide-active",
      function (e) {
        const win = $(window); //this = window
        const width = win.outerWidth();

        if (width <= 990) {
          return;
        }

        const imgUrl = $(this).css("background-image");
        $(this).css("background-image", "");
        $(this).css("position", "relative");
        $(this).html(`<div id="zoomResultBox" class="img-zoom-result"></div>`);
        imageZoom($(this)[0], "zoomResultBox", imgUrl);
      },
    );
    $(document).on(
      "mouseleave",
      ".product-media-gallery__top > .swiper-wrapper > .swiper-slide.swiper-slide-active",
      function (e) {
        imageDestroy();
      },
    );

    function imageDestroy() {
      const imgUrl = $("#zoomResultBox").css("background-image");
      $("#zoomResultBox").parent().css("background-image", imgUrl);
      $("#zoomResultBox").remove();
    }

    function imageZoom(img, resultID, imgUrl) {
      var lens, result, cx, cy;
      // img = document.getElementById(imgID);
      result = document.getElementById(resultID);

      /*create lens:*/
      // lens = document.createElement("DIV");
      // lens.setAttribute("class", "img-zoom-lens");
      /*insert lens:*/
      // img.parentElement.insertBefore(lens, img);
      /*calculate the ratio between result DIV and lens:*/
      cx = result.offsetWidth / 250;
      cy = result.offsetHeight / 250;

      /*set background properties for the result DIV:*/
      // var backgroundImage = $(img).css("background-image");
      var backgroundImage = imgUrl;
      var url = backgroundImage.slice(4, -1).replace(/["']/g, "");
      result.style.backgroundImage = "url('" + url + "')";
      result.style.backgroundSize =
        img.offsetWidth * cx + "px " + img.offsetHeight * cy + "px";
      /*execute a function when someone moves the cursor over the image, or the lens:*/
      // lens.addEventListener("mousemove", moveLens);
      img.addEventListener("mousemove", moveLens);
      /*and also for touch screens:*/
      // lens.addEventListener("touchmove", moveLens);
      img.addEventListener("touchmove", moveLens);
      function moveLens(e) {
        var pos, x, y;
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        /*calculate the position of the lens:*/
        x = pos.x / 2;
        y = pos.y / 2;
        /*prevent the lens from being positioned outside the image:*/

        /*display what the lens "sees":*/
        result.style.backgroundPosition = "-" + x * cx + "px -" + y * cy + "px";
      }
      function getCursorPos(e) {
        var a,
          x = 0,
          y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
      }
    }

    // Responsiveness
    resize();
    $(window).on("resize", function () {
      resize();
    });
    function resize() {
      const win = $(window); //this = window
      const width = win.outerWidth();

      if (width <= 990) {
        // Move product sidebar on mobile
        if ($(".product-page-sidebar").length) {
          $(".product-page-sidebar").each(function () {
            $(this).detach().appendTo(".product-page__mobile-sidebar-spot");
          });
        }

        // Move cart sidebar on mobile
        if ($(".cart-page-sidebar").length) {
          $(".cart-page-sidebar").each(function () {
            let top = $(this).find(".cart-page-sidebar__top");
            top.detach().appendTo(".cart-page__mobile-top-sidebar-spot");
          });
        }

        // Shorten mobile breadcrumb
        if ($(".breadcrumb").length) {
          $(".breadcrumb").each(function () {
            if (!$(this).hasClass("mobile-breadcrumb")) {
              $(this).addClass("mobile-breadcrumb");
              const bcInitialLength = $(this).children().length;
              $(this)
                .children()
                .each(function (index) {
                  if (index !== 0 && index !== bcInitialLength - 1) {
                    $(this).remove();
                  }
                });
              if (bcInitialLength > 2) {
                $(
                  '<li class="breadcrumb-item text-black-secondary">...</li>',
                ).insertAfter($(this).children(":first"));
              }
            }
          });
        }

        // To shorten big chunks of text
        if ($(".to-shorten").length) {
          $(".to-shorten").each(function () {
            if ($(this).height() > 100 && !$(this).hasClass("shortened")) {
              $(this).addClass("shortened");
              $(
                "<a href='#' class='shortened__toggle d-block mbp-20'>Читать полностью</a>",
              ).insertAfter($(this));
            }
          });
        }

        // Slick mobile-slider
        $(".mobile-slider").each(function () {
          if (!$(this).hasClass("slick-initialized")) {
            if ($(this).hasClass("mobile-slider--full")) {
              $(this).slick({
                infinite: false,
                dots: true,
                arrows: false,
                slidesToShow: 1,
                variableWidth: false,
                swipeToSlide: true,
                // centerMode: true,
                // centerPadding: "20px",
              });
            } else {
              $(this).slick({
                infinite: false,
                dots: false,
                arrows: false,
                slidesToShow: 1,
                variableWidth: true,
                swipeToSlide: true,
                // centerMode: true,
                // centerPadding: "20px",
              });
            }
          }
        });

        // Slick mobile-carousel
        $(".mobile-carousel").each(function () {
          if (!$(this).hasClass("slick-initialized")) {
            $(this).slick({
              infinite: false,
              dots: true,
              arrows: false,
              slidesToShow: 1,
              // variableWidth: true,
              // centerMode: true,
              // centerPadding: "20px",
            });
          }
        });

        // Cabinet order process mobile
        $(".cabinet-order-card__process").each(function () {
          const $processCard = $(this);
          const cardWidth = $processCard.innerWidth();

          const $processCardParent = $(this).closest(
            ".cabinet-order-card__process-wrap",
          );

          if (!$processCardParent.length) {
            console.error("Process card wrapper is unavailable");
            return;
          }

          if (
            $processCard.hasClass("cabinet-order-card__process--processing")
          ) {
            $processCardParent.scrollLeft(0);
          } else if (
            $processCard.hasClass("cabinet-order-card__process--forming")
          ) {
            $processCardParent.scrollLeft(cardWidth / 2);
          } else if (
            $processCard.hasClass("cabinet-order-card__process--delivery")
          ) {
            $processCardParent.scrollLeft(cardWidth / 2);
          } else {
            $processCardParent.scrollLeft(0);
          }
        });
      } else {
        // Put product sidebar back on desktop
        if ($(".product-page-sidebar").length) {
          $(".product-page-sidebar").each(function () {
            if (!$(this).parent().hasClass("sidebar-initial-spot")) {
              $(this).detach().appendTo(".sidebar-initial-spot");
            }
          });
        }

        // Put cart sidebar back on desktop
        if ($(".cart-page-sidebar").length) {
          let top = $(".cart-page-sidebar__top");
          if (top.parent().hasClass("cart-page__mobile-top-sidebar-spot")) {
            top.detach().appendTo(".cart-page-sidebar__top-wrap");
          }
        }

        // Destroy mobile-slider
        $(".mobile-slider").each(function () {
          if ($(this).hasClass("slick-initialized")) {
            $(this).slick("unslick");
          }
        });

        // Destroy mobile-carousel
        $(".mobile-carousel").each(function () {
          if ($(this).hasClass("slick-initialized")) {
            $(this).slick("unslick");
          }
        });
      }
    }

    // Sliding contact tabs header
    // Without timeout custom negative magins and paddings doesn't apply properly
    setTimeout(() => {
      $(".custom-tabs-header").each(function () {
        if ($(this).hasClass("swiper-wrapper")) return;

        $(this).wrap('<div class="custom-tabs-header-swiper"></div>');
        $(this).addClass("swiper-wrapper");
        $(this)
          .find(".nav-item")
          .each(function () {
            $(this).addClass("swiper-slide");
          });
        let wrapper = $(this).closest(".custom-tabs-header-swiper");

        let swiper = new Swiper(wrapper, {
          freeMode: true,
          slidesPerView: "auto",
          loop: false,
        });
      });
    }, 200);

    // Fixed header
    if ($("body").width() <= "990") {
      if ($(document).scrollTop() >= 300) {
        $(".main-header__top").addClass("fixed");
      } else {
        $(".main-header__top").removeClass("fixed");
      }
    } else {
      $(".main-header__top").removeClass("fixed");
    }
    $(document).on("scroll", function () {
      if ($("body").width() <= "990") {
        if ($(document).scrollTop() >= 300) {
          $(".main-header__top").addClass("fixed");
        } else {
          $(".main-header__top").removeClass("fixed");
        }
      } else {
        $(".main-header__top").removeClass("fixed");
      }
    });

    // City selector
    $(
      ".dropdown-city-menu__region-selector .dropdown-city-menu__selector-item",
    ).on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      let index = $(this).data("region-index");
      let parent = $(this).closest(".dropdown-menu");
      parent.find(".dropdown-city-menu__region-selector").removeClass("active");
      parent.find(".dropdown-city-menu__city-selector").removeClass("active");
      parent
        .find(
          '.dropdown-city-menu__city-selector[data-region-index="' +
            index +
            '"]',
        )
        .addClass("active");
    });
    $(".dropdown-city-menu__regions-btn").on("click", function (e) {
      e.preventDefault();
      let parent = $(this).closest(".dropdown-menu");
      parent.find(".dropdown-city-menu__region-selector").addClass("active");
      parent.find(".dropdown-city-menu__city-selector").removeClass("active");
    });
    $(".dropdown-city-menu__current-region").on("click", function (e) {
      e.preventDefault();
    });

    // Prevent city dropdown close on click
    $(".selected-city-menu").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    $(
      ".dropdown-city-menu__city-selector .dropdown-city-menu__selector-item",
    ).on("click", function (e) {
      e.preventDefault();
    });
  });
})(jQuery);

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
