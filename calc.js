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

		this.$label = $('<label/>').css("width", columns * pixelSize).css("height", pixelSize);
		$element.append(this.$label);
		$element.append('<br>');


		

//генерация кнопок
		this.buttons = json.buttons;
		for (var i = 0; i < this.buttons.length; i++)
		{
			let action = this.buttons[i].action || this.buttons[i].value;

			let width = this.buttons[i].width || 1;
			let height = this.buttons[i].height || 1;
			currentColumn += width;

			let button = $('<input/>').attr({ type: 'button', name:'btn1', value:this.buttons[i].label, title: this.buttons[i].description}).click(function(){console.log(action);$element.trigger(action)}).css("width", width * pixelSize).css("height", height * pixelSize).css("background-color", this.buttons[i].background);
			$element.append(button);

			if (currentColumn == columns)
			{
				$element.append('<br>');		
				currentColumn = 0;		
			}
		}
	}
}