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
//флаг того что текущее число - дробь
		this.isFraction = false;
//флаг того что нужно добавить точку при следующем нажатии на кнопку числа
		this.toAddPoint = false;
//слушатели
		$element.on("key", this.keyPressedHandler.bind(this));
		$element.on("remove-last", this.clearLastHandler.bind(this));
		$element.on("clear-input", this.inputClearHandler.bind(this));
		$element.on("set-float-point", this.floatPointHandler.bind(this));
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
//обработчик нажатия на цифровые кнопки
	keyPressedHandler(event)
	{
		let temp = this.current.toString()
		if (this.toAddPoint)
		{
			temp += ".";
			this.toAddPoint = false;
			this.isFraction = true;
		}

		temp += Number(event.keyValue);

		this.current = Number(temp);
		this.$display.html(this.current);
	}
//обработчик нажатий на стирание
	inputClearHandler()
	{
		this.toAddPoint = false;
		this.isFraction = false;
		this.current = 0;
		this.$display.html(this.current);
	}
//обработчик нажатий на кнопки стирания последнего
	clearLastHandler()
	{
		let temp = this.current.toString();
		temp = temp.substring(0, temp.length - 1);

		if (temp[temp.length - 1] == ".")
		{
			this.isFraction = false;
			temp = temp.substring(0, temp.length - 1);			
		}

		if (temp == "")
		{
			temp = "0";
		}
		this.current = Number(temp);
		this.$display.html(this.current);
		this.$display.html(this.current);
	}
//обработчик нажатий на запятую
	floatPointHandler()
	{
		if (!this.isFraction)
		{
			this.toAddPoint = true;	
		}
	}

}