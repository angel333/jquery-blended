/**
 * Blended
 * A carousel with images blended together (mask effect).
 * Author: Ondrej Simek ( http://ondrejsimek.com )
 */


(function($) {


	// Transform into a blended
	$.fn.blendedCarousel = function(options) {
		var o = $.extend({}, $.fn.blendedCarousel.defaults, options);
		
		return this.each(function() {
			var $carousel = $(this);
			var imagesCount = $carousel.children().filter('img').length;
			$carousel.blendedOptions = o;
			
			// Some settings of the carousel div
			$carousel.css({
				'white-space': 'nowrap',
				'overflow': 'hidden',
				'width': o.width,
				'height': o.height,
				'position': 'relative'
			});
			
			$carousel.children().filter('img').each(function(index) {
				var $image = $(this);
				$image.css({'display':'none'});

				var side = 'left';
				if (index === 0)
					var side = 'none';

				i = 0;
				$image.blendedSide({
					side: side,
					onComplete: function($blendedContainer) {
						i++;
						if (i !== 1) {
							$blendedContainer.css({
								'margin-left': - o.blendSize - 4 // white spaces
							});
							window.blended = $blendedContainer;
						}

						if (imagesCount === i) {
							// mouse panning
							if (o.mousePanning) {
								var maxScroll = (
									$blendedContainer.position().left
									+ $blendedContainer.width()
									- $carousel.width()
								);
								
								$carousel.mousemove(function(e) {
									var x = ((e.pageX - this.offsetLeft) / this.clientWidth * maxScroll);
									$carousel.scrollLeft(x);
								});
							}
						}
					}
				});
			});

		});
	};
	

	$.fn.blendedSide = function(options) {

		var o = $.extend({}, $.fn.blendedSide.defaults, options);

		return this.each(function() {

			var $image = $(this);
			$image.load(function() {

				var height = $image.height();
				var width = $image.width();
				var backImg = 'url('+$image[0].src+')';
				//var backImg = 'black';
				var $d = $('<div></div>').css({
					'position': 'absolute'
				});
				var $container = $d.clone().css({
					'display': 'inline-block',
					'position': 'relative',
					'width': width,
					'height': height
				});

				$image.hide();
				$image.after($container);
				
				// settings size
				if (o.side === 'left' || o.side === 'right') {
					width -= o.blendSize;
				} else if (o.side === 'top' || o.side === 'bottom') {
					height -= o.blendSize;
				} else if (o.side === 'horizontal') {
					width -= 2 * o.blendSize;
				} else if (o.side === 'vertical') {
					height -= 2 * o.blendSize;
				} //else if (o.side === 'none') {}
					//alert('wrong side settings'); // error
				
				// setting background position and position
				var topPos = 0,
					leftPos = 0,
					backPos = '0 0';
				if (o.side === 'left' || o.side === 'horizontal') {
					backPos = -o.blendSize;
					//leftPos = o.blendSize;
				} else if (o.side === 'top' || o.side === 'vertical') {
					backPos = '0 ' + String(-o.blendSize);
					//topPos = o.blendSize;
				}

				// first fade
				if (o.side !== 'right' && o.side !== 'bottom') {
					for (var i = 1; i <= o.blendSize; i++)
					{
						$container.append($d.clone().css(
							function(){
								var params = {
									'top': topPos,
									'left': leftPos,
									'width': 1,
									'height': 1,
									'background': backImg,
									'opacity': (i)/(o.blendSize/100)/100
								};
								if (o.side === 'left' || o.side === 'horizontal') {
									leftPos++;
									params.height = height;
									params['background-position'] = -i;
								}
								else if (o.side === 'top' || o.side === 'vertical') {
									topPos++;
									params.width = width;
									params['background-position'] = '0 ' + String(-i);
								}
								return params;
							}()
						));
					}
				}

				// the big div			
				$container.append($d.clone().css({
					'top': topPos,
					'left': leftPos,
					'width': width,
					'height': height,
					'background': backImg,
					'background-position': backPos
				}));
				if (o.side === 'left' || o.side === 'right' || o.side === 'horizontal') {
					leftPos += width;
					backPos -= width;
				} else if (o.side === 'top' || o.side === 'bottom' || o.side === 'vertical') {
					topPos += height;
					backPos -= height;
				}

				// last fade
				if (o.side !== 'left' && o.side !== 'top') {
					for (var i = 1; i <= o.blendSize; i++)
					{
						$container.append($d.clone().css(
							function(){
								var params = {
									'top': topPos,
									'left': leftPos,
									'width': 1,
									'height': 1,
									'background': backImg,
									'opacity': 1-(i)/(o.blendSize/100)/100
								};
								if (o.side === 'right' || o.side === 'horizontal') {
									leftPos++;
									params.height = height;
									params['background-position'] = (o.side === 'right') ? (-width-i) : (-width-i-o.blendSize);
								}
								else if (o.side === 'bottom' || o.side === 'vertical') {
									topPos++;
									params.width = width;
									params['background-position'] = '0 ' + String((o.side === 'bottom') ? -height-i : -height-i-o.blendSize);
								}
								return params;
							}()
						));
					}
				}

				if (o.onComplete) { o.onComplete($container); };

			});

		});
	}


	// Default parameters
	$.fn.blendedCarousel.defaults = {
		width: 500,
		height: 250,
		blendSize: 100,
		mousePanning: true
	};


	// Default parameters
	$.fn.blendedSide.defaults = {
		blendSize: 100,
		side: 'none'
	};


})(jQuery);