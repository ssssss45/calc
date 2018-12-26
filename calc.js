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
//генерация элемента в котором будет предыдущий элемент
		this.$lastDisplay = $('<div/>')
			.css("width", columns * pixelSize)
			.css("height", pixelSize)
			.html("");
		$element.append(this.$lastDisplay);
		$element.append('<br>');

		this.current = 0;
		this.last = undefined;
//флаг того что текущее число - дробь
		this.isFraction = false;
//флаг того что нужно добавить точку при следующем нажатии на кнопку числа
		this.toAddPoint = false;
//флаг того что на экране уже результат. при нажатии на цифры или действия он будет сразу передвинут в last
		this.isResult = false;
//текущее действие
		this.action = "";
//слушатели
		$element.on("key", this.keyPressedHandler.bind(this));
		$element.on("remove-last", this.clearLastHandler.bind(this));
		$element.on("clear-input", this.inputClearHandler.bind(this));
		$element.on("set-float-point", this.floatPointHandler.bind(this));
//слушатели на простые действия
		$element.on("addition", this.additionHandler.bind(this));
		$element.on("subtraction", this.substractionHandler.bind(this));
		$element.on("multiply", this.multiplyHandler.bind(this));
		$element.on("divide", this.divisionHandler.bind(this));
//слушатели на остальные действия
		$element.on("square", this.squareHandler.bind(this));
		$element.on("percent", this.percentHandler.bind(this));
		$element.on("reciprocal", this.reciprocalHandler.bind(this));
		$element.on("invert-sign", this.invertHandler.bind(this));
		$element.on("result", this.resultHandler.bind(this));
		
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
				.attr({ type: 'button', value:this.buttons[i].label, title: this.buttons[i].description})
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
		if (this.isResult && (this.last == undefined))
		{
			this.pushToLast();
		}
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
		this.last = undefined;
		this.toAddPoint = false;
		this.isFraction = false;
		this.isResult = false;
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
	}
//обработчик нажатий на запятую
	floatPointHandler()
	{
		if (!this.isFraction)
		{
			this.toAddPoint = true;	
		}
	}

	pushToLast()
	{
		this.last = this.current;
		this.current = 0;
		this.$display.html(this.current);
		this.$lastDisplay.html(this.last + this.action);
	}
//метод очистки last и поля его отображения
	removeLast()
	{
		this.isResult = true;
		this.last = undefined;
		this.$lastDisplay.html("");
		this.$display.html(this.current);	
	}

	additionHandler()
	{
		if ((this.last == undefined))
		{
			this.action = " +";
			this.pushToLast();	
		}
		else
		{
			this.resolveAction();		
		}
	}

	substractionHandler()
	{
		if (this.last == undefined)
		{
			this.action = " -";
			this.pushToLast();	
		}
		else
		{
			this.resolveAction();
		}

	}

	multiplyHandler()
	{
		if (this.last == undefined)
		{
			this.action = " *";
			this.pushToLast();	
		}
		else
		{
			this.resolveAction();
		}
	}

	divisionHandler()
	{
		if (this.last == undefined)
		{
			this.action = " /";
			this.pushToLast();	
		}
		else
		{
			if (this.current != 0)
			{
				this.resolveAction();
			}
			else
			{
				alert("Division by zero error");
			}
		}
	}

	resolveAction()
	{
		switch (this.action)
		{
			case " +": this.current = this.last + this.current; break;
			case " -": this.current = this.last - this.current; break;
			case " *": this.current = this.last * this.current; break;
			case " /": this.current = this.last / this.current; break;
		}
		this.removeLast();
	}

	percentHandler()
	{
		this.current /= 100;
		this.$display.html(this.current);
	}

	squareHandler()
	{
		this.current = Math.sqrt(this.current);
		this.$display.html(this.current);	
	}

	reciprocalHandler()
	{
		if (this.current != 0)
		{
			this.current = 1 / this.current;
			this.$display.html(this.current);	
		}
		else
		{
			alert("Division by zero error");
		}
		
	}

	invertHandler()
	{
		this.current *= -1;
		this.$display.html(this.current);
	}

	resultHandler()
	{
		this.resolveAction();
	}
}