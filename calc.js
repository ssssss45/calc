class Calculator
{
	constructor(path)
	{
	    var loaded = this.loaded.bind(this);

	    $.getJSON(path)
	    .done(function(json)
	    {
	      loaded(json);
	    });
	}

	loaded(json)
	{
		let $element = $(json.container_class);
		let columns = json.columns;
		let currentColumn = 0;
		let pixelSize = json.pixels_per_size_unit;
//генерация элемента в котором будет текст
		this.$display = $('<div/>')
			.css("width", columns * pixelSize)
			.css("height", pixelSize)
			.html(0);
		$element.append(this.$display);
		$element.append('<br>');

		this.current = 0;
		this.last = 0;

		$element.on("key", this.keyPressedHandler.bind(this));

//генерация кнопок
		this.buttons = json.buttons;
		for (var i = 0; i < this.buttons.length; i++)
		{
			let event = jQuery.Event(this.buttons[i].action || "key");
			event.keyValue = this.buttons[i].value;

			let width = this.buttons[i].width || 1;
			let height = this.buttons[i].height || 1;
			currentColumn += width;

			let button = $('<input/>')
				.attr({ type: 'button', name:'btn1', value:this.buttons[i].label, title: this.buttons[i].description})
				.click(function(){$element.trigger(event)})
				.css("width", width * pixelSize)
				.css("height", height * pixelSize)
				.css("background-color", this.buttons[i].background);
			$element.append(button);

			if (currentColumn == columns)
			{
				$element.append('<br>');		
				currentColumn = 0;		
			}
		}
	}

	keyPressedHandler(event)
	{
		console.log(this.current);
		this.current *= 10;
		this.current += Number(event.keyValue);
		this.$display.html(this.current);
	}


}